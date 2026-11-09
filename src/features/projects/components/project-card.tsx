import { useTranslations } from "next-intl";
import type { JSX } from "react/jsx-runtime";
import { Link } from "@/i18n/navigation";
import type { Project } from "../curation/curate";
import { getProjectSummary, getProjectTitle } from "../presentation";
import { getProjectTech } from "../tech";

const MAX_TAGS: number = 4;

export function ProjectCard({ project }: { project: Project }): JSX.Element {
  const t: ReturnType<typeof useTranslations<"Projects">> =
    useTranslations("Projects");
  const title: string = getProjectTitle(project);
  const summary: string | null = getProjectSummary(project);
  const tech: string[] = getProjectTech(project);
  return (
    <article className="flex h-full flex-col gap-3 rounded-xl border border-border bg-card p-5 text-card-foreground">
      <h3 className="text-lg font-semibold">
        <Link href={`/projects/${project.slug}`} className="hover:underline">
          {title}
        </Link>
      </h3>
      {summary && <p className="text-sm text-muted-foreground">{summary}</p>}
      {tech.length > 0 && (
        <ul
          aria-label={t("technologies")}
          className="mt-auto flex flex-wrap gap-2"
        >
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
    </article>
  );
}
