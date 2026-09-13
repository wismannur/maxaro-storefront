<script setup lang="ts">
import AppHeader from '~~/app/components/common/AppHeader.vue';
import AppFooter from '~~/app/components/common/AppFooter.vue';
</script>

<template>
  <div class="min-h-screen flex flex-col bg-white">
    <AppHeader />
    <main class="flex-1">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>
