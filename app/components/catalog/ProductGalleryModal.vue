<!-- app/components/catalog/ProductGalleryModal.vue -->
<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { useLocale } from '~~/app/composables/useLocale';
import {
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  Sparkles,
} from 'lucide-vue-next';

const { t } = useLocale();

const props = defineProps<{
  isOpen: boolean;
  images: string[];
  initialIndex?: number;
  productName: string;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'change', index: number): void;
}>();

const currentIndex = ref(props.initialIndex ?? 0);
const slideDirection = ref<'slide-left' | 'slide-right'>('slide-right');

// Sync with initialIndex when modal opens
watch(
  () => props.isOpen,
  (open) => {
    if (open) {
      currentIndex.value = props.initialIndex ?? 0;
      if (typeof document !== 'undefined') {
        document.body.style.overflow = 'hidden';
      }
    } else {
      if (typeof document !== 'undefined') {
        document.body.style.overflow = '';
      }
    }
  }
);

watch(
  () => props.initialIndex,
  (newIdx) => {
    if (newIdx !== undefined) {
      currentIndex.value = newIdx;
    }
  }
);

const currentImage = computed(() => {
  if (!props.images.length) return '';
  return props.images[currentIndex.value] || props.images[0] || '';
});

function nextImage() {
  if (props.images.length <= 1) return;
  slideDirection.value = 'slide-right';
  if (currentIndex.value < props.images.length - 1) {
    currentIndex.value++;
  } else {
    currentIndex.value = 0; // loop around
  }
  emit('change', currentIndex.value);
}

function prevImage() {
  if (props.images.length <= 1) return;
  slideDirection.value = 'slide-left';
  if (currentIndex.value > 0) {
    currentIndex.value--;
  } else {
    currentIndex.value = props.images.length - 1; // loop around
  }
  emit('change', currentIndex.value);
}

function selectIndex(idx: number) {
  if (idx === currentIndex.value) return;
  slideDirection.value = idx > currentIndex.value ? 'slide-right' : 'slide-left';
  currentIndex.value = idx;
  emit('change', currentIndex.value);
}

function close() {
  emit('close');
}

// Keyboard shortcuts
function handleKeyDown(e: KeyboardEvent) {
  if (!props.isOpen) return;
  if (e.key === 'Escape') {
    close();
  } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
    nextImage();
  } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
    prevImage();
  }
}

// Touch swipe gestures
const touchStartX = ref(0);
const touchEndX = ref(0);

function onTouchStart(e: TouchEvent) {
  touchStartX.value = e.changedTouches[0]?.clientX ?? 0;
}

function onTouchEnd(e: TouchEvent) {
  touchEndX.value = e.changedTouches[0]?.clientX ?? 0;
  handleSwipe();
}

