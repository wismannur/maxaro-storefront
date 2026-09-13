<script setup lang="ts">
import {
  Sparkles,
  ShieldCheck,
  Wrench,
  ChevronDown,
  Droplets,
  CheckCircle2,
} from 'lucide-vue-next';
import { useLocale } from '~~/app/composables/useLocale';

const props = defineProps<{
  finish: string;
  category: string;
  warrantyYears: number;
}>();

const { t } = useLocale();
const activeTab = ref<'care' | 'warranty' | 'install'>('care');
</script>

<template>
  <div class="p-6 bg-white rounded-3xl border border-neutral-200 shadow-xs space-y-4 text-left">
    <div class="flex items-center justify-between border-b border-neutral-100 pb-3">
      <h3 class="text-base font-black text-neutral-900 tracking-tight flex items-center gap-2">
        <Sparkles class="w-4 h-4 text-maxaro-accent" />
        <span>{{ t('pdpCare.title') }}</span>
      </h3>
    </div>

    <!-- Tab Switchers -->
    <div class="flex items-center gap-2 border-b border-neutral-100 pb-2 overflow-x-auto no-scrollbar">
      <button
        type="button"
        @click="activeTab = 'care'"
        class="px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap"
        :class="activeTab === 'care' ? 'bg-maxaro-blue text-white shadow-xs' : 'text-neutral-600 hover:bg-neutral-100'"
      >
        {{ t('pdpCare.tabCare') }}
      </button>

      <button
        type="button"
        @click="activeTab = 'warranty'"
        class="px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap"
        :class="activeTab === 'warranty' ? 'bg-maxaro-blue text-white shadow-xs' : 'text-neutral-600 hover:bg-neutral-100'"
      >
        {{ t('pdpCare.tabWarranty', { years: warrantyYears }) }}
      </button>

      <button
        type="button"
        @click="activeTab = 'install'"
        class="px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap"
        :class="activeTab === 'install' ? 'bg-maxaro-blue text-white shadow-xs' : 'text-neutral-600 hover:bg-neutral-100'"
      >
        {{ t('pdpCare.tabInstall') }}
      </button>
    </div>

    <!-- Tab 1: Care & Maintenance -->
    <div v-if="activeTab === 'care'" class="space-y-2.5 text-xs text-neutral-600 pt-1">
      <p class="leading-relaxed">
        {{ t('pdpCare.careText', { finish }) }}
      </p>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
        <div class="p-3 rounded-xl bg-neutral-50 border border-neutral-200/80 space-y-1">
          <span class="font-bold text-neutral-900 flex items-center gap-1.5 text-xs">
            <CheckCircle2 class="w-3.5 h-3.5 text-trust-green" /> {{ t('pdpCare.recommendedLabel') }}
          </span>
          <p class="text-[11px] text-neutral-500">{{ t('pdpCare.careRecommended') }}</p>
        </div>
        <div class="p-3 rounded-xl bg-neutral-50 border border-neutral-200/80 space-y-1">
          <span class="font-bold text-red-700 flex items-center gap-1.5 text-xs">
            <span class="text-xs">✕</span> {{ t('pdpCare.avoidLabel') }}
          </span>
          <p class="text-[11px] text-neutral-500">{{ t('pdpCare.careAvoid') }}</p>
        </div>
      </div>
    </div>

    <!-- Tab 2: Warranty & Certification -->
    <div v-if="activeTab === 'warranty'" class="space-y-2.5 text-xs text-neutral-600 pt-1">
      <p class="leading-relaxed">
        {{ t('pdpCare.warrantyText', { years: warrantyYears }) }}
      </p>
      <ul class="space-y-1.5 text-neutral-700 pt-1">
        <li class="flex items-center gap-2">
          <ShieldCheck class="w-4 h-4 text-trust-green shrink-0" />
          <span>{{ t('pdpCare.warrantyBullet1') }}</span>
        </li>
        <li class="flex items-center gap-2">
          <ShieldCheck class="w-4 h-4 text-trust-green shrink-0" />
          <span>{{ t('pdpCare.warrantyBullet2') }}</span>
        </li>
      </ul>
    </div>

    <!-- Tab 3: Installation -->
    <div v-if="activeTab === 'install'" class="space-y-2.5 text-xs text-neutral-600 pt-1">
      <p class="leading-relaxed">
        {{ t('pdpCare.installText') }}
      </p>
      <div class="p-3 bg-neutral-50 rounded-xl border border-neutral-200/80 text-[11px] text-neutral-600 flex items-center gap-2">
        <Wrench class="w-4 h-4 text-maxaro-blue shrink-0" />
        <span>{{ t('pdpCare.installNote') }}</span>
      </div>
    </div>
  </div>
</template>
