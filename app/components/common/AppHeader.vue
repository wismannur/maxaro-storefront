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
} from 'lucide-vue-next';
import { storeToRefs } from 'pinia';
import type { Product } from '~~/shared/types';
import { useCatalogStore } from '~~/app/stores/catalogStore';
import { useCartStore } from '~~/app/stores/cartStore';
import { useCurrency } from '~~/app/composables/useCurrency';
import { useLocale } from '~~/app/composables/useLocale';
import LocaleSwitcher from './LocaleSwitcher.vue';

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

onMounted(() => {
  if (catalogStore.allProducts.length === 0) {
    catalogStore.fetchProducts();
  }
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});

function handleShowroomClick(e: MouseEvent) {
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
  <header class="sticky top-0 z-40 w-full bg-white border-b border-maxaro-border shadow-xs">
    <!-- Top USP & Trust Bar -->
    <div class="bg-maxaro-surface-subtle border-b border-maxaro-border/60 py-1.5 text-xs text-neutral-600 relative z-50">
      <div class="max-w-7xl mx-auto px-4 flex items-center justify-between gap-3">
        <!-- Scrollable USPs on narrow screens -->
        <div class="flex items-center gap-4 overflow-x-auto no-scrollbar py-0.5 min-w-0">
          <div class="flex items-center gap-1.5 shrink-0">
            <span class="text-trust-green font-bold flex items-center gap-1">★ 4.6/5</span>
            <span class="font-medium text-neutral-700">{{ t('usp.reviews') }}</span>
          </div>
          <div class="flex items-center gap-1.5 shrink-0">
            <Building2 class="w-3.5 h-3.5 text-trust-green" />
            <span>{{ t('usp.showroom') }}</span>
          </div>
          <div class="flex items-center gap-1.5 shrink-0">
            <Truck class="w-3.5 h-3.5 text-trust-green" />
            <span>{{ t('usp.freeShipping') }}</span>
          </div>
          <div class="flex items-center gap-1.5 shrink-0 hidden md:flex">
            <ShieldCheck class="w-3.5 h-3.5 text-trust-green" />
            <span>{{ t('usp.warranty') }}</span>
          </div>
        </div>

        <!-- Right Utilities: Pitch Deck & Locale Switcher (Overflow visible) -->
        <div class="flex items-center gap-3 shrink-0 relative">
          <a
            href="https://wismannur.pro/showcase/maxaro"
            target="_blank"
            rel="noopener noreferrer"
            class="hidden sm:flex items-center gap-1 text-maxaro-blue hover:text-maxaro-blue-hover font-bold hover:underline"
            :title="t('usp.pitchDeck')"
          >
            <Sparkles class="w-3 h-3 text-maxaro-accent" />
            <span>{{ t('usp.pitchDeck') }}</span>
            <ExternalLink class="w-3 h-3 opacity-70" />
          </a>
          <span class="text-neutral-300 hidden sm:inline">|</span>
          <LocaleSwitcher />
        </div>
      </div>
    </div>

    <!-- Main Navigation Bar -->
    <div class="max-w-7xl mx-auto px-4 py-3 sm:py-4 flex items-center justify-between gap-4">
      <!-- Logo & Brand Badge -->
      <NuxtLink to="/" class="flex items-center gap-3 shrink-0 group">
        <div class="flex flex-col">
          <span class="font-black text-2xl sm:text-3xl tracking-tight text-maxaro-blue group-hover:text-maxaro-blue-hover transition-colors font-sans">
            MAXARO
          </span>
          <span class="text-[9px] uppercase tracking-widest text-neutral-400 font-semibold -mt-1 hidden sm:block">
            {{ t('header.tagline') }}
          </span>
        </div>
        <span class="hidden lg:inline-flex items-center rounded-full bg-maxaro-blue-light px-2.5 py-0.5 text-[11px] font-semibold text-maxaro-blue">
          {{ t('header.luxuryBadge') }}
        </span>
      </NuxtLink>

      <!-- Instant Search Bar -->
      <div ref="searchContainerRef" class="flex-1 max-w-xl relative hidden md:block">
        <div class="relative">
          <button
            type="button"
            @click="handleSearchSubmit"
            class="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-maxaro-blue transition-colors p-1 rounded-lg cursor-pointer"
            :aria-label="t('header.searchButton')"
          >
            <Search class="w-4 h-4" />
          </button>
          <input
            v-model="searchQuery"
            @focus="isSearchFocused = true"
            @input="isSearchFocused = true"
            @keydown.enter="handleSearchSubmit"
            @keydown.esc="isSearchFocused = false"
            type="text"
            :placeholder="t('header.searchPlaceholder')"
            class="w-full pl-10 pr-20 py-2 bg-neutral-100/80 hover:bg-neutral-100 focus:bg-white border border-transparent focus:border-maxaro-blue rounded-xl text-sm transition-all outline-none"
          />
          <div class="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
            <button
              v-if="searchQuery"
              type="button"
              @click="clearSearch"
              class="text-neutral-400 hover:text-neutral-700 p-1 rounded-md transition-colors cursor-pointer"
              :aria-label="t('header.searchClear')"
            >
              <X class="w-3.5 h-3.5" />
            </button>
            <button
              v-if="searchQuery.trim()"
              type="button"
              @click="handleSearchSubmit"
              class="px-2.5 py-1 rounded-lg bg-maxaro-blue hover:bg-maxaro-blue-hover text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1"
            >
              <span>{{ t('header.searchButton') }}</span>
              <ArrowRight class="w-3 h-3" />
            </button>
            <span
              v-else
              class="hidden lg:inline-flex items-center px-1.5 py-0.5 rounded border border-neutral-300/80 bg-neutral-200/50 text-[10px] font-mono text-neutral-500 select-none"
            >
              {{ t('header.searchEnterHint') }}
            </span>
          </div>
        </div>

        <!-- Live Instant Search Results Dropdown -->
        <Transition
          enter-active-class="transition duration-150 ease-out"
          enter-from-class="transform opacity-0 -translate-y-1 scale-98"
          enter-to-class="transform opacity-100 translate-y-0 scale-100"
          leave-active-class="transition duration-100 ease-in"
          leave-from-class="transform opacity-100 translate-y-0 scale-100"
          leave-to-class="transform opacity-0 -translate-y-1 scale-98"
        >
          <div
            v-if="isSearchFocused && searchQuery.trim().length > 0"
            class="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-neutral-200 z-50 overflow-hidden text-left"
          >
            <!-- Header Count & Compute Note -->
            <div class="px-4 py-2.5 bg-neutral-50 border-b border-neutral-100 flex items-center justify-between text-xs">
              <span class="font-bold text-neutral-700">
                {{ t('header.quickResultsTitle') }} ({{ quickSearchResults.length }})
              </span>
              <span class="text-[11px] text-neutral-400 font-mono">
                {{ t('header.quickResultsTelemetry') }}
              </span>
            </div>

            <!-- Matching Items (Max 4 items) -->
            <div v-if="quickSearchResults.length > 0" class="divide-y divide-neutral-100 max-h-80 overflow-y-auto">
              <div
                v-for="product in quickSearchResults.slice(0, 4)"
                :key="product.id"
                @click="handleSearchSelect(product)"
                class="p-3 flex items-center gap-3 hover:bg-neutral-50 transition-colors cursor-pointer group"
              >
                <NuxtImg
                  :src="product.imageThumbnail"
                  :alt="product.name"
                  width="48"
                  height="48"
                  class="w-12 h-12 rounded-xl object-cover bg-neutral-100 shrink-0 border border-neutral-200"
                />
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2">
                    <span class="text-[10px] uppercase font-bold text-maxaro-blue bg-maxaro-blue-light px-1.5 py-0.5 rounded">
                      {{ t(`categoriesMeta.${product.category}.title`) || product.categoryLabelNl }}
                    </span>
                    <span class="text-[10px] text-neutral-400 font-mono">{{ product.sku }}</span>
                  </div>
                  <p class="text-xs font-bold text-neutral-900 group-hover:text-maxaro-blue transition-colors truncate mt-0.5">
                    {{ product.name }}
                  </p>
                  <p class="text-[11px] text-neutral-500 truncate">
                    {{ t('product.colorFinish') }} {{ product.finish }} &bull; {{ product.inStock ? t('header.quickResultsDirectStock') : (product.deliveryEstimateNl || t('header.quickResultsBackorder')) }}
                  </p>
                </div>
                <div class="text-right shrink-0">
                  <span class="text-xs font-mono font-bold text-neutral-900">
                    {{ formatEuro(product.price) }}
                  </span>
                  <p class="text-[10px] text-trust-green font-medium">{{ t('header.quickResultsShowroomStock') }}</p>
                </div>
              </div>
            </div>

            <!-- Empty Matching State -->
            <div v-else class="p-6 text-center space-y-3">
              <p class="text-xs font-bold text-neutral-700">
                {{ t('header.quickResultsEmpty', { query: searchQuery }) }}
              </p>
              <p class="text-[11px] text-neutral-500">
                {{ t('header.quickResultsSuggestions') }}
              </p>
              <div class="flex flex-wrap justify-center gap-1.5 pt-1">
                <button
                  v-for="term in ['Mat Zwart', 'Chroom', 'Badmeubel', 'Douchecabine', 'Solid Surface']"
                  :key="term"
                  type="button"
                  @click="handleSearchSuggestion(term)"
                  class="text-[11px] px-2.5 py-1 rounded-full bg-neutral-100 hover:bg-maxaro-blue-light hover:text-maxaro-blue text-neutral-700 font-medium transition-colors cursor-pointer"
                >
                  {{ term }}
                </button>
              </div>
            </div>

            <!-- Footer Action Button -->
            <div class="p-3 bg-neutral-50 border-t border-neutral-100">
              <button
                type="button"
                @click="handleSearchSubmit"
                class="w-full py-2.5 px-4 rounded-xl bg-maxaro-blue hover:bg-maxaro-blue-hover text-white text-xs font-bold transition-all shadow-xs flex items-center justify-between cursor-pointer active:scale-98"
              >
                <span>{{ t('header.quickResultsViewAll', { count: quickSearchResults.length }) }}</span>
                <span class="flex items-center gap-1 text-[11px] text-white/80">
                  <span>{{ t('header.searchEnterHint') }}</span>
                  <ArrowRight class="w-3.5 h-3.5" />
                </span>
              </button>
            </div>
          </div>
        </Transition>
      </div>

      <!-- Action Items: Showroom, Cart Trigger & Mini-Cart Dropdown -->
      <div class="flex items-center gap-2 sm:gap-3">
        <!-- Mobile Search Toggle Button -->
        <button
          type="button"
          @click="toggleMobileSearch"
          class="md:hidden p-2 rounded-xl border border-neutral-200 text-neutral-600 hover:text-maxaro-blue hover:bg-neutral-50 transition-colors"
          :class="isMobileSearchOpen ? 'bg-neutral-100 text-maxaro-blue border-neutral-300' : ''"
          :aria-label="t('header.searchButton')"
        >
          <Search class="w-4 h-4" />
        </button>

        <!-- Showroom CTA -->
        <NuxtLink
          to="/#showroom-experience"
          @click="handleShowroomClick"
          class="hidden xl:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-200 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 hover:text-maxaro-blue hover:border-neutral-300 transition-all cursor-pointer active:scale-95"
          :title="t('header.showroomButton')"
        >
          <Building2 class="w-3.5 h-3.5 text-neutral-500" />
          <span>{{ t('header.showroomButton') }}</span>
        </NuxtLink>

        <!-- Active Showroom Pass Quick Access Badge -->
        <button
          v-if="activeShowroomPass"
          type="button"
          @click="cartStore.openShowroomPassModal()"
          class="hidden xl:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-maxaro-blue-light/70 border border-maxaro-blue/30 text-xs font-bold text-maxaro-blue hover:bg-maxaro-blue-light transition-all cursor-pointer active:scale-95"
          :title="`Open Showroom Pass ${activeShowroomPass.passId}`"
        >
          <QrCode class="w-3.5 h-3.5 text-maxaro-blue" />
          <span>Pass ({{ activeShowroomPass.passId }})</span>
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
            class="relative flex items-center gap-2 px-3 py-2 bg-maxaro-blue hover:bg-maxaro-blue-hover text-white rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-xs cursor-pointer active:scale-95"
            :aria-label="t('header.cart')"
          >
            <ShoppingCart class="w-4 h-4" />
            <span class="hidden sm:inline">{{ t('header.cart') }}</span>
            <span
              v-if="itemCount > 0"
              class="flex h-5 w-5 items-center justify-center rounded-full bg-trust-green text-[11px] font-bold text-white shadow-xs"
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
              class="w-full pl-10 pr-9 py-2.5 bg-neutral-100/90 focus:bg-white border border-transparent focus:border-maxaro-blue rounded-xl text-xs transition-all outline-none"
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
            class="px-3.5 py-2.5 rounded-xl bg-maxaro-blue hover:bg-maxaro-blue-hover text-white text-xs font-bold shrink-0 transition-colors shadow-xs cursor-pointer active:scale-95"
          >
            {{ t('header.searchButton') }}
          </button>
        </div>
      </div>
    </Transition>

    <!-- Category Tabs Rail -->
    <nav class="border-t border-maxaro-border/70 bg-white">
      <div class="max-w-7xl mx-auto px-4 flex items-center justify-start sm:justify-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar py-2 text-xs sm:text-sm font-medium">
        <NuxtLink
          to="/"
          class="px-3 py-1 rounded-lg transition-colors whitespace-nowrap"
          :class="$route.path === '/' ? 'bg-maxaro-blue text-white font-semibold' : 'text-neutral-600 hover:text-maxaro-blue hover:bg-neutral-100'"
        >
          {{ t('nav.allCategories') }}
        </NuxtLink>
        <NuxtLink
          v-for="cat in navCategories"
          :key="cat.slug"
          :to="`/categorie/${cat.slug}`"
          class="px-3 py-1 rounded-lg transition-colors whitespace-nowrap"
          :class="$route.params.slug === cat.slug ? 'bg-maxaro-blue text-white font-semibold' : 'text-neutral-600 hover:text-maxaro-blue hover:bg-neutral-100'"
        >
          {{ cat.label }}
        </NuxtLink>
      </div>
    </nav>
  </header>
</template>
