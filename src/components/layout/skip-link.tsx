import { useTranslations } from "next-intl";
import type { ReactElement } from "react";

export function SkipLink(): ReactElement {
  const t: ReturnType<typeof useTranslations<"Common">> =
    useTranslations("Common");
  return (
    <a
      href="#content"
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
    >
      {t("skipToContent")}
    </a>
  );
}
