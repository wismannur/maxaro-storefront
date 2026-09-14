<!-- app/components/cart/CheckoutHandshakeModal.vue -->
<script setup lang="ts">
import { useCartStore } from '~~/app/stores/cartStore';
import { useCurrency } from '~~/app/composables/useCurrency';
import { useLocale } from '~~/app/composables/useLocale';
import { storeToRefs } from 'pinia';
import QRCode from 'qrcode';
import {
  DUTCH_BANKS,
  type PaymentMethodId,
  type DeliveryMethodId,
  type DutchBankOption,
} from '~~/shared/types';
import {
  CheckCircle2,
  Zap,
  ShieldCheck,
  CreditCard,
  X,
  FileCode2,
  RefreshCw,
  Truck,
  Building2,
  ArrowRight,
  QrCode,
  Calendar,
  Printer,
  Copy,
  Check,
  Smartphone,
  Layers,
  Sparkles,
} from 'lucide-vue-next';

const cartStore = useCartStore();
const { lastHandshake, isCheckoutModalOpen } = storeToRefs(cartStore);
const { formatEuro } = useCurrency();
const { t, currentLocale } = useLocale();

// Steps: 'review' -> 'authorizing' -> 'confirmed'
const checkoutStage = ref<'review' | 'authorizing' | 'confirmed'>('review');

// Payment selections
const selectedPaymentMethod = ref<PaymentMethodId>('ideal');
const selectedBankId = ref<string>('rabobank');
const showIdealQr = ref(false);
const idealQrDataUrl = ref('');

// Delivery selections
const selectedDeliveryMethod = ref<DeliveryMethodId>('express');
const scheduledDaysAhead = ref(7);

// Authorizing animation steps
const authStep = ref(1);

// Confirmed order data
const confirmedOrderNumber = ref('');
const confirmedTrackingCode = ref('');
const confirmedDeliveryDate = ref('');
const paidAmount = ref(0);
const copiedCode = ref(false);

const selectedBank = computed<DutchBankOption | undefined>(() => {
  return DUTCH_BANKS.find(b => b.id === selectedBankId.value) || DUTCH_BANKS[0];
});

// Calculate in3 installments
const in3Installments = computed(() => {
  const total = lastHandshake.value?.totals.total || 0;
  const part1 = Math.round((total / 3) * 100) / 100;
  const part2 = Math.round((total / 3) * 100) / 100;
  const part3 = Number((total - part1 - part2).toFixed(2));
  return [
    { term: 1, label: t('checkoutModal.in3Installment1'), amount: part1 },
    { term: 2, label: t('checkoutModal.in3Installment2'), amount: part2 },
    { term: 3, label: t('checkoutModal.in3Installment3'), amount: part3 },
  ];
});

const in3FirstTermAmount = computed(() => in3Installments.value[0]?.amount ?? 0);

// Scheduled delivery date text
const scheduledDateLabel = computed(() => {
  const date = new Date();
  date.setDate(date.getDate() + scheduledDaysAhead.value);
  const localeStr = currentLocale.value === 'nl' ? 'nl-NL' : currentLocale.value === 'de' ? 'de-DE' : currentLocale.value === 'fr' ? 'fr-FR' : 'en-GB';
  return date.toLocaleDateString(localeStr, {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
  });
});

// Generate iDEAL 2.0 QR Code
async function generateIdealQr() {
  if (!lastHandshake.value) return;
  try {
    const payload = `ideal://pay?amount=${lastHandshake.value.totals.total}&currency=EUR&ref=${lastHandshake.value.sessionToken}&bic=${selectedBankId.value}`;
    idealQrDataUrl.value = await QRCode.toDataURL(payload, {
      margin: 1,
      width: 190,
      color: {
        dark: '#002B49',
        light: '#FFFFFF',
      },
    });
  } catch (err) {
    console.error('Failed to generate iDEAL QR', err);
  }
}

watch(showIdealQr, (val) => {
  if (val) generateIdealQr();
});

watch(selectedBankId, () => {
  if (showIdealQr.value) generateIdealQr();
});

function closeModal() {
  isCheckoutModalOpen.value = false;
  setTimeout(() => {
    checkoutStage.value = 'review';
    authStep.value = 1;
    showIdealQr.value = false;
    copiedCode.value = false;
  }, 250);
}

