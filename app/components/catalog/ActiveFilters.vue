<script setup lang="ts">
import { X, RotateCcw } from 'lucide-vue-next';
import { useCatalog } from '~~/app/composables/useCatalog';
import { useCurrency } from '~~/app/composables/useCurrency';
import { useLocale } from '~~/app/composables/useLocale';

const {
  activeFinish,
  priceRange,
  searchQuery,
  activeFilterCount,
  store,
} = useCatalog();

const { formatEuro } = useCurrency();
const { t } = useLocale();
</script>

<template>
  <div v-if="activeFilterCount > 0" class="flex flex-wrap items-center gap-2 py-3">
    <span class="text-xs font-semibold text-neutral-500 mr-1">{{ t('catalog.activeFilters') }}</span>

    <!-- Active Finish Chip -->
    <button
      v-if="activeFinish"
      @click="activeFinish = null"
      class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-maxaro-blue-light text-maxaro-blue text-xs font-semibold hover:bg-neutral-200 transition-colors"
    >
      <span>{{ t('catalog.filterFinish', { finish: activeFinish }) }}</span>
      <X class="w-3.5 h-3.5" />
    </button>

    <!-- Active Price Range Chip -->
    <button
      v-if="priceRange.min > 0 || priceRange.max < 2000"
      @click="priceRange = { min: 0, max: 2000 }"
      class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-maxaro-blue-light text-maxaro-blue text-xs font-semibold hover:bg-neutral-200 transition-colors"
    >
      <span>{{ t('catalog.filterPrice', { min: formatEuro(priceRange.min), max: formatEuro(priceRange.max) }) }}</span>
      <X class="w-3.5 h-3.5" />
    </button>

    <!-- Active Search Query Chip -->
    <button
      v-if="searchQuery.trim()"
      @click="searchQuery = ''"
      class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-maxaro-blue-light text-maxaro-blue text-xs font-semibold hover:bg-neutral-200 transition-colors"
    >
      <span>{{ t('catalog.filterSearch', { query: searchQuery }) }}</span>
      <X class="w-3.5 h-3.5" />
    </button>

    <!-- Reset All Button -->
    <button
      @click="store.resetFilters()"
      class="inline-flex items-center gap-1 text-xs text-neutral-500 hover:text-maxaro-blue underline ml-2 transition-colors font-medium"
    >
      <RotateCcw class="w-3 h-3" />
      <span>{{ t('catalog.clearAll') }}</span>
    </button>
  </div>
</template>
