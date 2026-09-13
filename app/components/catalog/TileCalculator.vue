<!-- app/components/catalog/TileCalculator.vue -->
<script setup lang="ts">
import { ref, computed } from 'vue';
import type { Product, TileCalculationMetadata } from '~~/shared/types';
import { useCartStore } from '~~/app/stores/cartStore';
import { useCurrency } from '~~/app/composables/useCurrency';
import { useLocale } from '~~/app/composables/useLocale';
import {
  Calculator,
  Layers,
  Sparkles,
  CheckCircle2,
  Info,
  ShoppingCart,
  Maximize2,
  Check,
  ShieldCheck,
} from 'lucide-vue-next';

const props = defineProps<{
  product: Product;
}>();

const emit = defineEmits<{
  (e: 'added-to-cart', metadata: TileCalculationMetadata): void;
}>();

const cartStore = useCartStore();
const { formatEuro } = useCurrency();
const { t } = useLocale();

// Calculation inputs
const inputMode = ref<'dimensions' | 'directM2'>('dimensions');
const roomLength = ref<number>(3.5);
const roomWidth = ref<number>(2.4);
const directM2Input = ref<number>(8.4);
const wastePercentage = ref<number>(10); // 10% standard recommended

// Tile package constants
const coveragePerPackageM2 = computed(() => props.product.packageCoverageM2 || 1.44);
const piecesPerPackage = computed(() => props.product.pieceCountPerPackage || 4);
const pricePerM2 = computed(() => props.product.price);
const pricePerPackage = computed(() => Number((coveragePerPackageM2.value * pricePerM2.value).toFixed(2)));

// Reactive Calculations
const netRoomM2 = computed(() => {
  if (inputMode.value === 'dimensions') {
    const l = Math.max(0.1, Number(roomLength.value) || 0);
    const w = Math.max(0.1, Number(roomWidth.value) || 0);
    return Number((l * w).toFixed(2));
  }
  return Math.max(0.1, Number(directM2Input.value) || 0.1);
});

const wasteM2 = computed(() => {
  return Number((netRoomM2.value * (wastePercentage.value / 100)).toFixed(2));
});

const grossRequiredM2 = computed(() => {
  return Number((netRoomM2.value + wasteM2.value).toFixed(2));
});

const packageCount = computed(() => {
  return Math.max(1, Math.ceil(grossRequiredM2.value / coveragePerPackageM2.value));
});

const totalM2Purchased = computed(() => {
  return Number((packageCount.value * coveragePerPackageM2.value).toFixed(2));
});

const surplusM2 = computed(() => {
  return Number(Math.max(0, totalM2Purchased.value - grossRequiredM2.value).toFixed(2));
});

const totalPrice = computed(() => {
  return Number((packageCount.value * pricePerPackage.value).toFixed(2));
});

const isAddedAnimation = ref(false);

function handleAddToCart() {
  const metadata: TileCalculationMetadata = {
    isTile: true,
    packageCount: packageCount.value,
    coveragePerPackageM2: coveragePerPackageM2.value,
    totalM2Purchased: totalM2Purchased.value,
    netRoomM2: netRoomM2.value,
    wastePercentage: wastePercentage.value,
    pricePerM2: pricePerM2.value,
    pricePerPackage: pricePerPackage.value,
    totalPrice: totalPrice.value,
  };

  cartStore.addItem(props.product, packageCount.value, metadata);
  emit('added-to-cart', metadata);

  isAddedAnimation.value = true;
  setTimeout(() => {
    isAddedAnimation.value = false;
  }, 1500);
}
</script>

