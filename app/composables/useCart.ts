// app/composables/useCart.ts
import { storeToRefs } from 'pinia';
import { useCartStore } from '~~/app/stores/cartStore';

export function useCart() {
  const store = useCartStore();
  const {
    items,
    isDrawerOpen,
    isSyncing,
    isCheckingOut,
    lastHandshake,
    isCheckoutModalOpen,
    itemCount,
    subtotal,
    vatAmount,
    freeShippingThreshold,
    isFreeShipping,
    remainingForFreeShipping,
    shippingCost,
    total,
  } = storeToRefs(store);

  return {
    items,
    isDrawerOpen,
    isSyncing,
    isCheckingOut,
    lastHandshake,
    isCheckoutModalOpen,
    itemCount,
    subtotal,
    vatAmount,
    freeShippingThreshold,
    isFreeShipping,
    remainingForFreeShipping,
    shippingCost,
    total,
    addItem: store.addItem,
    updateQuantity: store.updateQuantity,
    removeItem: store.removeItem,
    clearCart: store.clearCart,
    toggleDrawer: store.toggleDrawer,
    initiateCheckout: store.initiateCheckout,
    store,
  };
}
