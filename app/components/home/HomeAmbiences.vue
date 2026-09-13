<script setup lang="ts">
import { Sparkles, ArrowRight, Check, Compass } from 'lucide-vue-next';
import { useLocale } from '~~/app/composables/useLocale';
import { useCatalogStore } from '~~/app/stores/catalogStore';
import type { ProductFinish } from '~~/shared/types';

const { t } = useLocale();
const catalogStore = useCatalogStore();

const emit = defineEmits<{
  (e: 'style-selected', finish: ProductFinish | null): void;
}>();

interface AmbienceStyle {
  id: string;
  key: 'hotelChic' | 'japandi' | 'industrial' | 'travertine';
  targetFinish: ProductFinish;
  image: string;
  palette: string[];
}

const styles: AmbienceStyle[] = [
  {
    id: 'hotel-chic',
    key: 'hotelChic',
    targetFinish: 'Mat Zwart',
    image: 'https://media.maxaro.nl/product/Width800/54073/modulo-plato-badkamermeubel-voor-waskom-100-cm-mat-zwart-greeploos-front-lichtbruin-eiken-blad-2-lades-onder-elkaar-bmk17-00242.webp',
    palette: ['#1C1917', '#78350F', '#B45309', '#F5F5F4'],
  },
  {
    id: 'japandi-zen',
    key: 'japandi',
    targetFinish: 'Mat Wit',
    image: 'https://media.maxaro.nl/product/Width800/8498/tesino-vrijstaand-bad-180x85cm-solid-surface-mat-wit-vsb11-mn.webp',
    palette: ['#FAF9F6', '#D6D3D1', '#A8A29E', '#78716C'],
  },
  {
    id: 'industrial-luxe',
    key: 'industrial',
    targetFinish: 'Brushed Gunmetal',
    image: 'https://media.maxaro.nl/product/Width800/134341/radius-wastafelkraan-opbouw-rvs-eengreeps-mengkraan-55.003.551br.webp',
    palette: ['#292524', '#44403C', '#78716C', '#D6D3D1'],
  },
  {
    id: 'warm-travertine',
    key: 'travertine',
    targetFinish: 'Chroom',
    image: 'https://media.maxaro.nl/product/Width800/129529/legno-bruin-vloer-/wandtegel-15x90-cm-bruin-houtlook-505-090104.webp',
    palette: ['#E7E5E4', '#D7CCC8', '#A1887F', '#5D4037'],
  },
];

function selectStyle(style: AmbienceStyle) {
  if (catalogStore.activeFinish === style.targetFinish) {
    catalogStore.activeFinish = null;
    emit('style-selected', null);
  } else {
    catalogStore.activeFinish = style.targetFinish;
    emit('style-selected', style.targetFinish);
  }
}

</script>

<template>
  <section class="max-w-7xl mx-auto px-4 py-8">
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
      <div class="space-y-1.5 text-left max-w-2xl">
        <div class="inline-flex items-center gap-1.5 text-[11px] font-bold text-maxaro-accent uppercase tracking-wider">
          <Compass class="w-3.5 h-3.5" />
          <span>{{ t('ambiences.badge') }}</span>
        </div>
        <h2 class="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">
          {{ t('ambiences.title') }}
        </h2>
        <p class="text-xs sm:text-sm text-neutral-600 leading-relaxed">
          {{ t('ambiences.subtitle') }}
        </p>
      </div>

      <!-- Active Filter Pill & Reset -->
      <div v-if="catalogStore.activeFinish" class="flex items-center gap-2 self-start md:self-end">
        <span class="text-xs text-neutral-500 font-medium">{{ t('ambiences.activeFilterIndicator') }}</span>
        <button
          type="button"
          @click="catalogStore.activeFinish = null; emit('style-selected', null)"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-900 text-white text-xs font-bold hover:bg-neutral-800 transition-all cursor-pointer"
        >
          <span>{{ catalogStore.activeFinish }}</span>
          <span class="text-neutral-400 text-xs">✕</span>
        </button>
      </div>
    </div>

    <!-- 4-Column Architectural Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      <div
        v-for="style in styles"
        :key="style.id"
        @click="selectStyle(style)"
        class="group relative flex flex-col justify-between overflow-hidden rounded-3xl border transition-all duration-300 cursor-pointer p-4 aspect-[4/5] sm:aspect-[3/4]"
        :class="catalogStore.activeFinish === style.targetFinish ? 'ring-2 ring-maxaro-blue border-maxaro-blue shadow-xl' : 'border-neutral-200/90 hover:border-neutral-300 hover:shadow-card-hover'"
      >
        <!-- Background Imagery -->
        <NuxtImg
          :src="style.image"
          :alt="t(`ambiences.${style.key}Title`)"
          width="400"
          height="520"
          loading="lazy"
          class="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        <!-- Ambient Dark/Warm Gradient Scrim -->
        <div class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10 transition-opacity duration-300 group-hover:opacity-90" />

        <!-- Top Row: Style Badge & Active Indicator -->
        <div class="relative z-10 flex items-center justify-between">
          <!-- Palette Dot Strip -->
          <div class="flex items-center gap-1 bg-black/40 backdrop-blur-md px-2 py-1 rounded-full border border-white/10">
            <span
              v-for="(color, idx) in style.palette"
              :key="idx"
              class="w-2.5 h-2.5 rounded-full border border-white/20"
              :style="{ backgroundColor: color }"
            />
          </div>

          <span
            v-if="catalogStore.activeFinish === style.targetFinish"
            class="flex items-center gap-1 px-2.5 py-1 rounded-full bg-trust-green text-white text-[10px] font-bold shadow-xs"
          >
            <Check class="w-3 h-3 stroke-[3]" />
            <span>Actief</span>
          </span>
        </div>

        <!-- Bottom Content & Editorial Details -->
        <div class="relative z-10 space-y-2 text-white text-left">
          <span class="text-[10px] font-mono uppercase tracking-widest text-neutral-300 font-semibold">
            {{ t(`ambiences.${style.key}Subtitle`) }}
          </span>
          <h3 class="text-lg font-bold text-white tracking-tight group-hover:text-maxaro-accent transition-colors">
            {{ t(`ambiences.${style.key}Title`) }}
          </h3>
          <p class="text-xs text-neutral-200 line-clamp-2 leading-relaxed opacity-90">
            {{ t(`ambiences.${style.key}Desc`) }}
          </p>

          <div class="pt-2 flex items-center justify-between text-xs font-bold text-white group-hover:text-maxaro-accent transition-colors">
            <span>{{ t('ambiences.filterButton') }}</span>
            <ArrowRight class="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
