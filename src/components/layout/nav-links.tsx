"use client";

import { useTranslations } from "next-intl";
import type { ReactElement } from "react";
import { navItems, sectionHref } from "@/config/nav";
import { useActiveSection } from "@/hooks/use-active-section";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

const sectionIds: readonly string[] = navItems.map(
  (item: (typeof navItems)[number]): string => item.id,
);

interface NavLinksProps {
  className?: string;
  onNavigate?: () => void;
}

export function NavLinks({
  className,
  onNavigate,
}: NavLinksProps): ReactElement {
  const t = useTranslations("Nav");
  const active = useActiveSection(sectionIds);
  return (
    <nav aria-label={t("main")} className={className}>
      <ul className="flex flex-col gap-1 md:flex-row md:items-center md:gap-1">
        {navItems.map(({ id }) => (
          <li key={id}>
            <Link
              href={sectionHref(id)}
              onClick={onNavigate}
              aria-current={active === id ? "location" : undefined}
              className={cn(
                "inline-flex min-h-11 items-center rounded-md px-3 text-sm font-medium transition-colors",
                "hover:bg-accent hover:text-accent-foreground",
                active === id && "bg-secondary text-secondary-foreground",
              )}
            >
              {t(id)}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
