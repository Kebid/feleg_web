import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AppShell from "@/components/AppShell";
import PageWrapper from "@/components/layout/PageWrapper";
import ToastProvider from "@/components/providers/ToastProvider";
import ThemeProvider from "@/components/providers/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Feleg - Child Enrichment Programs",
  description: "Find and apply to enrichment programs for your children",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`bg-gray-50 dark:bg-gray-900 min-h-screen flex flex-col ${geistSans.variable} ${geistMono.variable}`}>
        <ThemeProvider>
          <ToastProvider />
          <AppShell>
            <PageWrapper>
              {children}
            </PageWrapper>
          </AppShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
