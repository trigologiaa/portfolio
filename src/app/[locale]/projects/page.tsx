import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import type { JSX } from "react/jsx-runtime";
import { ProjectGrid } from "@/features/projects/components/project-grid";
import { ProjectsEmpty } from "@/features/projects/components/projects-empty";
import { ProjectsExplorer } from "@/features/projects/components/projects-explorer";
import { getProjects } from "@/features/projects/get-projects";
import { Link } from "@/i18n/navigation";
import { getProfile, type Profile } from "@/lib/content";

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<JSX.Element> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Projects" });
  const { projects } = await getProjects(locale);
  const profile: Profile = getProfile(locale);
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
        {projects.length === 0 ? (
          <ProjectsEmpty githubUrl={profile.links.github} />
        ) : (
          <Suspense
            fallback={<ProjectGrid projects={projects} label={t("allTitle")} />}
          >
            <ProjectsExplorer projects={projects} />
          </Suspense>
        )}
      </div>
    </main>
  );
}
