// src/i18n.ts
import {createMiddleware} from 'next-intl/server';

export const locales = ['en', 'am', 'om', 'ti'] as const;
export const defaultLocale = 'en';

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale
});

export default intlMiddleware;

export const config = {
  matcher: ['/', '/(en|am|om|ti)/:path*']
};
