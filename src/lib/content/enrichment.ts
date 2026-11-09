import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { ZodSafeParseResult } from "zod";
import { ContentError, describeIssues } from "./loader";
import { enrichmentSchema, type ProjectEnrichmentFrontmatter } from "./schemas";

const SAFE_REPO_NAME: RegExp = /^[A-Za-z0-9._-]+$/;

export type ProjectEnrichment = ProjectEnrichmentFrontmatter & { body: string };

export function parseEnrichment(
  text: string,
  label: string,
): ProjectEnrichment {
  const parsed: matter.GrayMatterFile<string> = matter(text);
  const result: ZodSafeParseResult<ProjectEnrichmentFrontmatter> =
    enrichmentSchema.safeParse(parsed.data);
  if (!result.success) {
    throw new ContentError(
      "invalid_content",
      `${label}: ${describeIssues(result.error)}`,
    );
  }
  return {
    ...result.data,
    body: parsed.content.trim(),
  };
}

export function loadEnrichment(
  root: string,
  repoName: string,
  locale: string,
): ProjectEnrichment | null {
  if (!SAFE_REPO_NAME.test(repoName) || repoName.includes("..")) {
    return null;
  }
  const fileName: string = `${repoName}.${locale}.mdx`;
  const filePath: string = path.join(root, "projects", fileName);
  if (!existsSync(filePath)) {
    return null;
  }
  return parseEnrichment(
    readFileSync(filePath, "utf8"),
    `content/projects/${fileName}`,
  );
}

export function validateEnrichmentFiles(root: string): string[] {
  const dir: string = path.join(root, "projects");
  if (!existsSync(dir)) {
    return [];
  }
  const errors: string[] = [];
  for (const fileName of readdirSync(dir).filter((name: string) =>
    name.endsWith(".mdx"),
  )) {
    const label: string = `content/projects/${fileName}`;
    const match: RegExpExecArray | null = /^(.+)\.(en|es)\.mdx$/.exec(fileName);
    if (!match) {
      errors.push(`${label}: the file name must end in ".en.mdx" or ".es.mdx"`);
      continue;
    }
    try {
      parseEnrichment(readFileSync(path.join(dir, fileName), "utf8"), label);
    } catch (error) {
      if (error instanceof ContentError) {
        errors.push(error.message);
      } else {
        throw error;
      }
    }
  }
  return errors;
}
