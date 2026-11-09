import type { Project } from "./curation/curate";
import type { Repository } from "./types";

function languagesByUsage(repository: Repository): string[] {
  const byUsage: string[] = Object.entries(repository.languages)
    .sort(([, a]: [string, number], [, b]: [string, number]): number => b - a)
    .map(([name]: [string, number]): string => name);
  if (byUsage.length > 0) {
    return byUsage;
  }
  return repository.language ? [repository.language] : [];
}

export function getProjectTech(project: Project): string[] {
  const { repository, enrichment } = project;
  const seen: Set<string> = new Set<string>();
  const result: string[] = [];
  for (const name of [
    ...languagesByUsage(repository),
    ...(enrichment?.tags ?? []),
    ...repository.topics,
  ]) {
    const key: string = name.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      result.push(name);
    }
  }
  return result;
}
