// shared/constants/ecommerce.ts

/**
 * Standard Dutch E-commerce Business Rules for Maxaro Storefront
 */
export const DUTCH_VAT_PERCENTAGE = 21;
export const DUTCH_VAT_MULTIPLIER = 21 / 121; // Inclusive 21% BTW formula: subtotal * (21 / 121)

export const FREE_SHIPPING_THRESHOLD = 100;
export const STANDARD_SHIPPING_COST = 6.95;

export const ORDER_PREFIX = 'MAX-2026-';
export const TRACKING_PREFIX = 'TRK-NL-';
export const TRACKING_SUFFIX = '-MX';
export const SHOWROOM_PASS_PREFIX = 'MAX-SHW-';

export const SHOWROOM_PASS_VALIDITY_DAYS = 30;
export const CHECKOUT_SESSION_VALIDITY_MS = 15 * 60 * 1000; // 15 minutes
