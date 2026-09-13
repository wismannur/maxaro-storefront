<!-- app/components/catalog/SortDropdown.vue -->
<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import {
  ArrowUpDown,
  ChevronDown,
  Check,
  Flame,
  ArrowDownNarrowWide,
  ArrowUpNarrowWide,
  Star,
} from 'lucide-vue-next';
import { useCatalog } from '~~/app/composables/useCatalog';
import { useLocale } from '~~/app/composables/useLocale';

type SortOptionKey = 'popular' | 'price-asc' | 'price-desc' | 'rating';

const props = defineProps<{
  modelValue?: SortOptionKey;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: SortOptionKey): void;
}>();

const { sortBy: catalogSortBy, store } = useCatalog();
const { t } = useLocale();

const isOpen = ref(false);
const dropdownRef = ref<HTMLElement | null>(null);

const currentValue = computed<SortOptionKey>(() => {
  return props.modelValue !== undefined ? props.modelValue : catalogSortBy.value;
});

const sortOptions = computed(() => [
  {
    value: 'popular' as const,
    label: t('catalog.sortPopular'),
    icon: Flame,
  },
  {
    value: 'price-asc' as const,
    label: t('catalog.sortPriceAsc'),
    icon: ArrowDownNarrowWide,
  },
  {
    value: 'price-desc' as const,
    label: t('catalog.sortPriceDesc'),
    icon: ArrowUpNarrowWide,
  },
  {
    value: 'rating' as const,
    label: t('catalog.sortRating'),
    icon: Star,
  },
]);

const currentOption = computed(() => {
  return sortOptions.value.find((opt) => opt.value === currentValue.value) ?? sortOptions.value[0]!;
});

function toggle() {
  isOpen.value = !isOpen.value;
}

function selectOption(val: SortOptionKey) {
  if (props.modelValue !== undefined) {
    emit('update:modelValue', val);
  } else {
    store.setSortBy(val);
  }
  isOpen.value = false;
}

function handleClickOutside(e: MouseEvent) {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target as Node)) {
    isOpen.value = false;
  }
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && isOpen.value) {
    isOpen.value = false;
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  window.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
  window.removeEventListener('keydown', handleKeydown);
});
</script>

<template>
  <div
    ref="dropdownRef"
    class="relative inline-block text-left text-xs"
    style="position: relative;"
  >
    <!-- Trigger Button matching Locale Switcher aesthetics -->
    <button
      type="button"
      @click.stop="toggle"
      class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white hover:bg-neutral-50 border border-neutral-200/90 shadow-2xs hover:border-neutral-300 transition-all font-medium text-neutral-800 cursor-pointer select-none focus-visible:ring-2 focus-visible:ring-maxaro-blue focus-visible:outline-none"
      :aria-expanded="isOpen"
      aria-haspopup="listbox"
      :aria-label="`${t('catalog.sortBy')} ${currentOption.label}`"
      :title="t('catalog.sortBy')"
    >
      <component :is="currentOption.icon" class="w-3.5 h-3.5 text-maxaro-blue shrink-0" />
      <span class="text-xs font-semibold text-neutral-800 whitespace-nowrap">
        {{ currentOption.label }}
      </span>
      <ChevronDown
        class="w-3 h-3 text-neutral-400 transition-transform duration-150 shrink-0"
        :class="isOpen ? 'rotate-180 text-maxaro-blue' : ''"
      />
    </button>

    <!-- Custom Dropdown Menu matching LocaleSwitcher luxury standard -->
    <Transition
      enter-active-class="transition duration-100 ease-out"
      enter-from-class="opacity-0 scale-95 -translate-y-1"
      enter-to-class="opacity-100 scale-100 translate-y-0"
      leave-active-class="transition duration-75 ease-in"
      leave-from-class="opacity-100 scale-100 translate-y-0"
      leave-to-class="opacity-0 scale-95 -translate-y-1"
    >
      <div
        v-if="isOpen"
        role="listbox"
        :aria-label="t('catalog.sortBy')"
        class="absolute left-0 sm:left-auto sm:right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-neutral-200 py-1.5 z-50 overflow-hidden divide-y divide-neutral-100"
        style="position: absolute; top: 100%;"
      >
        <!-- Header Section -->
        <div class="px-3 py-1.5 text-[10px] uppercase font-bold text-neutral-400 tracking-wider flex items-center gap-1.5 bg-neutral-50/60">
          <ArrowUpDown class="w-3.5 h-3.5 text-maxaro-blue" />
          <span>{{ t('catalog.sortBy') }}</span>
        </div>

        <!-- Options List -->
        <div class="py-1">
          <button
            v-for="opt in sortOptions"
            :key="opt.value"
            type="button"
            role="option"
            :aria-selected="currentValue === opt.value"
            @click="selectOption(opt.value)"
            class="w-full flex items-center justify-between px-3 py-2 text-left hover:bg-neutral-50 transition-colors cursor-pointer group"
            :class="currentValue === opt.value ? 'bg-neutral-50/80 font-bold text-maxaro-blue' : 'text-neutral-700'"
          >
            <div class="flex items-center gap-2.5">
              <component
                :is="opt.icon"
                class="w-3.5 h-3.5 transition-colors shrink-0"
                :class="currentValue === opt.value ? 'text-maxaro-blue' : 'text-neutral-400 group-hover:text-maxaro-blue'"
              />
              <span
                class="text-xs transition-colors"
                :class="currentValue === opt.value ? 'font-bold text-neutral-900' : 'text-neutral-700 group-hover:text-maxaro-blue font-medium'"
              >
                {{ opt.label }}
              </span>
            </div>

            <Check
              v-if="currentValue === opt.value"
              class="w-3.5 h-3.5 text-trust-green shrink-0"
            />
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>
