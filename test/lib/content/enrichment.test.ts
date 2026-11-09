// @vitest-environment node

import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { loadEnrichment, parseEnrichment } from "@/lib/content/enrichment";
import { ContentError } from "@/lib/content/loader";

const valid = `---
summary: A hand-written summary
demo: https://demo.example.dev
tags: [react, typescript]
screenshots:
  - src: /projects/shop-api/home.png
    alt: Home page of the shop
---

Longer text about **the project**.
`;

function rootWithProject(fileName: string, text: string): string {
  const root: string = mkdtempSync(
    path.join(tmpdir(), "portfolio-enrichment-"),
  );
  mkdirSync(path.join(root, "projects"));
  writeFileSync(path.join(root, "projects", fileName), text);
  return root;
}

describe("loadEnrichment", (): void => {
  it("reads the frontmatter and the body of the matching file", (): void => {
    const root: string = rootWithProject("shop-api.en.mdx", valid);
    const enrichment = loadEnrichment(root, "shop-api", "en");
    expect(enrichment).toMatchObject({
      summary: "A hand-written summary",
      demo: "https://demo.example.dev",
      tags: ["react", "typescript"],
      screenshots: [
        { src: "/projects/shop-api/home.png", alt: "Home page of the shop" },
      ],
    });
    expect(enrichment?.body).toBe("Longer text about **the project**.");
  });

  it("returns null when there is no file for that repository or language", (): void => {
    const root: string = rootWithProject("shop-api.en.mdx", valid);
    expect(loadEnrichment(root, "shop-api", "es")).toBeNull();
    expect(loadEnrichment(root, "other", "en")).toBeNull();
  });

  it("returns null instead of reading outside the folder for unsafe names", (): void => {
    const root: string = rootWithProject("shop-api.en.mdx", valid);
    expect(loadEnrichment(root, "../curation", "en")).toBeNull();
  });
});

describe("parseEnrichment", (): void => {
  it("accepts a file with no frontmatter at all", (): void => {
    expect(parseEnrichment("Only text", "label")).toMatchObject({
      tags: [],
      screenshots: [],
      body: "Only text",
    });
  });

  it("names the file and the field when a screenshot has no alt text", (): void => {
    const text = `---\nscreenshots:\n  - src: /a.png\n---\nBody`;
    expect(() => parseEnrichment(text, "content/projects/x.en.mdx")).toThrow(
      ContentError,
    );
    expect(() => parseEnrichment(text, "content/projects/x.en.mdx")).toThrow(
      /content\/projects\/x\.en\.mdx.*screenshots\.0\.alt/,
    );
  });
});
