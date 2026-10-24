import type { JSX } from "react/jsx-runtime";
import { ThemeSelector } from "@/components/layout/theme-selector";
import { siteConfig } from "@/lib/site";

export default function Home(): JSX.Element {
  return (
    <main className="flex min-h-screen items-center justify-center gap-6">
      <h1 className="text-4xl font-bold">{siteConfig.name}</h1>
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
    </main>
  );
}
