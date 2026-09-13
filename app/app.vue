<script setup lang="ts">
import CartDrawer from '~~/app/components/cart/CartDrawer.vue';
import PitchBridgeBadge from '~~/app/components/common/PitchBridgeBadge.vue';
import ScorecardModal from '~~/app/components/common/ScorecardModal.vue';
import { useLocale } from '~~/app/composables/useLocale';
import { MAXARO_SHOWROOMS } from '~~/shared/constants/showrooms';

const { currentLocale } = useLocale();
const config = useRuntimeConfig();
const route = useRoute();

const siteUrl = computed(() => config.public.siteUrl || 'https://maxaro-storefront.vercel.app');
const canonicalUrl = computed(() => `${siteUrl.value}${route.path}`);

// Global Organization & Flagship Showroom Structured Data (Schema.org JSON-LD)
const organizationSchema = computed(() => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${siteUrl.value}/#organization`,
      name: 'Maxaro B.V.',
      url: siteUrl.value,
      logo: 'https://media.maxaro.nl/product/Width800/8498/tesino-vrijstaand-bad-180x85cm-solid-surface-mat-wit-vsb11-mn.webp',
      sameAs: [
        'https://www.facebook.com/maxarobv/',
        'https://www.instagram.com/maxaro.nl/',
        'https://nl.pinterest.com/maxaronl/',
      ],
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+31-165-574080',
        contactType: 'customer service',
        areaServed: ['NL', 'BE', 'DE', 'FR'],
        availableLanguage: ['Dutch', 'German', 'French', 'English'],
      },
    },
    {
      '@type': 'HomeGoodsStore',
      '@id': `${siteUrl.value}/#showroom-roosendaal`,
      name: 'Maxaro Flagship Showroom Roosendaal (5.000 m²)',
      image: 'https://media.maxaro.nl/product/Width800/8498/tesino-vrijstaand-bad-180x85cm-solid-surface-mat-wit-vsb11-mn.webp',
      telephone: '0165 - 574 080',
      priceRange: '€€€',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Rucphensebaan 17',
        addressLocality: 'Roosendaal',
        postalCode: '4706 PH',
        addressCountry: 'NL',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 51.5284,
        longitude: 4.4754,
      },
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
          opens: '09:00',
          closes: '18:00',
        },
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Sunday'],
          opens: '11:00',
          closes: '17:00',
        },
      ],
    },
  ],
}));

// Global app entrypoint
useHead({
  htmlAttrs: {
    lang: computed(() => currentLocale.value || 'nl'),
  },
  titleTemplate: (titleChunk) => {
    return titleChunk && !titleChunk.includes('Maxaro')
      ? `${titleChunk} | Maxaro`
      : 'Maxaro — Maximaal Geslaagd in Sanitair & Tegels';
  },
  link: [
    { rel: 'canonical', href: canonicalUrl },
    { rel: 'alternate', hreflang: 'nl', href: canonicalUrl },
    { rel: 'alternate', hreflang: 'de', href: canonicalUrl },
    { rel: 'alternate', hreflang: 'fr', href: canonicalUrl },
    { rel: 'alternate', hreflang: 'en', href: canonicalUrl },
    { rel: 'alternate', hreflang: 'x-default', href: canonicalUrl },
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify(organizationSchema.value),
    },
  ],
});
</script>

<template>
  <div class="min-h-screen bg-white text-neutral-900 selection:bg-maxaro-blue-light selection:text-maxaro-blue font-sans">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <!-- Global Optimistic Cart Drawer & Modals -->
    <CartDrawer />

    <!-- Comparative Technical Scorecard Modal -->
    <ScorecardModal />

    <!-- Floating Pitch Deck & Benchmark Toggle Badge -->
    <PitchBridgeBadge />
  </div>
</template>
