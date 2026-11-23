import type { RepositoriesError } from "./types";

export function formatGithubFailure(kind: RepositoriesError, at: Date): string {
  return `[projects] GitHub request failed (${kind}) at ${at.toISOString()}`;
}

export function redact(text: string, secrets: (string | undefined)[]): string {
  return secrets
    .filter(
      (secret: string | undefined): secret is string =>
        typeof secret === "string" && secret !== "",
    )
    .reduce(
      (result: string, secret: string) => result.split(secret).join("***"),
      text,
    );
}
