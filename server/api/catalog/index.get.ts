// server/api/catalog/index.get.ts
import { productRepository } from '../../repositories/productRepository';
import type { Product } from '~~/shared/types';

// Backward compatibility export if imported by external scripts/benchmarks
export const mockProducts: Product[] = productRepository.findAll();

/**
 * GET /api/catalog
 * Returns product catalog with optional query filtering (category, search).
 * Handled via Nitro Edge with sub-millisecond response latency.
 */
export default defineEventHandler(async (event) => {
  const query = getQuery(event);

  // 1. Category filter
  if (typeof query.category === 'string' && query.category.trim()) {
    const category = query.category.trim();
    return productRepository.findByCategory(category);
  }

  // 2. Query search filter
  if (typeof query.q === 'string' && query.q.trim()) {
    const search = query.q.trim();
    return productRepository.search(search);
  }

  // 3. Default: return entire catalog
  return productRepository.findAll();
});
