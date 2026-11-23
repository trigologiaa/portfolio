import { useTranslations } from "next-intl";
import type { JSX } from "react/jsx-runtime";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import type { Project } from "../curation/curate";
import { ProjectGrid } from "./project-grid";
import { ProjectsEmpty } from "./projects-empty";

interface ProjectsSectionProps {
  projects: Project[];
  githubUrl: string;
}

export function ProjectsSection({
  projects,
  githubUrl,
}: ProjectsSectionProps): JSX.Element {
  const t: ReturnType<typeof useTranslations<"Projects">> =
    useTranslations("Projects");
  return (
    <section
      id="projects"
      aria-labelledby="projects-title"
      className="scroll-mt-20 py-16"
    >
      <h2 id="projects-title" className="text-2xl font-semibold">
        {t("title")}
      </h2>
      {projects.length === 0 ? (
        <div className="mt-8">
          <ProjectsEmpty githubUrl={githubUrl} />
        </div>
      ) : (
        <>
          <div className="mt-8">
            <ProjectGrid projects={projects} label={t("title")} />
          </div>
          <div className="mt-8">
            <Button asChild variant="outline">
              <Link href="/projects">{t("viewAll")}</Link>
            </Button>
          </div>
        </>
      )}
    </section>
  );
}
