<script setup lang="ts">
import type { Product } from '~~/shared/types';
import { useCurrency } from '~~/app/composables/useCurrency';
import { useLocale } from '~~/app/composables/useLocale';
import { useCartStore } from '~~/app/stores/cartStore';
import { Sparkles, Plus, Check, ShoppingCart, ArrowRight } from 'lucide-vue-next';

const props = defineProps<{
  product: Product;
  complementaryProducts: Product[];
}>();

const { formatEuro } = useCurrency();
const { t } = useLocale();
const cartStore = useCartStore();

const isBundleAdded = ref(false);

const allSuiteItems = computed(() => {
  return [props.product, ...props.complementaryProducts];
});

const suiteTotalPrice = computed(() => {
  return allSuiteItems.value.reduce((acc, item) => acc + item.price, 0);
});

const bundleDiscountPrice = computed(() => {
  return Number((suiteTotalPrice.value * 0.95).toFixed(2));
});

async function handleAddCompleteSuite() {
  for (const item of allSuiteItems.value) {
    await cartStore.addItem(item, 1);
  }
  isBundleAdded.value = true;
  setTimeout(() => {
    isBundleAdded.value = false;
  }, 2500);
}
</script>

<template>
  <div v-if="complementaryProducts.length > 0" class="p-6 sm:p-8 bg-[#FAF9F5] border border-neutral-200/90 rounded-3xl space-y-6 text-left shadow-xs">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-200/80 pb-4">
      <div class="space-y-1">
        <div class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-maxaro-accent text-[10px] font-bold uppercase tracking-wider font-mono">
          <Sparkles class="w-3 h-3" />
          <span>{{ t('pdpSuite.badge') }}</span>
        </div>
        <h3 class="text-lg sm:text-xl font-black text-neutral-900 tracking-tight">
          {{ t('pdpSuite.title') }}
        </h3>
        <p class="text-xs text-neutral-600 max-w-2xl">
          {{ t('pdpSuite.subtitle') }}
        </p>
      </div>

      <!-- Suite Advantage Badge -->
      <span class="inline-flex items-center px-3 py-1 rounded-full bg-trust-greenBg text-trust-green font-bold text-xs shrink-0 self-start sm:self-center font-mono">
        {{ t('pdpSuite.advantage') }}
      </span>
    </div>

    <!-- 3 Items Horizontal Chain -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
      <!-- Main Product -->
      <div class="p-4 rounded-2xl bg-white border border-maxaro-blue/30 ring-1 ring-maxaro-blue/20 shadow-xs flex items-center gap-3">
        <NuxtImg
          :src="product.imageThumbnail"
          :alt="product.name"
          width="64"
          height="64"
          class="w-16 h-16 rounded-xl object-cover bg-neutral-100 border border-neutral-200 shrink-0"
        />
        <div class="min-w-0 flex-1">
          <span class="text-[9px] font-bold text-maxaro-blue uppercase tracking-wider font-mono">{{ t('pdpSuite.thisProduct') }}</span>
          <h4 class="text-xs font-bold text-neutral-900 truncate">{{ product.name }}</h4>
          <p class="text-[11px] font-mono font-bold text-neutral-900">{{ formatEuro(product.price) }}</p>
        </div>
      </div>

      <!-- Complementary Product 1 -->
      <div
        v-for="item in complementaryProducts"
        :key="item.id"
        class="p-4 rounded-2xl bg-white border border-neutral-200/90 shadow-xs flex items-center gap-3"
      >
        <NuxtImg
          :src="item.imageThumbnail"
          :alt="item.name"
          width="64"
          height="64"
          class="w-16 h-16 rounded-xl object-cover bg-neutral-100 border border-neutral-200 shrink-0"
        />
        <div class="min-w-0 flex-1">
          <span class="text-[9px] font-bold text-neutral-400 uppercase tracking-wider font-mono">{{ item.finish }}</span>
          <h4 class="text-xs font-bold text-neutral-900 truncate">{{ item.name }}</h4>
          <p class="text-[11px] font-mono font-bold text-neutral-900">{{ formatEuro(item.price) }}</p>
        </div>
      </div>
    </div>

    <!-- Combined Suite Purchase Action Bar -->
    <div class="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-neutral-200/90 shadow-xs">
      <div class="space-y-0.5">
        <div class="flex items-baseline gap-2">
          <span class="text-xs text-neutral-500 font-medium">{{ t('pdpSuite.bundlePriceLabel') }}</span>
          <span class="text-lg font-black font-mono text-neutral-900">{{ formatEuro(bundleDiscountPrice) }}</span>
          <span class="text-xs text-neutral-400 line-through font-mono">{{ formatEuro(suiteTotalPrice) }}</span>
        </div>
        <p class="text-[11px] text-trust-green font-semibold">
          {{ t('pdpSuite.bundlePerks') }}
        </p>
      </div>

      <button
        type="button"
        @click="handleAddCompleteSuite"
        class="inline-flex items-center justify-center gap-2 px-6 py-3 bg-maxaro-blue hover:bg-maxaro-blue-hover active:scale-95 text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-md cursor-pointer shrink-0"
      >
        <Check v-if="isBundleAdded" class="w-4 h-4 text-trust-green" />
        <ShoppingCart v-else class="w-4 h-4" />
        <span>{{ isBundleAdded ? t('pdpSuite.addedSuccess') : t('pdpSuite.addToCartButton') }}</span>
      </button>
    </div>
  </div>
</template>