function startPayment() {
  if (!lastHandshake.value) return;

  paidAmount.value = lastHandshake.value.totals.total;
  confirmedOrderNumber.value = lastHandshake.value.orderNumberPreview || `MAX-2026-${Math.floor(10000 + Math.random() * 90000)}`;
  confirmedTrackingCode.value = lastHandshake.value.trackingCodePreview || `TRK-NL-${Math.floor(10000 + Math.random() * 90000)}-MX`;
  
  if (selectedDeliveryMethod.value === 'express') {
    confirmedDeliveryDate.value = lastHandshake.value.deliverySlotInfo?.estimatedDate || t('checkoutModal.expressDeliveryTitle');
  } else if (selectedDeliveryMethod.value === 'scheduled') {
    confirmedDeliveryDate.value = scheduledDateLabel.value;
  } else {
    confirmedDeliveryDate.value = t('checkoutModal.deliveryPickup');
  }

  // Move to authorizing screen
  checkoutStage.value = 'authorizing';
  authStep.value = 1;

  const umami = useUmami();
  umami.track('submit_payment', {
    payment_method: selectedPaymentMethod.value,
    bank: selectedBankId.value,
    delivery_method: selectedDeliveryMethod.value,
    total: paidAmount.value,
    currency: 'EUR',
  });

  // Realistic bank network progression (1.2s total)
  setTimeout(() => {
    authStep.value = 2;
  }, 400);

  setTimeout(() => {
    authStep.value = 3;
  }, 850);

  setTimeout(() => {
    checkoutStage.value = 'confirmed';
    umami.track('purchase', {
      order_id: confirmedOrderNumber.value,
      total: paidAmount.value,
      currency: 'EUR',
      payment_method: selectedPaymentMethod.value,
      delivery_method: selectedDeliveryMethod.value,
    });
    cartStore.clearCart();
  }, 1300);
}

async function copyTracking() {
  try {
    await navigator.clipboard.writeText(confirmedTrackingCode.value);
    copiedCode.value = true;
    setTimeout(() => {
      copiedCode.value = false;
    }, 2000);
  } catch {
    // fallback
  }
}

