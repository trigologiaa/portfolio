import { type RenderResult, render } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import type { ReactElement } from "react";
import en from "../messages/en.json";
import es from "../messages/es.json";

interface Catalogs {
  en: typeof en;
  es: typeof es;
}

interface Options {
  locale?: keyof Catalogs;
}

const catalogs: Catalogs = {
  en,
  es,
};

export function renderWithProviders(
  ui: ReactElement,
  { locale = "en" }: Options = {},
): RenderResult {
  return render(
    <NextIntlClientProvider locale={locale} messages={catalogs[locale]}>
      {ui}
    </NextIntlClientProvider>,
  );
}
