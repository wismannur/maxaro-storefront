<script setup lang="ts">
import type { ProductCategory } from '~~/shared/types';
import { useLocale } from '~~/app/composables/useLocale';
import { Building2, Sparkles, MapPin } from 'lucide-vue-next';

const props = defineProps<{
  category: ProductCategory;
  isAvailable?: boolean;
}>();

const emit = defineEmits<{
  (e: 'open-showroom'): void;
}>();

const { t } = useLocale();

const bayInfo = computed(() => {
  switch (props.category) {
    case 'vrijstaande-baden':
    case 'inbouwbaden':
      return t('showroomBays.baths');
    case 'inloopdouches':
    case 'douchecabines':
      return t('showroomBays.showers');
    case 'badkamermeubels':
    case 'waskommen':
      return t('showroomBays.vanities');
    case 'kranen':
      return t('showroomBays.taps');
    case 'vloertegels':
    case 'wandtegels':
      return t('showroomBays.tiles');
    default:
      return t('showroomBays.baths');
  }
});
</script>

<template>
  <button
    v-if="isAvailable !== false"
    type="button"
    @click="emit('open-showroom')"
    class="group inline-flex items-center gap-2 rounded-full bg-maxaro-blue/95 hover:bg-maxaro-blue active:scale-95 backdrop-blur-md px-3.5 py-1.5 text-xs font-semibold text-white shadow-md border border-white/20 transition-all cursor-pointer"
    :title="t('showroomBays.inShowroom', { bay: bayInfo })"
  >
    <Building2 class="w-3.5 h-3.5 text-trust-green group-hover:scale-110 transition-transform" />
    <span class="hidden sm:inline font-medium">
      {{ t('showroomBays.inShowroom', { bay: bayInfo }) }}
    </span>
    <span class="sm:hidden font-medium">
      {{ t('showroomBays.inShowroomShort') }}
    </span>
    <span class="w-1.5 h-1.5 rounded-full bg-trust-green animate-pulse hidden sm:inline-block" />
  </button>
</template>
