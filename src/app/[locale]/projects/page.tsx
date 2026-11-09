import { getTranslations } from "next-intl/server";
import type { JSX } from "react/jsx-runtime";
import { ProjectGrid } from "@/features/projects/components/project-grid";
import type { Project } from "@/features/projects/curation/curate";
import { getProjects } from "@/features/projects/get-projects";
import { Link } from "@/i18n/navigation";

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<JSX.Element> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Projects" });
  const projects: Project[] = await getProjects(locale);
  return (
    <main id="content" className="mx-auto max-w-5xl px-4 py-16">
      <Link
        href="/"
        className="text-sm text-primary underline-offset-4 hover:underline"
      >
        ← {t("backHome")}
      </Link>
      <h1 className="mt-4 text-3xl font-bold tracking-tight">
        {t("allTitle")}
      </h1>
      <div className="mt-8">
        <ProjectGrid projects={projects} label={t("allTitle")} />
      </div>
    </main>
  );
}
