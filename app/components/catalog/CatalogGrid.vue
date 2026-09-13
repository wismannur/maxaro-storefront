<script setup lang="ts">
import type { Product } from '~~/shared/types';
import ProductCard from './ProductCard.vue';
import { PackageSearch, RotateCcw } from 'lucide-vue-next';
import { useCatalogStore } from '~~/app/stores/catalogStore';
import { useLocale } from '~~/app/composables/useLocale';

defineProps<{
  products: Product[];
  isLoading?: boolean;
}>();

const emit = defineEmits<{
  (e: 'add-to-cart', product: Product): void;
}>();

const catalogStore = useCatalogStore();
const { t } = useLocale();
</script>

<template>
  <div class="relative">
    <!-- Zero-CLS Product Grid -->
    <div
      v-if="products.length > 0"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 transition-all duration-300"
    >
      <ProductCard
        v-for="product in products"
        :key="product.id"
        :product="product"
        @add-to-cart="emit('add-to-cart', $event)"
      />
    </div>

    <!-- Empty State -->
    <div
      v-else-if="!isLoading"
      class="rounded-2xl border border-dashed border-neutral-300 bg-neutral-50/70 p-12 text-center"
    >
      <div class="mx-auto w-12 h-12 rounded-full bg-neutral-200 flex items-center justify-center text-neutral-500 mb-3">
        <PackageSearch class="w-6 h-6" />
      </div>
      <h3 class="text-base font-bold text-neutral-800">{{ t('catalog.emptyTitle') }}</h3>
      <p class="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
        {{ t('catalog.emptySubtitle') }}
      </p>
      <button
        @click="catalogStore.resetFilters()"
        class="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-maxaro-blue text-white rounded-xl text-xs font-bold hover:bg-maxaro-blue-hover transition-colors shadow-xs"
      >
        <RotateCcw class="w-3.5 h-3.5" />
        <span>{{ t('catalog.resetFilters') }}</span>
      </button>
    </div>
  </div>
</template>
