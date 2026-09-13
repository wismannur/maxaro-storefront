<script setup lang="ts">
import type { Product } from '~~/shared/types';
import { useCatalogStore } from '~~/app/stores/catalogStore';
import { useCatalog } from '~~/app/composables/useCatalog';
import { useCartStore } from '~~/app/stores/cartStore';
import { useLocale } from '~~/app/composables/useLocale';

import HomeHero from '~~/app/components/home/HomeHero.vue';
import HomeAmbiences from '~~/app/components/home/HomeAmbiences.vue';
import HomeCraftsmanship from '~~/app/components/home/HomeCraftsmanship.vue';
import HomeShowroomFlagship from '~~/app/components/home/HomeShowroomFlagship.vue';
import HomeTestimonials from '~~/app/components/home/HomeTestimonials.vue';
import FacetFilterBar from '~~/app/components/catalog/FacetFilterBar.vue';
import CatalogGrid from '~~/app/components/catalog/CatalogGrid.vue';
import ShowroomModal from '~~/app/components/common/ShowroomModal.vue';

import {
  Sparkles,
  ArrowRight,
  Search,
  SlidersHorizontal,
  RotateCcw,
  Zap,
} from 'lucide-vue-next';

const catalogStore = useCatalogStore();
const cartStore = useCartStore();
const { t } = useLocale();
const isShowroomModalOpen = ref(false);

// Fetch complete catalog for homepage showcase
const { data: allCatalog } = await useAsyncData('home-catalog', () =>
  $fetch<Product[]>('/api/catalog')
);

if (allCatalog.value) {
  catalogStore.allProducts = allCatalog.value;
  catalogStore.setCategory(null); // All categories
}

const { filteredProducts, isLoading } = useCatalog();

const categoryCards = computed(() => [
  {
    slug: 'vrijstaande-baden',
    title: t('categoriesMeta.vrijstaande-baden.title'),
    subtitle: t('categoriesMeta.vrijstaande-baden.subtitle'),
    image: 'https://media.maxaro.nl/product/Width800/8498/tesino-vrijstaand-bad-180x85cm-solid-surface-mat-wit-vsb11-mn.webp',
    count: t('categories.modelsCount', { count: 10 }),
  },
  {
    slug: 'inloopdouches',
    title: t('categoriesMeta.inloopdouches.title'),
    subtitle: t('categoriesMeta.inloopdouches.subtitle'),
    image: 'https://media.maxaro.nl/product/Width800/18683/zircon-comfort-inloopdouche-80-cm-chroom-helder-glas-vaste-wand-gw-08013.webp',
    count: t('categories.modelsCount', { count: 8 }),
  },
  {
    slug: 'badkamermeubels',
    title: t('categoriesMeta.badkamermeubels.title'),
    subtitle: t('categoriesMeta.badkamermeubels.subtitle'),
    image: 'https://media.maxaro.nl/product/Width800/54073/modulo-plato-badkamermeubel-voor-waskom-100-cm-mat-zwart-greeploos-front-lichtbruin-eiken-blad-2-lades-onder-elkaar-bmk17-00242.webp',
    count: t('categories.modelsCount', { count: 8 }),
  },
  {
    slug: 'kranen',
    title: t('categoriesMeta.kranen.title'),
    subtitle: t('categoriesMeta.kranen.subtitle'),
    image: 'https://media.maxaro.nl/product/Width800/134341/radius-wastafelkraan-opbouw-rvs-eengreeps-mengkraan-55.003.551br.webp',
    count: t('categories.modelsCount', { count: 8 }),
  },
  {
    slug: 'vloertegels',
    title: t('categoriesMeta.vloertegels.title'),
    subtitle: t('categoriesMeta.vloertegels.subtitle'),
    image: 'https://media.maxaro.nl/product/Width800/129529/legno-bruin-vloer-/wandtegel-15x90-cm-bruin-houtlook-505-090104.webp',
    count: t('categories.variantsCount', { count: 8 }),
  },
]);

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

function scrollToCatalog() {
  nextTick(() => {
    setTimeout(() => {
      const el = document.getElementById('catalog-collection');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        if (typeof history !== 'undefined') {
          history.replaceState(history.state, '', '#catalog-collection');
        }
      }
    }, 80);
  });
}

function handleStyleSelected(_finish: string | null) {
  scrollToCatalog();
}

onMounted(() => {
  if (typeof window !== 'undefined' && window.location.hash === '#catalog-collection') {
    scrollToCatalog();
  }
});
</script>

