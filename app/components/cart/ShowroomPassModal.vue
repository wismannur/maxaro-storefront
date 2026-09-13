<!-- app/components/cart/ShowroomPassModal.vue -->
<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import QRCode from 'qrcode';
import { storeToRefs } from 'pinia';
import {
  X,
  Building2,
  QrCode,
  Printer,
  Copy,
  Check,
  Calendar,
  Clock,
  MapPin,
  Phone,
  Sparkles,
  ShieldCheck,
  ChevronDown,
  Info,
  ArrowUpRight,
} from 'lucide-vue-next';
import { useCartStore, SHOWROOM_LOCATIONS } from '~~/app/stores/cartStore';
import { useCurrency } from '~~/app/composables/useCurrency';
import { useLocale } from '~~/app/composables/useLocale';

const cartStore = useCartStore();
const { isShowroomPassModalOpen, activeShowroomPass } = storeToRefs(cartStore);
const { formatEuro } = useCurrency();
const { t, currentLocale } = useLocale();

const qrCodeDataUrl = ref<string>('');
const isCopied = ref(false);
const isGeneratingQr = ref(false);

async function updateQrCode() {
  if (!activeShowroomPass.value) return;
  isGeneratingQr.value = true;
  try {
    const payload = JSON.stringify({
      code: activeShowroomPass.value.passId,
      showroom: activeShowroomPass.value.showroom.id,
      items: activeShowroomPass.value.items.length,
      total: activeShowroomPass.value.totals.total,
      v: '1',
    });

    qrCodeDataUrl.value = await QRCode.toDataURL(payload, {
      width: 220,
      margin: 1.5,
      color: {
        dark: '#0F2A4A',
        light: '#FFFFFF',
      },
      errorCorrectionLevel: 'M',
    });
  } catch (err) {
    console.error('Failed to generate QR code for showroom pass:', err);
  } finally {
    isGeneratingQr.value = false;
  }
}

watch(
  () => activeShowroomPass.value?.passId,
  () => {
    updateQrCode();
  },
  { immediate: true }
);

function handleShowroomChange(showroomLocationId: string) {
  cartStore.switchShowroomForActivePass(showroomLocationId);
  updateQrCode();
}

function handleCopyCode() {
  if (!activeShowroomPass.value) return;
  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    navigator.clipboard.writeText(activeShowroomPass.value.passId);
    isCopied.value = true;
    setTimeout(() => {
      isCopied.value = false;
    }, 2000);
  }
}

function handlePrint() {
  if (typeof window !== 'undefined') {
    window.print();
  }
}

function closeModal() {
  cartStore.closeShowroomPassModal();
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && isShowroomPassModalOpen.value) {
    closeModal();
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
  if (activeShowroomPass.value && !qrCodeDataUrl.value) {
    updateQrCode();
  }
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
});

const formattedExpiry = computed(() => {
  if (!activeShowroomPass.value) return '';
  const d = new Date(activeShowroomPass.value.expiresAt);
  const localeStr = currentLocale.value === 'nl' ? 'nl-NL' : currentLocale.value === 'de' ? 'de-DE' : currentLocale.value === 'fr' ? 'fr-FR' : 'en-GB';
  return d.toLocaleDateString(localeStr, { day: 'numeric', month: 'long', year: 'numeric' });
});
</script>

