<script setup lang="ts">
import {
  Sparkles,
  ArrowRight,
  Building2,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Truck,
  MapPin,
  ExternalLink,
  Plus,
} from 'lucide-vue-next';
import { useLocale } from '~~/app/composables/useLocale';
import TrustpilotBadge from '~~/app/components/common/TrustpilotBadge.vue';

const { t } = useLocale();

const activeHotspot = ref<'bath' | 'tap' | null>(null);

const emit = defineEmits<{
  (e: 'explore-catalog'): void;
  (e: 'open-showroom-modal'): void;
}>();

function onExploreCatalog() {
  const umami = useUmami();
  umami.track('click_hero_explore');
  emit('explore-catalog');
}

function onOpenShowroomModal() {
  const umami = useUmami();
  umami.track('click_hero_showroom');
  emit('open-showroom-modal');
}

function toggleHotspot(spot: 'bath' | 'tap') {
  activeHotspot.value = activeHotspot.value === spot ? null : spot;
  if (activeHotspot.value) {
    const umami = useUmami();
    umami.track('click_hero_hotspot', { hotspot: spot });
  }
}

function closeHotspot() {
  activeHotspot.value = null;
}
</script>

<template>
  <section class="relative bg-[#FAF9F5] border-b border-neutral-200/80 overflow-hidden">
    <!-- Subtle Architectural Background Accents -->
    <div class="absolute inset-0 pointer-events-none opacity-40">
      <div class="absolute -top-32 -left-32 w-96 h-96 bg-amber-100/60 rounded-full blur-3xl" />
      <div class="absolute top-1/2 -right-32 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl" />
    </div>

    <div class="max-w-7xl mx-auto px-4 pt-8 sm:pt-14 pb-12 relative z-10">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
        <!-- Left Column: Editorial Brand Typography & CTAs -->
        <div class="lg:col-span-7 space-y-6 text-left">
          <!-- Top Header Cluster: Eyebrow + Trustpilot Badge in clean harmony -->
          <div class="flex flex-wrap items-center justify-between gap-3">
            <div class="inline-flex items-center gap-2 rounded-full bg-white/95 border border-neutral-200/90 px-3.5 py-1.5 text-xs font-semibold text-neutral-800 shadow-xs backdrop-blur-xs">
              <span class="flex h-2 w-2 relative">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-trust-green opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2 w-2 bg-trust-green"></span>
              </span>
              <span class="font-mono text-[11px] uppercase tracking-wider text-neutral-600">{{ t('homeHero.eyebrow') }}</span>
            </div>

            <!-- Trustpilot Badge at top level -->
            <TrustpilotBadge />
          </div>

          <!-- Editorial H1 -->
          <div class="space-y-2">
            <h1 class="text-3xl sm:text-5xl lg:text-[3.4rem] font-black text-neutral-900 tracking-tight leading-[1.12]">
              {{ t('homeHero.titlePart1') }}
              <span class="block text-transparent bg-clip-text bg-gradient-to-r from-maxaro-blue via-[#183B65] to-maxaro-accent font-serif italic font-normal sm:font-semibold">
                {{ t('homeHero.titleHighlight') }}
              </span>
            </h1>
          </div>

          <p class="text-sm sm:text-base text-neutral-600 leading-relaxed max-w-2xl font-normal">
            {{ t('homeHero.description') }}
          </p>

          <!-- Primary & Secondary CTAs -->
          <div class="flex flex-wrap items-center gap-3.5 pt-2">
            <button
              type="button"
              @click="onExploreCatalog"
              class="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-maxaro-blue hover:bg-maxaro-blue-hover text-white text-sm font-bold rounded-2xl shadow-card-hover transition-all duration-200 active:scale-95 cursor-pointer"
            >
              <span>{{ t('homeHero.exploreCatalog') }}</span>
              <ArrowRight class="w-4 h-4" />
            </button>

            <button
              type="button"
              @click="onOpenShowroomModal"
              class="inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-white hover:bg-neutral-100 text-neutral-800 border border-neutral-200/90 text-sm font-bold rounded-2xl shadow-xs transition-all duration-200 active:scale-95 cursor-pointer"
            >
              <Building2 class="w-4 h-4 text-maxaro-accent" />
              <span>{{ t('homeHero.visitShowroom') }}</span>
            </button>
          </div>

          <!-- Spacious Omnichannel Showroom Status Card -->
          <div class="pt-2">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white/85 backdrop-blur-sm border border-neutral-200/90 shadow-xs hover:border-neutral-300 transition-colors">
              <div class="flex items-start sm:items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-trust-greenBg flex items-center justify-center text-trust-green shrink-0 mt-0.5 sm:mt-0">
                  <Clock class="w-5 h-5" />
                </div>
                <div class="space-y-0.5 text-left">
                  <div class="flex items-center gap-2 flex-wrap">
                    <span class="text-xs sm:text-sm font-bold text-neutral-900">
                      {{ t('homeHero.showroomLiveBadge') }}
                    </span>
                    <span class="inline-flex items-center gap-1 text-[10px] font-bold text-trust-green bg-trust-greenBg px-2 py-0.5 rounded-full font-mono">
                      <span class="w-1.5 h-1.5 rounded-full bg-trust-green animate-pulse" />
                      Open
                    </span>
                  </div>
                  <p class="text-[11px] text-neutral-500">
                    {{ t('homeHero.showroomLiveHours') }}
                  </p>
                </div>
              </div>

              <!-- Quick Showroom Info Modal Trigger Button -->
              <button
                type="button"
                @click="emit('open-showroom-modal')"
                class="inline-flex items-center gap-1.5 text-xs font-bold text-maxaro-blue hover:text-maxaro-blue-hover shrink-0 self-start sm:self-center px-3 py-1.5 rounded-xl hover:bg-neutral-100 transition-colors cursor-pointer"
              >
                <span>Route & Info</span>
                <ArrowRight class="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        <!-- Right Column: Interactive Flagship Architectural Showcase -->
        <div class="lg:col-span-5 relative" @mouseleave="closeHotspot">
          <div class="relative aspect-[4/3] sm:aspect-[16/13] rounded-3xl overflow-hidden shadow-2xl border border-neutral-200/90 bg-neutral-900 group">
            <NuxtImg
              src="https://media.maxaro.nl/Width1240/152649/1144x1060_test-ingangbanner_completebadkamers_desktop.jpg.webp"
              alt="Maxaro Flagship Complete Badkamer Suite"
              preset="heroProduct"
              width="800"
              height="650"
              loading="eager"
              decoding="async"
              fetchpriority="high"
              class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-103"
            />

            <!-- Ambient Image Vignette -->
            <div class="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent pointer-events-none" />

            <!-- Interactive Hotspot 1: Freestanding Bath (Tesino) -->
            <div class="absolute top-[62%] left-[36%] -translate-x-1/2 -translate-y-1/2 z-20">
              <button
                type="button"
                @click.stop="toggleHotspot('bath')"
                class="relative flex items-center justify-center w-8 h-8 rounded-full bg-white/90 text-maxaro-blue shadow-lg backdrop-blur-xs transition-transform hover:scale-110 active:scale-95 cursor-pointer focus:outline-none"
                :aria-label="t('homeHero.hotspot1Name')"
              >
                <span class="absolute inline-flex h-full w-full rounded-full bg-white opacity-70 animate-ping" />
                <Plus class="w-4 h-4 stroke-[3] transition-transform duration-200" :class="activeHotspot === 'bath' ? 'rotate-45' : ''" />
              </button>

              <!-- Hotspot Popover 1 -->
              <Transition
                enter-active-class="transition duration-200 ease-out"
                enter-from-class="opacity-0 translate-y-2 scale-95"
                enter-to-class="opacity-100 translate-y-0 scale-100"
                leave-active-class="transition duration-150 ease-in"
                leave-from-class="opacity-100 scale-100"
                leave-to-class="opacity-0 scale-95"
              >
                <div
                  v-if="activeHotspot === 'bath'"
                  class="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-2xl border border-neutral-200 text-neutral-900 z-30"
                >
                  <div class="flex items-center gap-2.5">
                    <NuxtImg
                      src="https://media.maxaro.nl/product/Width800/8498/tesino-vrijstaand-bad-180x85cm-solid-surface-mat-wit-vsb11-mn.webp"
                      alt="Tesino Bad"
                      width="54"
                      height="54"
                      class="w-13 h-13 rounded-xl object-cover bg-neutral-100 border border-neutral-200 shrink-0"
                    />
                    <div class="min-w-0 flex-1 text-left">
                      <span class="text-[9px] font-mono font-bold uppercase tracking-wider text-maxaro-blue bg-maxaro-blue-light px-1.5 py-0.5 rounded">
                        {{ t('homeHero.hotspotBadge') }}
                      </span>
                      <p class="text-xs font-bold text-neutral-900 truncate mt-0.5">{{ t('homeHero.hotspot1Name') }}</p>
                      <p class="text-[10px] text-neutral-500 truncate">{{ t('homeHero.hotspot1Meta') }}</p>
                      <p class="text-xs font-bold text-maxaro-blue font-mono mt-0.5">€ 2.295</p>
                    </div>
                  </div>
                  <NuxtLink
                    to="/product/tesino-vrijstaand-bad-180x85cm-solid-surface-mat-wit"
                    class="mt-2.5 flex items-center justify-between px-2.5 py-1.5 bg-maxaro-blue hover:bg-maxaro-blue-hover text-white text-[11px] font-bold rounded-xl transition-colors"
                  >
                    <span>{{ t('homeHero.hotspotViewProduct') }}</span>
                    <ArrowRight class="w-3 h-3" />
                  </NuxtLink>
                </div>
              </Transition>
            </div>

            <!-- Interactive Hotspot 2: Basin Mixer (Radius Gunmetal) -->
            <div class="absolute top-[42%] left-[75%] -translate-x-1/2 -translate-y-1/2 z-20">
              <button
                type="button"
                @click.stop="toggleHotspot('tap')"
                class="relative flex items-center justify-center w-8 h-8 rounded-full bg-white/90 text-maxaro-blue shadow-lg backdrop-blur-xs transition-transform hover:scale-110 active:scale-95 cursor-pointer focus:outline-none"
                :aria-label="t('homeHero.hotspot2Name')"
              >
                <span class="absolute inline-flex h-full w-full rounded-full bg-white opacity-70 animate-ping" />
                <Plus class="w-4 h-4 stroke-[3] transition-transform duration-200" :class="activeHotspot === 'tap' ? 'rotate-45' : ''" />
              </button>

              <!-- Hotspot Popover 2 -->
              <Transition
                enter-active-class="transition duration-200 ease-out"
                enter-from-class="opacity-0 translate-y-2 scale-95"
                enter-to-class="opacity-100 translate-y-0 scale-100"
                leave-active-class="transition duration-150 ease-in"
                leave-from-class="opacity-100 scale-100"
                leave-to-class="opacity-0 scale-95"
              >
                <div
                  v-if="activeHotspot === 'tap'"
                  class="absolute bottom-full right-0 sm:left-1/2 sm:-translate-x-1/2 mb-3 w-64 bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-2xl border border-neutral-200 text-neutral-900 z-30"
                >
                  <div class="flex items-center gap-2.5">
                    <NuxtImg
                      src="https://media.maxaro.nl/product/Width800/134341/radius-wastafelkraan-opbouw-rvs-eengreeps-mengkraan-55.003.551br.webp"
                      alt="Radius Wastafelkraan"
                      width="54"
                      height="54"
                      class="w-13 h-13 rounded-xl object-cover bg-neutral-100 border border-neutral-200 shrink-0"
                    />
                    <div class="min-w-0 flex-1 text-left">
                      <span class="text-[9px] font-mono font-bold uppercase tracking-wider text-maxaro-blue bg-maxaro-blue-light px-1.5 py-0.5 rounded">
                        {{ t('homeHero.hotspotBadge') }}
                      </span>
                      <p class="text-xs font-bold text-neutral-900 truncate mt-0.5">{{ t('homeHero.hotspot2Name') }}</p>
                      <p class="text-[10px] text-neutral-500 truncate">{{ t('homeHero.hotspot2Meta') }}</p>
                      <p class="text-xs font-bold text-maxaro-blue font-mono mt-0.5">€ 199</p>
                    </div>
                  </div>
                  <NuxtLink
                    to="/product/radius-wastafelkraan-opbouw-rvs-e-ngreeps-mengkraan"
                    class="mt-2.5 flex items-center justify-between px-2.5 py-1.5 bg-maxaro-blue hover:bg-maxaro-blue-hover text-white text-[11px] font-bold rounded-xl transition-colors"
                  >
                    <span>{{ t('homeHero.hotspotViewProduct') }}</span>
                    <ArrowRight class="w-3 h-3" />
                  </NuxtLink>
                </div>
              </Transition>
            </div>

            <!-- Bottom Floating Showcase Badge -->
            <div class="absolute inset-x-4 bottom-4 z-10 flex items-center justify-between bg-black/40 backdrop-blur-md rounded-2xl px-4 py-2.5 border border-white/15 text-white">
              <div class="flex items-center gap-2.5">
                <span class="flex h-2 w-2 rounded-full bg-maxaro-accent" />
                <span class="text-xs font-bold tracking-tight">{{ t('hero.flagshipTitle') }}</span>
              </div>
              <span class="text-[11px] font-mono text-neutral-300">Roosendaal 5.000 m²</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Luxury Metrics Ribbon -->
      <div class="mt-12 pt-8 border-t border-neutral-200/80 grid grid-cols-2 md:grid-cols-4 gap-6">
        <div class="space-y-1">
          <p class="text-2xl sm:text-3xl font-black text-neutral-900 font-sans tracking-tight">{{ t('homeHero.stat1Value') }}</p>
          <p class="text-xs text-neutral-500 font-medium">{{ t('homeHero.stat1Label') }}</p>
        </div>
        <div class="space-y-1">
          <p class="text-2xl sm:text-3xl font-black text-neutral-900 font-sans tracking-tight">{{ t('homeHero.stat2Value') }}</p>
          <p class="text-xs text-neutral-500 font-medium">{{ t('homeHero.stat2Label') }}</p>
        </div>
        <div class="space-y-1">
          <p class="text-2xl sm:text-3xl font-black text-neutral-900 font-sans tracking-tight">{{ t('homeHero.stat3Value') }}</p>
          <p class="text-xs text-neutral-500 font-medium">{{ t('homeHero.stat3Label') }}</p>
        </div>
        <div class="space-y-1">
          <p class="text-2xl sm:text-3xl font-black text-neutral-900 font-sans tracking-tight">{{ t('homeHero.stat4Value') }}</p>
          <p class="text-xs text-neutral-500 font-medium">{{ t('homeHero.stat4Label') }}</p>
        </div>
      </div>
    </div>
  </section>
</template>
