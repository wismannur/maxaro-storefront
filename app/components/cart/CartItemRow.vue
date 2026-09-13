<!-- app/components/cart/CartItemRow.vue -->
<script setup lang="ts">
import type { CartLineItem } from '~~/shared/types';
import { getItemLineTotal } from '~~/shared/types';
import { useCartStore } from '~~/app/stores/cartStore';
import { useCurrency } from '~~/app/composables/useCurrency';
import { useLocale } from '~~/app/composables/useLocale';
import { Trash2, Plus, Minus, Check, Layers } from 'lucide-vue-next';
import MaterialSwatch from '~~/app/components/catalog/MaterialSwatch.vue';

const props = defineProps<{
  item: CartLineItem;
}>();

const cartStore = useCartStore();
const { formatEuro, formatDimensions } = useCurrency();
const { t } = useLocale();

const formattedDimension = computed(() => {
  const d = props.item.product.dimensions;
  if (!d) return '';
  return formatDimensions(d.lengthCm, d.widthCm, d.heightCm, d.thicknessMm);
});

// Original line total if discount applies
const originalLineTotal = computed(() => {
  if (!props.item.product.originalPrice) return null;
  if (props.item.tileMetadata) {
    return null;
  }
  return Number((props.item.product.originalPrice * props.item.quantity).toFixed(2));
});

function handleNavigate() {
  cartStore.closeDrawer();
}
</script>

