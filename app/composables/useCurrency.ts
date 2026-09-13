// app/composables/useCurrency.ts
import { useLocale } from './useLocale';

export function useCurrency() {
  const { currentLocale } = useLocale();

  function formatEuro(value: number, includeDecimals = false): string {
    const localeMap: Record<string, string> = {
      nl: 'nl-NL',
      de: 'de-DE',
      en: 'en-GB',
      fr: 'fr-FR',
    };
    const localeTag = localeMap[currentLocale.value] || 'nl-NL';

    if (includeDecimals) {
      return new Intl.NumberFormat(localeTag, {
        style: 'currency',
        currency: 'EUR',
      }).format(value);
    }

    if (currentLocale.value === 'de') {
      const formatted = new Intl.NumberFormat('de-DE', {
        maximumFractionDigits: 0,
      }).format(value);
      return `${formatted} €`;
    }

    if (currentLocale.value === 'fr') {
      const formatted = new Intl.NumberFormat('fr-FR', {
        maximumFractionDigits: 0,
      }).format(value);
      return `${formatted} €`;
    }

    if (currentLocale.value === 'en') {
      const formatted = new Intl.NumberFormat('en-GB', {
        maximumFractionDigits: 0,
      }).format(value);
      return `€${formatted}`;
    }

    // Traditional Dutch retail price formatting: € 1.249,-
    const formatted = new Intl.NumberFormat('nl-NL', {
      maximumFractionDigits: 0,
    }).format(value);

    return `€${formatted},-`;
  }

  function formatDimensions(
    lengthCm?: number,
    widthCm?: number,
    heightCm?: number,
    thicknessMm?: number,
    thicknessLabel?: string
  ): string {
    const label =
      thicknessLabel ||
      (currentLocale.value === 'de' ? 'Stärke' : currentLocale.value === 'en' ? 'thickness' : currentLocale.value === 'fr' ? 'épaisseur' : 'dikte');

    if (thicknessMm) {
      return `${lengthCm} × ${widthCm} cm (${label} ${thicknessMm} mm)`;
    }
    if (lengthCm && widthCm && heightCm) {
      return `${lengthCm} × ${widthCm} × ${heightCm} cm`;
    }
    if (lengthCm && widthCm) {
      return `${lengthCm} × ${widthCm} cm`;
    }
    return '';
  }

  return {
    formatEuro,
    formatDimensions,
  };
}
