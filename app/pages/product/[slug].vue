<!-- app/pages/product/[slug].vue -->
<script setup lang="ts">
import type { Product } from '~~/shared/types';
import { useCurrency } from '~~/app/composables/useCurrency';
import { useLocale } from '~~/app/composables/useLocale';
import { useCartStore } from '~~/app/stores/cartStore';
import MaterialSwatch from '~~/app/components/catalog/MaterialSwatch.vue';
import TileCalculator from '~~/app/components/catalog/TileCalculator.vue';
import ShowroomModal from '~~/app/components/common/ShowroomModal.vue';
import ProductGalleryModal from '~~/app/components/catalog/ProductGalleryModal.vue';
import {
  Check,
  Truck,
  ShieldCheck,
  Building2,
  ChevronRight,
  ShoppingCart,
  Star,
  Ruler,
  Plus,
  Sparkles,
  QrCode,
  Layers,
  Award,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  Clock,
  Maximize2,
} from 'lucide-vue-next';

const route = useRoute();
const slug = computed(() => route.params.slug as string);

const { formatEuro, formatDimensions } = useCurrency();
const { t } = useLocale();

// Fetch product from catalog API
const { data: catalog } = await useAsyncData(`product-data-${slug.value}`, () =>
  $fetch<Product[]>('/api/catalog')
);

const product = computed(() => {
  return catalog.value?.find((p) => p.slug === slug.value) || catalog.value?.[0];
});

// Category variants for finish switcher
const categoryVariants = computed(() => {
  if (!product.value || !catalog.value) return [];
  return catalog.value.filter((p) => p.category === product.value?.category);
});

// Cross-sell complementary products
const crossSellProducts = computed(() => {
  if (!product.value || !catalog.value) return [];
  const p = product.value;
  let targetCategories: string[] = [];
  if (p.category === 'vrijstaande-baden' || p.category === 'inbouwbaden') {
    targetCategories = ['kranen', 'vloertegels'];
  } else if (p.category === 'inloopdouches' || p.category === 'douchecabines') {
    targetCategories = ['kranen', 'wandtegels'];
  } else if (p.category === 'badkamermeubels') {
    targetCategories = ['waskommen', 'kranen'];
  } else if (p.category === 'waskommen') {
    targetCategories = ['kranen', 'badkamermeubels'];
  } else if (p.category === 'kranen') {
    targetCategories = ['vrijstaande-baden', 'inloopdouches'];
  } else {
    targetCategories = ['kranen', 'badkamermeubels'];
  }

  return catalog.value
    .filter((item) => item.id !== p.id && targetCategories.includes(item.category))
    .slice(0, 2);
});

const selectedImage = ref<string>('');
const quantity = ref(1);
const isShowroomModalOpen = ref(false);
const isGalleryModalOpen = ref(false);
const galleryModalIndex = ref(0);

const currentGalleryImages = computed<string[]>(() => {
  if (!product.value) return [];
  if (product.value.imageGallery && product.value.imageGallery.length > 0) {
    return product.value.imageGallery;
  }
  return [product.value.imageThumbnail];
});

function openGalleryModal(index?: number) {
  if (index !== undefined) {
    galleryModalIndex.value = index;
  } else {
    const curIdx = currentGalleryImages.value.indexOf(selectedImage.value);
    galleryModalIndex.value = curIdx >= 0 ? curIdx : 0;
  }
  isGalleryModalOpen.value = true;
}

function onGalleryImageChange(newIdx: number) {
  galleryModalIndex.value = newIdx;
  if (currentGalleryImages.value[newIdx]) {
    selectedImage.value = currentGalleryImages.value[newIdx];
  }
}

watch(
  product,
  (p) => {
    if (p) {
      selectedImage.value = p.imageGallery?.[0] || p.imageThumbnail;
    }
  },
  { immediate: true }
);

const discountPercentage = computed(() => {
  if (!product.value?.originalPrice || product.value.originalPrice <= product.value.price) return 0;
  return Math.round(((product.value.originalPrice - product.value.price) / product.value.originalPrice) * 100);
});

