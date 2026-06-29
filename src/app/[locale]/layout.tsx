import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { Navbar } from '@/components/layout/Navbar';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Artisan Honey",
  description: "Premium Artisan Honey in Cairo, Egypt",
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <body className="flex flex-col min-h-screen bg-background bg-[url('/phone-back.jpg')] md:bg-[url('/pc-back.jpg')] bg-cover bg-center bg-fixed text-foreground antialiased selection:bg-primary/20 selection:text-primary">
        <NextIntlClientProvider messages={messages}>
          <Navbar />
          <main className="flex-1 flex flex-col relative">
            {children}
          </main>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
