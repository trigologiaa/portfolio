// @vitest-environment node

import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { ContentError, loadCuration } from "@/lib/content/loader";

function rootWith(curation?: string): string {
  const root: string = mkdtempSync(path.join(tmpdir(), "portfolio-curation-"));
  if (curation !== undefined) {
    writeFileSync(path.join(root, "curation.json"), curation);
  }
  return root;
}

describe("loadCuration", (): void => {
  it("reads the lists and the featured count", (): void => {
    const root: string = rootWith(
      JSON.stringify({ exclude: ["old"], pin: ["a", "b"], featuredCount: 3 }),
    );
    expect(loadCuration(root)).toEqual({
      exclude: ["old"],
      pin: ["a", "b"],
      featuredCount: 3,
      selfRepo: "portfolio",
    });
  });

  it("falls back to the defaults when the file does not exist", (): void => {
    expect(loadCuration(rootWith())).toEqual({
      exclude: [],
      pin: [],
      featuredCount: 6,
      selfRepo: "portfolio",
    });
  });

  it("names the file and the field when the content is invalid", (): void => {
    const root: string = rootWith(JSON.stringify({ featuredCount: 0 }));
    expect(() => loadCuration(root)).toThrow(ContentError);
    expect(() => loadCuration(root)).toThrow(
      /content\/curation\.json.*featuredCount/,
    );
  });

  it("reports malformed JSON", (): void => {
    expect(() => loadCuration(rootWith("{ nope"))).toThrow(
      /content\/curation\.json: invalid JSON/,
    );
  });
});
