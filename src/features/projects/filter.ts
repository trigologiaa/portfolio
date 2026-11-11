import type { Project } from "./curation/curate";
import { getProjectTech } from "./tech";

export interface TechOption {
  name: string;
  count: number;
}

const key = (name: string): string => name.toLowerCase();

export function getTechOptions(projects: readonly Project[]): TechOption[] {
  const options = new Map<string, TechOption>();
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
