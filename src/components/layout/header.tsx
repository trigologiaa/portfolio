import { useTranslations } from "next-intl";
import type { ReactElement } from "react";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { MobileMenu } from "@/components/layout/mobile-menu";
import { NavLinks } from "@/components/layout/nav-links";
import { ThemeSelector } from "@/components/layout/theme-selector";
import { Link } from "@/i18n/navigation";
import { siteConfig } from "@/lib/site";

export function Header(): ReactElement {
  const t: ReturnType<typeof useTranslations<"Theme">> =
    useTranslations("Theme");
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-center justify-between gap-4 px-4">
        <Link
          href="/"
          className="inline-flex min-h-11 items-center justify-between gap-4 px-4"
        >
          {siteConfig.name}
        </Link>
        <div className="hidden md:block">
          <NavLinks />
        </div>
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeSelector
            labels={{
              group: t("group"),
              options: {
                latte: t("options.latte"),
                frappe: t("options.frappe"),
                macchiato: t("options.macchiato"),
                mocha: t("options.mocha"),
              },
            }}
          />
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
