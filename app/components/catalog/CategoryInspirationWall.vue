<script setup lang="ts">
import type { ProductCategory } from '~~/shared/types';
import { Camera, MapPin, ArrowRight } from 'lucide-vue-next';

const props = defineProps<{
  category: ProductCategory;
}>();

const inspirationProjects = computed(() => [
  {
    image: 'https://media.maxaro.nl/Width1240/152649/1144x1060_test-ingangbanner_completebadkamers_desktop.jpg.webp',
    title: 'Modern Minimalistisch Landhuis',
    location: 'Breda • Renovatie',
    tag: 'Solid Surface Suite',
  },
  {
    image: 'https://media.maxaro.nl/Width1240/152610/ingangbanner_inspiratie_desktop.jpg.webp',
    title: 'Boutique Hotel Chic Suite',
    location: 'Utrecht • Nieuwbouw',
    tag: 'Mat Zwart & Eiken',
  },
  {
    image: 'https://media.maxaro.nl/Width1240/152609/ingangbanner_completetoiletruimtes_desktop.jpg.webp',
    title: 'Warm Travertine Penthouse',
    location: 'Rotterdam • Architectuurproject',
    tag: 'Natuursteen & Gunmetal',
  },
]);
</script>

<template>
  <div class="space-y-6 pt-6 text-left">
    <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-neutral-200 pb-4">
      <div>
        <div class="inline-flex items-center gap-1.5 text-[11px] font-bold text-maxaro-accent uppercase tracking-wider mb-1">
          <Camera class="w-3.5 h-3.5" />
          <span>Gerealiseerde Projecten</span>
        </div>
        <h2 class="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">
          Inspiratie uit Echte Badkamers
        </h2>
        <p class="text-xs text-neutral-500 mt-0.5">
          Ontdek hoe deze collectie tot leven komt in toonaangevende residenties door heel Nederland.
        </p>
      </div>
    </div>

    <!-- 3-Column Inspiration Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-5">
      <div
        v-for="(item, idx) in inspirationProjects"
        :key="idx"
        class="group relative aspect-[4/3] rounded-3xl overflow-hidden border border-neutral-200 shadow-xs bg-neutral-900"
      >
        <NuxtImg
          :src="item.image"
          :alt="item.title"
          width="400"
          height="300"
          loading="lazy"
          class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        <div class="absolute inset-x-4 bottom-4 text-white space-y-1">
          <span class="inline-block text-[10px] font-mono text-neutral-300 uppercase bg-white/20 backdrop-blur-xs px-2 py-0.5 rounded-md">
            {{ item.tag }}
          </span>
          <h4 class="text-sm font-bold text-white tracking-tight leading-snug group-hover:text-maxaro-accent transition-colors">
            {{ item.title }}
          </h4>
          <div class="flex items-center gap-1 text-[11px] text-neutral-300">
            <MapPin class="w-3 h-3 text-maxaro-accent" />
            <span>{{ item.location }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
