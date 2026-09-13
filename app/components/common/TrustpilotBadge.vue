<script setup lang="ts">
import { Star } from 'lucide-vue-next';
import { useLocale } from '~~/app/composables/useLocale';

const { t } = useLocale();
</script>

<template>
  <div class="inline-flex items-center gap-2 rounded-lg bg-trust-greenBg px-3 py-1.5 text-xs text-neutral-800">
    <!-- Trustpilot Star Block -->
    <div class="flex items-center gap-0.5">
      <div v-for="i in 5" :key="i" class="flex h-4 w-4 items-center justify-center rounded-xs bg-trust-green text-white">
        <Star class="h-2.5 w-2.5 fill-white stroke-none" />
      </div>
    </div>
    <span class="font-bold text-neutral-900">4.6</span>
    <span class="text-neutral-600 hidden sm:inline">&bull; {{ t('trustpilot.reviewsFull') }}</span>
    <span class="text-neutral-600 sm:hidden">{{ t('trustpilot.reviewsShort') }}</span>
  </div>
</template>
