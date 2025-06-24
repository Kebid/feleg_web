import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  const validLocale = ['en', 'am', 'om', 'ti'].includes(locale || 'en') ? (locale || 'en') : 'en';

  // Use fallback messages to avoid chunk loading issues
  const fallbackMessages = {
    welcome: "Welcome",
    login: "Login",
    signup: "Sign Up",
    applyNow: "Apply Now",
    language: "Language"
  };

  return {
    locale: validLocale,
    messages: fallbackMessages
  };
}); 