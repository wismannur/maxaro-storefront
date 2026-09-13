<script setup lang="ts">
import type { Product } from '~~/shared/types';
import { Check, ShoppingCart, Star, Eye, ShieldCheck } from 'lucide-vue-next';
import { useCurrency } from '~~/app/composables/useCurrency';
import { useLocale } from '~~/app/composables/useLocale';
import MaterialSwatch from './MaterialSwatch.vue';

const props = defineProps<{
  product: Product;
}>();

const emit = defineEmits<{
  (e: 'add-to-cart', product: Product): void;
}>();

const { formatEuro, formatDimensions } = useCurrency();
const { t } = useLocale();

const formattedDimension = computed(() => {
  const d = props.product.dimensions;
  return formatDimensions(d.lengthCm, d.widthCm, d.heightCm, d.thicknessMm);
});

function handleQuickAdd() {
  emit('add-to-cart', props.product);
}
</script>

<template>
  <div
    class="group relative flex flex-col justify-between rounded-2xl border border-neutral-200 bg-white p-3 sm:p-4 transition-all duration-200 hover:shadow-card-hover hover:border-neutral-300"
  >
    <div>
      <!-- Explicit 4/3 Aspect Ratio Container (Zero Layout Shift) -->
      <NuxtLink
        :to="`/product/${product.slug}`"
        class="relative block aspect-[4/3] w-full overflow-hidden rounded-xl bg-neutral-100 cursor-pointer"
        :aria-label="t('product.viewProduct', { name: product.name })"
      >
        <NuxtImg
          :src="product.imageThumbnail"
          :alt="`${product.name} - ${product.finish}`"
          preset="catalogThumb"
          width="400"
          height="300"
          loading="lazy"
          decoding="async"
          class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        <!-- Finish Badge Top-Left -->
        <div class="absolute top-2.5 left-2.5 flex items-center gap-1.5 rounded-full bg-white/95 backdrop-blur-xs px-2.5 py-1 text-[11px] font-semibold text-neutral-800 shadow-xs border border-neutral-200/80">
          <MaterialSwatch :finish="product.finish" size="sm" />
          <span>{{ product.finish }}</span>
        </div>
      </NuxtLink>

      <!-- Product Metadata & Details -->
      <div class="mt-3.5 space-y-1.5">
        <!-- SKU & Delivery Badge -->
        <div class="flex items-center justify-between text-xs text-neutral-500">
          <span class="font-mono text-[11px] text-neutral-400">{{ product.sku }}</span>
          <span class="text-trust-green font-semibold flex items-center gap-1 text-[11px]">
            <Check class="w-3 h-3 stroke-[2.5]" />
            {{ product.inStock ? t('product.inStock') : product.deliveryEstimateNl }}
          </span>
        </div>

        <!-- Title -->
        <NuxtLink :to="`/product/${product.slug}`">
          <h3 class="text-sm font-bold text-neutral-900 line-clamp-2 group-hover:text-maxaro-blue transition-colors leading-snug">
            {{ product.name }}
          </h3>
        </NuxtLink>

        <!-- Dimensional Spec Sheet Micro-Row -->
        <div v-if="formattedDimension" class="text-[11px] font-mono text-neutral-500 line-clamp-1">
          {{ t('productDetail.dimensions') }} <span class="text-neutral-700 font-medium">{{ formattedDimension }}</span>
        </div>

        <!-- Rating Stars & Warranty Trust Badge -->
        <div class="flex items-center justify-between text-[11px] text-neutral-500 pt-0.5">
          <div class="flex items-center gap-1">
            <div class="flex items-center text-trust-green">
              <Star class="w-3 h-3 fill-trust-green stroke-none" />
            </div>
            <span class="font-bold text-neutral-800">{{ product.rating }}</span>
            <span class="text-neutral-400">({{ product.reviewsCount }})</span>
          </div>

          <!-- Relocated Warranty Badge (Clean Trust Signal) -->
          <span
            v-if="product.warrantyYears"
            class="inline-flex items-center gap-1 text-[10px] font-semibold text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded-md"
          >
            <ShieldCheck class="w-3 h-3 text-maxaro-blue" />
            <span>{{ t('product.warranty', { years: product.warrantyYears }) }}</span>
          </span>
        </div>
      </div>
    </div>

    <!-- Pricing & Action Bar -->
    <div class="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between gap-2">
      <div class="flex flex-col">
        <div class="flex items-baseline gap-1.5">
          <span class="text-lg font-black font-mono tracking-tight text-neutral-900">
            {{ formatEuro(product.price) }}
          </span>
          <span v-if="product.category === 'vloertegels' || product.category === 'wandtegels'" class="text-[11px] font-bold text-neutral-500 font-mono">
            / m²
          </span>
          <span v-if="product.originalPrice" class="text-xs text-neutral-400 line-through font-mono">
            {{ formatEuro(product.originalPrice) }}
          </span>
        </div>
        <span class="text-[10px] text-neutral-500 font-medium">{{ t('productDetail.vatIncludedShort') }}</span>
      </div>

      <!-- Quick Add To Cart Button (Icon Only) -->
      <button
        type="button"
        @click="handleQuickAdd"
        class="inline-flex items-center justify-center p-2.5 bg-maxaro-blue hover:bg-maxaro-blue-hover active:scale-95 text-white rounded-xl transition-all shadow-xs shrink-0 cursor-pointer"
        :aria-label="t('product.quickAdd')"
        :title="t('product.quickAdd')"
      >
        <ShoppingCart class="w-4 h-4" />
      </button>
    </div>
  </div>
</template>
