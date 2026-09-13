// server/api/cart/sync.post.ts
import { cartService } from '../../services/cartService';

/**
 * POST /api/cart/sync
 * Background synchronization endpoint for optimistic client cart changes.
 * Validates integrity without blocking client UI thread.
 */
export default defineEventHandler(async (event) => {
  const body = await readBody<{ items?: unknown }>(event);

  if (!body?.items || !Array.isArray(body.items) || body.items.length === 0) {
    return {
      success: true,
      syncedItemCount: 0,
      timestamp: Date.now(),
      reconciled: true,
    };
  }

  try {
    const { reconciledItems } = cartService.reconcileCart(body.items);
    return {
      success: true,
      syncedItemCount: reconciledItems.length,
      timestamp: Date.now(),
      reconciled: true,
    };
  } catch (err: any) {
    return {
      success: false,
      syncedItemCount: 0,
      timestamp: Date.now(),
      reconciled: false,
      error: err?.message || 'Sync error',
    };
  }
});
