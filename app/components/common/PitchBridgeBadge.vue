<!-- app/components/common/PitchBridgeBadge.vue -->
<script setup lang="ts">
import { ref } from 'vue';
import {
  Zap,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Sparkles,
  X,
  Gauge,
} from 'lucide-vue-next';
import { useBenchmarkStore } from '~~/app/stores/benchmarkStore';
import { useLocale } from '~~/app/composables/useLocale';

const benchmarkStore = useBenchmarkStore();
const { t } = useLocale();
const isExpanded = ref(true);
const isDismissed = ref(false);

function toggleExpand() {
  isExpanded.value = !isExpanded.value;
}

function dismiss() {
  isDismissed.value = true;
}
</script>

<template>
  <div
    v-if="!isDismissed"
    class="hidden md:flex fixed bottom-5 left-5 z-50 select-none transition-all duration-300 ease-out pointer-events-auto"
  >
    <!-- Expanded Floating Card -->
    <div
      v-if="isExpanded"
      class="w-[350px] max-w-[calc(100vw-2.5rem)] bg-maxaro-blue/95 backdrop-blur-md rounded-2xl p-4 shadow-2xl border border-white/15 text-white space-y-3"
    >
      <!-- Card Header -->
      <div class="flex items-center justify-between gap-2">
        <div class="flex items-center gap-2 min-w-0">
          <span class="relative flex h-2 w-2 shrink-0">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-trust-green opacity-75" />
            <span class="relative inline-flex rounded-full h-2 w-2 bg-trust-green" />
          </span>
          <span class="text-xs font-bold tracking-tight text-white flex items-center gap-1.5 min-w-0">
            <Sparkles class="w-3.5 h-3.5 text-maxaro-accent shrink-0 pointer-events-none" />
            <span class="truncate">Maxaro Digital Hub Prototype</span>
          </span>
        </div>

        <div class="flex items-center gap-1 text-neutral-300 shrink-0">
          <button
            type="button"
            @click.stop.prevent="toggleExpand"
            class="p-1.5 rounded-lg hover:text-white hover:bg-white/15 active:scale-95 transition-all cursor-pointer flex items-center justify-center"
            :title="t('checkoutModal.cancel')"
            :aria-label="t('checkoutModal.cancel')"
          >
            <ChevronDown class="w-4 h-4 pointer-events-none" />
          </button>
          <button
            type="button"
            @click.stop.prevent="dismiss"
            class="p-1.5 rounded-lg hover:text-white hover:bg-white/15 active:scale-95 transition-all cursor-pointer flex items-center justify-center"
            :title="t('galleryModal.closeAria')"
            :aria-label="t('galleryModal.closeAria')"
          >
            <X class="w-3.5 h-3.5 pointer-events-none" />
          </button>
        </div>
      </div>

      <!-- Key Benchmarks Telemetry -->
      <div class="grid grid-cols-3 gap-1.5 py-1 text-center bg-white/10 rounded-xl p-2 border border-white/10 text-[11px] font-mono">
        <div>
          <span class="text-neutral-400 text-[9px] block uppercase">LCP 4G</span>
          <span class="text-trust-green font-bold">&lt;0.8s</span>
        </div>
        <div class="border-x border-white/10">
          <span class="text-neutral-400 text-[9px] block uppercase">Filter</span>
          <span class="text-trust-green font-bold">0.8ms</span>
        </div>
        <div>
          <span class="text-neutral-400 text-[9px] block uppercase">CLS</span>
          <span class="text-trust-green font-bold">0.00</span>
        </div>
      </div>

      <!-- Description Context -->
      <p class="text-[11px] text-neutral-300 leading-relaxed">
        Live interactief Nuxt 4 + Nitro Edge storefront prototype voor <strong>Lennard Bakhuys</strong> (Maxaro B.V.).
      </p>

      <!-- Action Buttons -->
      <div class="space-y-1.5 pt-0.5">
        <button
          type="button"
          @click="benchmarkStore.isScorecardModalOpen = true"
          class="w-full inline-flex items-center justify-center gap-2 py-2 px-3 bg-white/15 hover:bg-white/25 text-white text-xs font-bold rounded-xl border border-white/15 transition-all shadow-xs active:scale-98 cursor-pointer"
        >
          <Gauge class="w-3.5 h-3.5 text-trust-green pointer-events-none" />
          <span>Bekijk Scorecard Matrix</span>
        </button>

        <a
          href="https://wismannur.pro/showcase/maxaro"
          target="_blank"
          rel="noopener noreferrer"
          class="w-full inline-flex items-center justify-center gap-2 py-2.5 px-3 bg-white hover:bg-neutral-100 text-maxaro-blue text-xs font-bold rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
        >
          <span>Pitch Deck & Business ROI</span>
          <ExternalLink class="w-3.5 h-3.5 pointer-events-none" />
        </a>
      </div>
    </div>

    <!-- Minimized Floating Pill -->
    <button
      v-else
      type="button"
      @click.stop.prevent="toggleExpand"
      class="inline-flex items-center gap-2 px-3.5 py-2 bg-maxaro-blue/95 hover:bg-maxaro-blue backdrop-blur-md text-white rounded-full shadow-xl border border-white/15 text-xs font-bold transition-all active:scale-95 cursor-pointer"
      title="Open Modernization Details"
      aria-label="Open Modernization Details"
    >
      <span class="relative flex h-2 w-2 shrink-0">
        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-trust-green opacity-75" />
        <span class="relative inline-flex rounded-full h-2 w-2 bg-trust-green" />
      </span>
      <Zap class="w-3.5 h-3.5 text-trust-green shrink-0 pointer-events-none" />
      <span>Nuxt 4 Edge (&lt;1ms)</span>
      <ChevronUp class="w-3.5 h-3.5 text-neutral-300 ml-0.5 shrink-0 pointer-events-none" />
    </button>
  </div>
</template>
