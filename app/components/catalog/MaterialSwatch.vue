<script setup lang="ts">
import type { ProductFinish } from '~~/shared/types';
import { useLocale } from '~~/app/composables/useLocale';
import { Check } from 'lucide-vue-next';

const { t } = useLocale();

const props = withDefaults(
  defineProps<{
    finish: ProductFinish;
    isSelected?: boolean;
    showLabel?: boolean;
    count?: number;
    size?: 'sm' | 'md' | 'lg';
  }>(),
  {
    isSelected: false,
    showLabel: false,
    size: 'md',
  }
);

const emit = defineEmits<{
  (e: 'select', finish: ProductFinish): void;
}>();

// Hardware-accurate CSS styles specified in Maxaro Design System
const swatchStyle = computed(() => {
  switch (props.finish) {
    case 'Mat Wit':
      return {
        backgroundColor: '#FFFFFF',
        border: '1px solid #D1D5DB',
      };
    case 'Glans Wit':
      return {
        background: 'radial-gradient(circle, #FFFFFF 60%, #E5E7EB 100%)',
        border: '1px solid #D1D5DB',
      };
    case 'Mat Zwart':
      return {
        backgroundColor: '#18181B',
        border: '1px solid #27272A',
      };
    case 'Chroom':
      return {
        background: 'linear-gradient(135deg, #E2E8F0 0%, #94A3B8 50%, #CBD5E1 100%)',
        border: '1px solid #94A3B8',
      };
    case 'Brushed Gunmetal':
      return {
        background: 'linear-gradient(135deg, #475569 0%, #334155 50%, #64748B 100%)',
        border: '1px solid #334155',
      };
    case 'Eiken Natuur':
      return {
        background: 'linear-gradient(135deg, #D4A373 0%, #CCD5AE 50%, #B08968 100%)',
        border: '1px solid #B08968',
      };
    default:
      return { backgroundColor: '#E5E7EB' };
  }
});

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'w-4 h-4';
    case 'lg':
      return 'w-8 h-8';
    case 'md':
    default:
      return 'w-6 h-6';
  }
});
</script>

<template>
  <button
    type="button"
    @click="emit('select', finish)"
    class="group inline-flex items-center gap-2 rounded-xl transition-all outline-none"
    :class="[
      showLabel
        ? isSelected
          ? 'bg-maxaro-blue-light border-maxaro-blue text-maxaro-blue font-semibold px-3 py-1.5 border'
          : 'bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-50 px-3 py-1.5 border'
        : 'p-1 hover:scale-105',
    ]"
    :aria-label="t('product.colorFinishAria', { finish })"
    :aria-pressed="isSelected"
  >
    <!-- Visual Color Chip -->
    <span
      class="relative inline-flex items-center justify-center rounded-full shrink-0 shadow-xs transition-transform"
      :class="[
        sizeClasses,
        isSelected && !showLabel ? 'ring-2 ring-maxaro-blue ring-offset-2 scale-110' : '',
      ]"
      :style="swatchStyle"
    >
      <Check
        v-if="isSelected && !showLabel"
        class="w-3.5 h-3.5"
        :class="finish === 'Mat Wit' || finish === 'Glans Wit' || finish === 'Chroom' ? 'text-neutral-900' : 'text-white'"
      />
    </span>

    <!-- Optional Label & Count -->
    <span v-if="showLabel" class="text-xs">
      {{ finish }}
      <span v-if="typeof count === 'number'" class="text-neutral-400 text-[10px] ml-1">
        ({{ count }})
      </span>
    </span>
  </button>
</template>
