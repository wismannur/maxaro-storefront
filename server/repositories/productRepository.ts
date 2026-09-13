// server/repositories/productRepository.ts
import type { Product, ProductCategory } from '~~/shared/types';
import { productsData } from '../data/products.data';

/**
 * ProductRepository encapsulates catalog data retrieval logic.
 * In a full production setup, this serves as an abstraction layer over
 * headless ERP (e.g. Shopware, Magento 2, or Maxaro custom PIM).
 */
export class ProductRepository {
  private readonly products: Product[];

  constructor(initialData: Product[] = productsData) {
    this.products = initialData;
  }

  /**
   * Retrieve all products from the catalog.
   */
  public findAll(): Product[] {
    return [...this.products];
  }

  /**
   * Find products filtered by category.
   */
  public findByCategory(category: ProductCategory | string): Product[] {
    return this.products.filter((p) => p.category === category);
  }

  /**
   * Find a single product by its unique slug.
   */
  public findBySlug(slug: string): Product | undefined {
    return this.products.find((p) => p.slug === slug);
  }

  /**
   * Find a single product by its unique ID.
   */
  public findById(id: string): Product | undefined {
    return this.products.find((p) => p.id === id);
  }

  /**
   * Find a single product by SKU.
   */
  public findBySku(sku: string): Product | undefined {
    return this.products.find((p) => p.sku.toLowerCase() === sku.toLowerCase());
  }

  /**
   * In-memory search against product name, SKU, category, and finish.
   */
  public search(query: string): Product[] {
    const cleanQuery = query.toLowerCase().trim();
    if (!cleanQuery) return this.findAll();

    return this.products.filter((p) => {
      return (
        p.name.toLowerCase().includes(cleanQuery) ||
        p.sku.toLowerCase().includes(cleanQuery) ||
        p.categoryLabelNl.toLowerCase().includes(cleanQuery) ||
        p.finish.toLowerCase().includes(cleanQuery)
      );
    });
  }
}

// Export singleton instance for fast reuse in Nitro server
export const productRepository = new ProductRepository();
