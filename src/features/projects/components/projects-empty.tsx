import { useTranslations } from "next-intl";
import type { JSX } from "react/jsx-runtime";
import { Button } from "@/components/ui/button";

export function ProjectsEmpty({
  githubUrl,
}: {
  githubUrl: string;
}): JSX.Element {
  const t: ReturnType<typeof useTranslations<"Projects">> =
    useTranslations("Projects");
  return (
    <div className="rounded-xl border border-dashed border-border p-8 text-center">
      <p className="text-lg font-medium">{t("emptyTitle")}</p>
      <p className="mt-2 text-mute-foreground">{t("emptyDescription")}</p>
      <Button asChild variant="outline" className="mt-6">
        <a href={githubUrl} target="_blank" rel="noopener noreferrer">
          {t("viewGithub")}
        </a>
      </Button>
    </div>
  );
}