function handleSwipe() {
  const diff = touchStartX.value - touchEndX.value;
  const threshold = 45; // min swipe distance in px
  if (diff > threshold) {
    nextImage(); // swiped left -> next
  } else if (diff < -threshold) {
    prevImage(); // swiped right -> prev
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
  if (typeof document !== 'undefined') {
    document.body.style.overflow = '';
  }
});
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen"
        class="fixed inset-0 z-[999] flex flex-col items-center justify-between bg-black/92 backdrop-blur-xl select-none"
        role="dialog"
        aria-modal="true"
        :aria-label="productName"
        @click.self="close"
      >
        <!-- Top Bar: Title, Counter & Close Button -->
        <header class="w-full flex items-center justify-between px-4 sm:px-6 py-4 z-20 text-white pointer-events-auto">
          <!-- Left: Image Counter Badge & Product Name -->
          <div class="flex items-center gap-3 min-w-0 pr-4">
            <span
              v-if="images.length > 1"
              class="inline-flex items-center px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-mono font-bold tracking-wider text-white border border-white/10 shrink-0"
            >
              {{ currentIndex + 1 }} / {{ images.length }}
            </span>
            <h2 class="text-xs sm:text-sm font-semibold text-neutral-200 truncate max-w-[240px] sm:max-w-md md:max-w-xl">
              {{ productName }}
            </h2>
          </div>

          <!-- Right: Action Buttons -->
          <div class="flex items-center gap-2 shrink-0">
            <button
              type="button"
              @click="close"
              class="p-2 sm:p-2.5 rounded-full bg-white/20 hover:bg-white text-white hover:text-neutral-900 active:scale-95 transition-all cursor-pointer border border-white/20 shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              :title="t('galleryModal.close')"
              :aria-label="t('galleryModal.closeAria')"
            >
              <X class="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>
        </header>

        <!-- Center Stage: Main Image Showcase with Slide Navigation -->
        <div
          class="relative flex-1 w-full flex items-center justify-center px-4 sm:px-20 overflow-hidden"
          @touchstart="onTouchStart"
          @touchend="onTouchEnd"
          @click.self="close"
        >
          <!-- Main Image with Slide Animation -->
          <div class="relative max-h-[70vh] sm:max-h-[76vh] max-w-[92vw] sm:max-w-[85vw] flex items-center justify-center pointer-events-none">
            <Transition
              :name="slideDirection"
              mode="out-in"
            >
              <img
                :key="currentImage"
                :src="currentImage"
                :alt="t('galleryModal.photoNumber', { product: productName, index: currentIndex + 1 })"
                class="max-h-[68vh] sm:max-h-[75vh] w-auto max-w-full object-contain rounded-2xl sm:rounded-3xl shadow-2xl select-none pointer-events-auto"
                draggable="false"
              />
            </Transition>
          </div>
        </div>

        <!-- High-Contrast Navigation Floating Controls (Outside overflow-hidden) -->
        <!-- Prev Button -->
        <button
          v-if="images.length > 1"
          type="button"
          @click.stop="prevImage"
          class="absolute left-3 sm:left-6 md:left-8 top-1/2 -translate-y-1/2 z-40 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-white hover:bg-neutral-100 text-neutral-900 active:scale-90 shadow-2xl transition-all cursor-pointer flex items-center justify-center border border-neutral-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/40"
          :title="t('galleryModal.prevImage')"
          :aria-label="t('galleryModal.prevImageAria')"
        >
          <ChevronLeft class="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.5]" />
        </button>

        <!-- Next Button -->
        <button
          v-if="images.length > 1"
          type="button"
          @click.stop="nextImage"
          class="absolute right-3 sm:right-6 md:right-8 top-1/2 -translate-y-1/2 z-40 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-white hover:bg-neutral-100 text-neutral-900 active:scale-90 shadow-2xl transition-all cursor-pointer flex items-center justify-center border border-neutral-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/40"
          :title="t('galleryModal.nextImage')"
          :aria-label="t('galleryModal.nextImageAria')"
        >
          <ChevronRight class="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.5]" />
        </button>

        <!-- Bottom Bar: Thumbnails Strip for Quick Jump -->
        <footer class="w-full flex items-center justify-center p-4 z-20 pointer-events-auto">
          <div
            v-if="images.length > 1"
            class="flex items-center gap-2 sm:gap-2.5 px-3 py-2 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/15 max-w-[92vw] overflow-x-auto no-scrollbar shadow-2xl"
          >
            <button
              v-for="(img, idx) in images"
              :key="idx"
              type="button"
              @click="selectIndex(idx)"
              class="relative aspect-square w-12 sm:w-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer"
              :class="currentIndex === idx
                ? 'border-white scale-105 shadow-md ring-2 ring-white/40'
                : 'border-white/20 opacity-50 hover:opacity-100 hover:border-white/60'"
              :aria-label="t('galleryModal.goToPhoto', { index: idx + 1 })"
            >
              <img
                :src="img"
                :alt="`Thumbnail ${idx + 1}`"
                class="h-full w-full object-cover"
                loading="lazy"
              />
            </button>
          </div>

          <div
            v-else
            class="text-[11px] text-white/60 font-medium tracking-wide flex items-center gap-1.5"
          >
            <Sparkles class="w-3.5 h-3.5 text-maxaro-accent" />
            <span>{{ t('galleryModal.exclusiveView') }}</span>
          </div>
        </footer>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* Smooth slide transitions */
.slide-right-enter-active,
.slide-right-leave-active,
.slide-left-enter-active,
.slide-left-leave-active {
  transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
}

.slide-right-enter-from {
  opacity: 0;
  transform: translateX(40px) scale(0.96);
}

.slide-right-leave-to {
  opacity: 0;
  transform: translateX(-40px) scale(0.96);
}

.slide-left-enter-from {
  opacity: 0;
  transform: translateX(-40px) scale(0.96);
}

.slide-left-leave-to {
  opacity: 0;
  transform: translateX(40px) scale(0.96);
}
</style>
