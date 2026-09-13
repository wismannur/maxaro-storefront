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
        class="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex justify-end"
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
        @click.self="closeDrawer"
      >
        <!-- Slide-over Drawer Panel -->
        <div
          class="w-full max-w-md bg-white h-full flex flex-col shadow-2xl"
        >
          <!-- Drawer Header -->
          <div class="p-4 sm:p-5 border-b border-neutral-200 flex items-center justify-between bg-white">
            <div class="flex items-center gap-2.5">
              <div class="p-2 rounded-xl bg-maxaro-blue-light text-maxaro-blue">
                <ShoppingCart class="w-5 h-5" />
              </div>
              <div>
                <h3 id="drawer-title" class="font-bold text-base text-neutral-900 leading-tight">{{ t('cartDrawer.title') }}</h3>
                <div class="flex items-center gap-2 text-xs text-neutral-500">
                  <span>{{ t('cartDrawer.itemsCount', { count: itemCount }) }}</span>
                  <span v-if="isSyncing" class="inline-flex items-center gap-1 text-[10px] text-trust-green font-mono">
                    <RefreshCw class="w-2.5 h-2.5 animate-spin" />
                    <span>Sync edge</span>
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              @click="closeDrawer"
              class="p-2 rounded-xl text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
              :aria-label="t('header.searchClear')"
            >
              <X class="w-5 h-5" />
            </button>
          </div>

          <!-- Drawer Body -->
          <div class="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-neutral-50/40">
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
            <div v-else class="py-16 text-center space-y-3">
              <div class="mx-auto w-14 h-14 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400">
                <ShoppingBag class="w-7 h-7" />
              </div>
              <h4 class="text-sm font-bold text-neutral-800">{{ t('cartDrawer.emptyTitle') }}</h4>
              <p class="text-xs text-neutral-500 max-w-xs mx-auto">
                {{ t('cartDrawer.emptySubtitle') }}
              </p>
              <button
                type="button"
                @click="closeDrawer"
                class="mt-2 inline-flex items-center gap-1.5 px-4 py-2 bg-maxaro-blue text-white rounded-xl text-xs font-bold hover:bg-maxaro-blue-hover transition-colors shadow-xs cursor-pointer"
              >
                <span>{{ t('cartDrawer.continueShopping') }}</span>
              </button>
            </div>
          </div>

          <!-- Drawer Footer / Checkout Bar -->
          <div v-if="items.length > 0" class="p-4 sm:p-5 border-t border-neutral-200 bg-neutral-50/80 space-y-3">
            <!-- Price Breakdown -->
            <div class="space-y-1.5 text-xs text-neutral-600">
              <div class="flex justify-between">
                <span>{{ t('cartDrawer.subtotal') }}:</span>
                <span class="font-mono font-semibold text-neutral-800">{{ formatEuro(subtotal) }}</span>
              </div>
              <div class="flex justify-between">
                <span>{{ t('cartDrawer.vatIncluded') }}:</span>
                <span class="font-mono text-neutral-500">{{ formatEuro(vatAmount, true) }}</span>
              </div>
              <div class="flex justify-between">
                <span>{{ t('cartDrawer.shippingCost') }}:</span>
                <span
                  class="font-mono font-semibold"
                  :class="shippingCost === 0 ? 'text-trust-green' : 'text-neutral-800'"
                >
                  {{ shippingCost === 0 ? t('cartDrawer.free') : formatEuro(shippingCost, true) }}
                </span>
              </div>
              <div class="flex justify-between text-sm font-black text-neutral-900 pt-2 border-t border-neutral-200">
                <span>{{ t('checkoutModal.totalPaid') }}</span>
                <span class="font-mono text-base text-neutral-900">{{ formatEuro(total) }}</span>
              </div>
            </div>

            <!-- Instant Checkout Trigger Button -->
            <!-- Action Buttons: 1. Instant Online Checkout | 2. Showroom Pass (Single Unified Action) -->
            <div class="space-y-2 pt-1">
              <button
                type="button"
                :disabled="isCheckingOut"
                @click="handleCheckout"
                class="w-full py-3.5 px-4 bg-maxaro-blue hover:bg-maxaro-blue-hover disabled:bg-neutral-400 text-white rounded-xl text-sm font-bold transition-all shadow-md active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span v-if="!isCheckingOut">{{ t('cartDrawer.checkoutButton') }}</span>
                <span v-else class="flex items-center gap-2">
                  <RefreshCw class="w-4 h-4 animate-spin" />
                  Handshake...
                </span>
                <ArrowRight v-if="!isCheckingOut" class="w-4 h-4" />
              </button>

              <!-- Unified Smart Showroom Pass Button (State-Aware) -->
              <button
                type="button"
                @click="activeShowroomPass ? cartStore.openShowroomPassModal() : handleGenerateShowroomPass()"
                class="w-full py-2.5 px-4 bg-white hover:bg-neutral-50 border-2 border-maxaro-blue/80 text-maxaro-blue rounded-xl text-xs font-bold transition-all shadow-2xs active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Building2 v-if="activeShowroomPass" class="w-4 h-4 text-maxaro-blue" />
                <QrCode v-else class="w-4 h-4 text-maxaro-blue" />
                <span v-if="activeShowroomPass">
                  {{ t('cartDrawer.viewPassWithId', { id: activeShowroomPass.passId }) }}
                </span>
                <span v-else>
                  {{ t('showroomPass.generatePassButton') }}
                </span>
              </button>
            </div>

            <!-- Payment Trust Reassurance -->
            <div class="flex items-center justify-center gap-1.5 text-[11px] text-neutral-500 pt-1">
              <ShieldCheck class="w-3.5 h-3.5 text-trust-green" />
              <span>{{ t('cartDrawer.paymentTrustNote') }}</span>
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
