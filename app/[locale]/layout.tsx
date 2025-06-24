import '../globals.css';
import { NextIntlClientProvider, useMessages } from 'next-intl';
import { ReactNode } from 'react';
import { notFound } from 'next/navigation';
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

export default async function LocaleLayout({
  children,
  params: { locale }
}: {
  children: ReactNode;
  params: { locale: string }
}) {
  let messages;
  try {
    messages = (await import(`../../messages/${locale}.json`)).default;
  } catch (error) {
    notFound();
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