const in3InstallmentAmount = computed(() => {
  if (!product.value) return 0;
  return Math.round((product.value.price / 3) * 100) / 100;
});

useHead({
  title: computed(() => (product.value ? `${product.value.name} — Maxaro` : 'Product Detail — Maxaro')),
  meta: [
    {
      name: 'description',
      content: computed(() => product.value?.specsSummary || 'Bekijk dit product bij Maxaro.'),
    },
  ],
});

const cartStore = useCartStore();

async function handleAddToCart() {
  if (product.value) {
    await cartStore.addItem(product.value, quantity.value);
  }
}

function handleSaveToShowroomPass() {
  if (product.value) {
    cartStore.addItem(product.value, quantity.value);
    cartStore.generateShowroomPass();
  }
}

function handleAddCrossSell(item: Product) {
  cartStore.addItem(item);
}
</script>

<template>
  <div v-if="product" class="max-w-7xl mx-auto px-4 py-5 sm:py-7 space-y-7 pb-24 md:pb-10">
    <!-- Breadcrumbs -->
    <nav class="flex items-center gap-2 text-xs text-neutral-500 overflow-x-auto no-scrollbar py-0.5">
      <NuxtLink to="/" class="hover:text-maxaro-blue transition-colors">{{ t('productDetail.home') }}</NuxtLink>
      <ChevronRight class="w-3.5 h-3.5 text-neutral-400 shrink-0" />
      <NuxtLink :to="`/categorie/${product.category}`" class="hover:text-maxaro-blue transition-colors shrink-0">
        {{ t(`categoriesMeta.${product.category}.title`) || product.categoryLabelNl }}
      </NuxtLink>
      <ChevronRight class="w-3.5 h-3.5 text-neutral-400 shrink-0" />
      <span class="font-bold text-neutral-800 truncate max-w-[220px] sm:max-w-none">{{ product.name }}</span>
    </nav>

    <!-- Harmonized 2-Column Desktop Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
      
      <!-- ================= LEFT COLUMN: VISUALS, STORY & SPECIFICATIONS (7 cols) ================= -->
      <div class="lg:col-span-7 space-y-6">
        
        <!-- 1. Media Gallery -->
        <div class="space-y-3">
          <!-- Main Hero Image Container (Clickable for Fullscreen Slide Modal) -->
          <div
            class="group relative aspect-[4/3] w-full overflow-hidden rounded-3xl border border-neutral-200 bg-neutral-100 shadow-sm cursor-zoom-in select-none"
            @click="openGalleryModal()"
            role="button"
            tabindex="0"
            :title="t('productDetail.viewFullscreen')"
            :aria-label="`${product.name} - ${t('productDetail.zoomImage')}`"
            @keydown.enter="openGalleryModal()"
            @keydown.space.prevent="openGalleryModal()"
          >
            <NuxtImg
              :src="selectedImage || product.imageThumbnail"
              :alt="product.name"
              preset="heroProduct"
              width="800"
              height="600"
              loading="eager"
              decoding="async"
              fetchpriority="high"
              class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            />

            <!-- Finish Badge -->
            <div class="absolute top-4 left-4 flex items-center gap-2 rounded-full bg-white/95 backdrop-blur-xs px-3 py-1.5 text-xs font-bold text-neutral-800 shadow-xs border border-neutral-200">
              <MaterialSwatch :finish="product.finish" size="sm" />
              <span>{{ product.finish }}</span>
            </div>

            <!-- Showroom Presence Flag -->
            <div
              v-if="product.showroomAvailableRoosendaal"
              class="absolute top-4 right-4 flex items-center gap-1.5 rounded-full bg-maxaro-blue/90 backdrop-blur-xs px-3 py-1.5 text-xs font-semibold text-white shadow-xs"
            >
              <Building2 class="w-3.5 h-3.5 text-trust-green" />
              <span class="hidden sm:inline">{{ t('productDetail.inShowroomRoosendaal') }}</span>
              <span class="sm:hidden">{{ t('productDetail.inShowroomShort') }}</span>
            </div>

            <!-- Fullscreen Zoom Trigger Badge -->
            <button
              type="button"
              @click.stop="openGalleryModal()"
              class="absolute bottom-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 hover:bg-white active:scale-95 text-neutral-800 text-xs font-semibold backdrop-blur-md shadow-md border border-neutral-200/90 transition-all cursor-pointer group-hover:scale-105"
              :title="t('productDetail.viewFullscreen')"
              :aria-label="t('productDetail.zoomImage')"
            >
              <Maximize2 class="w-3.5 h-3.5 text-maxaro-blue" />
              <span class="hidden sm:inline text-[11px] font-bold">{{ t('productDetail.zoomImage') }}</span>
            </button>
          </div>

          <!-- Thumbnail Strip -->
          <div v-if="product.imageGallery && product.imageGallery.length > 1" class="flex items-center gap-3 overflow-x-auto no-scrollbar pt-1">
            <button
              v-for="(img, idx) in product.imageGallery"
              :key="idx"
              @click="selectedImage = img"
              @dblclick="openGalleryModal(idx)"
              class="relative aspect-square w-20 rounded-2xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer shadow-2xs group/thumb"
              :class="selectedImage === img ? 'border-maxaro-blue ring-2 ring-maxaro-blue-light' : 'border-neutral-200 hover:border-neutral-400 opacity-80 hover:opacity-100'"
              :aria-label="t('galleryModal.photoNumber', { product: product.name, index: idx + 1 })"
            >
              <NuxtImg :src="img" :alt="t('galleryModal.goToPhoto', { index: idx + 1 })" width="120" height="120" class="h-full w-full object-cover transition-transform group-hover/thumb:scale-105" />
            </button>
          </div>
        </div>

        <!-- 2. Material & Quality USPs Card (Balances Visual Weight) -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-neutral-50/80 rounded-2xl border border-neutral-200 text-xs">
          <div class="space-y-1">
            <div class="flex items-center gap-1.5 font-bold text-neutral-900">
              <Award class="w-4 h-4 text-maxaro-blue shrink-0" />
              <span class="truncate">{{ t('productDetail.uspQualityTitle') }}</span>
            </div>
            <p class="text-[11px] text-neutral-500 leading-tight">{{ t('productDetail.uspQualityDesc') }}</p>
          </div>

          <div class="space-y-1">
            <div class="flex items-center gap-1.5 font-bold text-neutral-900">
              <ShieldCheck class="w-4 h-4 text-trust-green shrink-0" />
              <span class="truncate">{{ t('productDetail.uspWarrantyTitle', { years: product.warrantyYears }) }}</span>
            </div>
            <p class="text-[11px] text-neutral-500 leading-tight">{{ t('productDetail.uspWarrantyDesc') }}</p>
          </div>

          <div class="space-y-1">
            <div class="flex items-center gap-1.5 font-bold text-neutral-900">
              <Truck class="w-4 h-4 text-trust-green shrink-0" />
              <span class="truncate">{{ t('productDetail.uspTransportTitle') }}</span>
            </div>
            <p class="text-[11px] text-neutral-500 leading-tight">{{ t('productDetail.uspTransportDesc') }}</p>
          </div>

          <div class="space-y-1">
            <div class="flex items-center gap-1.5 font-bold text-neutral-900">
              <Building2 class="w-4 h-4 text-maxaro-accent shrink-0" />
              <span class="truncate">{{ t('productDetail.uspShowroomTitle') }}</span>
            </div>
            <p class="text-[11px] text-neutral-500 leading-tight">{{ t('productDetail.uspShowroomDesc') }}</p>
          </div>
        </div>

        <!-- 3. Product Editorial & Description -->
        <div class="p-6 bg-white rounded-3xl border border-neutral-200 space-y-3 shadow-xs">
          <div class="flex items-center gap-2 text-neutral-900 font-black text-base">
            <Layers class="w-5 h-5 text-maxaro-blue" />
            <h3>{{ t('productDetail.aboutProductTitle') }}</h3>
          </div>
          <p class="text-sm text-neutral-700 leading-relaxed">
            {{ product.specsSummary }} {{ t('productDetail.editorialText') }}
          </p>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 text-xs text-neutral-600">
            <div class="flex items-center gap-2">
              <CheckCircle2 class="w-4 h-4 text-trust-green shrink-0" />
              <span>{{ t('productDetail.bulletSeamless') }}</span>
            </div>
            <div class="flex items-center gap-2">
              <CheckCircle2 class="w-4 h-4 text-trust-green shrink-0" />
              <span>{{ t('productDetail.bulletThermal') }}</span>
            </div>
            <div class="flex items-center gap-2">
              <CheckCircle2 class="w-4 h-4 text-trust-green shrink-0" />
              <span>{{ t('productDetail.bulletWarehouse') }}</span>
            </div>
            <div class="flex items-center gap-2">
              <CheckCircle2 class="w-4 h-4 text-trust-green shrink-0" />
              <span>{{ t('productDetail.bulletInstall') }}</span>
            </div>
          </div>
        </div>

        <!-- 4. Technical Specifications Table (Moved to Left Column for Natural Reading Balance) -->
        <div class="p-6 bg-white rounded-3xl border border-neutral-200 space-y-4 shadow-xs">
          <div class="flex items-center justify-between">
            <h3 class="text-base font-black text-neutral-900 tracking-tight flex items-center gap-2">
              <Ruler class="w-4 h-4 text-maxaro-blue" />
              <span>{{ t('productDetail.specsTitle') }}</span>
            </h3>
            <span class="font-mono text-xs text-neutral-400">SKU: {{ product.sku }}</span>
          </div>

          <div class="rounded-2xl border border-neutral-200 overflow-hidden">
            <table class="w-full text-left text-xs border-collapse">
              <tbody class="divide-y divide-neutral-200">
                <tr class="bg-neutral-50/50">
                  <td class="py-3 px-4 font-bold text-neutral-600 w-2/5">{{ t('productDetail.skuLabel') }}</td>
                  <td class="py-3 px-4 font-mono font-bold text-neutral-900">{{ product.sku }}</td>
                </tr>
                <tr>
                  <td class="py-3 px-4 font-bold text-neutral-600">{{ t('productDetail.categoryLabel') }}</td>
                  <td class="py-3 px-4 font-medium text-neutral-900">{{ t(`categoriesMeta.${product.category}.title`) || product.categoryLabelNl }}</td>
                </tr>
                <tr class="bg-neutral-50/50">
                  <td class="py-3 px-4 font-bold text-neutral-600">{{ t('productDetail.finishLabel') }}</td>
                  <td class="py-3 px-4 font-medium text-neutral-900 flex items-center gap-2">
                    <MaterialSwatch :finish="product.finish" size="sm" />
                    <span>{{ product.finish }}</span>
                  </td>
                </tr>
                <tr>
                  <td class="py-3 px-4 font-bold text-neutral-600">{{ t('productDetail.dimensionsLabel') }}</td>
                  <td class="py-3 px-4 font-mono font-medium text-neutral-900">
                    {{ formatDimensions(product.dimensions.lengthCm, product.dimensions.widthCm, product.dimensions.heightCm, product.dimensions.thicknessMm) }}
                  </td>
                </tr>
                <tr v-if="product.packageCoverageM2" class="bg-neutral-50/50">
                  <td class="py-3 px-4 font-bold text-neutral-600">{{ t('productDetail.packageContentLabel') }}</td>
                  <td class="py-3 px-4 font-mono font-bold text-maxaro-blue">
                    {{ t('productDetail.packageContentValue', { coverage: product.packageCoverageM2, pieces: product.pieceCountPerPackage || 4 }) }}
                  </td>
                </tr>
                <tr :class="product.packageCoverageM2 ? '' : 'bg-neutral-50/50'">
                  <td class="py-3 px-4 font-bold text-neutral-600">{{ t('productDetail.warrantyLabel') }}</td>
                  <td class="py-3 px-4 font-medium text-neutral-900">{{ t('productDetail.warrantyValue', { years: product.warrantyYears }) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 5. Megashowroom Experience Card -->
        <div class="p-6 bg-gradient-to-br from-neutral-900 via-maxaro-blue to-neutral-900 text-white rounded-3xl shadow-md space-y-4">
          <div class="flex items-start justify-between gap-4">
            <div class="space-y-1">
              <div class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/15 text-trust-green text-[10px] font-bold uppercase tracking-wider">
                <Sparkles class="w-3 h-3" />
                <span>Omnichannel Showroom Experience</span>
              </div>
              <h4 class="text-lg font-black text-white leading-tight">
                {{ t('productDetail.showroomCardTitle') }}
              </h4>
              <p class="text-xs text-neutral-300">
                {{ t('productDetail.showroomCardSubtitle') }}
              </p>
            </div>
            <div class="p-3 rounded-2xl bg-white/10 text-white shrink-0">
              <Building2 class="w-6 h-6 text-trust-green" />
            </div>
          </div>

          <p class="text-xs text-neutral-300 leading-relaxed">
            {{ t('productDetail.showroomCardDesc') }}
          </p>

          <div class="flex flex-wrap items-center gap-3 pt-1">
            <button
              type="button"
              @click="isShowroomModalOpen = true"
              class="py-2.5 px-4 rounded-xl bg-white text-maxaro-blue hover:bg-neutral-100 text-xs font-bold transition-all shadow-sm cursor-pointer flex items-center gap-1.5"
            >
              <span>{{ t('productDetail.viewShowroomDetails') }}</span>
              <ArrowRight class="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              @click="handleSaveToShowroomPass"
              class="py-2.5 px-4 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold transition-all border border-white/20 cursor-pointer flex items-center gap-1.5"
            >
              <QrCode class="w-3.5 h-3.5 text-trust-green" />
              <span>{{ t('showroomPass.generatePassButton') }}</span>
            </button>
          </div>
        </div>

      </div>

      <!-- ================= RIGHT COLUMN: COMPACT STICKY PURCHASE PANEL (5 cols) ================= -->
      <div class="lg:col-span-5 space-y-5 lg:sticky lg:top-24">
        
        <!-- Header & Title Card -->
        <div class="p-6 bg-white rounded-3xl border border-neutral-200 shadow-xs space-y-4">
          <!-- Top meta: SKU & In Stock -->
          <div class="flex items-center justify-between text-xs text-neutral-500">
            <span class="font-mono text-neutral-400">SKU: {{ product.sku }}</span>
            <span class="text-trust-green font-bold flex items-center gap-1 text-[11px] bg-trust-greenBg px-2 py-0.5 rounded-full border border-trust-green/20">
              <span class="w-1.5 h-1.5 rounded-full bg-trust-green" />
              <span>{{ t('productDetail.inStockDirect') }}</span>
            </span>
          </div>

          <!-- Product Title -->
          <h1 class="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight leading-snug">
            {{ product.name }}
          </h1>

          <!-- Trustpilot Reviews Rating -->
          <div class="flex items-center gap-2">
            <div class="flex items-center text-trust-green">
              <Star v-for="i in 5" :key="i" class="w-3.5 h-3.5 fill-trust-green stroke-none" />
            </div>
            <span class="text-xs font-black text-neutral-800">{{ product.rating }}</span>
            <span class="text-xs text-neutral-400 font-medium">({{ product.reviewsCount }} {{ t('product.reviews') }})</span>
            <span class="text-neutral-300 text-xs">•</span>
            <span class="text-xs font-bold text-neutral-600">Trustpilot</span>
          </div>

          <!-- Pricing Card -->
          <div class="p-4 bg-neutral-50 border border-neutral-200 rounded-2xl space-y-2.5">
            <div class="flex items-baseline justify-between">
              <div class="flex items-baseline gap-2">
                <span class="text-2xl sm:text-3xl font-black font-mono text-neutral-900 tracking-tight">
                  {{ formatEuro(product.price) }}
                </span>
                <span v-if="product.category === 'vloertegels' || product.category === 'wandtegels'" class="text-xs font-bold text-neutral-500 font-mono">
                  / m²
                </span>
                <span v-if="product.originalPrice" class="text-xs text-neutral-400 line-through font-mono">
                  {{ formatEuro(product.originalPrice) }}
                </span>
              </div>
              <span v-if="discountPercentage > 0" class="px-2 py-0.5 rounded-md bg-red-50 text-red-700 text-[11px] font-black border border-red-200">
                -{{ discountPercentage }}%
              </span>
            </div>

            <!-- in3 Installment Pill (High-Ticket Dutch sanitary boost) -->
            <div class="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-[11px] font-bold flex items-center justify-between">
              <span class="flex items-center gap-1.5">
                <span class="px-1.5 py-0.2 rounded bg-emerald-600 text-white text-[9px] font-black">in3</span>
                <span>{{ t('productDetail.in3Hint', { amount: formatEuro(in3InstallmentAmount) }) }}</span>
              </span>
            </div>

            <div class="flex items-center justify-between text-xs text-neutral-500 pt-0.5">
              <span>{{ t('productDetail.vatIncluded') }}</span>
              <span class="text-trust-green font-bold flex items-center gap-1">
                <Truck class="w-3.5 h-3.5" /> {{ t('productDetail.freeDelivery') }}
              </span>
            </div>
          </div>

          <!-- Material Finish Variant Switcher -->
          <div class="space-y-2 pt-1">
            <div class="flex items-center justify-between">
              <label class="block text-xs font-bold text-neutral-700 uppercase tracking-wider">
                {{ t('productDetail.colorFinish') }} <span class="text-neutral-900 normal-case font-black">{{ product.finish }}</span>
              </label>
              <span v-if="categoryVariants.length > 1" class="text-[11px] text-neutral-400 font-medium">
                {{ t('productDetail.variantsCount', { count: categoryVariants.length }) }}
              </span>
            </div>

            <!-- Interactive Finish Swatches -->
            <div class="flex flex-wrap items-center gap-2">
              <NuxtLink
                v-for="variant in categoryVariants"
                :key="variant.id"
                :to="`/product/${variant.slug}`"
                class="flex items-center gap-2 px-3 py-2 rounded-xl border transition-all cursor-pointer"
                :class="variant.id === product.id
                  ? 'border-maxaro-blue bg-maxaro-blue-light/50 ring-2 ring-maxaro-blue text-neutral-900 font-bold shadow-2xs'
                  : 'border-neutral-200 hover:border-neutral-300 bg-neutral-50/70 hover:bg-neutral-100 text-neutral-700'"
                :title="t('productDetail.switchToFinish', { finish: variant.finish })"
              >
                <MaterialSwatch :finish="variant.finish" :is-selected="variant.id === product.id" size="sm" />
                <span class="text-xs">{{ variant.finish }}</span>
                <span v-if="variant.price !== product.price" class="text-[10px] font-mono text-neutral-400">
                  ({{ formatEuro(variant.price) }})
                </span>
              </NuxtLink>
            </div>
          </div>

          <!-- Dimensional Spec Quick Summary -->
          <div class="space-y-1.5 pt-1">
            <label class="block text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
              {{ t('productDetail.dimensions') }}
            </label>
            <div class="flex items-center gap-2 p-2.5 bg-neutral-50 rounded-xl border border-neutral-200 text-xs font-mono text-neutral-800">
              <Ruler class="w-4 h-4 text-maxaro-blue shrink-0" />
              <span>{{ formatDimensions(product.dimensions.lengthCm, product.dimensions.widthCm, product.dimensions.heightCm, product.dimensions.thicknessMm) }}</span>
            </div>
          </div>

          <!-- Purchase Action Center: Tile Calculator vs Standard Add To Cart -->
          <div v-if="product.category === 'vloertegels' || product.category === 'wandtegels'" class="space-y-3 pt-2">
            <!-- Intelligent Tile Calculator -->
            <TileCalculator :product="product" />

            <!-- Showroom Pass secondary CTA -->
            <button
              type="button"
              @click="handleSaveToShowroomPass"
              class="w-full py-3 px-4 rounded-xl border-2 border-maxaro-blue hover:bg-maxaro-blue-light/40 text-xs font-bold text-maxaro-blue transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs active:scale-98"
            >
              <QrCode class="w-4 h-4 text-maxaro-blue" />
              <span>{{ t('showroomPass.generatePassButton') }}</span>
            </button>
          </div>

          <!-- Standard Sanitary Stepper & Buy Box -->
          <div v-else class="space-y-3 pt-2">
            <div class="flex items-center gap-2.5">
              <!-- Quantity Stepper -->
              <div class="flex items-center border border-neutral-200 rounded-xl bg-neutral-50 overflow-hidden shrink-0">
                <button
                  @click="quantity = Math.max(1, quantity - 1)"
                  class="w-10 h-11 flex items-center justify-center text-neutral-600 hover:bg-neutral-200 transition-colors font-bold text-base cursor-pointer"
                  :aria-label="t('cart.decreaseQuantity', { name: product.name })"
                >
                  -
                </button>
                <span class="w-10 text-center font-mono font-bold text-sm text-neutral-900">{{ quantity }}</span>
                <button
                  @click="quantity += 1"
                  class="w-10 h-11 flex items-center justify-center text-neutral-600 hover:bg-neutral-200 transition-colors font-bold text-base cursor-pointer"
                  :aria-label="t('cart.increaseQuantity', { name: product.name })"
                >
                  +
                </button>
              </div>

              <!-- Primary Add to Cart Button -->
              <button
                type="button"
                @click="handleAddToCart"
                class="flex-1 h-11 inline-flex items-center justify-center gap-2 px-6 bg-maxaro-blue hover:bg-maxaro-blue-hover text-white rounded-xl text-sm font-bold transition-all shadow-md active:scale-98 cursor-pointer"
              >
                <ShoppingCart class="w-4 h-4" />
                <span>{{ t('productDetail.addToCart') }}</span>
              </button>
            </div>

            <!-- Secondary Omnichannel CTA: Save to Showroom Pass -->
            <button
              type="button"
              @click="handleSaveToShowroomPass"
              class="w-full py-2.5 px-4 rounded-xl border-2 border-maxaro-blue/80 hover:border-maxaro-blue bg-white hover:bg-maxaro-blue-light/40 text-xs font-bold text-maxaro-blue transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs active:scale-98"
            >
              <QrCode class="w-4 h-4 text-maxaro-blue" />
              <span>{{ t('showroomPass.generatePassButton') }}</span>
            </button>
          </div>

          <!-- Trust Guarantees Checklist -->
          <div class="pt-4 border-t border-neutral-200 space-y-2 text-xs text-neutral-600">
            <div class="flex items-center gap-2 font-medium">
              <Check class="w-4 h-4 text-trust-green shrink-0" />
              <span>{{ t('productDetail.deliveryPromise') }}</span>
            </div>
            <div class="flex items-center gap-2 font-medium">
              <RotateCcw class="w-4 h-4 text-trust-green shrink-0" />
              <span>{{ t('productDetail.returnsPromise') }}</span>
            </div>
            <div class="flex items-center gap-2 font-medium">
              <Building2 class="w-4 h-4 text-trust-green shrink-0" />
              <span>{{ t('productDetail.expertAdvice') }}</span>
            </div>
          </div>
        </div>

      </div>

    </div>

    <!-- ================= FULL WIDTH SECTION: CROSS-SELL "VAAK SAMEN GEKOCHT" ================= -->
    <div v-if="crossSellProducts.length > 0" class="pt-8 border-t border-neutral-200 space-y-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2.5">
          <div class="p-2 rounded-2xl bg-maxaro-blue-light text-maxaro-blue">
            <Sparkles class="w-5 h-5" />
          </div>
          <div>
            <h3 class="text-lg sm:text-xl font-black text-neutral-900 tracking-tight">
              {{ t('productDetail.crossSellTitle') }}
            </h3>
            <p class="text-xs text-neutral-500">{{ t('productDetail.crossSellSubtitle') }}</p>
          </div>
        </div>
        <span class="text-xs text-trust-green font-bold hidden sm:inline-flex items-center gap-1 bg-trust-greenBg px-2.5 py-1 rounded-full border border-trust-green/20">
          <Check class="w-3.5 h-3.5" /> {{ t('productDetail.inStockDirect') }}
        </span>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div
          v-for="item in crossSellProducts"
          :key="item.id"
          class="flex items-center justify-between gap-4 p-4 rounded-3xl border border-neutral-200 bg-white hover:border-neutral-300 transition-all shadow-xs"
        >
          <NuxtLink :to="`/product/${item.slug}`" class="flex items-center gap-3.5 min-w-0 flex-1">
            <NuxtImg
              :src="item.imageThumbnail"
              :alt="item.name"
              width="72"
              height="72"
              class="w-18 h-18 rounded-2xl object-cover border border-neutral-200 bg-neutral-50 shrink-0"
            />
            <div class="min-w-0 space-y-0.5">
              <span class="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block truncate">
                {{ t(`categoriesMeta.${item.category}.title`) || item.categoryLabelNl }} &bull; {{ item.finish }}
              </span>
              <h4 class="text-xs sm:text-sm font-black text-neutral-900 truncate hover:text-maxaro-blue transition-colors">
                {{ item.name }}
              </h4>
              <div class="text-xs font-mono font-bold text-neutral-900">
                {{ formatEuro(item.price) }}
                <span class="text-[10px] font-normal text-neutral-500">({{ t('productDetail.vatIncluded') }})</span>
              </div>
            </div>
          </NuxtLink>

          <button
            type="button"
            @click="handleAddCrossSell(item)"
            class="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-maxaro-blue hover:bg-maxaro-blue-hover active:scale-95 text-white rounded-xl text-xs font-bold transition-all shadow-xs shrink-0 cursor-pointer"
            :title="t('productDetail.addCrossSellTitle', { name: item.name })"
          >
            <Plus class="w-4 h-4" />
            <span class="hidden sm:inline">{{ t('productDetail.addCrossSell') }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Sticky Mobile Bottom Conversion Bar -->
    <div class="fixed bottom-0 inset-x-0 z-40 md:hidden bg-white/95 backdrop-blur-md border-t border-neutral-200 p-3 pb-safe shadow-lg">
      <div class="flex items-center justify-between gap-3">
        <div>
          <div class="text-[11px] text-neutral-500 font-medium">{{ t('productDetail.totalPrice') }}</div>
          <div class="text-base font-black font-mono text-neutral-900">
            {{ formatEuro(product.price * quantity) }}
          </div>
        </div>

        <button
          type="button"
          @click="handleAddToCart"
          class="flex-1 py-3 px-4 bg-maxaro-blue hover:bg-maxaro-blue-hover text-white rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
        >
          <ShoppingCart class="w-4 h-4" />
          <span>{{ t('productDetail.addToCart') }}</span>
        </button>
      </div>
    </div>

    <!-- Mounted Showroom Modal -->
    <ShowroomModal :is-open="isShowroomModalOpen" @close="isShowroomModalOpen = false" />

    <!-- Mounted Fullscreen Slide Image Gallery Lightbox Modal -->
    <ProductGalleryModal
      :is-open="isGalleryModalOpen"
      :images="currentGalleryImages"
      :initial-index="galleryModalIndex"
      :product-name="product.name"
      @close="isGalleryModalOpen = false"
      @change="onGalleryImageChange"
    />
  </div>
</template>
