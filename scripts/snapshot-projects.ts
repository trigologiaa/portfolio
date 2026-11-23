import { writeFileSync } from "node:fs";
import path from "node:path";
import { loadEnvConfig } from "@next/env";
import {
  curateProjects,
  type Project,
} from "@/features/projects/curation/curate";
import { getRepositories } from "@/features/projects/github/get-repositories";
import type { RepositoriesResult } from "@/features/projects/types";
import { loadCuration } from "@/lib/content/loader";

async function main(): Promise<void> {
  loadEnvConfig(process.cwd());
  const result: RepositoriesResult = await getRepositories();
  if (!result.ok) {
    console.error(
      `Could not fetch the repositories (${result.error}). The snapshot was not changed.`,
    );
    process.exit(1);
  }
  const contentRoot: string = path.join(process.cwd(), "content");
  const curated: Project[] = curateProjects(
    result.data,
    loadCuration(contentRoot),
    new Date(),
  );
  const file: string = path.join(contentRoot, "projects-fallback.json");
  writeFileSync(
    file,
    `${JSON.stringify(
      curated.map((project) => project.repository),
      null,
      2,
    )}\n`,
  );
  console.log(
    `Saved ${curated.length} repositories to content/projects-fallback.json`,
  );
}

main().catch((error: unknown): void => {
  console.error(error);
  process.exit(1);
});
