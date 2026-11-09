import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import type { JSX } from "react/jsx-runtime";
import { Link } from "@/i18n/navigation";
import type { Project } from "../curation/curate";
import {
  formatUpdated,
  getCoverImage,
  getDemoUrl,
  getProjectSummary,
  getProjectTitle,
} from "../presentation";
import { getProjectTech } from "../tech";

const MAX_TAGS: number = 4;

const externalLink: string =
  "inline-flex min-h-11 items-center text-sm font-medium text-primary underline-offset-4 hover:underline";

export function ProjectCard({ project }: { project: Project }): JSX.Element {
  const t: ReturnType<typeof useTranslations<"Projects">> =
    useTranslations("Projects");
  const locale: string = useLocale();
  const title: string = getProjectTitle(project);
  const tech: string[] = getProjectTech(project);
  const demo: string | null = getDemoUrl(project);
  const cover = getCoverImage(project);
  const updated: string = formatUpdated(project.repository.pushedAt, locale);
  const summary: string =
    getProjectSummary(project) ??
    (tech[0]
      ? t("fallbackSummary", {
          language: project.repository.language ?? tech[0],
        })
      : t("fallbackSummaryNoLanguage"));
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card text-card-foreground">
      {cover ? (
        <Image
          src={cover.src}
          alt={cover.alt}
          width={640}
          height={360}
          sizes="(min-width: 1024px) 320px, (min-width: 640px) 45vw, 100vw"
          className="aspect-video w-full object-cover"
        />
      ) : (
        <div
          aria-hidden="true"
          className="aspect-video w-full bg-gradient-to-br from-primary/30 via-secondary to-accent"
        />
      )}
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-lg font-semibold">
            <Link
              href={`/projects/${project.slug}`}
              className="hover:underline"
            >
              {title}
            </Link>
          </h3>
          {project.featured && (
            <span className="shrink-0 rounded-full bg-primary px-2.5 py-0.5 text-xs font-medium text-primary-foreground">
              {t("featured")}
            </span>
          )}
        </div>
        <p className="text-sm text-muted-foreground">{summary}</p>
        {tech.length > 0 && (
          <ul aria-label={t("technologies")} className="flex flex-wrap gap-2">
            {tech.slice(0, MAX_TAGS).map((name) => (
              <li
                key={name}
                className="rounded-full bg-secondary px-2.5 py-0.5 text-xs text-secondary-foreground"
              >
                {name}
              </li>
            ))}
          </ul>
        )}
        <div className="mt-auto flex flex-wrap items-center gap-x-4 pt-2">
          <a
            href={project.repository.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t("repositoryOf", { name: title })}
            className={externalLink}
          >
            {t("repository")}
          </a>
          {demo && (
            <a
              href={demo}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t("demoOf", { name: title })}
              className={externalLink}
            >
              {t("demo")}
            </a>
          )}
          {updated && (
            <span className="ml-auto text-xs text-muted-foreground">
              {t("updated", { date: updated })}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
