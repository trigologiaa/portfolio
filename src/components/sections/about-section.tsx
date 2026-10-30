import { useTranslations } from "next-intl";
import type { ReactElement, ReactNode } from "react";

export const MAX_HIGHLIGHTS: number = 4;

interface AboutSectionProps {
  highlights?: string[];
  children: ReactNode;
}

export function AboutSection({
  highlights = [],
  children,
}: AboutSectionProps): ReactElement {
  const t: ReturnType<typeof useTranslations<"About">> =
    useTranslations("About");
  const shown = highlights.slice(0, MAX_HIGHLIGHTS);
  return (
    <section
      id="about"
      aria-labelledby="about-title"
      className="scroll-mt-20 py-16"
    >
      <h2 id="about-title" className="text-2xl font-semibold">
        {t("title")}
      </h2>
      <div className="mt-6 max-w-prose">{children}</div>
      {shown.length > 0 && (
        <ul aria-label={t("highlights")} className="mt-6 flex flex-wrap gap-2">
          {shown.map((highlight) => (
            <li
              key={highlight}
              className="rounded-full border border-border px-3 py-1 text-sm"
            >
              {highlight}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
