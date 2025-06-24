import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  const validLocale = ['en', 'am', 'om', 'ti'].includes(locale) ? locale : 'en';

  return {
    messages: (await import(`./messages/${validLocale}.json`)).default
  };
}); 