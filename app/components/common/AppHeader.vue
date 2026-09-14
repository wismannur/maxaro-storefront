<script setup lang="ts">
import {
  Search,
  ShoppingCart,
  CheckCircle2,
  Truck,
  ShieldCheck,
  Building2,
  X,
  ArrowRight,
  ShoppingBag,
  Sparkles,
  ExternalLink,
  QrCode,
  Clock,
  ArrowUpRight,
  Check,
} from 'lucide-vue-next';
import { storeToRefs } from 'pinia';
import type { Product } from '~~/shared/types';
import { useCatalogStore } from '~~/app/stores/catalogStore';
import { useCartStore } from '~~/app/stores/cartStore';
import { useCurrency } from '~~/app/composables/useCurrency';
import { useLocale } from '~~/app/composables/useLocale';
import LocaleSwitcher from './LocaleSwitcher.vue';
import MaterialSwatch from '~~/app/components/catalog/MaterialSwatch.vue';

const catalogStore = useCatalogStore();
const cartStore = useCartStore();
const { t } = useLocale();
const { searchQuery } = storeToRefs(catalogStore);
const { items, itemCount, subtotal, remainingForFreeShipping, isFreeShipping, activeShowroomPass } = storeToRefs(cartStore);
const { formatEuro } = useCurrency();

const isMiniCartOpen = ref(false);
let hoverTimeout: ReturnType<typeof setTimeout> | null = null;

function onMouseEnter() {
  if (hoverTimeout) clearTimeout(hoverTimeout);
  isMiniCartOpen.value = true;
}

function onMouseLeave() {
  hoverTimeout = setTimeout(() => {
    isMiniCartOpen.value = false;
  }, 250);
}

function handleCartClick() {
  isMiniCartOpen.value = false;
  cartStore.toggleDrawer();
}

function openDrawerFromMiniCart() {
  isMiniCartOpen.value = false;
  cartStore.isDrawerOpen = true;
}

function handleMiniCartCheckout() {
  isMiniCartOpen.value = false;
  cartStore.initiateCheckout();
}

const route = useRoute();
const router = useRouter();

const isMobileSearchOpen = ref(false);
const mobileSearchInputRef = ref<HTMLInputElement | null>(null);
const isSearchFocused = ref(false);
const searchContainerRef = ref<HTMLElement | null>(null);

const quickSearchResults = computed(() => {
  const q = searchQuery.value.trim().toLowerCase();
  if (!q) return [];
  return catalogStore.allProducts.filter((product) => {
    return (
      product.name.toLowerCase().includes(q) ||
      product.sku.toLowerCase().includes(q) ||
      product.categoryLabelNl.toLowerCase().includes(q) ||
      product.finish.toLowerCase().includes(q)
    );
  });
});

function toggleMobileSearch() {
  isMobileSearchOpen.value = !isMobileSearchOpen.value;
  if (isMobileSearchOpen.value) {
    nextTick(() => {
      mobileSearchInputRef.value?.focus();
    });
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

function handleSearchSubmit() {
  isSearchFocused.value = false;
  isMobileSearchOpen.value = false;
  if (mobileSearchInputRef.value) {
    mobileSearchInputRef.value.blur();
  }

  const q = searchQuery.value.trim();
  if (q) {
    const umami = useUmami();
    umami.track('search', { query: q });
  }

  if (route.path !== '/') {
    catalogStore.setCategory(null);
    router.push({ path: '/', hash: '#catalog-collection' }).then(() => {
      scrollToCatalog();
    });
  } else {
    scrollToCatalog();
  }
}

function handleSearchSelect(product: Product) {
  isSearchFocused.value = false;
  isMobileSearchOpen.value = false;

  const umami = useUmami();
  umami.track('search_select', {
    product_id: product.id,
    product_name: product.name,
    query: searchQuery.value,
  });

  router.push(`/product/${product.slug}`);
}

function handleSearchSuggestion(term: string) {
  searchQuery.value = term;
  handleSearchSubmit();
}

function clearSearch() {
  searchQuery.value = '';
  isSearchFocused.value = false;
}

function handleClickOutside(e: MouseEvent) {
  if (searchContainerRef.value && !searchContainerRef.value.contains(e.target as Node)) {
    isSearchFocused.value = false;
  }
}

const { y: scrollY } = useWindowScroll();
const isScrolled = computed(() => scrollY.value > 15);

function handleKeydownWindow(e: KeyboardEvent) {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault();
    isSearchFocused.value = true;
    const inputEl = document.getElementById('main-search-input');
    inputEl?.focus();
  }
}

onMounted(() => {
  if (catalogStore.allProducts.length === 0) {
    catalogStore.fetchProducts();
  }
  document.addEventListener('click', handleClickOutside);
  window.addEventListener('keydown', handleKeydownWindow);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
  window.removeEventListener('keydown', handleKeydownWindow);
});

function handleShowroomClick(e: MouseEvent) {
  const umami = useUmami();
  umami.track('click_showroom_header_nav');

  if (route.path === '/') {
    e.preventDefault();
    const el = document.getElementById('showroom-experience');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      if (typeof history !== 'undefined') {
        history.replaceState(history.state, '', '#showroom-experience');
      }
    }
  }
}

