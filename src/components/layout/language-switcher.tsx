"use client";

import { useLocale, useTranslations } from "next-intl";
import type { ReactElement } from "react";
import { Button } from "@/components/ui/button";
import { localeNames } from "@/i18n/locale-names";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

export function LanguageSwitcher(): ReactElement {
  const t: ReturnType<typeof useTranslations<"Language">> =
    useTranslations("Language");
  const currentLocale: string = useLocale();
  const pathname: string = usePathname();
  const router: ReturnType<typeof useRouter> = useRouter();
  return (
    <fieldset
      aria-label={t("label")}
      className="inline-flex items-center gap-1"
    >
      {routing.locales.map(
        (locale): ReactElement => (
          <Button
            key={locale}
            type="button"
            lang={locale}
            size="sm"
            variant={locale === currentLocale ? "secondary" : "ghost"}
            aria-pressed={locale === currentLocale}
            onClick={(): void => router.replace(pathname, { locale })}
          >
            {localeNames[locale]}
          </Button>
        ),
      )}
    </fieldset>
  );
}
