<!-- app/components/common/LocaleSwitcher.vue -->
<script setup lang="ts">
import { ChevronDown, Check, Globe } from 'lucide-vue-next';
import { useLocale } from '~~/app/composables/useLocale';
import type { MarketOption } from '~~/app/locales';

const { currentMarketInfo, supportedMarkets, setMarket, t } = useLocale();
const { trackMarketChange } = useUmami();

const isOpen = ref(false);
const dropdownRef = ref<HTMLElement | null>(null);

function toggle() {
  isOpen.value = !isOpen.value;
}

function selectMarket(market: MarketOption) {
  setMarket(market);
  trackMarketChange({
    code: market.code,
    language: market.languageName,
    country: market.countryName,
  });
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
  <div ref="dropdownRef" class="relative inline-block text-left text-xs">
    <!-- Trigger Button -->
    <button
      type="button"
      @click.stop="toggle"
      class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/90 sm:bg-neutral-100 hover:bg-neutral-200/80 border border-neutral-200/80 transition-all font-medium text-neutral-800 cursor-pointer shadow-xs select-none"
      :aria-expanded="isOpen"
      aria-haspopup="true"
      :title="t('localeSwitcher.selectCountryLanguage')"
    >
      <span class="text-sm leading-none">{{ currentMarketInfo.flag }}</span>
      <span class="font-bold text-[11px] uppercase tracking-wide text-neutral-800">
        {{ currentMarketInfo.code }}
      </span>
      <ChevronDown
        class="w-3 h-3 text-neutral-500 transition-transform duration-150"
        :class="isOpen ? 'rotate-180' : ''"
      />
    </button>

    <!-- Dropdown Menu -->
    <Transition
      enter-active-class="transition duration-100 ease-out"
      enter-from-class="transform opacity-0 scale-95 -translate-y-1"
      enter-to-class="transform opacity-100 scale-100 translate-y-0"
      leave-active-class="transition duration-75 ease-in"
      leave-from-class="transform opacity-100 scale-100 translate-y-0"
      leave-to-class="transform opacity-0 scale-95 -translate-y-1"
    >
      <div
        v-if="isOpen"
        class="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-neutral-200 py-1.5 z-[100] overflow-hidden divide-y divide-neutral-100"
      >
        <div class="px-3 py-1.5 text-[10px] uppercase font-bold text-neutral-400 tracking-wider flex items-center gap-1.5 bg-neutral-50/60">
          <Globe class="w-3.5 h-3.5 text-maxaro-blue" />
          <span>{{ t('localeSwitcher.title') }}</span>
        </div>

        <div class="py-1">
          <button
            v-for="market in supportedMarkets"
            :key="market.marketKey"
            type="button"
            @click="selectMarket(market)"
            class="w-full flex items-center justify-between px-3 py-2 text-left hover:bg-neutral-50 transition-colors cursor-pointer group"
            :class="market.marketKey === currentMarketInfo.marketKey ? 'bg-neutral-50/80 font-bold text-maxaro-blue' : 'text-neutral-700'"
          >
            <div class="flex items-center gap-2.5">
              <span class="text-base leading-none">{{ market.flag }}</span>
              <div>
                <p class="text-xs font-semibold leading-tight text-neutral-900 group-hover:text-maxaro-blue transition-colors">
                  {{ market.countryName }}
                </p>
                <p class="text-[10px] text-neutral-500 leading-tight">
                  {{ market.languageName }}
                </p>
              </div>
            </div>

            <Check
              v-if="market.marketKey === currentMarketInfo.marketKey"
              class="w-3.5 h-3.5 text-trust-green shrink-0"
            />
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>
