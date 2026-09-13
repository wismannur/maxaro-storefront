<script setup lang="ts">
import type { ProductCategory, Product } from '~~/shared/types';
import { useCatalog } from '~~/app/composables/useCatalog';
import { useLocale } from '~~/app/composables/useLocale';
import { useCatalogStore } from '~~/app/stores/catalogStore';
import { useCartStore } from '~~/app/stores/cartStore';
import FacetFilterBar from '~~/app/components/catalog/FacetFilterBar.vue';
import CatalogGrid from '~~/app/components/catalog/CatalogGrid.vue';
import TrustpilotBadge from '~~/app/components/common/TrustpilotBadge.vue';
import { ChevronRight, Sparkles } from 'lucide-vue-next';

const route = useRoute();
const catalogStore = useCatalogStore();
const { t } = useLocale();
const slug = computed(() => route.params.slug as ProductCategory);

const currentMeta = computed(() => {
  const catKey = slug.value;
  const title = t(`categoriesMeta.${catKey}.title`);
  const subtitle = t(`categoriesMeta.${catKey}.subtitle`);
  const description = t(`categoriesMeta.${catKey}.description`);

  return {
    title: title.startsWith('categoriesMeta.') ? 'Sanitair & Tegels' : title,
    subtitle: subtitle.startsWith('categoriesMeta.') ? '' : subtitle,
    description: description.startsWith('categoriesMeta.') ? '' : description,
  };
});

// SSR data fetch ensuring edge ISR caching
const { data: serverProducts } = await useAsyncData(`category-${slug.value}`, () =>
  $fetch<Product[]>('/api/catalog', {
    query: { category: slug.value },
  })
);

// Populate catalog store
if (serverProducts.value) {
  catalogStore.allProducts = serverProducts.value;
}
catalogStore.setCategory(slug.value);

// Watch route changes
watch(
  slug,
  (newSlug) => {
    catalogStore.setCategory(newSlug);
  },
  { immediate: true }
);

const { filteredProducts, isLoading } = useCatalog();

// SEO Head
useHead({
  title: computed(() => `${currentMeta.value.title} — Maxaro Showroom`),
  meta: [{ name: 'description', content: computed(() => currentMeta.value.description) }],
});

const cartStore = useCartStore();

async function handleAddToCart(product: Product) {
  if (product.category === 'vloertegels' || product.category === 'wandtegels') {
    const coverage = product.packageCoverageM2 || 1.44;
    const pricePerPkg = Number((coverage * product.price).toFixed(2));
    await cartStore.addItem(product, 1, {
      isTile: true,
      packageCount: 1,
      coveragePerPackageM2: coverage,
      totalM2Purchased: coverage,
      netRoomM2: coverage,
      wastePercentage: 0,
      pricePerM2: product.price,
      pricePerPackage: pricePerPkg,
      totalPrice: pricePerPkg,
    });
  } else {
    await cartStore.addItem(product);
  }
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 py-6 sm:py-8 space-y-6">
    <!-- Breadcrumbs -->
    <nav class="flex items-center gap-2 text-xs text-neutral-500">
      <NuxtLink to="/" class="hover:text-maxaro-blue transition-colors">{{ t('productDetail.home') }}</NuxtLink>
      <ChevronRight class="w-3.5 h-3.5 text-neutral-400" />
      <span class="text-neutral-400">{{ t('productDetail.sanitary') }}</span>
      <ChevronRight class="w-3.5 h-3.5 text-neutral-400" />
      <span class="font-bold text-neutral-800">{{ currentMeta.title }}</span>
    </nav>

    <!-- Category Header Hero -->
    <div class="bg-gradient-to-r from-maxaro-surface-subtle via-white to-maxaro-surface-subtle border border-neutral-200 rounded-3xl p-6 sm:p-8">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="space-y-2 max-w-2xl">
          <div class="flex items-center gap-2">
            <span class="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-maxaro-blue bg-maxaro-blue-light px-2.5 py-0.5 rounded-full">
              <Sparkles class="w-3 h-3" /> Maxaro
            </span>
            <span class="text-xs text-neutral-400 font-mono">{{ t('productDetail.deliveryPromise') }}</span>
          </div>
          <h1 class="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-maxaro-blue">
            {{ currentMeta.title }}
          </h1>
          <p class="text-sm text-neutral-600 leading-relaxed">
            {{ currentMeta.description }}
          </p>
        </div>

        <div class="shrink-0 self-start md:self-center">
          <TrustpilotBadge />
        </div>
      </div>
    </div>

    <!-- Facet Filter Bar (<4ms instant filtering) -->
    <FacetFilterBar />

    <!-- Responsive Zero-CLS Catalog Grid -->
    <CatalogGrid
      :products="filteredProducts"
      :is-loading="isLoading"
      @add-to-cart="handleAddToCart"
    />
  </div>
</template>
