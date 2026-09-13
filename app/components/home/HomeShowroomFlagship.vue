<script setup lang="ts">
import {
  Building2,
  Sparkles,
  CheckCircle2,
  MapPin,
  Clock,
  QrCode,
  Calendar,
  ArrowRight,
  Car,
  Compass,
} from 'lucide-vue-next';
import { useLocale } from '~~/app/composables/useLocale';
import { useCartStore } from '~~/app/stores/cartStore';

const { t } = useLocale();
const cartStore = useCartStore();

const emit = defineEmits<{
  (e: 'open-showroom-modal'): void;
}>();

function handleGeneratePass() {
  cartStore.generateShowroomPass();
}
</script>

<template>
  <section id="showroom-experience" class="max-w-7xl mx-auto px-4 py-12 sm:py-16 scroll-mt-36">
    <div class="relative overflow-hidden rounded-3xl bg-neutral-900 text-white border border-neutral-800 shadow-2xl p-6 sm:p-12 lg:p-14">
      <!-- Subtle Decorative Background Glow -->
      <div class="absolute -top-40 -right-40 w-96 h-96 bg-maxaro-accent/20 rounded-full blur-3xl pointer-events-none" />
      <div class="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

      <div class="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
        <!-- Left Text & 4 Pillars Content -->
        <div class="lg:col-span-7 space-y-6 text-left">
          <div class="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-3.5 py-1.5 text-xs font-semibold text-white backdrop-blur-md">
            <Building2 class="w-3.5 h-3.5 text-maxaro-accent" />
            <span class="font-mono text-[11px] uppercase tracking-wider text-neutral-300">
              {{ t('showroomFlagship.badge') }}
            </span>
          </div>

          <h2 class="text-2xl sm:text-4xl lg:text-[2.6rem] font-black tracking-tight leading-tight text-white">
            {{ t('showroomFlagship.title') }}
          </h2>

          <p class="text-xs sm:text-sm text-neutral-300 leading-relaxed max-w-2xl font-normal">
            {{ t('showroomFlagship.subtitle') }}
          </p>

          <!-- 4 Feature Pillars Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div class="bg-white/5 rounded-2xl p-4 border border-white/10 backdrop-blur-xs space-y-1 text-left">
              <div class="flex items-center gap-2 text-trust-green">
                <CheckCircle2 class="w-4 h-4 shrink-0" />
                <h4 class="text-xs font-bold text-white tracking-tight">{{ t('showroomFlagship.pillar1Title') }}</h4>
              </div>
              <p class="text-[11px] text-neutral-400 pl-6 leading-relaxed">{{ t('showroomFlagship.pillar1Desc') }}</p>
            </div>

            <div class="bg-white/5 rounded-2xl p-4 border border-white/10 backdrop-blur-xs space-y-1 text-left">
              <div class="flex items-center gap-2 text-trust-green">
                <CheckCircle2 class="w-4 h-4 shrink-0" />
                <h4 class="text-xs font-bold text-white tracking-tight">{{ t('showroomFlagship.pillar2Title') }}</h4>
              </div>
              <p class="text-[11px] text-neutral-400 pl-6 leading-relaxed">{{ t('showroomFlagship.pillar2Desc') }}</p>
            </div>

            <div class="bg-white/5 rounded-2xl p-4 border border-white/10 backdrop-blur-xs space-y-1 text-left">
              <div class="flex items-center gap-2 text-trust-green">
                <CheckCircle2 class="w-4 h-4 shrink-0" />
                <h4 class="text-xs font-bold text-white tracking-tight">{{ t('showroomFlagship.pillar3Title') }}</h4>
              </div>
              <p class="text-[11px] text-neutral-400 pl-6 leading-relaxed">{{ t('showroomFlagship.pillar3Desc') }}</p>
            </div>

            <div class="bg-white/5 rounded-2xl p-4 border border-white/10 backdrop-blur-xs space-y-1 text-left">
              <div class="flex items-center gap-2 text-trust-green">
                <CheckCircle2 class="w-4 h-4 shrink-0" />
                <h4 class="text-xs font-bold text-white tracking-tight">{{ t('showroomFlagship.pillar4Title') }}</h4>
              </div>
              <p class="text-[11px] text-neutral-400 pl-6 leading-relaxed">{{ t('showroomFlagship.pillar4Desc') }}</p>
            </div>
          </div>

          <!-- CTAs -->
          <div class="flex flex-wrap items-center gap-3 pt-3">
            <button
              type="button"
              @click="emit('open-showroom-modal')"
              class="inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-maxaro-accent hover:bg-maxaro-accent-hover text-white text-xs sm:text-sm font-bold rounded-2xl transition-all duration-200 active:scale-95 shadow-lg cursor-pointer"
            >
              <Calendar class="w-4 h-4" />
              <span>{{ t('showroomFlagship.ctaBook') }}</span>
            </button>

            <button
              type="button"
              @click="handleGeneratePass"
              class="inline-flex items-center justify-center gap-2 px-4 py-3.5 bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-bold rounded-2xl border border-white/15 transition-all duration-200 active:scale-95 cursor-pointer backdrop-blur-xs"
            >
              <QrCode class="w-4 h-4 text-maxaro-accent" />
              <span>{{ t('showroomFlagship.ctaPass') }}</span>
            </button>

            <button
              type="button"
              @click="emit('open-showroom-modal')"
              class="inline-flex items-center justify-center gap-1.5 text-xs font-medium text-neutral-300 hover:text-white underline px-3 py-2 cursor-pointer"
            >
              <Clock class="w-3.5 h-3.5 text-neutral-400" />
              <span>{{ t('showroomFlagship.ctaHoursRoute') }}</span>
            </button>
          </div>

          <!-- Address & Parking Note -->
          <div class="pt-4 border-t border-white/10 flex flex-wrap items-center gap-4 text-[11px] text-neutral-400">
            <div class="flex items-center gap-1.5">
              <MapPin class="w-3.5 h-3.5 text-maxaro-accent shrink-0" />
              <span>{{ t('showroomFlagship.address') }} ({{ t('showroomFlagship.directions') }})</span>
            </div>
            <div class="flex items-center gap-1.5 text-neutral-400">
              <Car class="w-3.5 h-3.5 text-trust-green shrink-0" />
              <span>{{ t('showroomFlagship.parking') }}</span>
            </div>
          </div>
        </div>

        <!-- Right Side: Dual Architectural Imagery Collage -->
        <div class="lg:col-span-5 grid grid-cols-2 gap-3.5 relative">
          <div class="aspect-[3/4] rounded-2xl overflow-hidden border border-white/15 shadow-xl relative group">
            <NuxtImg
              src="https://media.maxaro.nl/Width1240/152610/ingangbanner_inspiratie_desktop.jpg.webp"
              alt="Showroom Roosendaal 5000m2 Inspiratie"
              width="450"
              height="600"
              loading="lazy"
              class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3.5">
              <p class="text-xs font-bold text-white">50+ Complete Badkamers</p>
            </div>
          </div>

          <div class="aspect-[3/4] rounded-2xl overflow-hidden border border-white/15 shadow-xl relative group mt-6">
            <NuxtImg
              src="https://media.maxaro.nl/Width1240/152609/ingangbanner_completetoiletruimtes_desktop.jpg.webp"
              alt="Showroom Sanitair en Meubels"
              width="450"
              height="600"
              loading="lazy"
              class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3.5">
              <p class="text-xs font-bold text-white">3D Design Studio & Waterwand</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
