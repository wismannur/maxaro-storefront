<script setup lang="ts">
import {
  Layers,
  Sparkles,
  Droplets,
  CheckCircle2,
  ShieldCheck,
  Award,
} from 'lucide-vue-next';
import { useLocale } from '~~/app/composables/useLocale';

const { t } = useLocale();

const pillars = [
  {
    num: '01',
    icon: Layers,
    key: 'item1',
    highlightBg: 'bg-amber-50 text-amber-700 border-amber-200/60',
  },
  {
    num: '02',
    icon: Sparkles,
    key: 'item2',
    highlightBg: 'bg-blue-50 text-maxaro-blue border-blue-200/60',
  },
  {
    num: '03',
    icon: Droplets,
    key: 'item3',
    highlightBg: 'bg-teal-50 text-teal-700 border-teal-200/60',
  },
  {
    num: '04',
    icon: ShieldCheck,
    key: 'item4',
    highlightBg: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
  },
];
</script>

<template>
  <section class="bg-[#F8F7F4] border-y border-neutral-200/80 py-14 sm:py-20">
    <div class="max-w-7xl mx-auto px-4">
      <!-- Section Header -->
      <div class="text-center max-w-3xl mx-auto space-y-3 mb-12">
        <div class="inline-flex items-center gap-1.5 rounded-full bg-white border border-neutral-200 px-3.5 py-1 text-xs font-semibold text-neutral-800 shadow-xs">
          <Award class="w-3.5 h-3.5 text-maxaro-accent" />
          <span class="font-mono text-[11px] uppercase tracking-wider text-neutral-600">{{ t('craftsmanship.badge') }}</span>
        </div>
        <h2 class="text-2xl sm:text-4xl font-black text-neutral-900 tracking-tight">
          {{ t('craftsmanship.title') }}
        </h2>
        <p class="text-xs sm:text-base text-neutral-600 leading-relaxed max-w-2xl mx-auto">
          {{ t('craftsmanship.subtitle') }}
        </p>
      </div>

      <!-- 4 Architectural Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          v-for="pillar in pillars"
          :key="pillar.num"
          class="group relative bg-white rounded-3xl p-6 border border-neutral-200/80 shadow-xs hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between"
        >
          <div class="space-y-4">
            <!-- Top Header: Number & Badge -->
            <div class="flex items-center justify-between">
              <span class="font-mono text-xs font-bold text-neutral-300 group-hover:text-maxaro-accent transition-colors">
                {{ pillar.num }}
              </span>
              <span
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border"
                :class="pillar.highlightBg"
              >
                {{ t(`craftsmanship.${pillar.key}Badge`) }}
              </span>
            </div>

            <!-- Icon -->
            <div class="w-12 h-12 rounded-2xl bg-neutral-100 flex items-center justify-center text-maxaro-blue group-hover:bg-maxaro-blue group-hover:text-white transition-all duration-300">
              <component :is="pillar.icon" class="w-6 h-6" />
            </div>

            <!-- Titles -->
            <div class="space-y-1 text-left">
              <h3 class="text-base font-bold text-neutral-900 tracking-tight">
                {{ t(`craftsmanship.${pillar.key}Title`) }}
              </h3>
              <p class="text-xs font-medium text-neutral-500 font-mono">
                {{ t(`craftsmanship.${pillar.key}Subtitle`) }}
              </p>
            </div>

            <!-- Description -->
            <p class="text-xs text-neutral-600 leading-relaxed text-left">
              {{ t(`craftsmanship.${pillar.key}Desc`) }}
            </p>
          </div>

          <!-- Bottom Micro Visual Accent -->
          <div class="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-400">
            <span class="font-mono uppercase tracking-widest text-[10px]">Maxaro Lab Tested</span>
            <span class="text-trust-green font-bold text-xs">✓ 100% QA</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
