<!-- app/components/cart/FreeShippingBar.vue -->
<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useCartStore } from '~~/app/stores/cartStore';
import { useCurrency } from '~~/app/composables/useCurrency';
import { useLocale } from '~~/app/composables/useLocale';
import { CheckCircle2, Truck } from 'lucide-vue-next';

const cartStore = useCartStore();
const { subtotal, isFreeShipping, remainingForFreeShipping, freeShippingThreshold } = storeToRefs(cartStore);
const { formatEuro } = useCurrency();
const { t } = useLocale();

const progressPercentage = computed(() => {
  if (subtotal.value >= freeShippingThreshold.value) return 100;
  return Math.min(100, Math.round((subtotal.value / freeShippingThreshold.value) * 100));
});
</script>

<template>
  <div class="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200 text-xs space-y-2">
    <div class="flex items-center justify-between font-medium">
      <span v-if="isFreeShipping" class="text-trust-green flex items-center gap-1.5 font-bold">
        <CheckCircle2 class="w-4 h-4 shrink-0" />
        <span>{{ t('cartDrawer.freeShippingUnlocked') }}</span>
      </span>
      <span v-else class="text-neutral-700 flex items-center gap-1.5">
        <Truck class="w-4 h-4 text-maxaro-blue shrink-0" />
        <span>{{ t('cartDrawer.freeShippingRemaining', { amount: formatEuro(remainingForFreeShipping) }) }}</span>
      </span>
      <span class="font-mono text-neutral-500 font-bold text-[11px]">{{ progressPercentage }}%</span>
    </div>

    <!-- Animated Smooth Hardware-Accelerated Progress Bar -->
    <div class="w-full h-2 bg-neutral-200 rounded-full overflow-hidden">
      <div
        class="h-full bg-trust-green transition-all duration-300 ease-out rounded-full"
        :style="{ width: `${progressPercentage}%` }"
      />
    </div>
  </div>
</template>
