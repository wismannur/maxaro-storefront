<!-- app/components/cart/CartDrawer.vue -->
<script setup lang="ts">
import { useCartStore } from '~~/app/stores/cartStore';
import { useCurrency } from '~~/app/composables/useCurrency';
import { useLocale } from '~~/app/composables/useLocale';
import { storeToRefs } from 'pinia';
import {
  X,
  ShoppingCart,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  ShoppingBag,
  QrCode,
  Building2,
} from 'lucide-vue-next';
import FreeShippingBar from './FreeShippingBar.vue';
import CartItemRow from './CartItemRow.vue';
import CheckoutHandshakeModal from './CheckoutHandshakeModal.vue';
import ShowroomPassModal from './ShowroomPassModal.vue';

const cartStore = useCartStore();
const { t } = useLocale();
const {
  items,
  isDrawerOpen,
  isSyncing,
  isCheckingOut,
  activeShowroomPass,
  itemCount,
  subtotal,
  vatAmount,
  shippingCost,
  total,
} = storeToRefs(cartStore);

const { formatEuro } = useCurrency();

function closeDrawer() {
  isDrawerOpen.value = false;
}

function handleCheckout() {
  closeDrawer();
  cartStore.initiateCheckout();
}

function handleGenerateShowroomPass() {
  cartStore.generateShowroomPass();
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && isDrawerOpen.value) {
    closeDrawer();
  }
}

watch(isDrawerOpen, (isOpen) => {
  if (typeof document !== 'undefined') {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }
});

onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
  if (typeof document !== 'undefined') {
    document.body.style.overflow = '';
  }
});
</script>

