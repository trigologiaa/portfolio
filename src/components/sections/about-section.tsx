import { useTranslations } from "next-intl";
import type { ReactElement, ReactNode } from "react";

export function AboutSection({
  children,
}: {
  children: ReactNode;
}): ReactElement {
  const t: ReturnType<typeof useTranslations<"About">> =
    useTranslations("About");
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
    </section>
  );
}
