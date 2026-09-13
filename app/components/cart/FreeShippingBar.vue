<!-- app/components/cart/FreeShippingBar.vue -->
<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useCartStore } from '~~/app/stores/cartStore';
import { useCurrency } from '~~/app/composables/useCurrency';
import { useLocale } from '~~/app/composables/useLocale';
import { CheckCircle2, Truck, Sparkles } from 'lucide-vue-next';

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
  <div
    class="relative overflow-hidden p-4 rounded-2xl border transition-all duration-300 text-xs flex flex-col gap-y-2.5 shadow-2xs"
    :class="isFreeShipping ? 'bg-emerald-50/60 border-emerald-200/90 text-emerald-900' : 'bg-white border-neutral-200/90 text-neutral-800'"
  >
    <!-- Background Ambient Glow when unlocked -->
    <div
      v-if="isFreeShipping"
      class="absolute -right-8 -top-8 w-28 h-28 bg-emerald-300/30 rounded-full blur-2xl pointer-events-none"
    />

    <div class="relative z-10 flex items-center justify-between font-medium">
      <div v-if="isFreeShipping" class="text-trust-green flex items-center gap-2 font-bold">
        <div class="p-1 rounded-full bg-trust-green/10 text-trust-green">
          <CheckCircle2 class="w-4 h-4 shrink-0" />
        </div>
        <div class="flex items-center gap-1.5">
          <span>{{ t('cartDrawer.freeShippingUnlocked') }}</span>
          <Sparkles class="w-3.5 h-3.5 text-amber-500 animate-pulse" />
        </div>
      </div>
      <div v-else class="text-neutral-700 flex items-center gap-2">
        <div class="p-1 rounded-lg bg-maxaro-blue/10 text-maxaro-blue">
          <Truck class="w-4 h-4 shrink-0" />
        </div>
        <span>{{ t('cartDrawer.freeShippingRemaining', { amount: formatEuro(remainingForFreeShipping) }) }}</span>
      </div>

      <span
        class="font-mono font-bold text-[11px] px-2 py-0.5 rounded-full"
        :class="isFreeShipping ? 'bg-trust-green/15 text-trust-green' : 'bg-neutral-100 text-neutral-600'"
      >
        {{ progressPercentage }}%
      </span>
    </div>

    <!-- Animated Smooth Hardware-Accelerated Progress Track -->
    <div class="relative z-10 w-full h-2.5 bg-neutral-100 rounded-full overflow-hidden p-0.5 border border-neutral-200/60">
      <div
        class="h-full rounded-full transition-all duration-500 ease-out"
        :class="isFreeShipping ? 'bg-gradient-to-r from-trust-green via-emerald-400 to-teal-400 shadow-xs' : 'bg-gradient-to-r from-maxaro-blue to-maxaro-accent'"
        :style="{ width: `${progressPercentage}%` }"
      />
    </div>
  </div>
</template>
