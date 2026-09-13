<script setup lang="ts">
import { Star, ShieldCheck, Heart, Quote } from 'lucide-vue-next';
import { useLocale } from '~~/app/composables/useLocale';

const { t } = useLocale();

const testimonials = [
  {
    key: 'quote1',
    authorKey: 'author1',
    locKey: 'location1',
    rating: 5,
  },
  {
    key: 'quote2',
    authorKey: 'author2',
    locKey: 'location2',
    rating: 5,
  },
  {
    key: 'quote3',
    authorKey: 'author3',
    locKey: 'location3',
    rating: 5,
  },
];
</script>

<template>
  <section class="max-w-7xl mx-auto px-4 py-14 sm:py-18">
    <!-- Header -->
    <div class="text-center max-w-3xl mx-auto space-y-2.5 mb-12">
      <div class="inline-flex items-center gap-1.5 rounded-full bg-trust-greenBg border border-trust-green/20 px-3.5 py-1 text-xs font-semibold text-trust-green shadow-xs">
        <Star class="w-3.5 h-3.5 fill-trust-green" />
        <span class="font-mono text-[11px] uppercase tracking-wider">{{ t('testimonials.badge') }}</span>
      </div>
      <h2 class="text-2xl sm:text-4xl font-black text-neutral-900 tracking-tight">
        {{ t('testimonials.title') }}
      </h2>
      <p class="text-xs sm:text-sm text-neutral-600 leading-relaxed max-w-2xl mx-auto">
        {{ t('testimonials.subtitle') }}
      </p>
    </div>

    <!-- 3 Editorial Testimonial Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div
        v-for="(item, idx) in testimonials"
        :key="idx"
        class="bg-white rounded-3xl p-6 sm:p-7 border border-neutral-200/90 shadow-xs hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between text-left relative"
      >
        <div class="space-y-4">
          <!-- Stars & Verified Badge -->
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-1">
              <Star
                v-for="star in item.rating"
                :key="star"
                class="w-4 h-4 fill-trust-green text-trust-green"
              />
            </div>
            <span class="inline-flex items-center gap-1 text-[10px] font-semibold text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-full">
              <ShieldCheck class="w-3 h-3 text-trust-green" />
              <span>{{ t('testimonials.verifiedBuyer') }}</span>
            </span>
          </div>

          <!-- Quote -->
          <p class="text-xs sm:text-sm text-neutral-700 leading-relaxed italic font-normal">
            &ldquo;{{ t(`testimonials.${item.key}`) }}&rdquo;
          </p>
        </div>

        <!-- Author & Location -->
        <div class="mt-6 pt-4 border-t border-neutral-100">
          <p class="text-xs font-bold text-neutral-900 tracking-tight">
            {{ t(`testimonials.${item.authorKey}`) }}
          </p>
          <p class="text-[11px] text-neutral-500 font-mono mt-0.5">
            {{ t(`testimonials.${item.locKey}`) }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