<template>
  <div>
    <!-- Fullscreen Slide-Over Drawer -->
    <Transition
      enter-active-class="transition-opacity duration-300 ease-out"
      leave-active-class="transition-opacity duration-200 ease-in"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isDrawerOpen"
        class="fixed inset-0 z-[100] bg-neutral-950/60 backdrop-blur-md flex justify-end"
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
        @click.self="closeDrawer"
      >
        <!-- Slide-over Drawer Panel -->
        <div
          class="w-full max-w-md sm:max-w-lg bg-[#FAF9F5] h-full flex flex-col shadow-2xl border-l border-neutral-200/90 text-left transition-all"
        >
          <!-- Drawer Header -->
          <div class="p-4 sm:p-5 border-b border-neutral-200/90 flex items-center justify-between bg-white shadow-xs">
            <div class="flex items-center gap-3">
              <div class="p-2.5 rounded-2xl bg-maxaro-blue text-white shadow-xs">
                <ShoppingCart class="w-5 h-5" />
              </div>
              <div>
                <div class="flex items-center gap-2">
                  <h3 id="drawer-title" class="font-black text-base sm:text-lg text-neutral-900 leading-tight">
                    {{ t('cartDrawer.title') }}
                  </h3>
                  <span class="px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700 font-mono font-bold text-xs">
                    {{ itemCount }}
                  </span>
                </div>
                <div class="flex items-center gap-2 text-xs text-neutral-500 mt-0.5">
                  <span>{{ t('cartDrawer.itemsCount', { count: itemCount }) }}</span>
                  <span v-if="isSyncing" class="inline-flex items-center gap-1 text-[10px] text-trust-green font-mono font-semibold">
                    <RefreshCw class="w-2.5 h-2.5 animate-spin" />
                    <span>Edge Synced</span>
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              @click="closeDrawer"
              class="p-2 rounded-xl text-neutral-400 hover:text-neutral-800 hover:bg-neutral-100 transition-colors cursor-pointer border border-neutral-200/60"
              :aria-label="t('header.searchClear')"
            >
              <X class="w-5 h-5" />
            </button>
          </div>

          <!-- Drawer Body -->
          <div class="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-[#FAF9F5]">
            <!-- Free Shipping Dynamic Progress Bar -->
            <FreeShippingBar />

            <!-- Items List (Modern Card Layout) -->
            <div v-if="items.length > 0" role="list" :aria-label="t('cartDrawer.itemsListAria')" class="space-y-3">
              <CartItemRow
                v-for="item in items"
                :key="item.product.id"
                :item="item"
              />
            </div>

            <!-- Empty State -->
            <div v-else class="py-20 text-center space-y-4">
              <div class="relative mx-auto w-20 h-20 rounded-3xl bg-white border border-neutral-200/90 shadow-sm flex items-center justify-center text-neutral-400">
                <ShoppingBag class="w-9 h-9 text-maxaro-blue" />
                <span class="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                  <Sparkles class="w-3.5 h-3.5" />
                </span>
              </div>
              <div class="space-y-1">
                <h4 class="text-base font-black text-neutral-900">{{ t('cartDrawer.emptyTitle') }}</h4>
                <p class="text-xs text-neutral-500 max-w-xs mx-auto leading-relaxed">
                  {{ t('cartDrawer.emptySubtitle') }}
                </p>
              </div>
              <button
                type="button"
                @click="closeDrawer"
                class="mt-2 inline-flex items-center gap-2 px-5 py-2.5 bg-maxaro-blue text-white rounded-xl text-xs font-bold hover:bg-maxaro-blue-hover active:scale-95 transition-all shadow-sm cursor-pointer"
              >
                <span>{{ t('cartDrawer.continueShopping') }}</span>
                <ArrowRight class="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <!-- Drawer Footer / Checkout Bar -->
          <div v-if="items.length > 0" class="p-4 sm:p-5 border-t border-neutral-200/90 bg-white space-y-3.5 shadow-lg">
            <!-- Price Breakdown -->
            <div class="space-y-1.5 text-xs text-neutral-600">
              <div class="flex justify-between items-center">
                <span>{{ t('cartDrawer.subtotal') }}:</span>
                <span class="font-mono font-semibold text-neutral-800">{{ formatEuro(subtotal) }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span>{{ t('cartDrawer.vatIncluded') }}:</span>
                <span class="font-mono text-neutral-500">{{ formatEuro(vatAmount, true) }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span>{{ t('cartDrawer.shippingCost') }}:</span>
                <span
                  class="font-mono font-semibold"
                  :class="shippingCost === 0 ? 'text-trust-green' : 'text-neutral-800'"
                >
                  {{ shippingCost === 0 ? t('cartDrawer.free') : formatEuro(shippingCost, true) }}
                </span>
              </div>
              <div class="flex justify-between items-center text-base font-black text-neutral-900 pt-2.5 border-t border-neutral-200/80">
                <span>{{ t('checkoutModal.totalPaid') }}</span>
                <span class="font-mono text-lg text-maxaro-blue font-black">{{ formatEuro(total) }}</span>
              </div>
            </div>

            <!-- Action Buttons: 1. Instant Online Checkout | 2. Showroom Pass -->
            <div class="space-y-2.5 pt-1">
              <button
                type="button"
                :disabled="isCheckingOut"
                @click="handleCheckout"
                class="w-full py-3.5 px-4 bg-maxaro-blue hover:bg-maxaro-blue-hover active:scale-[0.99] disabled:bg-neutral-400 text-white rounded-2xl text-sm font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer group"
              >
                <span v-if="!isCheckingOut">{{ t('cartDrawer.checkoutButton') }}</span>
                <span v-else class="flex items-center gap-2">
                  <RefreshCw class="w-4 h-4 animate-spin" />
                  Handshake...
                </span>
                <ArrowRight v-if="!isCheckingOut" class="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <!-- Unified Smart Showroom Pass Button (State-Aware) -->
              <button
                type="button"
                @click="activeShowroomPass ? cartStore.openShowroomPassModal() : handleGenerateShowroomPass()"
                class="w-full py-3 px-4 bg-amber-50/70 hover:bg-amber-100/80 border border-amber-200/90 text-amber-900 rounded-2xl text-xs font-bold transition-all shadow-2xs active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
              >
                <Building2 v-if="activeShowroomPass" class="w-4 h-4 text-maxaro-accent" />
                <QrCode v-else class="w-4 h-4 text-maxaro-accent" />
                <span v-if="activeShowroomPass">
                  {{ t('cartDrawer.viewPassWithId', { id: activeShowroomPass.passId }) }}
                </span>
                <span v-else>
                  {{ t('showroomPass.generatePassButton') }}
                </span>
              </button>
            </div>

            <!-- Payment Trust Reassurance Strip -->
            <div class="grid grid-cols-2 gap-2 pt-2 border-t border-neutral-100 text-[11px] text-neutral-500 font-medium">
              <div class="flex items-center gap-1.5">
                <ShieldCheck class="w-3.5 h-3.5 text-trust-green shrink-0" />
                <span class="truncate">Veilig iDEAL & Klarna</span>
              </div>
              <div class="flex items-center gap-1.5 justify-end">
                <Building2 class="w-3.5 h-3.5 text-maxaro-blue shrink-0" />
                <span class="truncate">Showroom 5.000 m²</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Headless Checkout Handshake Modal -->
    <CheckoutHandshakeModal />

    <!-- Omnichannel Showroom Pass & QR Offerte Modal -->
    <ShowroomPassModal />
  </div>
</template>
