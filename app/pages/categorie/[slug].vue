<script setup lang="ts">
import type { ProductCategory, Product } from '~~/shared/types';
import { useCatalog } from '~~/app/composables/useCatalog';
import { useLocale } from '~~/app/composables/useLocale';
import { useCatalogStore } from '~~/app/stores/catalogStore';
import { useCartStore } from '~~/app/stores/cartStore';

import CategoryHeroBanner from '~~/app/components/catalog/CategoryHeroBanner.vue';
import CategoryAdvisor from '~~/app/components/catalog/CategoryAdvisor.vue';
import CategoryInspirationWall from '~~/app/components/catalog/CategoryInspirationWall.vue';
import FacetFilterBar from '~~/app/components/catalog/FacetFilterBar.vue';
import CatalogGrid from '~~/app/components/catalog/CatalogGrid.vue';
import ShowroomModal from '~~/app/components/common/ShowroomModal.vue';

const route = useRoute();
const catalogStore = useCatalogStore();
const cartStore = useCartStore();
const { t } = useLocale();
const slug = computed(() => route.params.slug as ProductCategory);
const isShowroomModalOpen = ref(false);

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
    const umami = useUmami();
    umami.track('view_category', { category: newSlug });
  },
  { immediate: true }
);

const { filteredProducts, isLoading } = useCatalog();

const config = useRuntimeConfig();
const siteUrl = computed(() => config.public.siteUrl || 'https://maxaro-storefront.vercel.app');
const categoryUrl = computed(() => `${siteUrl.value}/categorie/${slug.value}`);
const heroCategoryImg = computed(
  () =>
    serverProducts.value?.[0]?.imageThumbnail ||
    'https://media.maxaro.nl/product/Width800/8498/tesino-vrijstaand-bad-180x85cm-solid-surface-mat-wit-vsb11-mn.webp'
);

// Structured Data (Schema.org JSON-LD for Breadcrumbs & Collection)
const categorySchema = computed(() => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'BreadcrumbList',
      '@id': `${categoryUrl.value}/#breadcrumb`,
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: siteUrl.value,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: currentMeta.value.title,
          item: categoryUrl.value,
        },
      ],
    },
    {
      '@type': 'CollectionPage',
      '@id': `${categoryUrl.value}/#webpage`,
      url: categoryUrl.value,
      name: `${currentMeta.value.title} kopen? | Maxaro`,
      description: currentMeta.value.description,
      breadcrumb: { '@id': `${categoryUrl.value}/#breadcrumb` },
      mainEntity: {
        '@type': 'ItemList',
        numberOfItems: serverProducts.value?.length || 0,
        itemListElement: (serverProducts.value || []).slice(0, 12).map((prod, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          url: `${siteUrl.value}/product/${prod.slug}`,
          name: prod.name,
          image: prod.imageThumbnail,
        })),
      },
    },
  ],
}));

// SEO Meta Tags
useSeoMeta({
  title: computed(() => `${currentMeta.value.title} kopen? | Maxaro`),
  description: computed(
    () =>
      currentMeta.value.description ||
      `Bekijk het complete assortiment ${currentMeta.value.title.toLowerCase()} bij Maxaro. Direct uit voorraad leverbaar met 10 jaar garantie.`
  ),
  ogTitle: computed(() => `${currentMeta.value.title} kopen? | Maxaro Sanitair`),
  ogDescription: computed(
    () =>
      currentMeta.value.description ||
      `Bekijk het complete assortiment ${currentMeta.value.title.toLowerCase()} bij Maxaro.`
  ),
  ogImage: heroCategoryImg,
  ogType: 'website',
  twitterCard: 'summary_large_image',
  twitterTitle: computed(() => `${currentMeta.value.title} kopen? | Maxaro`),
  twitterDescription: computed(() => currentMeta.value.description),
  twitterImage: heroCategoryImg,
});

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: computed(() => JSON.stringify(categorySchema.value)),
    },
  ],
});

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
  <div class="max-w-7xl mx-auto px-4 py-6 sm:py-8 space-y-8 pb-16">
    <!-- 1. Elevated Category Hero Banner with Quick Chips & Breadcrumbs -->
    <CategoryHeroBanner
      :category="slug"
      :title="currentMeta.title"
      :subtitle="currentMeta.subtitle"
      :description="currentMeta.description"
      :total-count="catalogStore.allProducts.filter(p => p.category === slug).length"
      :filtered-count="filteredProducts.length"
      @open-showroom-modal="isShowroomModalOpen = true"
    />

    <!-- 2. Interactive Category Buyer's Guide & Material Compass -->
    <CategoryAdvisor
      :category="slug"
    />

    <!-- 3. Sub-Second Interactive Filter Bar (<4ms instant compute) -->
    <FacetFilterBar />

    <!-- 4. Zero-CLS Product Grid -->
    <CatalogGrid
      :products="filteredProducts"
      :is-loading="isLoading"
      @add-to-cart="handleAddToCart"
    />

    <!-- 5. Real-Life Customer Inspiration Gallery Wall -->
    <CategoryInspirationWall
      :category="slug"
    />

    <!-- Showroom Modal -->
    <ShowroomModal
      :is-open="isShowroomModalOpen"
      @close="isShowroomModalOpen = false"
    />
  </div>
</template>
