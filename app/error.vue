<script setup lang="ts">
import type { NuxtError } from '#app';
import { Home, ArrowLeft, RefreshCw, AlertTriangle, ShieldCheck } from 'lucide-vue-next';
import { useLocale } from '~~/app/composables/useLocale';

const props = defineProps<{
  error: NuxtError;
}>();

const { t } = useLocale();

const isDev = import.meta.dev;
const showDetails = ref(false);

const isNotFound = computed(() => props.error.statusCode === 404);

const errorTitle = computed(() => {
  if (isNotFound.value) {
    return 'Pagina niet gevonden';
  }
  return 'Er is iets misgegaan';
});

const errorDescription = computed(() => {
  if (isNotFound.value) {
    return 'Het sanitair product of de pagina die u zoekt is verplaatst, hernoemd of bestaat niet meer in onze showroom.';
  }
  return props.error.statusMessage || props.error.message || 'Onze excuses voor het ongemak. Onze systemen herstellen de verbinding direct.';
});

function handleErrorReset() {
  clearError({ redirect: '/' });
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-b from-maxaro-surface-subtle via-white to-white flex flex-col justify-between p-4 sm:p-6 text-neutral-900 font-sans">
    <!-- Header Mini Bar -->
    <header class="max-w-4xl w-full mx-auto flex items-center justify-between py-4 border-b border-maxaro-border/60">
      <NuxtLink to="/" class="font-black text-2xl tracking-tight text-maxaro-blue hover:text-maxaro-blue-hover transition-colors">
        MAXARO
      </NuxtLink>
      <span class="text-xs font-mono font-bold text-neutral-400 uppercase tracking-wider">
        Status {{ error.statusCode || 500 }}
      </span>
    </header>

    <!-- Main Error Content Card -->
    <main class="max-w-xl w-full mx-auto my-12 p-8 sm:p-10 bg-white rounded-3xl border border-neutral-200 shadow-xl text-center space-y-6">
      <div class="w-16 h-16 mx-auto rounded-3xl bg-maxaro-blue-light flex items-center justify-center text-maxaro-blue shadow-inner">
        <AlertTriangle v-if="!isNotFound" class="w-8 h-8 text-maxaro-accent" />
        <span v-else class="text-2xl font-mono font-black text-maxaro-blue">404</span>
      </div>

      <div class="space-y-2">
        <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 text-xs font-mono font-semibold text-neutral-600">
          <ShieldCheck class="w-3.5 h-3.5 text-trust-green" />
          <span>Maxaro Resilient Edge Layer</span>
        </div>
        <h1 class="text-2xl sm:text-3xl font-black tracking-tight text-neutral-900">
          {{ errorTitle }}
        </h1>
        <p class="text-sm text-neutral-600 leading-relaxed max-w-md mx-auto">
          {{ errorDescription }}
        </p>
      </div>

      <!-- Action CTAs -->
      <div class="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <button
          type="button"
          @click="handleErrorReset"
          class="w-full sm:w-auto px-6 py-3.5 bg-maxaro-blue hover:bg-maxaro-blue-hover text-white text-xs sm:text-sm font-bold rounded-2xl shadow-md transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
        >
          <Home class="w-4 h-4" />
          <span>Terug naar Showroom</span>
        </button>

        <button
          type="button"
          @click="() => refreshNuxtData()"
          class="w-full sm:w-auto px-5 py-3.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs sm:text-sm font-bold rounded-2xl transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
        >
          <RefreshCw class="w-4 h-4" />
          <span>Herlaad pagina</span>
        </button>
      </div>

      <!-- Developer Diagnostic Accordion (safe for production) -->
      <div v-if="isDev && error.stack" class="pt-4 border-t border-neutral-100 text-left">
        <button
          type="button"
          @click="showDetails = !showDetails"
          class="text-[11px] font-mono font-semibold text-neutral-500 hover:text-neutral-900 underline cursor-pointer"
        >
          {{ showDetails ? 'Verberg technische details' : 'Toon technische stacktrace (Dev mode)' }}
        </button>
        <pre
          v-if="showDetails"
          class="mt-2 p-3 bg-neutral-900 text-neutral-100 text-[10px] font-mono rounded-xl overflow-x-auto max-h-48 leading-relaxed"
        >{{ error.stack }}</pre>
      </div>
    </main>

    <!-- Footer Security Note -->
    <footer class="max-w-4xl w-full mx-auto text-center py-4 text-xs text-neutral-400">
      &copy; 2026 Maxaro B.V. &bull; Next-Gen Sub-Second Storefront Prototype
    </footer>
  </div>
</template>
