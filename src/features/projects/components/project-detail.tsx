import { useLocale, useTranslations } from "next-intl";
import type { JSX, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import type { Project } from "../curation/curate";
import {
  formatUpdated,
  getDemoUrl,
  getProjectSummary,
  getProjectTitle,
} from "../presentation";
import { getProjectTech } from "../tech";

interface ProjectDetailProps {
  project: Project;
  previous: Project | null;
  next: Project | null;
  children?: ReactNode;
}

export function ProjectDetail({
  project,
  children,
}: ProjectDetailProps): JSX.Element {
  const t: ReturnType<typeof useTranslations<"Projects">> =
    useTranslations("Projects");
  const locale: string = useLocale();
  const title: string = getProjectTitle(project);
  const summary: string | null = getProjectSummary(project);
  const tech: string[] = getProjectTech(project);
  const demo: string | null = getDemoUrl(project);
  const updated: string = formatUpdated(project.repository.pushedAt, locale);
  return (
    <article className="mx-auto max-w-3xl px-4 py-16">
      <Link
        href="/projects"
        className="text-sm text-primary underline-offset-4 hover:underline"
      >
        ← {t("allTitle")}
      </Link>
      <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
        {title}
      </h1>
      {summary && (
        <p className="mt-3 text-lg text-muted-foreground">{summary}</p>
      )}
      <div className="mt-6 flex flex-wrap gap-3">
        <Button asChild>
          <a
            href={project.repository.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t("repositoryOf", { name: title })}
          >
            {t("repository")}
          </a>
        </Button>
        {demo && (
          <Button asChild variant="outline">
            <a
              href={demo}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t("demoOf", { name: title })}
            >
              {t("demo")}
            </a>
          </Button>
        )}
      </div>
      {updated && (
        <p className="mt-4 text-sm text-muted-foreground">
          {t("updated", { date: updated })}
        </p>
      )}
      {tech.length > 0 && (
        <ul
          aria-label={t("technologies")}
          className="mt-6 flex flex-wrap gap-2"
        >
          {tech.map((name) => (
            <li
              key={name}
              className="rounded-full bg-secondary px-3 py-1 text-sm text-secondary-foreground"
            >
              {name}
            </li>
          ))}
        </ul>
      )}
      {children && <div className="mt-10">{children}</div>}
    </article>
  );
}
