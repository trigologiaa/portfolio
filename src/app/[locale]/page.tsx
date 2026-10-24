import { getTranslations } from "next-intl/server";
import type React from "react";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { ThemeSelector } from "@/components/layout/theme-selector";
import { siteConfig } from "@/lib/site";

export default async function Home(): Promise<React.JSX.Element> {
  const t = await getTranslations("Home");
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6">
      <h1 className="text-4xl font-bold">{siteConfig.name}</h1>
      <p className="text-muted-foreground">{t("tagline")}</p>
      <div className="flex items-center gap-4">
        <LanguageSwitcher />
        <ThemeSelector
          labels={{
            group: "Theme",
            options: {
              latte: "Latte (light)",
              frappe: "Frappé (dark)",
              macchiato: "Macchiato (darker)",
              mocha: "Mocha (darkest)",
            },
          }}
        />
      </div>
    </main>
  );
}
