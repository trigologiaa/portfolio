export interface GithubConfig {
  username: string;
  token: string | undefined;
  revalidateSeconds: number;
  dataSource: "api" | "fixture";
}

export type GithubConfigResult =
  | { ok: true; config: GithubConfig }
  | { ok: false; missing: string[] };

export const REVALIDATE_SECONDS: number = 3600;

export function readGithubConfig(
  env: Record<string, string | undefined> = process.env,
): GithubConfigResult {
  const dataSource: GithubConfig["dataSource"] =
    env.GH_DATA_SOURCE === "fixture" ? "fixture" : "api";
  const username: string = env.GH_USERNAME?.trim() || "";
  const token: string | undefined = env.GH_API_TOKEN?.trim() || undefined;
  if (dataSource === "api" && username === "") {
    return {
      ok: false,
      missing: ["GH_USERNAME"],
    };
  }
  return {
    ok: true,
    config: {
      username,
      token,
      revalidateSeconds: REVALIDATE_SECONDS,
      dataSource,
    },
  };
}
