// server/services/cartService.ts
import { productRepository } from '../repositories/productRepository';
import type { CartLineItem, CartTotals, TileCalculationMetadata } from '~~/shared/types';
import { calculateCartTotals } from '~~/shared/types';

export interface ValidatedCartResult {
  reconciledItems: CartLineItem[];
  totals: CartTotals;
  warnings?: string[];
}

/**
 * CartService implements authoritative business logic and anti-tampering verification
 * for the Maxaro Storefront checkout and cart synchronization.
 */
export class CartService {
  /**
   * Reconciles cart line items sent from the client against server-side authoritative catalog.
   * Eliminates Client-Side Price Tampering and invalid quantity injection.
   */
  public reconcileCart(rawItems: unknown): ValidatedCartResult {
    if (!Array.isArray(rawItems) || rawItems.length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Winkelmand is leeg of payload is ongeldig.',
      });
    }

    const reconciledItems: CartLineItem[] = [];
    const warnings: string[] = [];

    for (const rawItem of rawItems) {
      if (!rawItem || typeof rawItem !== 'object') {
        continue;
      }

      const item = rawItem as Record<string, any>;
      const productId = item.product?.id || item.productId;

      if (!productId || typeof productId !== 'string') {
        warnings.push('Item met ontbrekend product-ID overgeslagen.');
        continue;
      }

      // Lookup authoritative product from repository
      const authoritativeProduct = productRepository.findById(productId);
      if (!authoritativeProduct) {
        warnings.push(`Product ${productId} niet gevonden in catalogus.`);
        continue;
      }

      // Sanitize and bounds-check quantity (must be integer between 1 and 999)
      const rawQuantity = Number(item.quantity);
      const safeQuantity = Number.isInteger(rawQuantity) && rawQuantity > 0
        ? Math.min(rawQuantity, 999)
        : 1;

      // Handle Tile calculation metadata with server verification
      let verifiedTileMetadata: TileCalculationMetadata | undefined;
      if (item.tileMetadata && typeof item.tileMetadata === 'object') {
        const rawTile = item.tileMetadata as Partial<TileCalculationMetadata>;
        const coverage = authoritativeProduct.packageCoverageM2 || rawTile.coveragePerPackageM2 || 1.44;
        const verifiedPricePerM2 = authoritativeProduct.price;
        const verifiedPricePerPackage = Number((coverage * verifiedPricePerM2).toFixed(2));
        const verifiedTotalPrice = Number((safeQuantity * verifiedPricePerPackage).toFixed(2));

        verifiedTileMetadata = {
          isTile: true,
          packageCount: safeQuantity,
          coveragePerPackageM2: coverage,
          totalM2Purchased: Number((safeQuantity * coverage).toFixed(2)),
          netRoomM2: Number(rawTile.netRoomM2 || safeQuantity * coverage),
          wastePercentage: Number(rawTile.wastePercentage || 0),
          pricePerM2: verifiedPricePerM2,
          pricePerPackage: verifiedPricePerPackage,
          totalPrice: verifiedTotalPrice,
        };
      }

      reconciledItems.push({
        product: authoritativeProduct, // Always inject authoritative server product
        quantity: safeQuantity,
        addedAt: typeof item.addedAt === 'number' ? item.addedAt : Date.now(),
        tileMetadata: verifiedTileMetadata,
      });
    }

    if (reconciledItems.length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Geen geldige artikelen in winkelmand gevonden.',
      });
    }

    // Authoritative total calculation using verified server prices
    const totals = calculateCartTotals(reconciledItems);

    return {
      reconciledItems,
      totals,
      warnings: warnings.length > 0 ? warnings : undefined,
    };
  }
}

export const cartService = new CartService();