function handlePrintInvoice() {
  window.print();
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && isCheckoutModalOpen.value && checkoutStage.value !== 'authorizing') {
    closeModal();
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
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
      v-if="isCheckoutModalOpen && lastHandshake"
      class="fixed inset-0 z-[150] bg-neutral-950/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto print:p-0 print:bg-white print:static"
      role="dialog"
      aria-modal="true"
      @click.self="checkoutStage !== 'authorizing' && closeModal()"
    >
      <div class="w-full max-w-xl sm:max-w-2xl bg-white rounded-3xl shadow-2xl border border-neutral-200/90 overflow-hidden space-y-0 my-4 sm:my-6 print:shadow-none print:border-none print:rounded-none transition-all">
        
        <!-- ================= STAGE 1: SELECTION & REVIEW ================= -->
        <template v-if="checkoutStage === 'review'">
          <!-- Header -->
          <div class="relative bg-gradient-to-r from-neutral-950 via-maxaro-blue to-neutral-900 text-white p-6 sm:p-7 overflow-hidden">
            <!-- Ambient Glow -->
            <div class="absolute -top-20 -right-20 w-48 h-48 bg-emerald-400/15 rounded-full blur-3xl pointer-events-none" />
            <div class="absolute -bottom-20 -left-20 w-48 h-48 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

            <div class="relative z-10 flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="p-2.5 rounded-2xl bg-white/10 text-white backdrop-blur-md border border-white/15 shadow-xs">
                  <CheckCircle2 class="w-6 h-6 text-trust-green" />
                </div>
                <div>
                  <div class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/15 text-[10px] font-bold text-trust-green uppercase tracking-wider font-mono mb-1">
                    <Sparkles class="w-3 h-3" />
                    <span>Nitro Edge Protocol</span>
                  </div>
                  <h3 class="font-black text-lg sm:text-xl text-white leading-tight">
                    {{ t('checkoutModal.handshakeTitle') }}
                  </h3>
                  <p class="text-xs text-neutral-300">
                    {{ t('checkoutModal.handshakeSubtitle') }}
                  </p>
                </div>
              </div>
              <button
                type="button"
                @click="closeModal"
                class="text-neutral-400 hover:text-white p-2 rounded-xl hover:bg-white/10 transition-colors cursor-pointer border border-white/10"
                :aria-label="t('checkoutModal.cancel')"
              >
                <X class="w-5 h-5" />
              </button>
            </div>

            <!-- Benchmark Telemetry Badges -->
            <div class="relative z-10 grid grid-cols-2 gap-3 mt-5">
              <div class="bg-white/10 rounded-2xl p-3 border border-white/15 backdrop-blur-md">
                <div class="flex items-center gap-1.5 text-trust-green text-[11px] font-bold">
                  <Zap class="w-3.5 h-3.5 fill-trust-green" />
                  <span>{{ t('checkoutModal.edgeVerification') }}</span>
                </div>
                <div class="text-lg font-mono font-black mt-0.5 text-white">
                  {{ lastHandshake.preparationTimeMs }} ms
                </div>
                <div class="text-[10px] text-neutral-300">{{ t('checkoutModal.edgeLatencyNote') }}</div>
              </div>

              <div class="bg-white/10 rounded-2xl p-3 border border-white/15 backdrop-blur-md">
                <div class="flex items-center gap-1.5 text-amber-300 text-[11px] font-bold">
                  <FileCode2 class="w-3.5 h-3.5" />
                  <span>{{ t('checkoutModal.payloadDto') }}</span>
                </div>
                <div class="text-lg font-mono font-black mt-0.5 text-white">
                  {{ (lastHandshake.payloadSizeBytes / 1024).toFixed(2) }} KB
                </div>
                <div class="text-[10px] text-neutral-300">{{ t('checkoutModal.payloadDtoNote') }}</div>
              </div>
            </div>
          </div>

          <!-- Body -->
          <div class="p-5 sm:p-6 space-y-5 text-xs">
            <!-- 1. Delivery Options -->
            <div class="space-y-2">
              <label class="block font-bold text-neutral-800 text-xs">
                {{ t('checkoutModal.deliveryPreference') }}
              </label>
              
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <!-- Express -->
                <button
                  type="button"
                  @click="selectedDeliveryMethod = 'express'"
                  class="p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between"
                  :class="selectedDeliveryMethod === 'express' ? 'border-trust-green bg-trust-greenBg ring-1 ring-trust-green' : 'border-neutral-200 hover:border-neutral-300 bg-white'"
                >
                  <div class="flex items-center justify-between mb-1">
                    <Truck class="w-4 h-4" :class="selectedDeliveryMethod === 'express' ? 'text-trust-green' : 'text-neutral-500'" />
                    <span class="text-[10px] font-black uppercase text-trust-green px-1.5 py-0.2 rounded bg-trust-green/10">{{ t('checkoutModal.freeBadge') }}</span>
                  </div>
                  <div class="font-bold text-neutral-900 text-xs leading-tight">{{ t('checkoutModal.expressDeliveryTitle') }}</div>
                  <div class="text-[10px] text-neutral-500 mt-0.5">{{ t('checkoutModal.expressDeliveryDesc') }}</div>
                </button>

                <!-- Scheduled -->
                <button
                  type="button"
                  @click="selectedDeliveryMethod = 'scheduled'"
                  class="p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between"
                  :class="selectedDeliveryMethod === 'scheduled' ? 'border-maxaro-blue bg-blue-50/60 ring-1 ring-maxaro-blue' : 'border-neutral-200 hover:border-neutral-300 bg-white'"
                >
                  <div class="flex items-center justify-between mb-1">
                    <Calendar class="w-4 h-4" :class="selectedDeliveryMethod === 'scheduled' ? 'text-maxaro-blue' : 'text-neutral-500'" />
                    <span class="text-[10px] font-bold text-neutral-500">{{ t('checkoutModal.flexibleBadge') }}</span>
                  </div>
                  <div class="font-bold text-neutral-900 text-xs leading-tight">{{ t('checkoutModal.scheduledDeliveryTitle') }}</div>
                  <div class="text-[10px] text-neutral-500 mt-0.5">{{ t('checkoutModal.scheduledDeliveryDesc') }}</div>
                </button>

                <!-- Showroom Pickup -->
                <button
                  type="button"
                  @click="selectedDeliveryMethod = 'pickup'"
                  class="p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between"
                  :class="selectedDeliveryMethod === 'pickup' ? 'border-maxaro-accent bg-orange-50/60 ring-1 ring-maxaro-accent' : 'border-neutral-200 hover:border-neutral-300 bg-white'"
                >
                  <div class="flex items-center justify-between mb-1">
                    <Building2 class="w-4 h-4" :class="selectedDeliveryMethod === 'pickup' ? 'text-maxaro-accent' : 'text-neutral-500'" />
                    <span class="text-[10px] font-bold text-neutral-500">{{ t('checkoutModal.twoHoursBadge') }}</span>
                  </div>
                  <div class="font-bold text-neutral-900 text-xs leading-tight">{{ t('checkoutModal.pickupDeliveryTitle') }}</div>
                  <div class="text-[10px] text-neutral-500 mt-0.5">{{ t('checkoutModal.pickupDeliveryDesc') }}</div>
                </button>
              </div>

              <!-- Scheduled date selector sub-panel -->
              <div v-if="selectedDeliveryMethod === 'scheduled'" class="p-3 bg-blue-50/50 rounded-xl border border-blue-100 flex items-center justify-between gap-3">
                <div>
                  <div class="text-[11px] font-bold text-maxaro-blue">{{ t('checkoutModal.chosenDeliveryDate') }}</div>
                  <div class="text-xs font-black text-neutral-800 capitalize">{{ scheduledDateLabel }}</div>
                </div>
                <div class="flex items-center gap-1.5">
                  <button
                    type="button"
                    @click="scheduledDaysAhead = 7"
                    class="px-2 py-1 rounded-lg text-[10px] font-bold border transition-colors cursor-pointer"
                    :class="scheduledDaysAhead === 7 ? 'bg-maxaro-blue text-white border-maxaro-blue' : 'bg-white text-neutral-700 border-neutral-200'"
                  >
                    {{ t('checkoutModal.plusOneWeek') }}
                  </button>
                  <button
                    type="button"
                    @click="scheduledDaysAhead = 14"
                    class="px-2 py-1 rounded-lg text-[10px] font-bold border transition-colors cursor-pointer"
                    :class="scheduledDaysAhead === 14 ? 'bg-maxaro-blue text-white border-maxaro-blue' : 'bg-white text-neutral-700 border-neutral-200'"
                  >
                    {{ t('checkoutModal.plusTwoWeeks') }}
                  </button>
                  <button
                    type="button"
                    @click="scheduledDaysAhead = 30"
                    class="px-2 py-1 rounded-lg text-[10px] font-bold border transition-colors cursor-pointer"
                    :class="scheduledDaysAhead === 30 ? 'bg-maxaro-blue text-white border-maxaro-blue' : 'bg-white text-neutral-700 border-neutral-200'"
                  >
                    {{ t('checkoutModal.plusOneMonth') }}
                  </button>
                </div>
              </div>
            </div>

            <!-- 2. Payment Method Tabs -->
            <div class="space-y-2.5">
              <label class="block font-bold text-neutral-800 text-xs">
                {{ t('checkoutModal.choosePaymentMethod') }}
              </label>

              <!-- Method Tabs -->
              <div class="grid grid-cols-4 gap-1.5 p-1 bg-neutral-100 rounded-xl border border-neutral-200">
                <button
                  type="button"
                  @click="selectedPaymentMethod = 'ideal'"
                  class="py-2 px-1.5 rounded-lg text-center font-bold text-[11px] transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5"
                  :class="selectedPaymentMethod === 'ideal' ? 'bg-white text-maxaro-blue shadow-xs font-black' : 'text-neutral-600 hover:text-neutral-900'"
                >
                  <span class="inline-block w-2.5 h-2.5 rounded-full bg-[#CC0066] mb-0.5" />
                  <span>iDEAL 2.0</span>
                </button>

                <button
                  type="button"
                  @click="selectedPaymentMethod = 'bancontact'"
                  class="py-2 px-1.5 rounded-lg text-center font-bold text-[11px] transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5"
                  :class="selectedPaymentMethod === 'bancontact' ? 'bg-white text-maxaro-blue shadow-xs font-black' : 'text-neutral-600 hover:text-neutral-900'"
                >
                  <span class="inline-block w-2.5 h-2.5 rounded-full bg-[#00559F] mb-0.5" />
                  <span>Bancontact</span>
                </button>

                <button
                  type="button"
                  @click="selectedPaymentMethod = 'in3'"
                  class="py-2 px-1.5 rounded-lg text-center font-bold text-[11px] transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5"
                  :class="selectedPaymentMethod === 'in3' ? 'bg-white text-maxaro-blue shadow-xs font-black' : 'text-neutral-600 hover:text-neutral-900'"
                >
                  <span class="inline-block w-2.5 h-2.5 rounded-full bg-emerald-600 mb-0.5" />
                  <span>in3 (0%)</span>
                </button>

                <button
                  type="button"
                  @click="selectedPaymentMethod = 'klarna'"
                  class="py-2 px-1.5 rounded-lg text-center font-bold text-[11px] transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5"
                  :class="selectedPaymentMethod === 'klarna' ? 'bg-white text-maxaro-blue shadow-xs font-black' : 'text-neutral-600 hover:text-neutral-900'"
                >
                  <span class="inline-block w-2.5 h-2.5 rounded-full bg-[#FFB3C7] mb-0.5" />
                  <span>Klarna</span>
                </button>
              </div>

              <!-- iDEAL 2.0 Subview: Dutch Bank Selector -->
              <div v-if="selectedPaymentMethod === 'ideal'" class="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-3">
                <div class="flex items-center justify-between">
                  <span class="text-[11px] font-bold text-neutral-700">{{ t('checkoutModal.chooseBank') }}</span>
                  <button
                    type="button"
                    @click="showIdealQr = !showIdealQr"
                    class="text-[10px] font-bold text-maxaro-blue hover:underline inline-flex items-center gap-1 cursor-pointer"
                  >
                    <QrCode class="w-3.5 h-3.5 text-maxaro-accent" />
                    <span>{{ showIdealQr ? t('checkoutModal.chooseBankText') : t('checkoutModal.showIdealQr') }}</span>
                  </button>
                </div>

                <!-- QR Mode -->
                <div v-if="showIdealQr" class="p-4 bg-white rounded-xl border border-neutral-200 text-center space-y-2">
                  <div class="inline-block p-2 bg-white rounded-xl shadow-xs border border-neutral-200">
                    <img v-if="idealQrDataUrl" :src="idealQrDataUrl" alt="iDEAL QR Code" class="w-36 h-36 mx-auto" />
                  </div>
                  <p class="text-[11px] text-neutral-600 font-medium">
                    {{ t('checkoutModal.scanQrWithApp') }}
                  </p>
                </div>

                <!-- Bank Buttons Grid -->
                <div v-else class="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    v-for="bank in DUTCH_BANKS"
                    :key="bank.id"
                    type="button"
                    @click="selectedBankId = bank.id"
                    class="py-2.5 px-2 rounded-xl border text-center font-bold text-[11px] transition-all cursor-pointer flex items-center justify-center gap-1.5 relative"
                    :class="selectedBankId === bank.id ? 'bg-white border-maxaro-blue shadow-xs text-neutral-900 ring-2 ring-maxaro-blue/20' : 'bg-white border-neutral-200 text-neutral-700 hover:border-neutral-300'"
                  >
                    <span
                      class="w-2 h-2 rounded-full shrink-0"
                      :style="{ backgroundColor: bank.badgeColor }"
                    />
                    <span class="truncate">{{ bank.name }}</span>
                    <span
                      v-if="bank.popular && selectedBankId === bank.id"
                      class="absolute -top-1.5 -right-1 px-1 py-0.2 bg-trust-green text-white text-[8px] font-black rounded-full"
                    >
                      ✓
                    </span>
                  </button>
                </div>
              </div>

              <!-- Bancontact Subview -->
              <div v-else-if="selectedPaymentMethod === 'bancontact'" class="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-2">
                <div class="flex items-center gap-2">
                  <div class="w-6 h-6 rounded-lg bg-[#00559F] text-white flex items-center justify-center font-black text-[10px]">
                    BC
                  </div>
                  <div class="font-bold text-neutral-900 text-xs">Bancontact / Payconiq</div>
                </div>
                <p class="text-[11px] text-neutral-600 leading-relaxed">
                  {{ t('checkoutModal.bancontactNote') }}
                </p>
              </div>

              <!-- in3 Subview -->
              <div v-else-if="selectedPaymentMethod === 'in3'" class="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-200 space-y-3">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <span class="px-2 py-0.5 rounded-full bg-emerald-600 text-white font-black text-[10px]">in3</span>
                    <span class="font-bold text-neutral-900 text-xs">{{ t('checkoutModal.in3Title') }}</span>
                  </div>
                  <span class="text-[10px] font-black text-emerald-700 uppercase">{{ t('checkoutModal.zeroInterestBadge') }}</span>
                </div>

                <div class="grid grid-cols-3 gap-2">
                  <div
                    v-for="inst in in3Installments"
                    :key="inst.term"
                    class="p-2.5 bg-white rounded-xl border border-emerald-100 text-center"
                  >
                    <div class="text-[9px] font-bold text-neutral-500 uppercase">{{ t('checkoutModal.termNumber', { term: inst.term }) }}</div>
                    <div class="text-xs font-black text-emerald-800 mt-0.5">{{ formatEuro(inst.amount) }}</div>
                    <div class="text-[9px] text-neutral-400 mt-0.5">{{ inst.term === 1 ? t('checkoutModal.todayLabel') : inst.term === 2 ? t('checkoutModal.after30DaysLabel') : t('checkoutModal.after60DaysLabel') }}</div>
                  </div>
                </div>

                <div class="flex items-center gap-1.5 text-[10px] text-emerald-800 font-bold justify-center pt-0.5">
                  <ShieldCheck class="w-3.5 h-3.5 text-emerald-600" />
                  <span>{{ t('checkoutModal.in3NoBkr') }}</span>
                </div>
              </div>

              <!-- Klarna Subview -->
              <div v-else-if="selectedPaymentMethod === 'klarna'" class="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-2">
                <div class="flex items-center gap-2">
                  <div class="w-6 h-6 rounded-lg bg-[#FFB3C7] text-neutral-900 flex items-center justify-center font-black text-[10px]">
                    K.
                  </div>
                  <div class="font-bold text-neutral-900 text-xs">{{ t('checkoutModal.klarnaTitle') }}</div>
                </div>
                <p class="text-[11px] text-neutral-600 leading-relaxed">
                  {{ t('checkoutModal.klarnaDesc') }}
                </p>
              </div>
            </div>

            <!-- 3. Totals Breakdown Card -->
            <div class="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-2">
              <div class="flex justify-between items-center text-neutral-500">
                <span>{{ t('checkoutModal.subtotalLabel') }}</span>
                <span class="font-bold text-neutral-800">{{ formatEuro(lastHandshake.totals.subtotal) }}</span>
              </div>
              <div class="flex justify-between items-center text-neutral-500">
                <span>{{ t('checkoutModal.vatLabel') }}</span>
                <span class="font-medium text-neutral-600">{{ formatEuro(lastHandshake.totals.vatAmount) }}</span>
              </div>
              <div class="flex justify-between items-center text-neutral-500">
                <span>{{ t('checkoutModal.shippingCarrierLabel') }}</span>
                <span class="font-bold text-trust-green uppercase text-[11px]">{{ t('checkoutModal.freeBadge') }}</span>
              </div>
              <div class="flex justify-between items-center border-t border-neutral-200 pt-2 text-sm font-black text-neutral-900">
                <span>{{ t('checkoutModal.totalToPay') }}</span>
                <span class="text-base text-maxaro-blue">{{ formatEuro(lastHandshake.totals.total) }}</span>
              </div>
            </div>

            <div class="flex items-center gap-2 text-neutral-500 text-[11px]">
              <ShieldCheck class="w-4 h-4 text-trust-green shrink-0" />
              <span>{{ t('checkoutModal.securityNote') }}</span>
            </div>
          </div>

          <!-- Footer Actions -->
          <div class="p-4 bg-neutral-50 border-t border-neutral-200 flex items-center gap-3">
            <button
              type="button"
              @click="closeModal"
              class="py-3 px-4 rounded-xl border border-neutral-200 bg-white text-xs font-bold text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
            >
              {{ t('checkoutModal.cancel') }}
            </button>
            <button
              type="button"
              @click="startPayment"
              class="flex-1 py-3.5 px-4 rounded-xl bg-trust-green hover:bg-emerald-600 text-white text-xs font-black transition-all shadow-md flex items-center justify-center gap-2 text-center cursor-pointer active:scale-98"
            >
              <CreditCard class="w-4 h-4" />
              <span>
                {{ t('checkoutModal.payButton') }} {{ formatEuro(selectedPaymentMethod === 'in3' ? in3FirstTermAmount : lastHandshake.totals.total) }}
              </span>
              <ArrowRight class="w-4 h-4" />
            </button>
          </div>
        </template>

        <!-- ================= STAGE 2: AUTHORIZING HANDSHAKE ANIMATION ================= -->
        <template v-else-if="checkoutStage === 'authorizing'">
          <div class="relative p-8 sm:p-12 text-center space-y-6 overflow-hidden bg-gradient-to-b from-white to-neutral-50/50">
            <div class="relative w-24 h-24 mx-auto flex items-center justify-center">
              <div class="absolute inset-0 rounded-full border-4 border-neutral-100 border-t-maxaro-blue animate-spin" />
              <div class="absolute -inset-2 rounded-full bg-maxaro-blue/5 blur-xl animate-pulse" />
              <div class="w-14 h-14 rounded-2xl bg-maxaro-blue/10 border border-maxaro-blue/20 flex items-center justify-center text-maxaro-blue font-black text-sm shadow-xs">
                <template v-if="selectedPaymentMethod === 'ideal'">
                  {{ selectedBank?.shortName || 'iDEAL' }}
                </template>
                <template v-else-if="selectedPaymentMethod === 'bancontact'">
                  BC
                </template>
                <template v-else-if="selectedPaymentMethod === 'in3'">
                  in3
                </template>
                <template v-else>
                  <CreditCard class="w-7 h-7 text-maxaro-blue" />
                </template>
              </div>
            </div>

            <div class="space-y-1.5">
              <h3 class="font-black text-xl text-neutral-900">
                {{ t('checkoutModal.authorizingBank', { bank: selectedPaymentMethod === 'ideal' ? (selectedBank?.name || 'iDEAL') : 'Bank' }) }}
              </h3>
              <p class="text-xs text-neutral-500">
                {{ t('checkoutModal.authorizingNote') }}
              </p>
            </div>

            <!-- Progression checklist -->
            <div class="max-w-md mx-auto bg-white p-5 rounded-3xl border border-neutral-200/90 shadow-xs text-left space-y-3 text-xs">
              <div class="flex items-center gap-3">
                <CheckCircle2 class="w-4 h-4 text-trust-green shrink-0" />
                <span class="text-neutral-800 font-semibold">{{ t('checkoutModal.stepHandshake1') }}</span>
              </div>
              <div class="flex items-center gap-3">
                <CheckCircle2 v-if="authStep >= 2" class="w-4 h-4 text-trust-green shrink-0 animate-scale-in" />
                <RefreshCw v-else class="w-4 h-4 text-neutral-400 shrink-0 animate-spin" />
                <span :class="authStep >= 2 ? 'text-neutral-800 font-semibold' : 'text-neutral-400'">
                  {{ t('checkoutModal.stepHandshake2') }}
                </span>
              </div>
              <div class="flex items-center gap-3">
                <CheckCircle2 v-if="authStep >= 3" class="w-4 h-4 text-trust-green shrink-0 animate-scale-in" />
                <RefreshCw v-else-if="authStep >= 2" class="w-4 h-4 text-neutral-400 shrink-0 animate-spin" />
                <div v-else class="w-4 h-4 rounded-full border border-neutral-300 shrink-0" />
                <span :class="authStep >= 3 ? 'text-neutral-800 font-semibold' : 'text-neutral-400'">
                  {{ t('checkoutModal.stepHandshake3') }}
                </span>
              </div>
            </div>
          </div>
        </template>

        <!-- ================= STAGE 3: CONFIRMED ORDER ================= -->
        <template v-else-if="checkoutStage === 'confirmed'">
          <!-- Success Header -->
          <div class="relative bg-gradient-to-r from-emerald-800 via-trust-green to-emerald-700 text-white p-6 sm:p-7 relative print:bg-none print:text-neutral-900 print:p-4 overflow-hidden">
            <!-- Ambient Glow -->
            <div class="absolute -top-16 -right-16 w-44 h-44 bg-white/10 rounded-full blur-2xl pointer-events-none" />

            <div class="relative z-10 flex items-center justify-between">
              <div class="flex items-center gap-3.5">
                <div class="p-2.5 rounded-2xl bg-white/20 text-white backdrop-blur-md border border-white/20 shadow-xs print:bg-neutral-100 print:text-neutral-900">
                  <CheckCircle2 class="w-7 h-7 text-white print:text-trust-green" />
                </div>
                <div>
                  <div class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-[10px] font-bold text-white uppercase tracking-wider font-mono mb-1">
                    <Sparkles class="w-3 h-3" />
                    <span>Bestelling Bevestigd</span>
                  </div>
                  <h3 class="font-black text-xl text-white print:text-neutral-900 leading-tight">
                    {{ t('checkoutModal.confirmedTitle') }}
                  </h3>
                  <p class="text-xs text-emerald-100 print:text-neutral-600">
                    {{ t('checkoutModal.confirmedSubtitle') }}
                  </p>
                </div>
              </div>
              <button
                type="button"
                @click="closeModal"
                class="text-white/70 hover:text-white p-2 rounded-xl hover:bg-white/10 transition-colors cursor-pointer print:hidden border border-white/10"
                :aria-label="t('checkoutModal.cancel')"
              >
                <X class="w-5 h-5" />
              </button>
            </div>
          </div>

          <!-- Order Summary Body -->
          <div class="p-5 sm:p-6 space-y-4 text-xs">
            <!-- Order Reference Card -->
            <div class="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-2.5">
              <div class="flex justify-between items-center">
                <span class="text-neutral-500 font-medium">{{ t('checkoutModal.orderNumber') }}</span>
                <span class="font-mono font-black text-neutral-900 text-xs px-2.5 py-1 rounded-lg bg-neutral-200/70">
                  {{ confirmedOrderNumber }}
                </span>
              </div>

              <!-- Track & Trace code row -->
              <div class="flex justify-between items-center">
                <span class="text-neutral-500 font-medium">{{ t('checkoutModal.trackAndTrace') }}</span>
                <div class="flex items-center gap-1.5">
                  <span class="font-mono font-bold text-maxaro-blue text-xs bg-blue-50 px-2 py-0.5 rounded border border-blue-200/60">
                    {{ confirmedTrackingCode }}
                  </span>
                  <button
                    type="button"
                    @click="copyTracking"
                    class="p-1 rounded bg-neutral-100 hover:bg-neutral-200 text-neutral-600 transition-colors cursor-pointer print:hidden"
                    :title="t('checkoutModal.copyTrackingTitle')"
                  >
                    <Check v-if="copiedCode" class="w-3.5 h-3.5 text-trust-green" />
                    <Copy v-else class="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <!-- Payment Method badge -->
              <div class="flex justify-between items-center">
                <span class="text-neutral-500 font-medium">{{ t('checkoutModal.paymentMethod') }}</span>
                <span class="font-semibold text-neutral-800 flex items-center gap-1.5">
                  <span class="w-2 h-2 rounded-full bg-trust-green" />
                  <span>
                    <template v-if="selectedPaymentMethod === 'ideal'">
                      iDEAL 2.0 ({{ selectedBank?.name }}) • {{ t('checkoutModal.paidStatus') }}
                    </template>
                    <template v-else-if="selectedPaymentMethod === 'bancontact'">
                      Bancontact (Payconiq) • {{ t('checkoutModal.paidStatus') }}
                    </template>
                    <template v-else-if="selectedPaymentMethod === 'in3'">
                      in3 ({{ t('checkoutModal.in3Installment1') }} {{ formatEuro(in3FirstTermAmount) }})
                    </template>
                    <template v-else>
                      {{ t('checkoutModal.paidStatus') }}
                    </template>
                  </span>
                </span>
              </div>

              <div class="flex justify-between items-center border-t border-neutral-200/80 pt-2">
                <span class="text-neutral-500 font-medium">{{ t('checkoutModal.totalPaid') }}</span>
                <span class="font-mono font-black text-base text-neutral-900">
                  {{ formatEuro(selectedPaymentMethod === 'in3' ? in3FirstTermAmount : paidAmount) }}
                </span>
              </div>
            </div>

            <!-- Delivery & Service Guarantee -->
            <div class="space-y-2.5 pt-1">
              <div class="flex items-start gap-3 p-3.5 rounded-xl bg-trust-greenBg border border-trust-green/20">
                <Truck class="w-5 h-5 text-trust-green shrink-0 mt-0.5" />
                <div class="space-y-0.5 text-[11px]">
                  <p class="font-bold text-neutral-900">
                    {{ t('checkoutModal.deliveryTitle') }} • {{ confirmedDeliveryDate }}
                  </p>
                  <p class="text-neutral-600">
                    {{ t('checkoutModal.deliveryDesc') }}
                  </p>
                </div>
              </div>

              <div class="flex items-start gap-3 p-3.5 rounded-xl bg-neutral-50 border border-neutral-200">
                <Building2 class="w-5 h-5 text-maxaro-blue shrink-0 mt-0.5" />
                <div class="space-y-0.5 text-[11px]">
                  <p class="font-bold text-neutral-900">{{ t('checkoutModal.serviceTitle') }}</p>
                  <p class="text-neutral-600">
                    {{ t('checkoutModal.serviceDesc') }}
                  </p>
                </div>
              </div>
            </div>

            <p class="text-[11px] text-neutral-500 text-center pt-1">
              {{ t('checkoutModal.invoiceNote') }}
            </p>
          </div>

          <!-- Actions: Print & Back to shop -->
          <div class="p-4 bg-neutral-50 border-t border-neutral-200 flex flex-col sm:flex-row items-center gap-2.5 print:hidden">
            <button
              type="button"
              @click="handlePrintInvoice"
              class="w-full sm:w-auto py-3 px-4 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-100 text-neutral-700 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Printer class="w-4 h-4" />
              <span>{{ t('checkoutModal.printInvoice') }}</span>
            </button>

            <button
              type="button"
              @click="closeModal"
              class="flex-1 w-full py-3.5 px-4 rounded-xl bg-maxaro-blue hover:bg-maxaro-blue-hover text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <span>{{ t('checkoutModal.backToShowroom') }}</span>
              <ArrowRight class="w-4 h-4" />
            </button>
          </div>
        </template>
      </div>
    </div>
  </Transition>
</template>
