<!-- app/components/common/ShowroomModal.vue -->
<script setup lang="ts">
import {
  X,
  MapPin,
  Clock,
  Phone,
  Calendar,
  ExternalLink,
  Car,
  CheckCircle2,
  Building2,
} from 'lucide-vue-next';
import { useLocale } from '~~/app/composables/useLocale';

defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const { t } = useLocale();

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    emit('close');
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
});

const openingHours = computed(() => [
  { days: t('showroomModal.daysMonWed'), hours: '09:00 - 18:00', open: true },
  { days: t('showroomModal.daysThu'), hours: '09:00 - 21:00', open: true, highlight: true },
  { days: t('showroomModal.daysFri'), hours: '09:00 - 18:00', open: true },
  { days: t('showroomModal.daysSat'), hours: '09:00 - 17:00', open: true },
  { days: t('showroomModal.daysSun'), hours: '11:00 - 17:00', open: true },
]);

const otherLocations = [
  { city: 'Utrecht', address: 'The Wall, Hertogwetering 171', phone: '030 - 307 2400' },
  { city: 'Hoofddorp', address: 'Kruisweg 787', phone: '023 - 201 4400' },
];
</script>

<template>
  <Transition
    enter-active-class="transition-opacity duration-200 ease-out"
    leave-active-class="transition-opacity duration-150 ease-in"
    enter-from-class="opacity-0"
    leave-to-class="opacity-0"
  >
    <div
      v-if="isOpen"
      class="fixed inset-0 z-[150] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="showroom-modal-title"
      @click.self="emit('close')"
    >
      <div class="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden my-6">
        <!-- Header -->
        <div class="bg-gradient-to-r from-maxaro-blue to-maxaro-blue-hover text-white p-6 relative">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="p-2 rounded-xl bg-white/10 text-white backdrop-blur-sm">
                <Building2 class="w-6 h-6" />
              </div>
              <div>
                <h3 id="showroom-modal-title" class="font-bold text-lg text-white">
                  {{ t('showroomModal.title') }}
                </h3>
                <p class="text-xs text-neutral-300">
                  {{ t('showroomModal.subtitle') }}
                </p>
              </div>
            </div>

            <button
              type="button"
              @click="emit('close')"
              class="p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              :aria-label="t('checkoutModal.cancel')"
            >
              <X class="w-5 h-5" />
            </button>
          </div>
        </div>

        <!-- Body -->
        <div class="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          <!-- Main Location Card -->
          <div class="bg-neutral-50 rounded-2xl border border-neutral-200 p-4 space-y-3">
            <div class="flex items-start justify-between">
              <div class="space-y-1">
                <div class="flex items-center gap-1.5 text-xs font-bold text-neutral-900">
                  <MapPin class="w-4 h-4 text-maxaro-blue" />
                  <span>{{ t('showroomModal.addressText') }}</span>
                </div>
                <p class="text-xs text-neutral-500 pl-5.5">
                  {{ t('showroomModal.addressDirections') }}
                </p>
              </div>

              <a
                href="https://maps.google.com/?q=Maxaro+Roosendaal+Rucphensebaan+17"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-neutral-100 border border-neutral-200 rounded-xl text-xs font-bold text-maxaro-blue transition-colors shrink-0 cursor-pointer"
              >
                <span>{{ t('showroomModal.routeButton') }}</span>
                <ExternalLink class="w-3.5 h-3.5" />
              </a>
            </div>

            <div class="flex flex-wrap items-center gap-4 text-xs text-neutral-600 pt-1 border-t border-neutral-200/80">
              <div class="flex items-center gap-1.5">
                <Car class="w-3.5 h-3.5 text-trust-green" />
                <span>{{ t('showroomModal.freeParking') }}</span>
              </div>
              <div class="flex items-center gap-1.5">
                <Phone class="w-3.5 h-3.5 text-trust-green" />
                <a href="tel:0165574080" class="hover:underline font-mono">{{ t('showroomModal.phone') }}</a>
              </div>
            </div>
          </div>

          <!-- Opening Hours Matrix -->
          <div class="space-y-2.5">
            <h4 class="text-xs font-bold text-neutral-900 uppercase tracking-wider flex items-center gap-1.5">
              <Clock class="w-3.5 h-3.5 text-maxaro-blue" />
              <span>{{ t('showroomModal.hoursTitle') }}</span>
            </h4>

            <div class="divide-y divide-neutral-100 rounded-2xl border border-neutral-200 overflow-hidden text-xs">
              <div
                v-for="item in openingHours"
                :key="item.days"
                class="px-4 py-2.5 flex items-center justify-between transition-colors"
                :class="item.highlight ? 'bg-maxaro-blue-light/50 font-bold text-maxaro-blue' : 'bg-white text-neutral-700'"
              >
                <span class="flex items-center gap-1.5">
                  <span v-if="item.highlight" class="w-1.5 h-1.5 rounded-full bg-maxaro-blue" />
                  {{ item.days }}
                </span>
                <span class="font-mono font-semibold">{{ item.hours }}</span>
              </div>
            </div>
          </div>

          <!-- Additional Locations Summary -->
          <div class="space-y-2.5">
            <h4 class="text-xs font-bold text-neutral-900 uppercase tracking-wider">
              {{ t('showroomModal.otherLocationsTitle') }}
            </h4>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div
                v-for="loc in otherLocations"
                :key="loc.city"
                class="p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-xs space-y-1"
              >
                <div class="font-bold text-neutral-900">{{ t('showroomModal.showroomCity', { city: loc.city }) }}</div>
                <div class="text-neutral-500 text-[11px]">{{ loc.address }}</div>
                <div class="text-[11px] text-trust-green font-mono">{{ loc.phone }}</div>
              </div>
            </div>
          </div>

          <!-- 3D Advice CTA -->
          <div class="p-4 rounded-2xl bg-trust-greenBg border border-trust-green/30 flex items-center justify-between gap-4">
            <div class="space-y-0.5">
              <div class="text-xs font-bold text-neutral-900 flex items-center gap-1.5">
                <CheckCircle2 class="w-4 h-4 text-trust-green shrink-0" />
                <span>{{ t('showroomModal.adviceTitle') }}</span>
              </div>
              <p class="text-[11px] text-neutral-600">
                {{ t('showroomModal.adviceDesc') }}
              </p>
            </div>
            <button
              type="button"
              @click="emit('close')"
              class="px-3.5 py-2 bg-trust-green hover:bg-trust-green-hover text-white rounded-xl text-xs font-bold transition-colors shrink-0 shadow-xs cursor-pointer"
            >
              {{ t('showroomModal.bookAppointment') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>
