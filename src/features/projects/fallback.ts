import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import type { ZodSafeParseResult } from "zod";
import type { $ZodIssue } from "zod/v4/core";
import { repositoriesSchema } from "./schema";
import type { Repository } from "./types";

export function readFallbackRepositories(filePath: string): Repository[] {
  if (!existsSync(filePath)) {
    return [];
  }
  const label: string = path.basename(filePath);
  let data: unknown;
  try {
    data = JSON.parse(readFileSync(filePath, "utf8"));
  } catch {
    throw new Error(`${label}: invalid JSON`);
  }
  const result: ZodSafeParseResult<Repository[]> =
    repositoriesSchema.safeParse(data);
  if (!result.success) {
    const issues = result.error.issues
      .map(
        (issue: $ZodIssue) =>
          `${issue.path.join(".") || "(root)"} — ${issue.message}`,
      )
      .join("; ");
    throw new Error(`${label}: ${issues}`);
  }
  return result.data;
}
