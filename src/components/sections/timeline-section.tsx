"use client";

import { useLocale, useTranslations } from "next-intl";
import type { ReactElement } from "react";
import type { TimelineEntry } from "@/lib/content";
import { formatPeriod, sortEntries } from "@/lib/timeline";

export function TimelineSection({
  entries,
}: {
  entries: TimelineEntry[];
}): ReactElement {
  const t: ReturnType<typeof useTranslations<"Timeline">> =
    useTranslations("Timeline");
  const locale: string = useLocale();
  const sorted: TimelineEntry[] = sortEntries(entries);
  return (
    <section
      id="experience"
      aria-labelledby="experience-title"
      className="scroll-mt-20 py-16"
    >
      <h2 id="experience-title" className="text-2xl font-semibold">
        {t("title")}
      </h2>
      <ol
        aria-label={t("title")}
        className="mt-8 space-y-8 border-l border-border pl-6"
      >
        {sorted.map((entry) => (
          <li key={entry.id} className="relative">
            <span
              aria-hidden="true"
              className="absolute -left-[1.85rem] top-2 size-3 rounded-full bg-primary"
            />
            <article>
              <p className="text-sm text-muted-foreground">
                {formatPeriod(entry, locale, t("present"))}
              </p>
              <h3 className="text-lg font-semibold">{entry.title}</h3>
              <p className="font-medium">{entry.organization}</p>
              <p className="mt-2 max-w-prose text-muted-foreground">
                {entry.description}
              </p>
            </article>
          </li>
        ))}
      </ol>
    </section>
  );
}