<template>
  <div class="rounded-3xl border-2 border-maxaro-blue/20 bg-gradient-to-b from-maxaro-surface-subtle to-white p-5 sm:p-6 shadow-card space-y-5">
    <!-- Calculator Header -->
    <div class="flex items-center justify-between border-b border-neutral-200/80 pb-4">
      <div class="flex items-center gap-2.5">
        <div class="p-2 rounded-xl bg-maxaro-blue text-white shadow-xs">
          <Calculator class="w-5 h-5" />
        </div>
        <div>
          <div class="inline-flex items-center gap-1 text-[10px] font-bold text-trust-green uppercase tracking-wider">
            <Sparkles class="w-3 h-3 text-trust-green" />
            <span>{{ t('tileCalculator.badge') }}</span>
          </div>
          <h3 class="text-base sm:text-lg font-black text-neutral-900 leading-tight">
            {{ t('tileCalculator.title') }}
          </h3>
        </div>
      </div>

      <span class="text-xs font-mono font-bold text-neutral-600 hidden sm:inline-block bg-white px-2.5 py-1 rounded-lg border border-neutral-200">
        {{ formatEuro(pricePerM2) }} / m²
      </span>
    </div>

    <!-- Mode Switcher Tabs -->
    <div class="grid grid-cols-2 p-1 bg-neutral-200/70 rounded-xl text-xs font-bold text-neutral-600">
      <button
        type="button"
        @click="inputMode = 'dimensions'"
        class="py-2 px-3 rounded-lg transition-all text-center cursor-pointer"
        :class="inputMode === 'dimensions' ? 'bg-white text-neutral-900 shadow-xs' : 'hover:text-neutral-900'"
      >
        <span>{{ t('tileCalculator.dimensionsMode') }}</span>
      </button>
      <button
        type="button"
        @click="inputMode = 'directM2'"
        class="py-2 px-3 rounded-lg transition-all text-center cursor-pointer"
        :class="inputMode === 'directM2' ? 'bg-white text-neutral-900 shadow-xs' : 'hover:text-neutral-900'"
      >
        <span>{{ t('tileCalculator.directM2Mode') }}</span>
      </button>
    </div>

    <!-- Input Fields -->
    <div v-if="inputMode === 'dimensions'" class="grid grid-cols-2 gap-3">
      <div class="space-y-1.5">
        <label class="block text-xs font-bold text-neutral-700">
          {{ t('tileCalculator.roomLength') }}
        </label>
        <div class="relative">
          <input
            v-model.number="roomLength"
            type="number"
            step="0.1"
            min="0.5"
            max="50"
            class="w-full px-3.5 py-2.5 bg-white border border-neutral-300 rounded-xl font-mono text-sm text-neutral-900 focus:outline-none focus:border-maxaro-blue focus:ring-2 focus:ring-maxaro-blue-light"
          />
          <span class="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-neutral-400">m</span>
        </div>
      </div>

      <div class="space-y-1.5">
        <label class="block text-xs font-bold text-neutral-700">
          {{ t('tileCalculator.roomWidth') }}
        </label>
        <div class="relative">
          <input
            v-model.number="roomWidth"
            type="number"
            step="0.1"
            min="0.5"
            max="50"
            class="w-full px-3.5 py-2.5 bg-white border border-neutral-300 rounded-xl font-mono text-sm text-neutral-900 focus:outline-none focus:border-maxaro-blue focus:ring-2 focus:ring-maxaro-blue-light"
          />
          <span class="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-neutral-400">m</span>
        </div>
      </div>
    </div>

    <div v-else class="space-y-1.5">
      <label class="block text-xs font-bold text-neutral-700">
        {{ t('tileCalculator.netArea') }}
      </label>
      <div class="relative">
        <input
          v-model.number="directM2Input"
          type="number"
          step="0.1"
          min="0.5"
          max="500"
          class="w-full px-3.5 py-2.5 bg-white border border-neutral-300 rounded-xl font-mono text-sm text-neutral-900 focus:outline-none focus:border-maxaro-blue focus:ring-2 focus:ring-maxaro-blue-light"
        />
        <span class="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-neutral-400">m²</span>
      </div>
    </div>

    <!-- Snijverlies (Cutting Waste) Selector -->
    <div class="space-y-2">
      <div class="flex items-center justify-between">
        <label class="block text-xs font-bold text-neutral-800">
          {{ t('tileCalculator.recommendedWaste') }}
        </label>
        <span class="text-[11px] text-neutral-500 font-medium">{{ t('tileCalculator.wasteNotice') }}</span>
      </div>

      <div class="grid grid-cols-3 gap-2">
        <button
          type="button"
          @click="wastePercentage = 10"
          class="p-2.5 rounded-xl border text-left transition-all cursor-pointer"
          :class="wastePercentage === 10
            ? 'border-maxaro-blue bg-maxaro-blue-light/50 ring-2 ring-maxaro-blue/40 text-neutral-900'
            : 'border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-600'"
        >
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold">+10%</span>
            <span class="text-[9px] uppercase font-bold text-trust-green bg-trust-greenBg px-1 rounded">{{ t('tileCalculator.recommended') }}</span>
          </div>
          <p class="text-[10px] text-neutral-500 mt-0.5">{{ t('tileCalculator.standardStraight') }}</p>
        </button>

        <button
          type="button"
          @click="wastePercentage = 15"
          class="p-2.5 rounded-xl border text-left transition-all cursor-pointer"
          :class="wastePercentage === 15
            ? 'border-maxaro-blue bg-maxaro-blue-light/50 ring-2 ring-maxaro-blue/40 text-neutral-900'
            : 'border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-600'"
        >
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold">+15%</span>
            <span class="text-[9px] uppercase font-bold text-amber-700 bg-amber-50 px-1 rounded">{{ t('tileCalculator.pattern') }}</span>
          </div>
          <p class="text-[10px] text-neutral-500 mt-0.5">{{ t('tileCalculator.herringbone') }}</p>
        </button>

        <button
          type="button"
          @click="wastePercentage = 0"
          class="p-2.5 rounded-xl border text-left transition-all cursor-pointer"
          :class="wastePercentage === 0
            ? 'border-maxaro-blue bg-maxaro-blue-light/50 ring-2 ring-maxaro-blue/40 text-neutral-900'
            : 'border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-600'"
        >
          <span class="text-xs font-bold block">0%</span>
          <p class="text-[10px] text-neutral-500 mt-0.5">{{ t('tileCalculator.noWaste') }}</p>
        </button>
      </div>
    </div>

    <!-- Calculation Telemetry Breakdown Card -->
    <div class="rounded-2xl bg-white border border-neutral-200 p-4 space-y-2.5 text-xs">
      <div class="flex justify-between items-center text-neutral-600">
        <span>{{ t('tileCalculator.netRoomArea') }}</span>
        <span class="font-mono font-semibold text-neutral-900">{{ netRoomM2 }} m²</span>
      </div>

      <div v-if="wastePercentage > 0" class="flex justify-between items-center text-neutral-600">
        <span class="flex items-center gap-1">
          <span>{{ t('tileCalculator.cuttingWasteLabel', { percent: wastePercentage }) }}</span>
        </span>
        <span class="font-mono text-neutral-700">+{{ wasteM2 }} m²</span>
      </div>

      <div class="flex justify-between items-center text-neutral-600">
        <span>{{ t('tileCalculator.packageContent') }}</span>
        <span class="font-mono text-neutral-700">{{ coveragePerPackageM2 }} m² ({{ piecesPerPackage }} {{ t('tileCalculator.pieces') }})</span>
      </div>

      <div class="pt-2 border-t border-neutral-200/80 flex justify-between items-center font-bold text-sm">
        <span class="text-neutral-900 flex items-center gap-1.5">
          <Layers class="w-4 h-4 text-maxaro-blue" />
          <span>{{ t('tileCalculator.orderAdvice') }}</span>
        </span>
        <span class="font-mono text-maxaro-blue text-base">
          {{ t('tileCalculator.packagesWithM2', { count: packageCount, m2: totalM2Purchased }) }}
        </span>
      </div>

      <div v-if="surplusM2 > 0" class="flex justify-between items-center text-[11px] text-trust-green bg-trust-greenBg/50 p-2 rounded-lg">
        <span class="flex items-center gap-1">
          <CheckCircle2 class="w-3.5 h-3.5 shrink-0" />
          <span>{{ t('tileCalculator.safetyMargin', { surplus: surplusM2 }) }}</span>
        </span>
      </div>

      <!-- Financial Total -->
      <div class="pt-2 border-t border-neutral-200/80 flex justify-between items-baseline">
        <div>
          <span class="text-xs text-neutral-500 block">{{ t('tileCalculator.totalInvestment') }}</span>
          <span class="text-[10px] text-neutral-400 font-mono">{{ packageCount }}x {{ formatEuro(pricePerPackage) }} {{ t('tileCalculator.perPackage') }}</span>
        </div>
        <span class="text-xl sm:text-2xl font-black font-mono text-neutral-900">
          {{ formatEuro(totalPrice) }}
        </span>
      </div>
    </div>

    <!-- Quick 1-Click Add Action Button -->
    <button
      type="button"
      @click="handleAddToCart"
      class="w-full py-3.5 px-5 bg-maxaro-blue hover:bg-maxaro-blue-hover text-white rounded-xl text-sm font-bold transition-all shadow-md active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
    >
      <Check v-if="isAddedAnimation" class="w-4 h-4 text-trust-green animate-bounce" />
      <ShoppingCart v-else class="w-4 h-4" />
      <span>{{ t('tileCalculator.addToCartButton', { count: packageCount, m2: totalM2Purchased }) }}</span>
    </button>
  </div>
</template>
