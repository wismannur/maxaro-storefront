// app/composables/useLocale.ts
import {
  translations,
  supportedMarkets,
  DEFAULT_MARKET,
  type LocaleCode,
  type MarketOption,
} from '~~/app/locales';

export function useLocale() {
  const currentLocale = useState<LocaleCode>('maxaro-locale', () => 'nl');
  const currentMarketKey = useState<string>('maxaro-market', () => 'nl_NL');

  // Load from localStorage upon client mounting
  if (import.meta.client) {
    try {
      const storedLocale = localStorage.getItem('maxaro-locale') as LocaleCode | null;
      const storedMarket = localStorage.getItem('maxaro-market');
      if (storedLocale && ['nl', 'en', 'de', 'fr'].includes(storedLocale)) {
        currentLocale.value = storedLocale;
      }
      if (storedMarket) {
        currentMarketKey.value = storedMarket;
      }
      document.documentElement.lang = currentLocale.value;
    } catch {
      // Ignore localStorage errors in private browsing
    }
  }

  const currentMarketInfo = computed<MarketOption>(() => {
    return (
      supportedMarkets.find((m) => m.marketKey === currentMarketKey.value) ??
      DEFAULT_MARKET
    );
  });

  function setMarket(market: MarketOption) {
    currentLocale.value = market.code;
    currentMarketKey.value = market.marketKey;

    if (import.meta.client) {
      try {
        localStorage.setItem('maxaro-locale', market.code);
        localStorage.setItem('maxaro-market', market.marketKey);
        document.documentElement.lang = market.code;
      } catch {
        // Ignore localStorage errors
      }
    }
  }

  function setLocale(code: LocaleCode) {
    const market = supportedMarkets.find((m) => m.code === code) ?? DEFAULT_MARKET;
    setMarket(market);
  }

  /**
   * Reactive translation lookup with variable replacement
   * e.g. t('catalog.resultsCount', { count: 12 })
   */
  function t(keyPath: string, params?: Record<string, string | number>): string {
    const dict = translations[currentLocale.value] || translations.nl;
    const fallbackDict = translations.nl;

    const keys = keyPath.split('.');
    let value: any = dict;
    let fallbackValue: any = fallbackDict;

    for (const key of keys) {
      if (value && typeof value === 'object') {
        value = value[key];
      } else {
        value = undefined;
      }

      if (fallbackValue && typeof fallbackValue === 'object') {
        fallbackValue = fallbackValue[key];
      } else {
        fallbackValue = undefined;
      }
    }

    let result = typeof value === 'string' ? value : typeof fallbackValue === 'string' ? fallbackValue : keyPath;

    if (params) {
      for (const [paramKey, paramVal] of Object.entries(params)) {
        result = result.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(paramVal));
      }
    }

    return result;
  }

  return {
    currentLocale,
    currentMarketKey,
    currentMarketInfo,
    supportedMarkets,
    setMarket,
    setLocale,
    t,
  };
}
