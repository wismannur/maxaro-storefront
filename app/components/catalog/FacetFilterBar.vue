<script setup lang="ts">
import { SlidersHorizontal, ArrowUpDown, Zap, X } from 'lucide-vue-next';
import { useCatalog } from '~~/app/composables/useCatalog';
import { useCurrency } from '~~/app/composables/useCurrency';
import { useLocale } from '~~/app/composables/useLocale';
import MaterialSwatch from './MaterialSwatch.vue';
import ActiveFilters from './ActiveFilters.vue';
import SortDropdown from './SortDropdown.vue';
import type { ProductFinish } from '~~/shared/types';

const {
  finishes,
  finishCounts,
  activeFinish,
  priceRange,
  sortBy,
  totalCount,
  activeFilterCount,
  lastComputeDurationMs,
  isFilterDrawerOpen,
  store,
} = useCatalog();

const { formatEuro } = useCurrency();
const { t } = useLocale();

function handleFinishSelect(finish: ProductFinish) {
  store.toggleFinish(finish);
}

watch(isFilterDrawerOpen, (isOpen) => {
  if (typeof document !== 'undefined') {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }
});

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && isFilterDrawerOpen.value) {
    isFilterDrawerOpen.value = false;
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
  if (typeof document !== 'undefined') {
    document.body.style.overflow = '';
  }
});
</script>