<template>
  <article
    role="listitem"
    class="relative flex gap-3 sm:gap-3.5 p-3 sm:p-3.5 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs hover:border-neutral-300 hover:shadow-card-subtle transition-all duration-200 group"
  >
    <!-- Thumbnail (Aspect 4/3 anti-CLS container with interactive link) -->
    <NuxtLink
      :to="`/product/${item.product.slug}`"
      @click="handleNavigate"
      class="relative w-20 h-20 sm:w-22 sm:h-22 rounded-xl overflow-hidden bg-neutral-100 shrink-0 border border-neutral-200/80 group-hover:border-neutral-300 transition-colors focus-visible:ring-2 focus-visible:ring-maxaro-blue focus-visible:outline-none"
      :aria-label="t('product.viewProduct', { name: item.product.name })"
    >
      <NuxtImg
        :src="item.product.imageThumbnail"
        :alt="`${item.product.name} - ${item.product.finish}`"
        width="160"
        height="160"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        loading="lazy"
        decoding="async"
      />

      <!-- Floating Tile or Warranty Indicator -->
      <span
        v-if="item.tileMetadata"
        class="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded bg-amber-900/85 backdrop-blur-xs text-[9px] font-bold text-white tracking-wide uppercase"
      >
        {{ t('productDetail.tile') }}
      </span>
      <span
        v-else-if="item.product.warrantyYears"
        class="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded bg-maxaro-blue/85 backdrop-blur-xs text-[9px] font-bold text-white tracking-wide"
      >
        {{ t('product.warrantyShort', { years: item.product.warrantyYears }) }}
      </span>
    </NuxtLink>

    <!-- Details Column -->
    <div class="flex-1 min-w-0 flex flex-col justify-between">
      <div>
        <!-- Top Row: Category / SKU tag & Remove Button -->
        <div class="flex items-start justify-between gap-2">
          <div class="flex items-center gap-1.5 text-[11px] text-neutral-400 font-mono line-clamp-1">
            <span class="text-neutral-500 font-sans font-medium capitalize">{{ t(`categoriesMeta.${item.product.category}.title`) || item.product.categoryLabelNl || item.product.category }}</span>
            <span>&bull;</span>
            <span>{{ item.product.sku }}</span>
          </div>

          <!-- Quick Remove Button -->
          <button
            type="button"
            @click="cartStore.removeItem(item.product.id)"
            class="p-1 -mr-1 -mt-0.5 rounded-lg text-neutral-400 hover:text-red-600 hover:bg-red-50 active:scale-95 transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:outline-none shrink-0"
            :title="t('product.remove')"
            :aria-label="t('product.removeFromCart', { name: item.product.name })"
          >
            <Trash2 class="w-3.5 h-3.5" />
          </button>
        </div>

        <!-- Product Title with Link -->
        <NuxtLink
          :to="`/product/${item.product.slug}`"
          @click="handleNavigate"
          class="block mt-0.5 text-xs sm:text-[13px] font-bold text-neutral-900 line-clamp-2 group-hover:text-maxaro-blue transition-colors leading-snug focus-visible:underline focus-visible:outline-none"
        >
          {{ item.product.name }}
        </NuxtLink>

        <!-- Finish & Dimension Attributes Micro-Row -->
        <div class="mt-1.5 flex flex-wrap items-center gap-1.5 text-[11px]">
          <!-- Finish Chip -->
          <div class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-700 font-medium">
            <MaterialSwatch :finish="item.product.finish" size="sm" />
            <span>{{ item.product.finish }}</span>
          </div>

          <!-- Dimensions Chip -->
          <div v-if="formattedDimension" class="inline-flex items-center px-1.5 py-0.5 rounded-md bg-neutral-100 text-neutral-600 font-mono text-[10px]">
            {{ formattedDimension }}
          </div>
        </div>

        <!-- Tile Calculation Metadata Panel (Specialized for Dutch Ceramic Tiles) -->
        <div
          v-if="item.tileMetadata"
          class="mt-2 p-2 rounded-xl bg-amber-50/80 border border-amber-200/70 text-[10px] space-y-1 text-amber-900"
        >
          <div class="flex items-center justify-between font-semibold">
            <span class="flex items-center gap-1">
              <Layers class="w-3 h-3 text-amber-700" />
              <span>{{ t('tileCalculator.packagesWithM2', { count: item.tileMetadata.packageCount, m2: item.tileMetadata.totalM2Purchased }) }}</span>
            </span>
            <span v-if="item.tileMetadata.wastePercentage > 0" class="text-amber-700 font-mono">
              {{ t('tileCalculator.wasteSummary', { percent: item.tileMetadata.wastePercentage }) }}
            </span>
          </div>
          <div class="flex items-center justify-between text-amber-700/80 font-mono text-[9px] pt-0.5 border-t border-amber-200/50">
            <span>{{ t('tileCalculator.pricePerPackage', { price: formatEuro(item.tileMetadata.pricePerPackage) }) }}</span>
            <span>{{ t('tileCalculator.pricePerM2', { price: formatEuro(item.tileMetadata.pricePerM2) }) }}</span>
          </div>
        </div>

        <!-- Stock / Delivery Assurance Tag -->
        <div class="mt-1.5 flex items-center gap-1 text-[10px] text-trust-green font-medium">
          <Check class="w-3 h-3 stroke-[2.5]" />
          <span>{{ item.product.inStock ? t('product.inStock') : item.product.deliveryEstimateNl }}</span>
        </div>
      </div>

      <!-- Action & Price Row -->
      <div class="mt-2.5 pt-2 border-t border-neutral-100 flex items-center justify-between gap-2">
        <!-- Ergonomic Quantity Stepper (WCAG touch targets & tactile haptics) -->
        <div class="flex items-center border border-neutral-200 rounded-xl bg-neutral-50/80 p-0.5 shadow-2xs">
          <!-- Decrement / Trash Button -->
          <button
            type="button"
            @click="cartStore.updateQuantity(item.product.id, -1)"
            class="w-7 h-7 flex items-center justify-center rounded-lg text-neutral-500 hover:text-neutral-900 hover:bg-white active:scale-95 transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-maxaro-blue focus-visible:outline-none"
            :class="{ 'hover:text-red-600 hover:bg-red-50': item.quantity === 1 }"
            :aria-label="item.quantity === 1 ? t('product.removeFromCart', { name: item.product.name }) : t('product.decreaseQuantity', { name: item.product.name })"
            :title="item.quantity === 1 ? t('product.remove') : t('product.decrease')"
          >
            <Trash2 v-if="item.quantity === 1" class="w-3 h-3 text-neutral-400" />
            <Minus v-else class="w-3 h-3" />
          </button>

          <!-- Quantity Value with Tabular Figures -->
          <span
            class="w-7 text-center font-mono font-bold text-xs text-neutral-900 tabular-nums select-none"
            aria-live="polite"
          >
            {{ item.quantity }}
          </span>

          <!-- Increment Button -->
          <button
            type="button"
            @click="cartStore.updateQuantity(item.product.id, 1)"
            class="w-7 h-7 flex items-center justify-center rounded-lg text-neutral-500 hover:text-neutral-900 hover:bg-white active:scale-95 transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-maxaro-blue focus-visible:outline-none"
            :aria-label="t('product.increaseQuantity', { name: item.product.name })"
            :title="t('product.increase')"
          >
            <Plus class="w-3 h-3" />
          </button>
        </div>

        <!-- Line Item Price Breakdown -->
        <div class="text-right">
          <div class="flex items-baseline justify-end gap-1.5">
            <span
              v-if="originalLineTotal"
              class="text-[11px] text-neutral-400 line-through font-mono"
            >
              {{ formatEuro(originalLineTotal) }}
            </span>
            <span class="font-mono font-black text-xs sm:text-sm text-neutral-900 tracking-tight">
              {{ formatEuro(getItemLineTotal(item)) }}
            </span>
          </div>

          <!-- Unit Rate Subtext -->
          <div v-if="item.tileMetadata" class="text-[10px] text-neutral-400 font-mono">
            {{ formatEuro(item.tileMetadata.pricePerPackage) }} {{ t('tileCalculator.perPackage') }}
          </div>
          <div v-else-if="item.quantity > 1" class="text-[10px] text-neutral-400 font-mono">
            {{ formatEuro(item.product.price) }} {{ t('product.perPiece') }}
          </div>
        </div>
      </div>
    </div>
  </article>
</template>
