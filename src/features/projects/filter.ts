import type { Project } from "./curation/curate";
import { getProjectTech } from "./tech";

export interface TechOption {
  name: string;
  count: number;
}

const key = (name: string): string => name.toLowerCase();

export function filterProjects(
  projects: readonly Project[],
  selected: readonly string[],
): Project[] {
  if (selected.length === 0) {
    return [...projects];
  }
  const wanted: Set<string> = new Set(selected.map(key));
  return projects.filter((project: Project) =>
    getProjectTech(project).some((name: string) => wanted.has(key(name))),
  );
}

export function getTechOptions(projects: readonly Project[]): TechOption[] {
  const options: Map<string, TechOption> = new Map<string, TechOption>();
  for (const project of projects) {
    for (const name of getProjectTech(project)) {
      const existing = options.get(key(name));
      if (existing) {
        existing.count += 1;
      } else {
        options.set(key(name), { name, count: 1 });
      }
    }
  }
  return [...options.values()].sort(
    (a, b) => b.count - a.count || a.name.localeCompare(b.name),
  );
}

export function parseTechParam(
  param: string | null,
  options: readonly TechOption[],
): string[] {
  if (!param) {
    return [];
  }
  const byKey: Map<string, string> = new Map(
    options.map((option: TechOption) => [key(option.name), option.name]),
  );
  const result: string[] = [];
  for (const raw of param.split(",")) {
    const name: string | undefined = byKey.get(key(raw.trim()));
    if (name && !result.includes(name)) {
      result.push(name);
    }
  }
  return result;
}

export function serializeTechParam(selected: readonly string[]): string {
  return selected.map(key).join(",");
}

export function toggleTech(
  selected: readonly string[],
  name: string,
): string[] {
  return selected.some((item) => key(item) === key(name))
    ? selected.filter((item) => key(item) !== key(name))
    : [...selected, name];
}
