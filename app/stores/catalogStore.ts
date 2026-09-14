// app/stores/catalogStore.ts
import { defineStore } from 'pinia';
import type { Product, ProductCategory, ProductFinish } from '~~/shared/types';

export const useCatalogStore = defineStore('catalog', () => {
  const allProducts = ref<Product[]>([]);
  const activeCategory = ref<ProductCategory | null>(null);
  const activeFinish = ref<ProductFinish | null>(null);
  const priceRange = ref<{ min: number; max: number }>({ min: 0, max: 2000 });
  const searchQuery = ref<string>('');
  const sortBy = ref<'popular' | 'price-asc' | 'price-desc' | 'rating'>('popular');
  const isLoading = ref(false);
  const isFilterDrawerOpen = ref(false);

  async function fetchProducts() {
    if (allProducts.value.length > 0) return;
    isLoading.value = true;
    try {
      const data = await $fetch<Product[]>('/api/catalog');
      allProducts.value = data || [];
    } catch (err) {
      console.error('Failed to fetch catalog:', err);
    } finally {
      isLoading.value = false;
    }
  }

  function setCategory(cat: ProductCategory | null) {
    activeCategory.value = cat;
    const umami = useUmami();
    umami.track('filter_category', { category: cat || 'all' });
  }

  function toggleFinish(finish: ProductFinish) {
    const umami = useUmami();
    if (activeFinish.value === finish) {
      activeFinish.value = null;
      umami.track('filter_finish', { finish: 'none' });
    } else {
      activeFinish.value = finish;
      umami.track('filter_finish', { finish });
    }
  }

  function setSortBy(sort: 'popular' | 'price-asc' | 'price-desc' | 'rating') {
    sortBy.value = sort;
    const umami = useUmami();
    umami.track('sort_catalog', { sort });
  }

  function resetFilters() {
    activeFinish.value = null;
    priceRange.value = { min: 0, max: 2000 };
    searchQuery.value = '';
    const umami = useUmami();
    umami.track('reset_filters');
  }

  return {
    allProducts,
    activeCategory,
    activeFinish,
    priceRange,
    searchQuery,
    sortBy,
    isLoading,
    isFilterDrawerOpen,
    fetchProducts,
    setCategory,
    toggleFinish,
    setSortBy,
    resetFilters,
  };
});
