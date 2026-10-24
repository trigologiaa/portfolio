import "../globals.css";
import type { Metadata } from "next";
import type { NextFontWithVariable } from "next/dist/compiled/@next/font";
import { Geist, Geist_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import type React from "react";
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
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <NextIntlClientProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