const navCategories = computed(() => [
  { slug: 'vrijstaande-baden', label: t('nav.baths') },
  { slug: 'inloopdouches', label: t('nav.showers') },
  { slug: 'badkamermeubels', label: t('nav.vanities') },
  { slug: 'kranen', label: t('nav.taps') },
  { slug: 'vloertegels', label: t('nav.tiles') },
]);
</script>

<template>
  <header
    class="sticky top-0 z-40 w-full bg-white transition-all duration-200"
    :class="isScrolled ? 'shadow-sm border-b border-neutral-200/90' : 'border-b border-neutral-200/70'"
  >
    <!-- Top USP & Trust Bar (Architectural Midnight Strip) -->
    <div class="bg-[#0B1528] text-neutral-300 border-b border-white/10 py-1.5 text-xs relative z-50">
      <div class="max-w-7xl mx-auto px-4 flex items-center justify-between gap-3">
        <!-- Scrollable USPs on narrow screens -->
        <div class="flex items-center gap-4 sm:gap-6 overflow-x-auto no-scrollbar py-0.5 min-w-0 font-medium text-[11px] sm:text-xs">
          <div class="flex items-center gap-1.5 shrink-0">
            <span class="text-trust-green font-bold flex items-center gap-1">★ 4.6/5</span>
            <span class="text-neutral-300">{{ t('usp.reviews') }}</span>
          </div>

          <div class="flex items-center gap-2 shrink-0">
            <span class="w-1.5 h-1.5 rounded-full bg-trust-green animate-pulse shrink-0" />
            <span class="text-white font-semibold">Showroom Roosendaal (5.000 m²)</span>
            <span class="text-neutral-400 hidden sm:inline">• Vandaag open</span>
          </div>

          <div class="flex items-center gap-1.5 shrink-0 hidden md:flex">
            <Truck class="w-3.5 h-3.5 text-trust-green" />
            <span>{{ t('usp.freeShipping') }}</span>
          </div>

          <div class="flex items-center gap-1.5 shrink-0 hidden lg:flex">
            <ShieldCheck class="w-3.5 h-3.5 text-trust-green" />
            <span>{{ t('usp.warranty') }}</span>
          </div>
        </div>

        <!-- Right Utilities: Pitch Deck & Locale Switcher -->
        <div class="flex items-center gap-3 shrink-0 relative">
          <a
            href="https://wismannur.pro/showcase/maxaro"
            target="_blank"
            rel="noopener noreferrer"
            class="hidden sm:flex items-center gap-1.5 text-amber-300 hover:text-amber-200 font-bold hover:underline transition-colors text-[11px]"
            :title="t('usp.pitchDeck')"
          >
            <Sparkles class="w-3 h-3 text-amber-400" />
            <span>{{ t('usp.pitchDeck') }}</span>
            <ExternalLink class="w-3 h-3 opacity-70" />
          </a>
          <span class="text-neutral-700 hidden sm:inline">|</span>
          <LocaleSwitcher />
        </div>
      </div>
    </div>

    <!-- Main Navigation Bar -->
    <div class="max-w-7xl mx-auto px-4 py-3 sm:py-3.5 flex items-center justify-between gap-4">
      <!-- Logo & Brand Badge -->
      <NuxtLink to="/" class="flex items-center gap-3.5 shrink-0 group">
        <div class="flex flex-col text-left">
          <span class="font-black text-2xl sm:text-3xl tracking-tight text-maxaro-blue group-hover:text-maxaro-blue-hover transition-colors font-sans">
            MAXARO
          </span>
          <span class="text-[9px] uppercase tracking-widest text-neutral-400 font-bold -mt-1 hidden sm:block font-mono">
            {{ t('header.tagline') }}
          </span>
        </div>
      </NuxtLink>

      <!-- Instant Search Bar (Lookbook Search Compass) -->
      <div ref="searchContainerRef" class="flex-1 max-w-2xl relative hidden md:block">
        <div class="relative flex items-center bg-[#FAF9F5] hover:bg-[#F5F4EE] focus-within:bg-white rounded-2xl border border-neutral-200/90 focus-within:border-maxaro-blue focus-within:ring-4 focus-within:ring-maxaro-blue/10 transition-all shadow-2xs focus-within:shadow-md group">
          <button
            type="button"
            @click="handleSearchSubmit"
            class="pl-4 pr-2 text-neutral-400 group-focus-within:text-maxaro-blue transition-colors cursor-pointer"
            :aria-label="t('header.searchButton')"
          >
            <Search class="w-4 h-4" />
          </button>
          <input
            id="main-search-input"
            v-model="searchQuery"
            @focus="isSearchFocused = true"
            @input="isSearchFocused = true"
            @keydown.enter="handleSearchSubmit"
            @keydown.esc="isSearchFocused = false"
            type="text"
            :placeholder="t('header.searchPlaceholder')"
            class="w-full py-2.5 sm:py-3 pr-28 bg-transparent text-xs sm:text-sm font-medium text-neutral-900 placeholder:text-neutral-400 outline-none"
          />
          <div class="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
            <button
              v-if="searchQuery"
              type="button"
              @click="clearSearch"
              class="p-1 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200/70 transition-colors cursor-pointer"
              :aria-label="t('header.searchClear')"
            >
              <X class="w-3.5 h-3.5" />
            </button>
            <button
              v-if="searchQuery.trim()"
              type="button"
              @click="handleSearchSubmit"
              class="px-3 py-1.5 rounded-xl bg-maxaro-blue hover:bg-maxaro-blue-hover text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1 active:scale-95"
            >
              <span>{{ t('header.searchButton') }}</span>
              <ArrowRight class="w-3 h-3" />
            </button>
            <kbd
              v-else
              class="hidden lg:inline-flex items-center gap-0.5 px-2 py-1 rounded-lg border border-neutral-200/90 bg-white text-[10px] font-mono text-neutral-400 shadow-2xs select-none"
            >
              <span class="text-xs">⌘</span>K
            </kbd>
          </div>
        </div>

        <!-- Live Instant Search Results Popover (Curated Architectural Lookbook) -->
        <Transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="transform opacity-0 -translate-y-2 scale-98"
          enter-to-class="transform opacity-100 translate-y-0 scale-100"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="transform opacity-100 translate-y-0 scale-100"
          leave-to-class="transform opacity-0 -translate-y-2 scale-98"
        >
          <div
            v-if="isSearchFocused && searchQuery.trim().length > 0"
            class="absolute left-0 right-0 top-full mt-3 bg-white rounded-3xl shadow-2xl border border-neutral-200/90 z-50 overflow-hidden text-left divide-y divide-neutral-100"
          >
            <!-- Popover Header: Count & Compute Telemetry -->
            <div class="px-5 py-3 bg-white flex items-center justify-between text-xs">
              <div class="flex items-center gap-2">
                <span class="inline-flex items-center gap-1 font-bold text-neutral-900 font-sans">
                  <Sparkles class="w-3.5 h-3.5 text-maxaro-accent" />
                  <span>{{ t('header.quickResultsTitle') }}</span>
                </span>
                <span class="px-2 py-0.5 rounded-full bg-neutral-100 border border-neutral-200/80 font-mono text-[11px] font-bold text-neutral-700 shadow-2xs">
                  {{ quickSearchResults.length }}
                </span>
              </div>
              <div class="flex items-center gap-1 text-[11px] font-mono text-trust-green font-semibold">
                <span class="w-1.5 h-1.5 rounded-full bg-trust-green animate-pulse" />
                <span>{{ t('header.quickResultsTelemetry') }}</span>
              </div>
            </div>

            <!-- Matching Items (Max 4 Lookbook Items) -->
            <div v-if="quickSearchResults.length > 0" class="divide-y divide-neutral-100 max-h-[380px] overflow-y-auto">
              <article
                v-for="product in quickSearchResults.slice(0, 4)"
                :key="product.id"
                @click="handleSearchSelect(product)"
                class="p-4 flex items-center gap-4 hover:bg-neutral-50 transition-all cursor-pointer group"
              >
                <!-- Image Container with Aspect & Subtle Hover Zoom -->
                <div class="relative w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-neutral-100 overflow-hidden border border-neutral-200/80 group-hover:border-maxaro-blue shrink-0 shadow-2xs transition-colors">
                  <NuxtImg
                    :src="product.imageThumbnail"
                    :alt="product.name"
                    width="72"
                    height="72"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <!-- Tiny Badge for In Stock -->
                  <span
                    v-if="product.inStock"
                    class="absolute bottom-1 right-1 w-2 h-2 rounded-full bg-trust-green ring-2 ring-white"
                  />
                </div>

                <!-- Product Attributes & Title -->
                <div class="flex-1 min-w-0 space-y-1">
                  <div class="flex items-center gap-2">
                    <span class="text-[10px] uppercase font-bold text-maxaro-blue bg-blue-50 px-2 py-0.5 rounded-md font-mono">
                      {{ t(`categoriesMeta.${product.category}.title`) || product.categoryLabelNl }}
                    </span>
                    <span class="text-[10px] text-neutral-400 font-mono">{{ product.sku }}</span>
                  </div>

                  <h4 class="text-xs sm:text-[13px] font-bold text-neutral-900 group-hover:text-maxaro-blue transition-colors truncate leading-snug">
                    {{ product.name }}
                  </h4>

                  <div class="flex flex-wrap items-center gap-2 text-[11px] text-neutral-500">
                    <div class="inline-flex items-center gap-1 font-medium text-neutral-700">
                      <MaterialSwatch :finish="product.finish" size="sm" />
                      <span>{{ product.finish }}</span>
                    </div>
                    <span>&bull;</span>
                    <span :class="product.inStock ? 'text-trust-green font-medium' : 'text-neutral-500'">
                      {{ product.inStock ? t('header.quickResultsDirectStock') : (product.deliveryEstimateNl || t('header.quickResultsBackorder')) }}
                    </span>
                    <span class="hidden sm:inline">&bull;</span>
                    <span class="hidden sm:inline-flex items-center gap-1 text-neutral-500">
                      <Building2 class="w-3 h-3 text-maxaro-accent" />
                      <span>Showroom</span>
                    </span>
                  </div>
                </div>

                <!-- Price & Navigation Affordance -->
                <div class="text-right shrink-0 flex items-center gap-3 pl-2">
                  <div>
                    <div class="text-xs sm:text-sm font-mono font-black text-neutral-900">
                      {{ formatEuro(product.price) }}
                    </div>
                    <p class="text-[10px] text-trust-green font-medium hidden sm:block">
                      {{ t('header.quickResultsShowroomStock') }}
                    </p>
                  </div>
                  <div class="w-8 h-8 rounded-xl bg-neutral-100 group-hover:bg-maxaro-blue text-neutral-400 group-hover:text-white flex items-center justify-center transition-colors shrink-0">
                    <ArrowRight class="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </article>
            </div>

            <!-- Empty Matching State with Curated Style Queries -->
            <div v-else class="p-7 text-center space-y-3.5">
              <div class="w-12 h-12 mx-auto rounded-2xl bg-neutral-100 flex items-center justify-center text-neutral-400">
                <Search class="w-6 h-6 text-maxaro-blue" />
              </div>
              <div class="space-y-1">
                <p class="text-sm font-bold text-neutral-800">
                  {{ t('header.quickResultsEmpty', { query: searchQuery }) }}
                </p>
                <p class="text-xs text-neutral-500 max-w-sm mx-auto">
                  {{ t('header.quickResultsSuggestions') }}
                </p>
              </div>
              <div class="flex flex-wrap justify-center gap-2 pt-1">
                <button
                  v-for="term in ['Solid Surface', 'Mat Zwart Kranen', 'Badmeubel Eiken', 'Inloopdouche', 'Travertin Look']"
                  :key="term"
                  type="button"
                  @click="handleSearchSuggestion(term)"
                  class="text-xs px-3 py-1.5 rounded-xl bg-neutral-100 hover:bg-maxaro-blue-light hover:text-maxaro-blue text-neutral-700 font-medium transition-all cursor-pointer border border-neutral-200/60 shadow-2xs"
                >
                  {{ term }}
                </button>
              </div>
            </div>

            <!-- Footer Action Button -->
            <div class="p-3.5 sm:p-4 bg-white border-t border-neutral-100">
              <button
                type="button"
                @click="handleSearchSubmit"
                class="w-full py-3 px-4 rounded-2xl bg-maxaro-blue hover:bg-maxaro-blue-hover text-white text-xs sm:text-sm font-bold transition-all shadow-md flex items-center justify-between cursor-pointer active:scale-[0.99] group/btn"
              >
                <span>{{ t('header.quickResultsViewAll', { count: quickSearchResults.length }) }}</span>
                <span class="flex items-center gap-1.5 text-xs text-white/80 font-mono font-normal">
                  <span>{{ t('header.searchEnterHint') }}</span>
                  <ArrowRight class="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                </span>
              </button>
            </div>
          </div>
        </Transition>
      </div>

      <!-- Action Items: Showroom, Pass, Cart Trigger & Mini-Cart Dropdown -->
      <div class="flex items-center gap-2 sm:gap-3">
        <!-- Mobile Search Toggle Button -->
        <button
          type="button"
          @click="toggleMobileSearch"
          class="md:hidden p-2.5 rounded-2xl border border-neutral-200 text-neutral-600 hover:text-maxaro-blue hover:bg-[#FAF9F5] transition-colors"
          :class="isMobileSearchOpen ? 'bg-neutral-100 text-maxaro-blue border-neutral-300' : ''"
          :aria-label="t('header.searchButton')"
        >
          <Search class="w-4 h-4" />
        </button>

        <!-- Cart Trigger Button & Mini-Cart Dropdown Container -->
        <div
          class="relative"
          @mouseenter="onMouseEnter"
          @mouseleave="onMouseLeave"
        >
          <!-- Cart Trigger Button -->
          <button
            id="cart-trigger-btn"
            type="button"
            @click="handleCartClick"
            class="relative flex items-center gap-2.5 px-4 py-2.5 bg-maxaro-blue hover:bg-maxaro-blue-hover text-white rounded-2xl text-xs sm:text-sm font-bold transition-all shadow-md cursor-pointer active:scale-95"
            :aria-label="t('header.cart')"
          >
            <ShoppingCart class="w-4 h-4" />
            <span class="hidden sm:inline">{{ t('header.cart') }}</span>
            <span
              v-if="itemCount > 0"
              class="flex h-5 w-5 items-center justify-center rounded-full bg-trust-green text-[11px] font-mono font-bold text-white shadow-xs"
            >
              {{ itemCount }}
            </span>
          </button>

          <!-- Interactive Mini-Cart Dropdown -->
          <Transition
            enter-active-class="transition duration-150 ease-out origin-top-right"
            enter-from-class="transform opacity-0 scale-95"
            enter-to-class="transform opacity-100 scale-100"
            leave-active-class="transition duration-100 ease-in origin-top-right"
            leave-from-class="transform opacity-100 scale-100"
            leave-to-class="transform opacity-0 scale-95"
          >
            <div
              v-if="isMiniCartOpen"
              class="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-neutral-200 z-50 p-4 space-y-3"
            >
              <!-- Dropdown Header -->
              <div class="flex items-center justify-between pb-2 border-b border-neutral-100">
                <span class="text-xs font-bold text-neutral-800 flex items-center gap-1.5">
                  <ShoppingCart class="w-3.5 h-3.5 text-maxaro-blue" />
                  {{ t('header.miniCartTitle', { count: itemCount }) }}
                </span>
                <button
                  type="button"
                  @click="openDrawerFromMiniCart"
                  class="text-[11px] font-medium text-maxaro-blue hover:underline cursor-pointer"
                >
                  {{ t('header.miniCartViewAll') }}
                </button>
              </div>

              <!-- Content: Empty State -->
              <div v-if="items.length === 0" class="py-6 text-center space-y-2">
                <div class="w-10 h-10 mx-auto rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400">
                  <ShoppingBag class="w-5 h-5" />
                </div>
                <p class="text-xs font-semibold text-neutral-700">{{ t('header.miniCartEmptyTitle') }}</p>
                <p class="text-[11px] text-neutral-500 max-w-[200px] mx-auto">
                  {{ t('header.miniCartEmptySubtitle') }}
                </p>
                <button
                  type="button"
                  @click="openDrawerFromMiniCart"
                  class="mt-2 text-xs font-bold text-maxaro-blue hover:underline inline-block cursor-pointer"
                >
                  {{ t('header.miniCartViewCart') }}
                </button>
              </div>

              <!-- Content: Filled State -->
              <div v-else class="space-y-3">
                <!-- Free Shipping Mini Note -->
                <div
                  class="text-[11px] px-2.5 py-1.5 rounded-lg flex items-center gap-1.5"
                  :class="isFreeShipping ? 'bg-trust-greenBg text-trust-green font-medium' : 'bg-neutral-100 text-neutral-600'"
                >
                  <Truck class="w-3 h-3 shrink-0" />
                  <span v-if="isFreeShipping">{{ t('header.miniCartFreeShippingUnlocked') }}</span>
                  <span v-else>{{ t('header.miniCartFreeShippingRemaining', { amount: formatEuro(remainingForFreeShipping, true) }) }}</span>
                </div>

                <!-- Items Preview (Max 3) -->
                <div class="divide-y divide-neutral-100 max-h-52 overflow-y-auto space-y-2 pr-1">
                  <div
                    v-for="item in items.slice(0, 3)"
                    :key="item.product.id"
                    class="pt-2 first:pt-0 flex items-center gap-3"
                  >
                    <NuxtImg
                      :src="item.product.imageThumbnail"
                      :alt="item.product.name"
                      width="44"
                      height="44"
                      class="w-11 h-11 rounded-lg object-cover bg-neutral-100 shrink-0 border border-neutral-200"
                    />
                    <div class="flex-1 min-w-0 text-left">
                      <p class="text-xs font-bold text-neutral-800 truncate">{{ item.product.name }}</p>
                      <p class="text-[10px] text-neutral-500">{{ item.product.finish }} &bull; {{ item.quantity }}x</p>
                    </div>
                    <span class="text-xs font-mono font-bold text-neutral-900 shrink-0">
                      {{ formatEuro(item.product.price * item.quantity) }}
                    </span>
                  </div>
                </div>

                <div v-if="items.length > 3" class="text-center text-[10px] text-neutral-400">
                  {{ t('header.miniCartMoreItems', { count: items.length - 3 }) }}
                </div>

                <!-- Subtotal -->
                <div class="pt-2 border-t border-neutral-100 flex items-center justify-between text-xs">
                  <span class="text-neutral-500">{{ t('header.miniCartSubtotal') }}</span>
                  <span class="font-mono font-bold text-sm text-neutral-900">{{ formatEuro(subtotal) }}</span>
                </div>

                <!-- Action CTA Buttons -->
                <div class="grid grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    @click="openDrawerFromMiniCart"
                    class="py-2 px-3 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-xs font-semibold text-neutral-700 transition-colors text-center cursor-pointer"
                  >
                    {{ t('header.cart') }}
                  </button>
                  <button
                    type="button"
                    @click="handleMiniCartCheckout"
                    class="py-2 px-3 rounded-xl bg-maxaro-blue hover:bg-maxaro-blue-hover text-white text-xs font-bold transition-colors shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>{{ t('header.miniCartOrderButton') }}</span>
                    <ArrowRight class="w-3.5 h-3.5" />
                  </button>
                </div>

                <!-- Secondary Omnichannel CTA: Showroom Pass -->
                <button
                  type="button"
                  @click="cartStore.generateShowroomPass(); isMiniCartOpen = false;"
                  class="w-full py-1.5 px-3 rounded-xl border border-maxaro-blue/60 hover:bg-maxaro-blue-light/50 text-[11px] font-bold text-maxaro-blue transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <QrCode class="w-3.5 h-3.5" />
                  <span>{{ t('showroomPass.generateShortButton') }}</span>
                </button>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </div>

    <!-- Mobile Expandable Search Bar Row -->
    <Transition
      enter-active-class="transition-all duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-2 max-h-0 overflow-hidden"
      enter-to-class="opacity-100 translate-y-0 max-h-16"
      leave-active-class="transition-all duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0 max-h-16"
      leave-to-class="opacity-0 -translate-y-2 max-h-0 overflow-hidden"
    >
      <div v-if="isMobileSearchOpen" class="md:hidden px-4 pb-3 pt-1 border-t border-neutral-100 bg-white">
        <div class="relative flex items-center gap-2">
          <div class="relative flex-1">
            <Search class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              ref="mobileSearchInputRef"
              v-model="searchQuery"
              @keydown.enter="handleSearchSubmit"
              type="text"
              :placeholder="t('header.searchPlaceholder')"
              class="w-full pl-10 pr-9 py-2.5 bg-[#FAF9F5] focus:bg-white border border-neutral-200/90 focus:border-maxaro-blue focus:ring-2 focus:ring-maxaro-blue/10 rounded-2xl text-xs transition-all outline-none"
            />
            <button
              v-if="searchQuery"
              type="button"
              @click="clearSearch"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 p-1 cursor-pointer"
              :aria-label="t('header.searchClear')"
            >
              <X class="w-3.5 h-3.5" />
            </button>
          </div>
          <button
            type="button"
            @click="handleSearchSubmit"
            class="px-4 py-2.5 rounded-2xl bg-maxaro-blue hover:bg-maxaro-blue-hover text-white text-xs font-bold shrink-0 transition-all shadow-xs cursor-pointer active:scale-95"
          >
            {{ t('header.searchButton') }}
          </button>
        </div>
      </div>
    </Transition>

    <!-- Category Tabs Rail (Architectural Taxonomy Rail) -->
    <nav class="border-t border-neutral-200/80 bg-white">
      <div class="max-w-7xl mx-auto px-4 flex items-center justify-between gap-3 overflow-x-auto no-scrollbar py-2 text-xs sm:text-sm font-medium">
        <div class="flex items-center gap-1 sm:gap-1.5 min-w-0">
          <NuxtLink
            to="/"
            class="px-3.5 py-1.5 rounded-xl transition-all whitespace-nowrap text-xs font-semibold"
            :class="$route.path === '/' && !$route.params.slug ? 'bg-maxaro-blue text-white font-bold shadow-xs' : 'text-neutral-600 hover:text-maxaro-blue hover:bg-[#FAF9F5]'"
          >
            {{ t('nav.allCategories') }}
          </NuxtLink>
          <NuxtLink
            v-for="cat in navCategories"
            :key="cat.slug"
            :to="`/categorie/${cat.slug}`"
            class="px-3.5 py-1.5 rounded-xl transition-all whitespace-nowrap text-xs font-semibold"
            :class="$route.params.slug === cat.slug ? 'bg-maxaro-blue text-white font-bold shadow-xs' : 'text-neutral-600 hover:text-maxaro-blue hover:bg-[#FAF9F5]'"
          >
            {{ cat.label }}
          </NuxtLink>
        </div>

        <!-- Right Callout in Rail: 3D Advies & Showroom Booking -->
        <NuxtLink
          to="/#showroom-experience"
          @click="handleShowroomClick"
          class="hidden md:inline-flex items-center gap-1.5 text-xs font-bold text-maxaro-blue hover:text-maxaro-accent transition-colors shrink-0 py-1"
        >
          <Sparkles class="w-3.5 h-3.5 text-maxaro-accent" />
          <span>Vrijblijvend 3D-Advies</span>
        </NuxtLink>
      </div>
    </nav>
  </header>
</template>
