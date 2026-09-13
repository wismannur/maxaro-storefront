<script setup lang="ts">
import { ShieldCheck, Truck, RotateCcw, MapPin, Phone, Mail } from 'lucide-vue-next';
import { useLocale } from '~~/app/composables/useLocale';

const { t } = useLocale();
</script>

<template>
  <footer class="bg-maxaro-surface-subtle border-t border-maxaro-border mt-16">
    <!-- Value Propositions Matrix -->
    <div class="border-b border-maxaro-border py-8 sm:py-12">
      <div class="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="flex items-start gap-3.5">
          <div class="p-2.5 rounded-xl bg-trust-greenBg text-trust-green shrink-0">
            <ShieldCheck class="w-6 h-6" />
          </div>
          <div>
            <h4 class="text-sm font-bold text-neutral-900">{{ t('footer.warrantyTitle') }}</h4>
            <p class="text-xs text-neutral-600 mt-1">
              {{ t('footer.warrantyDesc') }}
            </p>
          </div>
        </div>

        <div class="flex items-start gap-3.5">
          <div class="p-2.5 rounded-xl bg-trust-greenBg text-trust-green shrink-0">
            <Truck class="w-6 h-6" />
          </div>
          <div>
            <h4 class="text-sm font-bold text-neutral-900">{{ t('footer.shippingTitle') }}</h4>
            <p class="text-xs text-neutral-600 mt-1">
              {{ t('footer.shippingDesc') }}
            </p>
          </div>
        </div>

        <div class="flex items-start gap-3.5">
          <div class="p-2.5 rounded-xl bg-trust-greenBg text-trust-green shrink-0">
            <MapPin class="w-6 h-6" />
          </div>
          <div>
            <h4 class="text-sm font-bold text-neutral-900">{{ t('footer.showroomTitle') }}</h4>
            <p class="text-xs text-neutral-600 mt-1">
              {{ t('footer.showroomDesc') }}
            </p>
          </div>
        </div>

        <div class="flex items-start gap-3.5">
          <div class="p-2.5 rounded-xl bg-trust-greenBg text-trust-green shrink-0">
            <RotateCcw class="w-6 h-6" />
          </div>
          <div>
            <h4 class="text-sm font-bold text-neutral-900">{{ t('footer.returnTitle') }}</h4>
            <p class="text-xs text-neutral-600 mt-1">
              {{ t('footer.returnDesc') }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Footer Information -->
    <div class="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8 sm:gap-10 text-sm">
      <!-- About Maxaro -->
      <div class="space-y-3 col-span-1 sm:col-span-2">
        <span class="font-black text-2xl tracking-tight text-maxaro-blue">MAXARO</span>
        <p class="text-xs text-neutral-600 leading-relaxed">
          {{ t('footer.aboutDesc') }}
        </p>
        <div class="pt-2">
          <div class="inline-flex items-center gap-2 rounded-lg bg-trust-greenBg px-3 py-1.5 text-xs text-neutral-800 font-semibold">
            <span class="text-trust-green font-bold">★ 4.6/5</span>
            <span>{{ t('footer.trustpilotReviews') }}</span>
          </div>
        </div>
      </div>

      <!-- Showrooms -->
      <div class="space-y-2 col-span-1 sm:col-span-2">
        <h4 class="font-bold text-neutral-900 uppercase tracking-wider text-xs">{{ t('footer.showroomsTitle') }}</h4>
        <ul class="text-xs space-y-2 text-neutral-600">
          <li class="font-medium text-neutral-800">{{ t('footer.showroomRoosendaal') }}</li>
          <li>{{ t('footer.roosendaalAddress') }}</li>
          <li class="pt-1 font-medium text-neutral-800">{{ t('footer.showroomUtrecht') }}</li>
          <li>{{ t('footer.showroomHoofddorp') }}</li>
          <li class="pt-2 text-trust-green font-semibold">{{ t('footer.open7Days') }}</li>
        </ul>
      </div>

      <!-- Customer Service -->
      <div class="space-y-2 col-span-1 sm:col-span-2">
        <h4 class="font-bold text-neutral-900 uppercase tracking-wider text-xs">{{ t('footer.customerServiceTitle') }}</h4>
        <ul class="text-xs space-y-2 text-neutral-600">
          <li class="flex items-center gap-2">
            <Phone class="w-3.5 h-3.5 text-neutral-400" />
            <span>0165 - 574 080</span>
          </li>
          <li class="flex items-center gap-2">
            <Mail class="w-3.5 h-3.5 text-neutral-400" />
            <span>klantenservice@maxaro.nl</span>
          </li>
          <li>{{ t('footer.faq') }}</li>
          <li>{{ t('footer.deliveryInstallation') }}</li>
          <li>{{ t('footer.warrantyComplaints') }}</li>
        </ul>
      </div>

      <!-- Architecture & Proof of Speed -->
      <div class="space-y-3 col-span-1 sm:col-span-2">
        <h4 class="font-bold text-neutral-900 uppercase tracking-wider text-xs">{{ t('footer.techTitle') }}</h4>
        <p class="text-xs text-neutral-500 leading-relaxed">
          {{ t('footer.techDesc') }}
        </p>
        <div class="p-3 bg-white rounded-xl border border-neutral-200 text-[11px] font-mono space-y-1">
          <div class="flex justify-between">
            <span class="text-neutral-500">Framework:</span>
            <span class="font-bold text-maxaro-blue">Nuxt 4 + Vue 3.5</span>
          </div>
          <div class="flex justify-between">
            <span class="text-neutral-500">Target LCP:</span>
            <span class="font-bold text-trust-green">&lt; 0.8s</span>
          </div>
          <div class="flex justify-between">
            <span class="text-neutral-500">Target CLS:</span>
            <span class="font-bold text-trust-green">0.00</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Copyright & Payment Security Reassurance -->
    <div class="border-t border-maxaro-border/80 py-4 text-xs text-neutral-500">
      <div class="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p>{{ t('footer.copyright', { year: new Date().getFullYear() }) }}</p>
        <div class="flex items-center gap-3 text-neutral-600 font-semibold text-[11px]">
          <span class="px-2 py-0.5 bg-white border border-neutral-200 rounded">iDEAL</span>
          <span class="px-2 py-0.5 bg-white border border-neutral-200 rounded">Bancontact</span>
          <span class="px-2 py-0.5 bg-white border border-neutral-200 rounded">Klarna</span>
          <span class="px-2 py-0.5 bg-white border border-neutral-200 rounded">Visa / MC</span>
          <span class="px-2 py-0.5 bg-white border border-neutral-200 rounded">Thuiswinkel Waarborg</span>
        </div>
      </div>
    </div>
  </footer>
</template>
