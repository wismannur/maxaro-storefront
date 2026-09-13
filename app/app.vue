<script setup lang="ts">
import CartDrawer from '~~/app/components/cart/CartDrawer.vue';
import PitchBridgeBadge from '~~/app/components/common/PitchBridgeBadge.vue';
import ScorecardModal from '~~/app/components/common/ScorecardModal.vue';

// Global app entrypoint
useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk && !titleChunk.includes('Maxaro')
      ? `${titleChunk} | Maxaro`
      : 'Maxaro — Maximaal Geslaagd | Sub-Second Storefront Prototype';
  },
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