<template>
  <div class="relative bg-white border border-neutral-200 rounded-2xl p-4 shadow-xs flex flex-col gap-y-4">
    <!-- Desktop & Mobile Top Bar: Counts, Live Telemetry & Sort Dropdown -->
    <div class="flex flex-wrap items-center justify-between gap-3 sm:pb-3 border-b border-neutral-100">
      <div class="flex items-center gap-3">
        <!-- Results Count -->
        <span class="text-sm font-bold text-neutral-900">
          {{ totalCount }} <span class="text-neutral-500 font-normal">{{ t('catalog.results') }}</span>
        </span>

        <!-- Sub-4ms Reactive Telemetry Badge -->
        <ClientOnly>
          <div class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-trust-greenBg text-trust-green shadow-2xs">
            <Zap class="w-3 h-3 fill-trust-green" />
            <span>{{ t('catalog.computeTime', { time: lastComputeDurationMs }) }}</span>
            <span class="text-neutral-400 font-normal hidden sm:inline">&bull; {{ t('catalog.zeroNetwork') }}</span>
          </div>
          <template #fallback>
            <div class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-trust-greenBg text-trust-green text-[11px] font-mono font-bold">
              <Zap class="w-3 h-3 fill-trust-green" />
              <span>{{ t('catalog.computeTime', { time: '<1' }) }}</span>
              <span class="text-neutral-400 font-normal hidden sm:inline">&bull; {{ t('catalog.zeroNetwork') }}</span>
            </div>
          </template>
        </ClientOnly>
      </div>

      <div class="relative flex items-center gap-2">
        <!-- Mobile Filter Button Trigger -->
        <button
          @click="isFilterDrawerOpen = true"
          class="md:hidden inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-neutral-200 bg-neutral-50 text-xs font-bold text-neutral-800 hover:bg-neutral-100"
        >
          <SlidersHorizontal class="w-3.5 h-3.5" />
          <span>{{ t('catalog.mobileFilters') }}</span>
          <span
            v-if="activeFilterCount > 0"
            class="ml-1 flex h-4 w-4 items-center justify-center rounded-full bg-maxaro-blue text-[10px] text-white"
          >
            {{ activeFilterCount }}
          </span>
        </button>

        <!-- Sort Selector (Custom Dropdown matching LocaleSwitcher) -->
        <SortDropdown />
      </div>
    </div>

    <!-- Desktop Filters Section (Visible on md+) -->
    <div class="hidden md:flex flex-col lg:flex-row lg:items-center justify-between gap-6 pt-1">
      <!-- Finish / Material Swatches -->
      <div class="space-y-1.5">
        <label class="block text-xs font-bold text-neutral-700">{{ t('catalog.colorFinish') }}</label>
        <div class="flex flex-wrap items-center gap-1.5">
          <MaterialSwatch
            v-for="finish in finishes"
            :key="finish"
            :finish="finish"
            :is-selected="activeFinish === finish"
            :count="finishCounts[finish] || 0"
            show-label
            @select="handleFinishSelect"
          />
        </div>
      </div>

      <!-- Price Range Quick Slider -->
      <div class="space-y-1.5 shrink-0 min-w-[240px]">
        <div class="flex items-center justify-between text-xs font-bold text-neutral-700">
          <span>{{ t('catalog.priceRange') }}</span>
          <span class="font-mono text-maxaro-blue">{{ t('catalog.priceRangeUpTo', { amount: formatEuro(priceRange.max) }) }}</span>
        </div>
        <input
          v-model.number="priceRange.max"
          type="range"
          min="50"
          max="2000"
          step="50"
          class="w-full accent-maxaro-blue cursor-pointer h-1.5 bg-neutral-200 rounded-lg appearance-none"
        />
        <div class="flex justify-between text-[10px] font-mono text-neutral-400">
          <span>€50</span>
          <span>€1.000</span>
          <span>€2.000+</span>
        </div>
      </div>
    </div>

    <!-- Active Filters Strip -->
    <ActiveFilters />

    <!-- Mobile Slide-Over Filter Drawer -->
    <Transition
      enter-active-class="transition-opacity duration-300 ease-out"
      leave-active-class="transition-opacity duration-200 ease-in"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isFilterDrawerOpen"
        class="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end md:hidden"
        @click.self="isFilterDrawerOpen = false"
      >
        <div class="w-full max-w-sm bg-white h-full flex flex-col shadow-drawer">
          <!-- Drawer Header -->
          <div class="p-4 border-b border-neutral-200 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <SlidersHorizontal class="w-4 h-4 text-maxaro-blue" />
              <h3 class="font-bold text-base text-neutral-900">{{ t('catalog.mobileFilters') }}</h3>
              <span v-if="activeFilterCount > 0" class="text-xs text-neutral-500">
                ({{ t('catalog.activeCount', { count: activeFilterCount }) }})
              </span>
            </div>
            <button
              @click="isFilterDrawerOpen = false"
              class="p-2 rounded-xl text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100"
            >
              <X class="w-5 h-5" />
            </button>
          </div>

          <!-- Drawer Body -->
          <div class="flex-1 overflow-y-auto p-4 space-y-6">
            <!-- Finishes -->
            <div class="space-y-3">
              <h4 class="text-xs font-bold uppercase tracking-wider text-neutral-500">{{ t('catalog.colorFinish') }}</h4>
              <div class="grid grid-cols-1 gap-2">
                <MaterialSwatch
                  v-for="finish in finishes"
                  :key="finish"
                  :finish="finish"
                  :is-selected="activeFinish === finish"
                  :count="finishCounts[finish] || 0"
                  show-label
                  size="md"
                  @select="handleFinishSelect"
                />
              </div>
            </div>

            <!-- Price Range -->
            <div class="space-y-3">
              <div class="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-neutral-500">
                <span>{{ t('catalog.maxPrice') }}</span>
                <span class="font-mono text-maxaro-blue font-bold text-sm">{{ formatEuro(priceRange.max) }}</span>
              </div>
              <input
                v-model.number="priceRange.max"
                type="range"
                min="50"
                max="2000"
                step="50"
                class="w-full accent-maxaro-blue cursor-pointer h-2 bg-neutral-200 rounded-lg appearance-none"
              />
            </div>
          </div>

          <!-- Drawer Sticky Footer -->
          <div class="p-4 border-t border-neutral-200 bg-neutral-50 flex items-center gap-3">
            <button
              v-if="activeFilterCount > 0"
              @click="store.resetFilters()"
              class="px-4 py-2.5 rounded-xl border border-neutral-200 bg-white text-xs font-semibold text-neutral-700 hover:bg-neutral-100 transition-colors"
            >
              {{ t('catalog.clearFilter') }}
            </button>
            <button
              @click="isFilterDrawerOpen = false"
              class="flex-1 py-2.5 px-4 bg-maxaro-blue hover:bg-maxaro-blue-hover text-white rounded-xl text-xs font-bold transition-colors shadow-xs text-center"
            >
              {{ t('catalog.showResults', { count: totalCount }) }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>
