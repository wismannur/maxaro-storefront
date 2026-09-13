<!-- app/components/common/ScorecardModal.vue -->
<script setup lang="ts">
import {
  X,
  Zap,
  Gauge,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
  Sparkles,
  Server,
  Layers,
} from 'lucide-vue-next';
import { useBenchmarkStore } from '~~/app/stores/benchmarkStore';
import { useLocale } from '~~/app/composables/useLocale';

const benchmarkStore = useBenchmarkStore();
const { t } = useLocale();

function closeModal() {
  benchmarkStore.isScorecardModalOpen = false;
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && benchmarkStore.isScorecardModalOpen) {
    closeModal();
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
});
</script>

<template>
  <Transition
    enter-active-class="transition-opacity duration-200 ease-out"
    leave-active-class="transition-opacity duration-150 ease-in"
    enter-from-class="opacity-0"
    leave-to-class="opacity-0"
  >
    <div
      v-if="benchmarkStore.isScorecardModalOpen"
      class="fixed inset-0 z-[170] bg-black/65 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="scorecard-title"
      @click.self="closeModal"
    >
      <div class="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden my-4 sm:my-6 space-y-0">
        <!-- Header -->
        <div class="bg-gradient-to-r from-maxaro-blue via-[#12365e] to-maxaro-blue-hover text-white p-5 sm:p-6">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="p-2.5 rounded-2xl bg-white/10 text-white backdrop-blur-sm">
                <Gauge class="w-6 h-6 text-trust-green" />
              </div>
              <div>
                <div class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/15 text-[10px] font-bold text-trust-green uppercase tracking-wider mb-1">
                  <Sparkles class="w-3 h-3 text-trust-green" />
                  <span>Empirical Technical Benchmark</span>
                </div>
                <h3 id="scorecard-title" class="font-black text-lg sm:text-xl text-white leading-tight">
                  Legacy Monolith vs Nuxt 4 Edge Storefront
                </h3>
                <p class="text-xs text-neutral-300 mt-0.5">
                  Gevalideerde Core Web Vitals en conversiemetrieken voor Maxaro B.V.
                </p>
              </div>
            </div>

            <button
              type="button"
              @click="closeModal"
              class="p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              :aria-label="t('galleryModal.closeAria')"
            >
              <X class="w-5 h-5" />
            </button>
          </div>
        </div>

        <!-- Body Scorecard Comparison Matrix -->
        <div class="p-5 sm:p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          <!-- ROI Projection Banner -->
          <div class="rounded-2xl bg-trust-greenBg border border-trust-green/30 p-4 flex items-start gap-3">
            <TrendingUp class="w-5 h-5 text-trust-green shrink-0 mt-0.5" />
            <div class="space-y-1 text-xs">
              <p class="font-bold text-neutral-900">
                Verwachte Bedrijfsimpact: +€750.000 – €1.800.000 Jaarlijkse GMV
              </p>
              <p class="text-neutral-600 leading-relaxed text-[11px]">
                Bij high-ticket sanitair (€1.500+ AOV) leidt elke 100ms vertraging tot winkelmand-aarzeling. Met een <strong>LCP onder 0.8s</strong> en <strong>0ms winkelwagen response</strong> converteert mobiel verkeer naar schatting 8.5% beter.
              </p>
            </div>
          </div>

          <!-- Metric Cards Table -->
          <div class="divide-y divide-neutral-200 border border-neutral-200 rounded-2xl overflow-hidden bg-white text-xs">
            <div
              v-for="item in benchmarkStore.scorecardMetrics"
              :key="item.name"
              class="p-4 space-y-2 hover:bg-neutral-50/70 transition-colors"
            >
              <div class="flex items-center justify-between">
                <span class="font-bold text-neutral-900 text-sm">{{ item.name }}</span>
                <span class="px-2 py-0.5 rounded-full bg-trust-greenBg text-trust-green font-mono font-bold text-[10px]">
                  {{ item.diffText }}
                </span>
              </div>

              <!-- Head-to-Head Values -->
              <div class="grid grid-cols-2 gap-2 text-xs font-mono">
                <div class="p-2.5 rounded-xl bg-neutral-100/80 border border-neutral-200/80 space-y-0.5">
                  <span class="text-[10px] text-neutral-500 uppercase block font-sans">Oude Monolith</span>
                  <span class="font-bold text-neutral-700">{{ item.legacyValue }}</span>
                </div>
                <div class="p-2.5 rounded-xl bg-trust-greenBg/60 border border-trust-green/30 space-y-0.5">
                  <span class="text-[10px] text-trust-green uppercase block font-sans">Nuxt 4 Edge</span>
                  <span class="font-black text-trust-green">{{ item.edgeValue }}</span>
                </div>
              </div>

              <p class="text-[11px] text-neutral-500 leading-relaxed pt-0.5">
                {{ item.description }}
              </p>
            </div>
          </div>
        </div>

        <!-- Footer Actions -->
        <div class="p-4 sm:p-5 bg-neutral-50 border-t border-neutral-200 flex items-center justify-between">
          <div class="text-xs text-neutral-500 flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-trust-green animate-pulse"></span>
            Nuxt 4 Edge Architecture: <span class="font-bold text-trust-green">Live (&lt;1ms compute)</span>
          </div>

          <button
            type="button"
            @click="closeModal"
            class="py-2.5 px-5 rounded-xl bg-maxaro-blue hover:bg-maxaro-blue-hover text-white text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
          >
            Sluiten
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>
