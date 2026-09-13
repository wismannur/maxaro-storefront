<script setup lang="ts">
import type { Product } from '~~/shared/types';
import { useCatalogStore } from '~~/app/stores/catalogStore';
import { useCatalog } from '~~/app/composables/useCatalog';
import FacetFilterBar from '~~/app/components/catalog/FacetFilterBar.vue';
import CatalogGrid from '~~/app/components/catalog/CatalogGrid.vue';
import TrustpilotBadge from '~~/app/components/common/TrustpilotBadge.vue';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Truck,
  Building2,
  Clock,
  CheckCircle2,
  Search,
} from 'lucide-vue-next';

import { useCartStore } from '~~/app/stores/cartStore';
import { useLocale } from '~~/app/composables/useLocale';
import ShowroomModal from '~~/app/components/common/ShowroomModal.vue';

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

function scrollToShowroom() {
  const el = document.getElementById('showroom-experience');
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' });
    if (typeof history !== 'undefined') {
      history.replaceState(history.state, '', '#showroom-experience');
    }
  }
}

onMounted(() => {
  if (typeof window !== 'undefined' && window.location.hash === '#catalog-collection') {
    const el = document.getElementById('catalog-collection');
    if (el) {
      setTimeout(() => {
        el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }
});
</script>

<template>
  <div class="space-y-12 sm:space-y-16 pb-16">
    <!-- Hero Showroom Section -->
    <section class="relative bg-gradient-to-b from-maxaro-surface-subtle via-white to-white pt-8 sm:pt-14 pb-10 border-b border-maxaro-border/60">
      <div class="max-w-7xl mx-auto px-4">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <!-- Hero Text -->
          <div class="lg:col-span-7 space-y-5 text-left">
            <div class="inline-flex items-center gap-2 rounded-full bg-maxaro-blue-light border border-maxaro-blue/20 px-3 py-1 text-xs font-semibold text-maxaro-blue">
              <Sparkles class="w-3.5 h-3.5 text-maxaro-accent" />
              <span>{{ t('hero.badge') }}</span>
            </div>

            <h1 class="text-3xl sm:text-4xl lg:text-5xl font-black text-neutral-900 tracking-tight leading-[1.15]">
              {{ t('hero.title') }}
            </h1>

            <p class="text-sm sm:text-base text-neutral-600 leading-relaxed max-w-2xl">
              {{ t('hero.description') }}
            </p>

            <!-- Hero Action CTAs -->
            <div class="flex flex-wrap items-center gap-3 pt-2">
              <NuxtLink
                to="/categorie/vrijstaande-baden"
                class="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-maxaro-blue hover:bg-maxaro-blue-hover text-white text-sm font-bold rounded-2xl shadow-card-hover transition-all active:scale-95"
              >
                <span>{{ t('hero.viewCollection') }}</span>
                <ArrowRight class="w-4 h-4" />
              </NuxtLink>

              <a
                href="#showroom-experience"
                @click.prevent="scrollToShowroom"
                class="inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-neutral-100 hover:bg-neutral-200 active:scale-95 text-neutral-800 text-sm font-bold rounded-2xl transition-all cursor-pointer"
              >
                <Building2 class="w-4 h-4 text-neutral-600" />
                <span>{{ t('hero.visitShowroom') }}</span>
              </a>
            </div>

            <!-- Trustpilot Callout -->
            <div class="pt-4 border-t border-neutral-200/80">
              <TrustpilotBadge />
            </div>
          </div>

          <!-- Hero Image Showcase -->
          <div class="lg:col-span-5 relative">
            <div class="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border border-neutral-200">
              <NuxtImg
                src="https://media.maxaro.nl/Width1240/152649/1144x1060_test-ingangbanner_completebadkamers_desktop.jpg.webp"
                alt="Maxaro Luxe Badkamer Showroom"
                preset="heroProduct"
                width="800"
                height="600"
                loading="eager"
                decoding="async"
                fetchpriority="high"
                class="w-full h-full object-cover"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-6">
                <div class="text-white space-y-1">
                  <span class="text-xs font-mono uppercase tracking-widest text-neutral-300">{{ t('hero.flagshipBadge') }}</span>
                  <p class="text-lg font-bold">{{ t('hero.flagshipTitle') }}</p>
                  <p class="text-xs text-neutral-200">{{ t('hero.flagshipSubtitle') }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Category Visual Rails -->
    <section class="max-w-7xl mx-auto px-4">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">
            {{ t('categories.title') }}
          </h2>
          <p class="text-xs text-neutral-500 mt-0.5">{{ t('categories.subtitle') }}</p>
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
          class="group relative flex flex-col justify-end overflow-hidden rounded-2xl border border-neutral-200 bg-white p-4 transition-all duration-300 hover:shadow-card-hover hover:border-neutral-300 aspect-[3/4] w-44 sm:w-56 lg:w-auto shrink-0 snap-start"
        >
          <NuxtImg
            :src="cat.image"
            :alt="cat.title"
            width="300"
            height="400"
            loading="lazy"
            class="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <div class="relative z-10 text-white space-y-1">
            <span class="text-[10px] font-mono text-neutral-300 uppercase">{{ cat.count }}</span>
            <h3 class="text-sm font-bold leading-tight group-hover:text-maxaro-accent transition-colors">
              {{ cat.title }}
            </h3>
            <p class="text-[11px] text-neutral-200 line-clamp-1">{{ cat.subtitle }}</p>
          </div>
        </NuxtLink>
      </div>
    </section>

    <!-- Sub-Second Interactive Catalog Engine Section -->
    <section id="catalog-collection" class="max-w-7xl mx-auto px-4 space-y-6 scroll-mt-44 sm:scroll-mt-48 pt-2">
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-2 border-b border-neutral-200 pb-4">
        <div>
          <template v-if="catalogStore.searchQuery.trim()">
            <div class="inline-flex items-center gap-1.5 text-[11px] font-bold text-maxaro-blue uppercase tracking-wider mb-1 bg-maxaro-blue-light px-2.5 py-0.5 rounded-full">
              <Search class="w-3 h-3" />
              <span>{{ t('catalog.searchBadge') }}</span>
            </div>
            <h2 class="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight flex items-center gap-2 flex-wrap">
              <span>{{ t('catalog.searchTitlePrefix') }}</span>
              <span class="text-maxaro-blue underline decoration-maxaro-blue/30 italic">"{{ catalogStore.searchQuery }}"</span>
            </h2>
            <p class="text-xs text-neutral-500">
              {{ t('catalog.searchCount', { count: filteredProducts.length }) }}
            </p>
          </template>
          <template v-else>
            <div class="inline-flex items-center gap-1 text-[11px] font-bold text-trust-green uppercase tracking-wider mb-1">
              <Sparkles class="w-3 h-3" /> {{ t('catalog.badge') }}
            </div>
            <h2 class="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">
              {{ t('catalog.title') }}
            </h2>
            <p class="text-xs text-neutral-500">
              {{ t('catalog.subtitle') }}
            </p>
          </template>
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

    <!-- Showroom Experience Section (Supports both #showroom-experience and #showrooms anchors) -->
    <div id="showrooms" class="scroll-mt-32 sm:scroll-mt-36"></div>
    <section id="showroom-experience" class="max-w-7xl mx-auto px-4 pt-8 scroll-mt-32 sm:scroll-mt-36">
      <div class="bg-maxaro-surface-subtle border border-maxaro-border rounded-3xl p-6 sm:p-10">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div class="space-y-4">
            <span class="text-xs font-mono font-bold uppercase tracking-wider text-maxaro-blue">
              {{ t('showroomSection.badge') }}
            </span>
            <h2 class="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">
              {{ t('showroomSection.title') }}
            </h2>
            <p class="text-xs sm:text-sm text-neutral-600 leading-relaxed">
              {{ t('showroomSection.description') }}
            </p>

            <ul class="space-y-2 text-xs text-neutral-700">
              <li class="flex items-center gap-2 font-medium">
                <CheckCircle2 class="w-4 h-4 text-trust-green" />
                <span>{{ t('showroomSection.feature1') }}</span>
              </li>
              <li class="flex items-center gap-2 font-medium">
                <CheckCircle2 class="w-4 h-4 text-trust-green" />
                <span>{{ t('showroomSection.feature2') }}</span>
              </li>
              <li class="flex items-center gap-2 font-medium">
                <CheckCircle2 class="w-4 h-4 text-trust-green" />
                <span>{{ t('showroomSection.feature3') }}</span>
              </li>
            </ul>

            <div class="pt-2">
              <button
                type="button"
                @click="isShowroomModalOpen = true"
                class="inline-flex items-center gap-1.5 text-xs font-bold text-maxaro-blue hover:text-maxaro-blue-hover underline cursor-pointer"
              >
                <span>{{ t('showroomSection.ctaHoursRoute') }}</span>
              </button>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div class="aspect-square rounded-2xl overflow-hidden border border-neutral-200">
              <NuxtImg
                src="https://media.maxaro.nl/Width1240/152610/ingangbanner_inspiratie_desktop.jpg.webp"
                alt="Showroom Inspiratie Roosendaal"
                class="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div class="aspect-square rounded-2xl overflow-hidden border border-neutral-200">
              <NuxtImg
                src="https://media.maxaro.nl/Width1240/152609/ingangbanner_completetoiletruimtes_desktop.jpg.webp"
                alt="Showroom Badmeubels & Ruimtes"
                class="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Interactive Showroom Opening Hours & Route Modal -->
    <ShowroomModal
      :is-open="isShowroomModalOpen"
      @close="isShowroomModalOpen = false"
    />
  </div>
</template>
