// shared/types/cart.ts
import type { Product } from './product';
import {
  FREE_SHIPPING_THRESHOLD,
  STANDARD_SHIPPING_COST,
  DUTCH_VAT_MULTIPLIER,
} from '../constants/ecommerce';

export interface TileCalculationMetadata {
  isTile: boolean;
  packageCount: number;
  coveragePerPackageM2: number;
  totalM2Purchased: number;
  netRoomM2: number;
  wastePercentage: number;
  pricePerM2: number;
  pricePerPackage: number;
  totalPrice: number;
}

export interface CartLineItem {
  product: Product;
  quantity: number;
  addedAt: number;
  tileMetadata?: TileCalculationMetadata;
}

export interface CartTotals {
  subtotal: number;
  vatAmount: number; // 21% BTW in the Netherlands
  shippingCost: number; // €0 if subtotal >= €100, otherwise €6,95
  total: number;
  isFreeShipping: boolean;
  remainingForFreeShipping: number;
}

export function getItemLineTotal(item: CartLineItem): number {
  if (item.tileMetadata) {
    return Number(item.tileMetadata.totalPrice.toFixed(2));
  }
  return Number((item.product.price * item.quantity).toFixed(2));
}

export function calculateCartTotals(items: CartLineItem[]): CartTotals {
  const subtotal = items.reduce((sum, item) => sum + getItemLineTotal(item), 0);
  const vatAmount = Number((subtotal * DUTCH_VAT_MULTIPLIER).toFixed(2));
  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD || items.length === 0;
  const shippingCost = isFreeShipping ? 0 : STANDARD_SHIPPING_COST;
  const total = Number((subtotal + shippingCost).toFixed(2));
  const remainingForFreeShipping = Number(Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal).toFixed(2));

  return {
    subtotal: Number(subtotal.toFixed(2)),
    vatAmount,
    shippingCost,
    total,
    isFreeShipping,
    remainingForFreeShipping,
  };
}
