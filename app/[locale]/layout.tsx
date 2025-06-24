import '../globals.css';
import { NextIntlClientProvider } from 'next-intl';
import { ReactNode } from 'react';
import { Geist, Geist_Mono } from "next/font/google";
import AppShell from "@/components/AppShell";
import PageWrapper from "@/components/layout/PageWrapper";
import ToastProvider from "@/components/providers/ToastProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Fallback messages
const fallbackMessages = {
  welcome: "Welcome",
  login: "Login",
  signup: "Sign Up",
  applyNow: "Apply Now",
  language: "Language"
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  let locale = 'en';
  let messages = fallbackMessages;
  
  try {
    const resolvedParams = await params;
    locale = resolvedParams.locale || 'en';
    
    // Validate locale
    const validLocales = ['en', 'am', 'om', 'ti'];
    if (!validLocales.includes(locale)) {
      console.warn(`Invalid locale: ${locale}, falling back to 'en'`);
      locale = 'en';
    }
    
    // Try to import messages with better error handling
    try {
      const importedMessages = await import(`../../messages/${locale}.json`);
      messages = importedMessages.default || fallbackMessages;
    } catch (importError) {
      console.warn(`Could not load messages for locale: ${locale}, using fallback`, importError);
      messages = fallbackMessages;
    }
  } catch (error) {
    console.error('Error in LocaleLayout:', error);
    // Use fallback values
    locale = 'en';
    messages = fallbackMessages;
  }

  return (
    <html lang={locale}>
      <body className={`bg-gray-50 dark:bg-gray-900 min-h-screen flex flex-col ${geistSans.variable} ${geistMono.variable}`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider>
            <ToastProvider />
            <AppShell>
              <PageWrapper>
                {children}
              </PageWrapper>
            </AppShell>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
} 