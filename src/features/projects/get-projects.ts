import "server-only";
import path from "node:path";
import { cacheLife, cacheTag } from "next/cache";
import { getCuration, getEnrichment } from "@/lib/content";
import { readFallbackRepositories } from "./fallback";
import { getRepositories } from "./github/get-repositories";
import { type ProjectsData, resolveProjects } from "./resolve-projects";

const fallbackFile: string = path.join(
  process.cwd(),
  "content",
  "projects-fallback.json",
);

export async function getProjects(locale: string): Promise<ProjectsData> {
  "use cache";
  cacheLife("hours");
  cacheTag("github");
  return await resolveProjects(locale, {
    getRepositories: () => getRepositories(),
    getCuration,
    getEnrichment,
    now: () => new Date(),
    warn: (message: string) => console.warn(`[projects] ${message}`),
    getFallbackRepositories: () => readFallbackRepositories(fallbackFile),
    isBuildPhase: () => process.env.NEXT_PHASE === "phase-production-build",
    log: (message: string) => console.error(message),
  });
}
