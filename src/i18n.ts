import { createI18nMiddleware } from 'next-intl/middleware';

export const locales = ['en', 'am', 'om', 'ti'] as const;
export const defaultLocale = 'en' as const;

export default createI18nMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always'
}); 