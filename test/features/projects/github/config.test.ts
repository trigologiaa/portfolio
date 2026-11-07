import { describe, expect, it } from "vitest";
import { readGithubConfig } from "@/features/projects/github/config";

describe("readGithubConfig", (): void => {
  it("reads the username and the optional token", (): void => {
    const result = readGithubConfig({
      // biome-ignore lint/style/useNamingConvention: env var names are SCREAMING_SNAKE_CASE
      GH_USERNAME: "ada",
      // biome-ignore lint/style/useNamingConvention: env var names are SCREAMING_SNAKE_CASE
      GH_API_TOKEN: "secret",
    });
    expect(result).toEqual({
      ok: true,
      config: {
        username: "ada",
        token: "secret",
        revalidateSeconds: 3600,
        dataSource: "api",
      },
    });
  });

  it("works without a token", (): void => {
    const result = readGithubConfig({
      // biome-ignore lint/style/useNamingConvention: env var names are SCREAMING_SNAKE_CASE
      GH_USERNAME: "ada",
    });
    expect(result.ok && result.config.token).toBeUndefined();
  });

  it("names the missing variable when the username is not set", (): void => {
    expect(readGithubConfig({})).toEqual({
      ok: false,
      missing: ["GH_USERNAME"],
    });
  });

  it("treats an empty username as missing", (): void => {
    const result = readGithubConfig({
      // biome-ignore lint/style/useNamingConvention: env var names are SCREAMING_SNAKE_CASE
      GH_USERNAME: "   ",
    });
    expect(result).toEqual({
      ok: false,
      missing: ["GH_USERNAME"],
    });
  });

  it("does not require a username in fixture mode", (): void => {
    const result = readGithubConfig({
      // biome-ignore lint/style/useNamingConvention: env var names are SCREAMING_SNAKE_CASE
      GH_DATA_SOURCE: "fixture",
    });
    expect(result.ok && result.config.dataSource).toBe("fixture");
  });
});
