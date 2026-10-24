import { locale as rootLocale } from "next/root-params";
import type { AbstractIntlMessages } from "next-intl";
import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

type Locale = (typeof routing.locales)[number];

interface RequestConfigReturn {
  locale: Locale;
  messages: AbstractIntlMessages;
}

interface MessagesModule {
  default: AbstractIntlMessages;
}

export default getRequestConfig(async (): Promise<RequestConfigReturn> => {
  const requested: string | undefined = await rootLocale();
  const resolvedLocale: Locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;
  const messagesModule = (await import(
    `../../messages/${resolvedLocale}.json`
  )) as MessagesModule;
  return {
    locale: resolvedLocale,
    messages: messagesModule.default,
  };
});
