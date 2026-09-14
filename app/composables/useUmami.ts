// app/composables/useUmami.ts
import type { UmamiEventData, UmamiCustomTrackFn, UmamiRuntimeConfig } from '~~/app/types/umami';

// In-memory queue to buffer calls made before Umami's deferred script finishes loading
const queuedTasks: Array<() => void> = [];
let queuePollerInitialized = false;

function flushQueue() {
  if (typeof window !== 'undefined' && window.umami) {
    while (queuedTasks.length > 0) {
      const task = queuedTasks.shift();
      try {
        task?.();
      } catch (err) {
        console.warn('[Umami] Error executing queued tracking task:', err);
      }
    }
  }
}

function runWhenReady(fn: () => void) {
  if (!import.meta.client) return;

  if (typeof window !== 'undefined' && window.umami) {
    fn();
    return;
  }

  queuedTasks.push(fn);

  if (!queuePollerInitialized && typeof window !== 'undefined') {
    queuePollerInitialized = true;
    let attempts = 0;
    const interval = setInterval(() => {
      attempts++;
      if (window.umami) {
        clearInterval(interval);
        flushQueue();
      } else if (attempts > 30) {
        // Stop checking after ~6 seconds (30 * 200ms)
        clearInterval(interval);
      }
    }, 200);
  }
}

export function useUmami() {
  const config = useRuntimeConfig();
  const umamiConfig = (config.public.umami || {}) as UmamiRuntimeConfig;

  const isConfigured = computed(() => Boolean(umamiConfig.id));

  function track(eventName: string, eventData?: UmamiEventData) {
    if (!import.meta.client) return;

    if (import.meta.dev) {
      console.info(`[Umami Analytics] 📊 Event: "${eventName}"`, eventData ?? {});
    }

    runWhenReady(() => {
      if (window.umami?.track) {
        window.umami.track(eventName, eventData);
      }
    });
  }

  function trackCustom(customFn: UmamiCustomTrackFn) {
    if (!import.meta.client) return;

    runWhenReady(() => {
      if (window.umami?.track) {
        window.umami.track(customFn);
      }
    });
  }

  function trackPageView(url?: string, referrer?: string, title?: string) {
    if (!import.meta.client) return;

    if (import.meta.dev) {
      console.info(`[Umami Analytics] 📄 PageView: ${url || window.location.pathname}`);
    }

    runWhenReady(() => {
      if (window.umami?.track) {
        window.umami.track((props) => ({
          ...props,
          ...(url ? { url } : {}),
          ...(referrer ? { referrer } : {}),
          ...(title ? { title } : {}),
        }));
      }
    });
  }

  function identify(sessionData: Record<string, string | number | boolean>) {
    if (!import.meta.client) return;

    if (import.meta.dev) {
      console.info('[Umami Analytics] 👤 Identify:', sessionData);
    }

    runWhenReady(() => {
      if (window.umami?.identify) {
        window.umami.identify(sessionData);
      }
    });
  }

  // --- E-commerce & Storefront Domain Helpers ---

  function trackAddToCart(item: {
    id: string;
    name: string;
    price: number;
    quantity?: number;
    category?: string;
    finish?: string;
  }) {
    track('add_to_cart', {
      product_id: item.id,
      product_name: item.name,
      price: item.price,
      quantity: item.quantity ?? 1,
      category: item.category ?? 'sanitair',
      finish: item.finish ?? 'standard',
    });
  }

  function trackRemoveFromCart(productId: string) {
    track('remove_from_cart', {
      product_id: productId,
    });
  }

  function trackCheckoutStart(summary: { total: number; itemCount: number }) {
    track('initiate_checkout', {
      total: summary.total,
      item_count: summary.itemCount,
      currency: 'EUR',
    });
  }

  function trackShowroomPassGenerated(pass: {
    passId: string;
    showroom: string;
    itemCount: number;
    total: number;
  }) {
    track('generate_showroom_pass', {
      pass_id: pass.passId,
      showroom: pass.showroom,
      item_count: pass.itemCount,
      total: pass.total,
    });
  }

  function trackShowroomPassAction(action: 'copy' | 'print', passId: string) {
    track('showroom_pass_action', {
      action,
      pass_id: passId,
    });
  }

  function trackMarketChange(market: { code: string; language: string; country: string }) {
    track('change_market', {
      market_code: market.code,
      language: market.language,
      country: market.country,
    });
  }

  return {
    isConfigured,
    config: umamiConfig,
    track,
    trackCustom,
    trackPageView,
    identify,
    trackAddToCart,
    trackRemoveFromCart,
    trackCheckoutStart,
    trackShowroomPassGenerated,
    trackShowroomPassAction,
    trackMarketChange,
  };
}
