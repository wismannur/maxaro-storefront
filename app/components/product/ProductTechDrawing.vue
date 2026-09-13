<script setup lang="ts">
import type { Product } from '~~/shared/types';
import { useCurrency } from '~~/app/composables/useCurrency';
import { useLocale } from '~~/app/composables/useLocale';
import {
  Ruler,
  Download,
  CheckCircle2,
  FileText,
  ShieldCheck,
  Maximize2,
  Check,
} from 'lucide-vue-next';

const props = defineProps<{
  product: Product;
}>();

const { formatDimensions } = useCurrency();
const { t } = useLocale();

const isDownloaded = ref(false);

function handleDownloadPdf() {
  isDownloaded.value = true;
  setTimeout(() => {
    isDownloaded.value = false;
  }, 2500);
}

const formattedDim = computed(() => {
  const d = props.product.dimensions;
  return formatDimensions(d.lengthCm, d.widthCm, d.heightCm, d.thicknessMm);
});
</script>

<template>
  <div class="p-6 bg-white rounded-3xl border border-neutral-200 shadow-xs space-y-5 text-left">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-100 pb-4">
      <div class="space-y-0.5">
        <div class="flex items-center gap-2">
          <span class="inline-flex items-center gap-1 text-[10px] font-mono font-bold uppercase tracking-wider text-maxaro-blue bg-maxaro-blue-light px-2 py-0.5 rounded">
            CAD Drawing 1:1
          </span>
          <span class="text-xs font-mono text-neutral-400">Art. {{ product.sku }}</span>
        </div>
        <h3 class="text-base font-black text-neutral-900 tracking-tight flex items-center gap-2">
          <Ruler class="w-4 h-4 text-maxaro-blue" />
          <span>{{ t('pdpBlueprint.title') }}</span>
        </h3>
      </div>

      <button
        type="button"
        @click="handleDownloadPdf"
        class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-xs font-bold text-neutral-700 transition-colors shadow-2xs self-start sm:self-auto cursor-pointer"
      >
        <Check v-if="isDownloaded" class="w-3.5 h-3.5 text-trust-green" />
        <Download v-else class="w-3.5 h-3.5 text-neutral-500" />
        <span>{{ isDownloaded ? t('pdpBlueprint.downloadSuccess') : t('pdpBlueprint.downloadButton') }}</span>
      </button>
    </div>

    <!-- Architectural Wireframe Diagram Schematic Box -->
    <div class="relative bg-neutral-900 rounded-2xl p-6 overflow-hidden border border-neutral-800 text-neutral-300">
      <!-- Subtle CAD Grid Background -->
      <div
        class="absolute inset-0 opacity-15 pointer-events-none"
        style="background-image: radial-gradient(rgba(255,255,255,0.4) 1px, transparent 1px); background-size: 16px 16px;"
      />

      <div class="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <!-- SVG Isometric / Dimensional Blueprint Illustration -->
        <div class="w-full md:w-1/2 flex items-center justify-center p-4">
          <div class="relative w-full max-w-[280px] aspect-[16/10] border-2 border-dashed border-neutral-600 rounded-xl flex items-center justify-center p-3 text-center">
            <!-- Center outline -->
            <div class="w-full h-full border border-neutral-400 rounded-lg flex flex-col items-center justify-center space-y-1 bg-white/5 backdrop-blur-xs">
              <span class="text-[10px] font-mono uppercase tracking-widest text-neutral-400">{{ t('pdpBlueprint.topView') }}</span>
              <span class="text-sm font-bold text-white font-mono">{{ product.dimensions.lengthCm }} × {{ product.dimensions.widthCm }} cm</span>
              <span v-if="product.dimensions.heightCm" class="text-[11px] text-neutral-400 font-mono">{{ t('pdpBlueprint.depthHeight') }} {{ product.dimensions.heightCm }} cm</span>
            </div>

            <!-- Dimension Axis Indicators -->
            <div class="absolute -top-3 inset-x-0 flex items-center justify-between text-[10px] font-mono text-maxaro-accent font-bold px-2">
              <span>←</span>
              <span>{{ product.dimensions.lengthCm }} cm</span>
              <span>→</span>
            </div>
            <div class="absolute -left-5 inset-y-0 flex flex-col items-center justify-between text-[10px] font-mono text-maxaro-accent font-bold py-1">
              <span>↑</span>
              <span class="rotate-90">{{ product.dimensions.widthCm }} cm</span>
              <span>↓</span>
            </div>
          </div>
        </div>

        <!-- Technical Key Data Points -->
        <div class="w-full md:w-1/2 grid grid-cols-2 gap-3 text-xs">
          <div class="p-3 rounded-xl bg-white/5 border border-white/10 space-y-0.5">
            <span class="text-[10px] font-mono uppercase text-neutral-400">{{ t('pdpBlueprint.dimensionsLabel') }}</span>
            <p class="font-bold text-white font-mono">{{ formattedDim }}</p>
          </div>
          <div class="p-3 rounded-xl bg-white/5 border border-white/10 space-y-0.5">
            <span class="text-[10px] font-mono uppercase text-neutral-400">{{ t('pdpBlueprint.materialLabel') }}</span>
            <p class="font-bold text-white">{{ product.finish }}</p>
          </div>
          <div class="p-3 rounded-xl bg-white/5 border border-white/10 space-y-0.5">
            <span class="text-[10px] font-mono uppercase text-neutral-400">{{ t('pdpBlueprint.warrantyLabel') }}</span>
            <p class="font-bold text-white">{{ t('pdpBlueprint.warrantyValue', { years: product.warrantyYears }) }}</p>
          </div>
          <div class="p-3 rounded-xl bg-white/5 border border-white/10 space-y-0.5">
            <span class="text-[10px] font-mono uppercase text-neutral-400">{{ t('pdpBlueprint.standardsLabel') }}</span>
            <p class="font-bold text-trust-green">{{ t('pdpBlueprint.standardsValue') }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Specs Summary Note -->
    <p class="text-xs text-neutral-600 leading-relaxed">
      {{ product.specsSummary }}
    </p>
  </div>
</template>
