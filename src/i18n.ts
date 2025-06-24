// Next-intl middleware configuration for i18n support
import createI18nMiddleware from 'next-intl/middleware';

export const locales = ['en', 'am', 'om', 'ti'] as const;
export const defaultLocale = 'en' as const;

export const i18nMiddleware = createI18nMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always'
});

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    '/((?!_next|api|favicon.ico).*)',
  ],
};

export default i18nMiddleware; 