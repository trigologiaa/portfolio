import "../globals.css";
import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import type { NextFontWithVariable } from "next/dist/compiled/@next/font";
import { Geist, Geist_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import type React from "react";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { SkipLink } from "@/components/layout/skip-link";
import { ThemeProvider } from "@/components/theme-provider";
import { routing } from "@/i18n/routing";
import { formatPageTitle, siteConfig } from "@/lib/site";

const geistSans: NextFontWithVariable = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono: NextFontWithVariable = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// biome-ignore lint/suspicious/useAwait: "use cache" functions must be async
async function getCurrentYear(): Promise<number> {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
}

export const metadata: Metadata = {
  title: formatPageTitle(),
  description: siteConfig.description,
};

export function generateStaticParams(): { locale: string }[] {
  return routing.locales.map((locale: string) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps<"/[locale]">): Promise<React.JSX.Element> {
  const { locale } = await params;
  const year: number = await getCurrentYear();
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <NextIntlClientProvider>
          <ThemeProvider>
            <SkipLink />
            <Header />
            {children}
            <Footer year={year} />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
