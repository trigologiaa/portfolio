import { useTranslations } from "next-intl";
import type { ReactElement } from "react";
import { siteConfig } from "@/lib/site";

export interface FooterLink {
  label: string;
  href: string;
}

interface FooterProps {
  year?: number;
  links?: FooterLink[];
}

export function Footer({ year, links = [] }: FooterProps): ReactElement {
  const t: ReturnType<typeof useTranslations<"Footer">> =
    useTranslations("Footer");
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row">
        <p className="text-sm text-muted-foreground">
          © {year} {siteConfig.name}. {t("rights")}
        </p>
        {links.length > 0 && (
          <ul aria-label={t("social")} className="flex items-center gap-4">
            {links.map(
              (link: FooterLink): ReactElement => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center text-sm underline-offset-4 hover:underline"
                  >
                    {link.label}
                  </a>
                </li>
              ),
            )}
          </ul>
        )}
      </div>
    </footer>
  );
}
