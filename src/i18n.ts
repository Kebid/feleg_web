// src/i18n.ts
import createMiddleware from 'next-intl/middleware';

export const locales = ['en', 'am', 'om', 'ti'] as const;
export const defaultLocale = 'en';

export default createMiddleware({
  locales,
  defaultLocale,
});

export const config = {
  // Match only routes that start with a locale
  matcher: ['/', '/(en|am|om|ti)/:path*']
}; 