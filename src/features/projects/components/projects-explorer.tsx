"use client";

import { type ReadonlyURLSearchParams, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { type JSX, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import type { Project } from "../curation/curate";
import {
  filterProjects,
  getTechOptions,
  parseTechParam,
  serializeTechParam,
  type TechOption,
  toggleTech,
} from "../filter";
import { ProjectGrid } from "./project-grid";

export function ProjectsExplorer({
  projects,
}: {
  projects: Project[];
}): JSX.Element {
  const t: ReturnType<typeof useTranslations<"Projecs">> =
    useTranslations("Projects");
  const searchParams: ReadonlyURLSearchParams = useSearchParams();
  const options: TechOption[] = useMemo(
    () => getTechOptions(projects),
    [projects],
  );
  const [selected, setSelected] = useState<string[]>(() =>
    parseTechParam(searchParams.get("tech"), options),
  );
  const visible: Project[] = filterProjects(projects, selected);
  function change(next: string[]): void {
    setSelected(next);
    const params = new URLSearchParams(window.location.search);
    if (next.length > 0) {
      params.set("tech", serializeTechParam(next));
    } else {
      params.delete("tech");
    }
    const query: string = params.toString();
    window.history.replaceState(
      null,
      "",
      query ? `?${query}` : window.location.pathname,
    );
  }
  return (
    <div>
      <fieldset
        aria-label={t("filterLabel")}
        className="flex flex-wrap gap-2 border-0 p-0"
      >
        {options.map((option) => {
          const pressed = selected.includes(option.name);
          return (
            <Button
              key={option.name}
              type="button"
              size="sm"
              variant={pressed ? "default" : "outline"}
              aria-pressed={pressed}
              onClick={(): void => change(toggleTech(selected, option.name))}
            >
              {option.name}
            </Button>
          );
        })}
        {selected.length > 0 && (
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={(): void => change([])}
          >
            {t("clearFilters")}
          </Button>
        )}
      </fieldset>
      <output className="mt-4 block text-sm text-muted-foreground">
        {t("count", { count: visible.length })}
      </output>
      <div className="mt-6">
        <ProjectGrid projects={visible} label={t("allTitle")} />
      </div>
    </div>
  );
}