<template>
  <Transition
    enter-active-class="transition-opacity duration-200 ease-out"
    leave-active-class="transition-opacity duration-150 ease-in"
    enter-from-class="opacity-0"
    leave-to-class="opacity-0"
  >
    <div
      v-if="isShowroomPassModalOpen && activeShowroomPass"
      class="fixed inset-0 z-[160] bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto print:bg-white print:p-0 print:static print:overflow-visible"
      role="dialog"
      aria-modal="true"
      aria-labelledby="showroom-pass-title"
      @click.self="closeModal"
    >
      <div
        class="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden my-4 sm:my-6 print:border-none print:shadow-none print:my-0"
      >
        <!-- Modal Header -->
        <div class="bg-gradient-to-r from-maxaro-blue via-[#12365e] to-maxaro-blue-hover text-white p-5 sm:p-6 print:bg-white print:text-neutral-900 print:border-b-2 print:border-neutral-900">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="p-2.5 rounded-2xl bg-white/10 text-white backdrop-blur-sm print:hidden">
                <Building2 class="w-6 h-6 text-trust-green" />
              </div>
              <div>
                <div class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/15 text-[10px] font-bold text-trust-green uppercase tracking-wider mb-1 print:text-neutral-600 print:border">
                  <Sparkles class="w-3 h-3 text-trust-green" />
                  <span>Omnichannel Showroom Pass</span>
                </div>
                <h3 id="showroom-pass-title" class="font-black text-lg sm:text-xl text-white print:text-neutral-900 leading-tight">
                  {{ t('showroomPass.modalTitle') }}
                </h3>
                <p class="text-xs text-neutral-300 print:text-neutral-600 mt-0.5">
                  {{ t('showroomPass.modalSubtitle') }}
                </p>
              </div>
            </div>

            <button
              type="button"
              @click="closeModal"
              class="p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer print:hidden"
              :aria-label="t('checkoutModal.cancel')"
            >
              <X class="w-5 h-5" />
            </button>
          </div>
        </div>

        <!-- Modal Body -->
        <div class="p-5 sm:p-6 space-y-6 max-h-[75vh] overflow-y-auto print:max-h-none print:overflow-visible">
          <!-- Top Hero: QR Code & Unique Offerte Identifier -->
          <div class="bg-neutral-50 rounded-2xl border border-neutral-200 p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-5 sm:gap-6">
            <!-- QR Code Box -->
            <div class="relative bg-white p-3 rounded-2xl border-2 border-maxaro-blue/20 shadow-xs shrink-0 text-center flex flex-col items-center">
              <div v-if="isGeneratingQr" class="w-[180px] h-[180px] flex items-center justify-center text-neutral-400">
                <QrCode class="w-8 h-8 animate-pulse text-maxaro-blue" />
              </div>
              <img
                v-else-if="qrCodeDataUrl"
                :src="qrCodeDataUrl"
                :alt="`QR Code ${activeShowroomPass.passId}`"
                class="w-[160px] h-[160px] sm:w-[170px] sm:h-[170px] object-contain rounded-lg"
              />
              <span class="text-[10px] font-mono text-neutral-500 mt-1 uppercase font-bold tracking-wider">{{ t('showroomPass.scanInShowroom') }}</span>
            </div>

            <!-- Pass Details & Actions -->
            <div class="space-y-3 flex-1 text-center sm:text-left w-full">
              <div>
                <span class="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block">
                  {{ t('showroomPass.quoteReferenceCode') }}
                </span>
                <div class="flex items-center justify-center sm:justify-start gap-2 mt-1">
                  <span class="text-xl sm:text-2xl font-mono font-black text-neutral-900 tracking-tight bg-white px-3 py-1 rounded-xl border border-neutral-200 shadow-2xs">
                    {{ activeShowroomPass.passId }}
                  </span>
                  <button
                    type="button"
                    @click="handleCopyCode"
                    class="p-2 rounded-xl border border-neutral-200 hover:bg-neutral-100 text-neutral-600 transition-colors print:hidden cursor-pointer"
                    :title="t('showroomPass.copyLink')"
                  >
                    <Check v-if="isCopied" class="w-4 h-4 text-trust-green" />
                    <Copy v-else class="w-4 h-4" />
                  </button>
                </div>
              </div>

              <!-- Expiry & Scan Instructions -->
              <div class="p-3 bg-white rounded-xl border border-neutral-200/80 space-y-1.5 text-xs text-neutral-700">
                <div class="flex items-center gap-1.5 font-bold text-neutral-900">
                  <Calendar class="w-3.5 h-3.5 text-maxaro-blue shrink-0" />
                  <span>{{ t('showroomPass.validUntil', { date: formattedExpiry }) }}</span>
                </div>
                <p class="text-[11px] text-neutral-600 leading-relaxed">
                  {{ t('showroomPass.scanInstruction') }}
                </p>
              </div>

              <!-- Print & Share Actions -->
              <div class="flex flex-wrap items-center gap-2 pt-1 print:hidden">
                <button
                  type="button"
                  @click="handlePrint"
                  class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-maxaro-blue text-white hover:bg-maxaro-blue-hover text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
                >
                  <Printer class="w-3.5 h-3.5" />
                  <span>{{ t('showroomPass.printPass') }}</span>
                </button>

                <button
                  type="button"
                  @click="handleCopyCode"
                  class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-100 text-xs font-bold text-neutral-700 transition-all cursor-pointer"
                >
                  <Copy class="w-3.5 h-3.5" />
                  <span>{{ isCopied ? t('showroomPass.copied') : t('showroomPass.copyLink') }}</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Target Showroom Selection -->
          <div class="space-y-2">
            <label class="block text-xs font-bold text-neutral-800 uppercase tracking-wider">
              {{ t('showroomPass.preferredShowroom') }}
            </label>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 print:hidden">
              <button
                v-for="loc in SHOWROOM_LOCATIONS"
                :key="loc.id"
                type="button"
                @click="handleShowroomChange(loc.id)"
                class="p-3 rounded-2xl border text-left transition-all cursor-pointer"
                :class="activeShowroomPass.showroom.id === loc.id
                  ? 'border-maxaro-blue bg-maxaro-blue-light/50 ring-2 ring-maxaro-blue/40 text-neutral-900 shadow-xs'
                  : 'border-neutral-200 bg-neutral-50/70 hover:bg-neutral-100 text-neutral-700'"
              >
                <div class="flex items-center justify-between">
                  <span class="font-bold text-xs">{{ loc.city }}</span>
                  <span v-if="loc.isFlagship" class="text-[9px] uppercase font-bold text-maxaro-blue bg-white px-1.5 py-0.5 rounded-full border border-maxaro-blue/20">
                    Flagship
                  </span>
                </div>
                <div class="text-[11px] text-neutral-500 mt-1 truncate">{{ loc.address }}</div>
                <div class="text-[10px] text-trust-green font-medium mt-0.5">{{ loc.openingHoursToday }}</div>
              </button>
            </div>

            <!-- Print View Showroom Details -->
            <div class="hidden print:block p-3 border rounded-xl text-xs space-y-1">
              <p class="font-bold">{{ activeShowroomPass.showroom.name }}</p>
              <p>{{ activeShowroomPass.showroom.address }}, {{ activeShowroomPass.showroom.postalCode }}</p>
              <p>{{ t('showroomPass.phoneLabel') }} {{ activeShowroomPass.showroom.phone }} • {{ t('showroomPass.openingHoursLabel') }} {{ activeShowroomPass.showroom.openingHoursToday }}</p>
            </div>
          </div>

          <!-- Configured Products Summary -->
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <h4 class="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                {{ t('showroomPass.itemsTitle', { count: activeShowroomPass.totals.itemCount }) }}
              </h4>
              <span class="text-xs text-neutral-500 font-mono">
                {{ t('cart.subtotal') }}: {{ formatEuro(activeShowroomPass.totals.subtotal) }}
              </span>
            </div>

            <div class="divide-y divide-neutral-200 rounded-2xl border border-neutral-200 overflow-hidden bg-white text-xs">
              <div
                v-for="item in activeShowroomPass.items"
                :key="item.id"
                class="p-3 sm:p-4 flex items-center justify-between gap-3"
              >
                <div class="flex items-center gap-3 min-w-0">
                  <img
                    :src="item.imageThumbnail"
                    :alt="item.name"
                    class="w-12 h-12 object-cover rounded-xl border border-neutral-200 shrink-0"
                  />
                  <div class="min-w-0 space-y-0.5">
                    <p class="font-bold text-neutral-900 truncate leading-tight">{{ item.name }}</p>
                    <div class="flex items-center gap-2 text-[11px] text-neutral-500">
                      <span class="font-mono">{{ item.sku }}</span>
                      <span>•</span>
                      <span>{{ t('product.colorFinish') }} <strong>{{ item.finish }}</strong></span>
                      <span>•</span>
                      <span>{{ t('showroomPass.quantityLabel') }} <strong>{{ item.quantity }}x</strong></span>
                    </div>
                  </div>
                </div>

                <div class="text-right shrink-0">
                  <span class="font-mono font-bold text-neutral-900">{{ formatEuro(item.totalPrice) }}</span>
                  <span v-if="item.quantity > 1" class="block text-[10px] text-neutral-400 font-mono">
                    {{ t('cart.unitPriceRate', { price: formatEuro(item.unitPrice) }) }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Price Breakdown Summary -->
            <div class="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-1.5 text-xs">
              <div class="flex justify-between text-neutral-600">
                <span>{{ t('showroomPass.subtotalExclVat') }}</span>
                <span class="font-mono">{{ formatEuro(activeShowroomPass.totals.subtotal - activeShowroomPass.totals.vatAmount) }}</span>
              </div>
              <div class="flex justify-between text-neutral-600">
                <span>{{ t('showroomPass.vatLabel') }}</span>
                <span class="font-mono">{{ formatEuro(activeShowroomPass.totals.vatAmount) }}</span>
              </div>
              <div class="flex justify-between font-black text-sm text-neutral-900 pt-2 border-t border-neutral-200/80">
                <span>{{ t('showroomPass.totalPriceInclVat') }}</span>
                <span class="font-mono text-base text-neutral-900">{{ formatEuro(activeShowroomPass.totals.total) }}</span>
              </div>
            </div>
          </div>

          <!-- Verkoopadviseur Notice & Guarantee -->
          <div class="p-4 rounded-2xl bg-trust-greenBg border border-trust-green/20 flex items-start gap-3">
            <ShieldCheck class="w-5 h-5 text-trust-green shrink-0 mt-0.5" />
            <div class="space-y-1 text-xs">
              <p class="font-bold text-neutral-900">{{ t('showroomPass.guaranteeTitle') }}</p>
              <p class="text-neutral-600 leading-relaxed text-[11px]">
                {{ t('showroomPass.guaranteeDesc') }}
              </p>
            </div>
          </div>
        </div>

        <!-- Modal Footer Actions -->
        <div class="p-4 sm:p-5 bg-neutral-50 border-t border-neutral-200 flex items-center justify-between gap-3 print:hidden">
          <span class="text-xs text-neutral-500 hidden sm:inline-flex items-center gap-1.5">
            <Info class="w-3.5 h-3.5 text-neutral-400" />
            <span>{{ t('showroomPass.reservedNote') }}</span>
          </span>

          <div class="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              @click="closeModal"
              class="flex-1 sm:flex-none py-2.5 px-5 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-100 text-xs font-bold text-neutral-700 transition-colors cursor-pointer"
            >
              {{ t('cartDrawer.continueShopping') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
@media print {
  body {
    background-color: white !important;
    color: black !important;
  }
}
</style>
