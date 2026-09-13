import { defineStore } from 'pinia';
import type { CartLineItem, Product, ShowroomPassData, ShowroomLocation, TileCalculationMetadata } from '~~/shared/types';
import { getItemLineTotal } from '~~/shared/types';
import {
  MAXARO_SHOWROOMS,
  FREE_SHIPPING_THRESHOLD,
  STANDARD_SHIPPING_COST,
  DUTCH_VAT_MULTIPLIER,
  SHOWROOM_PASS_PREFIX,
  SHOWROOM_PASS_VALIDITY_DAYS,
} from '~~/shared/constants';
import type { CheckoutHandshakeResponse } from '~~/server/api/cart/checkout.post';

// Re-export for backward compatibility
export const SHOWROOM_LOCATIONS: ShowroomLocation[] = MAXARO_SHOWROOMS;

export const useCartStore = defineStore('cart', () => {
  // In-memory cart items with local storage hydration
  const items = ref<CartLineItem[]>([]);
  const isDrawerOpen = ref(false);
  const isSyncing = ref(false);
  const isCheckingOut = ref(false);
  const lastHandshake = ref<CheckoutHandshakeResponse | null>(null);
  const isCheckoutModalOpen = ref(false);

  // Omnichannel Showroom Pass state
  const isShowroomPassModalOpen = ref(false);
  const activeShowroomPass = ref<ShowroomPassData | null>(null);
  const savedShowroomPasses = ref<ShowroomPassData[]>([]);

  // Initialize from localStorage safely on client mount
  if (import.meta.client) {
    onMounted(() => {
      const saved = localStorage.getItem('maxaro-cart-v1');
      if (saved) {
        try {
          items.value = JSON.parse(saved);
        } catch (err) {
          console.warn('Failed to parse saved cart:', err);
        }
      }

      const savedPass = localStorage.getItem('maxaro-showroom-pass-active');
      if (savedPass) {
        try {
          activeShowroomPass.value = JSON.parse(savedPass);
        } catch (err) {
          console.warn('Failed to parse active showroom pass:', err);
        }
      }
    });

    watch(
      items,
      (val) => {
        localStorage.setItem('maxaro-cart-v1', JSON.stringify(val));
      },
      { deep: true }
    );

    watch(
      activeShowroomPass,
      (val) => {
        if (val) {
          localStorage.setItem('maxaro-showroom-pass-active', JSON.stringify(val));
        } else {
          localStorage.removeItem('maxaro-showroom-pass-active');
        }
      },
      { deep: true }
    );
  }

  // Reactive Totals
  const itemCount = computed(() =>
    items.value.reduce((total, i) => total + i.quantity, 0)
  );

  const subtotal = computed(() =>
    items.value.reduce((sum, i) => sum + getItemLineTotal(i), 0)
  );

  // 21% BTW inclusive breakdown for Dutch tax compliance
  const vatAmount = computed(() =>
    Number((subtotal.value * DUTCH_VAT_MULTIPLIER).toFixed(2))
  );

  // Dutch free shipping threshold (€100)
  const freeShippingThreshold = ref(FREE_SHIPPING_THRESHOLD);
  const isFreeShipping = computed(() =>
    subtotal.value >= freeShippingThreshold.value || items.value.length === 0
  );
  const remainingForFreeShipping = computed(() =>
    Number(Math.max(0, freeShippingThreshold.value - subtotal.value).toFixed(2))
  );
  const shippingCost = computed(() =>
    isFreeShipping.value ? 0 : STANDARD_SHIPPING_COST
  );
  const total = computed(() =>
    Number((subtotal.value + shippingCost.value).toFixed(2))
  );

  // Add Item (0ms perceived latency on Nuxt 4 Edge)
  function addItem(product: Product, quantity = 1, tileMetadata?: TileCalculationMetadata) {
    // 1. Instant local mutation
    const existing = items.value.find((i) => i.product.id === product.id);
    if (existing) {
      existing.quantity += quantity;
      if (tileMetadata) {
        existing.tileMetadata = tileMetadata;
      }
    } else {
      items.value.push({
        product,
        quantity,
        addedAt: Date.now(),
        tileMetadata,
      });
    }

    // 2. Open drawer immediately (0ms visual feedback)
    isDrawerOpen.value = true;

    // 3. Decoupled background sync
    syncWithBackend();
  }

  function updateQuantity(productId: string, delta: number) {
    const item = items.value.find((i) => i.product.id === productId);
    if (!item) return;

    item.quantity += delta;
    if (item.quantity <= 0) {
      removeItem(productId);
    } else {
      if (item.tileMetadata) {
        item.tileMetadata.packageCount = item.quantity;
        item.tileMetadata.totalM2Purchased = Number(
          (item.quantity * item.tileMetadata.coveragePerPackageM2).toFixed(2)
        );
        item.tileMetadata.totalPrice = Number(
          (item.quantity * item.tileMetadata.pricePerPackage).toFixed(2)
        );
      }
      syncWithBackend();
    }
  }

  function removeItem(productId: string) {
    items.value = items.value.filter((i) => i.product.id !== productId);
    syncWithBackend();
  }

  function clearCart() {
    items.value = [];
    if (import.meta.client) {
      localStorage.removeItem('maxaro-cart-v1');
    }
    syncWithBackend();
  }

  function toggleDrawer() {
    isDrawerOpen.value = !isDrawerOpen.value;
  }

  function openDrawer() {
    isDrawerOpen.value = true;
  }

  function closeDrawer() {
    isDrawerOpen.value = false;
  }

  async function syncWithBackend() {
    isSyncing.value = true;
    try {
      await $fetch('/api/cart/sync', {
        method: 'POST',
        body: { items: items.value },
      });
    } catch (err) {
      console.warn('Silent cart background sync retry scheduled:', err);
    } finally {
      isSyncing.value = false;
    }
  }

  async function initiateCheckout(): Promise<CheckoutHandshakeResponse | null> {
    if (items.value.length === 0) return null;
    isCheckingOut.value = true;
    isDrawerOpen.value = false; // Close cart drawer so checkout modal displays cleanly without backdrop blur collision

    try {
      const response = await $fetch<CheckoutHandshakeResponse>('/api/cart/checkout', {
        method: 'POST',
        body: { items: items.value },
      });

      lastHandshake.value = response;
      isCheckoutModalOpen.value = true;
      return response;
    } catch (err) {
      console.error('Checkout handshake error:', err);
      return null;
    } finally {
      isCheckingOut.value = false;
    }
  }

  function generateShowroomPass(showroomLocationId = 'roosendaal'): ShowroomPassData | null {
    if (items.value.length === 0) return null;

    const location: ShowroomLocation = SHOWROOM_LOCATIONS.find((l) => l.id === showroomLocationId) || SHOWROOM_LOCATIONS[0]!;
    const now = new Date();
    const expiry = new Date(now.getTime() + SHOWROOM_PASS_VALIDITY_DAYS * 24 * 60 * 60 * 1000);

    const pass: ShowroomPassData = {
      passId: `${SHOWROOM_PASS_PREFIX}${Math.floor(100000 + Math.random() * 900000)}`,
      createdAt: now.toISOString(),
      expiresAt: expiry.toISOString(),
      showroom: location,
      items: items.value.map((i) => ({
        id: i.product.id,
        sku: i.product.sku,
        name: i.product.name,
        finish: i.product.finish,
        quantity: i.quantity,
        unitPrice: i.tileMetadata ? i.tileMetadata.pricePerPackage : i.product.price,
        totalPrice: getItemLineTotal(i),
        imageThumbnail: i.product.imageThumbnail,
        categoryLabelNl: i.product.categoryLabelNl,
      })),
      totals: {
        itemCount: itemCount.value,
        subtotal: subtotal.value,
        vatAmount: vatAmount.value,
        total: total.value,
      },
    };

    activeShowroomPass.value = pass;
    isDrawerOpen.value = false;
    isShowroomPassModalOpen.value = true;
    return pass;
  }

  function switchShowroomForActivePass(showroomLocationId: string) {
    if (!activeShowroomPass.value) return;
    const location = SHOWROOM_LOCATIONS.find((l) => l.id === showroomLocationId);
    if (location) {
      activeShowroomPass.value.showroom = location;
    }
  }

  function openShowroomPassModal() {
    if (!activeShowroomPass.value && items.value.length > 0) {
      generateShowroomPass();
    } else if (activeShowroomPass.value) {
      isShowroomPassModalOpen.value = true;
    }
  }

  function closeShowroomPassModal() {
    isShowroomPassModalOpen.value = false;
  }

  return {
    items,
    isDrawerOpen,
    isSyncing,
    isCheckingOut,
    lastHandshake,
    isCheckoutModalOpen,
    isShowroomPassModalOpen,
    activeShowroomPass,
    savedShowroomPasses,
    itemCount,
    subtotal,
    vatAmount,
    freeShippingThreshold,
    isFreeShipping,
    remainingForFreeShipping,
    shippingCost,
    total,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    toggleDrawer,
    openDrawer,
    closeDrawer,
    syncWithBackend,
    initiateCheckout,
    generateShowroomPass,
    switchShowroomForActivePass,
    openShowroomPassModal,
    closeShowroomPassModal,
  };
});
