// app/locales/index.ts
import { nl } from './nl';
import { en } from './en';
import { de } from './de';
import { fr } from './fr';

export type LocaleCode = 'nl' | 'en' | 'de' | 'fr';

export interface MarketOption {
  code: LocaleCode;
  marketKey: 'nl_NL' | 'fr_FR' | 'en' | 'de';
  countryName: string;
  languageName: string;
  flag: string;
}

export const DEFAULT_MARKET: MarketOption = {
  code: 'nl',
  marketKey: 'nl_NL',
  countryName: 'Nederland',
  languageName: 'Nederlands',
  flag: '🇳🇱',
};

export const supportedMarkets: MarketOption[] = [
  DEFAULT_MARKET,
  {
    code: 'fr',
    marketKey: 'fr_FR',
    countryName: 'France',
    languageName: 'Français',
    flag: '🇫🇷',
  },
  {
    code: 'en',
    marketKey: 'en',
    countryName: 'International',
    languageName: 'English',
    flag: '🇬🇧',
  },
  {
    code: 'de',
    marketKey: 'de',
    countryName: 'Deutschland',
    languageName: 'Deutsch',
    flag: '🇩🇪',
  },
];

export const translations: Record<LocaleCode, typeof nl> = {
  nl,
  en: en as typeof nl,
  de: de as typeof nl,
  fr: fr as typeof nl,
};
