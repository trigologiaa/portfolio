import { defineRouting } from "next-intl/routing";

export const locales = ["en", "es"] as const;

export type Locale = (typeof locales)[number];

interface RoutingConfig {
  locales: typeof locales;
  defaultLocale: Locale;
}

export const routing: RoutingConfig = defineRouting({
  locales,
  defaultLocale: "en",
});
