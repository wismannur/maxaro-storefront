<script setup lang="ts">
import type { ProductCategory, ProductFinish } from '~~/shared/types';
import { useLocale } from '~~/app/composables/useLocale';
import { useCatalogStore } from '~~/app/stores/catalogStore';
import TrustpilotBadge from '~~/app/components/common/TrustpilotBadge.vue';
import {
  ChevronRight,
  Sparkles,
  Building2,
  CheckCircle2,
  Clock,
  RotateCcw,
  SlidersHorizontal,
} from 'lucide-vue-next';

const props = defineProps<{
  category: ProductCategory;
  title: string;
  subtitle: string;
  description: string;
  totalCount: number;
  filteredCount: number;
}>();

const emit = defineEmits<{
  (e: 'open-showroom-modal'): void;
}>();

const { t } = useLocale();
const catalogStore = useCatalogStore();

// Category finish options available for quick chips
const availableFinishes = computed<ProductFinish[]>(() => {
  const finishes = new Set<ProductFinish>();
  catalogStore.allProducts.forEach((p) => {
    if (p.category === props.category && p.finish) {
      finishes.add(p.finish);
    }
  });
  return Array.from(finishes);
});

function toggleFinishChip(finish: ProductFinish) {
  if (catalogStore.activeFinish === finish) {
    catalogStore.activeFinish = null;
  } else {
    catalogStore.activeFinish = finish;
  }
}
</script>

<template>
  <div class="space-y-4 text-left">
    <!-- Minimalist Architectural Breadcrumbs -->
    <nav class="flex items-center gap-2 text-xs text-neutral-500 overflow-x-auto no-scrollbar py-0.5" aria-label="Breadcrumb">
      <NuxtLink to="/" class="hover:text-maxaro-blue transition-colors flex items-center gap-1 font-medium">
        {{ t('productDetail.home') }}
      </NuxtLink>
      <ChevronRight class="w-3.5 h-3.5 text-neutral-400 shrink-0" />
      <span class="text-neutral-400">{{ t('productDetail.sanitary') }}</span>
      <ChevronRight class="w-3.5 h-3.5 text-neutral-400 shrink-0" />
      <span class="font-bold text-neutral-800 tracking-tight">{{ title }}</span>
    </nav>

    <!-- Elevated Category Hero Banner -->
    <div class="relative bg-[#FAF9F5] border border-neutral-200/90 rounded-3xl p-6 sm:p-10 shadow-xs overflow-hidden">
      <!-- Ambient Glow Accents -->
      <div class="absolute -top-32 -right-32 w-80 h-80 bg-amber-100/50 rounded-full blur-3xl pointer-events-none" />
      <div class="absolute -bottom-32 -left-32 w-80 h-80 bg-blue-100/30 rounded-full blur-3xl pointer-events-none" />

      <div class="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <!-- Left Side: Editorial Typography & Quick Chips -->
        <div class="lg:col-span-8 space-y-4">
          <!-- Top Badge & Trustpilot -->
          <div class="flex flex-wrap items-center gap-3">
            <div class="inline-flex items-center gap-1.5 rounded-full bg-white border border-neutral-200/80 px-3 py-1 text-xs font-semibold text-neutral-800 shadow-xs">
              <Sparkles class="w-3 h-3 text-maxaro-accent" />
              <span class="font-mono text-[10px] uppercase tracking-wider text-neutral-600">Maxaro Collectie</span>
            </div>

            <span class="inline-flex items-center gap-1.5 text-xs text-neutral-500 font-mono">
              <Clock class="w-3.5 h-3.5 text-trust-green" />
              <span>Direct uit voorraad leverbaar</span>
            </span>
          </div>

          <!-- Main Title & Description -->
          <div class="space-y-1.5">
            <h1 class="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-neutral-900 leading-tight">
              {{ title }}
            </h1>
            <p v-if="subtitle" class="text-sm sm:text-base font-serif italic text-maxaro-blue font-medium">
              {{ subtitle }}
            </p>
          </div>

          <p class="text-xs sm:text-sm text-neutral-600 leading-relaxed max-w-2xl">
            {{ description }}
          </p>

          <!-- Quick Finish Filter Chips -->
          <div v-if="availableFinishes.length > 0" class="pt-2 space-y-2">
            <div class="flex items-center justify-between">
              <span class="text-[11px] font-bold uppercase tracking-wider text-neutral-500 font-mono">
                Snelfilter op uitvoering:
              </span>
              <button
                v-if="catalogStore.activeFinish"
                type="button"
                @click="catalogStore.activeFinish = null"
                class="inline-flex items-center gap-1 text-[11px] font-bold text-maxaro-accent hover:underline cursor-pointer"
              >
                <RotateCcw class="w-3 h-3" />
                <span>Herstel filter</span>
              </button>
            </div>

            <div class="flex flex-wrap items-center gap-2">
              <button
                type="button"
                @click="catalogStore.activeFinish = null"
                class="px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
                :class="!catalogStore.activeFinish ? 'bg-maxaro-blue text-white shadow-xs' : 'bg-white hover:bg-neutral-100 text-neutral-700 border border-neutral-200'"
              >
                Alle ({{ totalCount }})
              </button>

              <button
                v-for="finish in availableFinishes"
                :key="finish"
                type="button"
                @click="toggleFinishChip(finish)"
                class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border"
                :class="catalogStore.activeFinish === finish ? 'bg-maxaro-blue text-white border-maxaro-blue shadow-xs font-bold' : 'bg-white hover:bg-neutral-100 text-neutral-700 border-neutral-200'"
              >
                <span>{{ finish }}</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Right Side: Showroom Concierge & Trust Card -->
        <div class="lg:col-span-4 space-y-4">
          <div class="bg-white/90 backdrop-blur-xs rounded-2xl p-5 border border-neutral-200/90 shadow-xs space-y-3.5">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-neutral-900 flex items-center gap-1.5">
                <Building2 class="w-4 h-4 text-maxaro-accent" />
                Showroom Beleving
              </span>
              <span class="text-[10px] font-mono text-trust-green font-bold bg-trust-greenBg px-2 py-0.5 rounded-full">
                Roosendaal 5.000 m²
              </span>
            </div>

            <p class="text-xs text-neutral-600 leading-relaxed">
              Ervaar de complete collectie {{ title.toLowerCase() }} in het echt. Vergelijk materialen en ontvang kosteloos 3D-advies op maat.
            </p>

            <div class="pt-1 flex items-center justify-between gap-2">
              <button
                type="button"
                @click="emit('open-showroom-modal')"
                class="w-full py-2 px-3 bg-maxaro-blue hover:bg-maxaro-blue-hover active:scale-95 text-white text-xs font-bold rounded-xl transition-all shadow-xs text-center cursor-pointer"
              >
                Plan Showroombezoek
              </button>
            </div>
          </div>

          <!-- Trustpilot Pill -->
          <div class="flex justify-end">
            <TrustpilotBadge />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
