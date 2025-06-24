import { i18nMiddleware } from './src/i18n';

export default i18nMiddleware;

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    '/((?!_next|api|favicon.ico).*)',
  ],
};
