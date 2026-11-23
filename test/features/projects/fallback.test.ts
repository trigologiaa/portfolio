// @vitest-environment node
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { readFallbackRepositories } from "@/features/projects/fallback";
import type { Repository } from "@/features/projects/types";
import { makeRepo } from "../../helpers/repo-factory";

function fileWith(content?: string): string {
  const directory: string = mkdtempSync(
    path.join(tmpdir(), "portfolio-fallback-"),
  );
  const file: string = path.join(directory, "projects-fallback.json");
  if (content !== undefined) {
    writeFileSync(file, content);
  }
  return file;
}

describe("readFallbackRepositories", (): void => {
  it("reads the saved repositories", (): void => {
    const repo: Repository = makeRepo({
      name: "saved",
      url: "https://github.com/ada/saved",
    });
    expect(readFallbackRepositories(fileWith(JSON.stringify([repo])))).toEqual([
      repo,
    ]);
  });

  it("accepts an empty list", (): void => {
    expect(readFallbackRepositories(fileWith("[]"))).toEqual([]);
  });

  it("returns an empty list when the file does not exist", (): void => {
    expect(readFallbackRepositories(fileWith())).toEqual([]);
  });

  it("fails loudly when the file is not valid, naming it", (): void => {
    expect(() =>
      readFallbackRepositories(fileWith(JSON.stringify([{ name: "broken" }]))),
    ).toThrow(/projects-fallback\.json/);
  });

  it("fails loudly when the file is not JSON", (): void => {
    expect(() => readFallbackRepositories(fileWith("{ nope"))).toThrow(
      /projects-fallback\.json/,
    );
  });
});