<template>
  <div class="space-y-12 sm:space-y-16 pb-16">
    <!-- 1. Cinematic Architectural Hero Section with Curated Hotspots -->
    <HomeHero
      @explore-catalog="scrollToCatalog"
      @open-showroom-modal="isShowroomModalOpen = true"
    />

    <!-- 2. Curated Interior Styles & Moodboards (Shop by Style) -->
    <HomeAmbiences
      @style-selected="handleStyleSelected"
    />

    <!-- 3. Architectural Category Visual Rails -->
    <section class="max-w-7xl mx-auto px-4">
      <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-6">
        <div class="space-y-1 text-left">
          <span class="text-[11px] font-bold text-maxaro-blue uppercase tracking-wider font-mono">
            {{ t('categories.title') }}
          </span>
          <h2 class="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">
            {{ t('categories.subtitle') }}
          </h2>
        </div>
      </div>

      <!-- Horizontal Scrollable Rail on Mobile/Tablet, Grid on Desktop -->
      <div
        id="category-rails"
        class="flex lg:grid lg:grid-cols-5 gap-3 sm:gap-4 overflow-x-auto lg:overflow-x-visible overflow-y-hidden lg:overflow-y-visible no-scrollbar pb-3 lg:pb-0 snap-x snap-mandatory lg:snap-none touch-pan-x"
      >
        <NuxtLink
          v-for="cat in categoryCards"
          :key="cat.slug"
          :to="`/categorie/${cat.slug}`"
          class="group relative flex flex-col justify-end overflow-hidden rounded-3xl border border-neutral-200/90 bg-white p-4 sm:p-5 transition-all duration-300 hover:shadow-card-hover hover:border-neutral-300 aspect-[3/4] w-48 sm:w-56 lg:w-auto shrink-0 snap-start"
        >
          <NuxtImg
            :src="cat.image"
            :alt="cat.title"
            width="320"
            height="420"
            loading="lazy"
            class="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
          <div class="relative z-10 text-white space-y-1 text-left">
            <span class="inline-block text-[10px] font-mono text-neutral-300 uppercase bg-white/15 backdrop-blur-xs px-2 py-0.5 rounded-md">
              {{ cat.count }}
            </span>
            <h3 class="text-sm sm:text-base font-bold leading-tight group-hover:text-maxaro-accent transition-colors">
              {{ cat.title }}
            </h3>
            <p class="text-[11px] text-neutral-200 line-clamp-1 opacity-90">{{ cat.subtitle }}</p>
          </div>
        </NuxtLink>
      </div>
    </section>

    <!-- 4. Material Mastery & Craftsmanship Section -->
    <HomeCraftsmanship />

    <!-- 5. Sub-Second Interactive Catalog Engine Section -->
    <section id="catalog-collection" class="max-w-7xl mx-auto px-4 space-y-6 scroll-mt-44 sm:scroll-mt-48 pt-4">
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-3 border-b border-neutral-200 pb-4 text-left">
        <div>
          <!-- Search Query State -->
          <template v-if="catalogStore.searchQuery.trim()">
            <div class="inline-flex items-center gap-1.5 text-[11px] font-bold text-maxaro-blue uppercase tracking-wider mb-1 bg-maxaro-blue-light px-2.5 py-0.5 rounded-full">
              <Search class="w-3 h-3" />
              <span>{{ t('catalog.searchBadge') }}</span>
            </div>
            <h2 class="text-xl sm:text-3xl font-black text-neutral-900 tracking-tight flex items-center gap-2 flex-wrap">
              <span>{{ t('catalog.searchTitlePrefix') }}</span>
              <span class="text-maxaro-blue underline decoration-maxaro-blue/30 italic font-serif font-normal">"{{ catalogStore.searchQuery }}"</span>
            </h2>
            <p class="text-xs text-neutral-500 mt-1">
              {{ t('catalog.searchCount', { count: filteredProducts.length }) }}
            </p>
          </template>

          <!-- Selected Finish / Style Active State -->
          <template v-else-if="catalogStore.activeFinish">
            <div class="inline-flex items-center gap-1.5 text-[11px] font-bold text-maxaro-accent uppercase tracking-wider mb-1 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200/60">
              <SlidersHorizontal class="w-3 h-3" />
              <span>Gefilterd op: {{ catalogStore.activeFinish }}</span>
            </div>
            <h2 class="text-xl sm:text-3xl font-black text-neutral-900 tracking-tight">
              {{ t('catalog.title') }}
            </h2>
            <p class="text-xs text-neutral-500 mt-1">
              {{ t('catalog.subtitle') }}
            </p>
          </template>

          <!-- Default Collection State -->
          <template v-else>
            <div class="inline-flex items-center gap-1 text-[11px] font-bold text-trust-green uppercase tracking-wider mb-1">
              <Sparkles class="w-3 h-3" /> {{ t('catalog.badge') }}
            </div>
            <h2 class="text-xl sm:text-3xl font-black text-neutral-900 tracking-tight">
              {{ t('catalog.title') }}
            </h2>
            <p class="text-xs text-neutral-500 mt-1">
              {{ t('catalog.subtitle') }}
            </p>
          </template>
        </div>

        <!-- Telemetry & Active Filter Reset Trigger -->
        <div class="flex items-center gap-2">
          <div class="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-100 border border-neutral-200/80 text-[11px] font-mono text-neutral-600">
            <Zap class="w-3 h-3 text-trust-green" />
            <span>&lt;4ms in-memory compute</span>
          </div>

          <button
            v-if="catalogStore.activeFinish || catalogStore.searchQuery"
            type="button"
            @click="catalogStore.resetFilters()"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-xs font-bold text-neutral-700 transition-colors cursor-pointer"
          >
            <RotateCcw class="w-3 h-3" />
            <span>{{ t('catalog.resetFilters') }}</span>
          </button>
        </div>
      </div>

      <!-- Facet Filter Bar Component -->
      <FacetFilterBar />

      <!-- Zero-CLS Product Grid Component -->
      <CatalogGrid
        :products="filteredProducts"
        :is-loading="isLoading"
        @add-to-cart="handleAddToCart"
      />
    </section>

    <!-- 6. Flagship 5.000m² Showroom Experience Section -->
    <HomeShowroomFlagship
      @open-showroom-modal="isShowroomModalOpen = true"
    />

    <!-- 7. Verified Transformations & Customer Stories -->
    <HomeTestimonials />

    <!-- Interactive Showroom Opening Hours & Route Modal -->
    <ShowroomModal
      :is-open="isShowroomModalOpen"
      @close="isShowroomModalOpen = false"
    />
  </div>
</template>
