import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { validateContent } from "@/lib/content/validate";
import { makeContentRoot, validTimeline } from "../../helpers/content-fixtures";

describe("validateContent", (): void => {
  it("returns no errors for valid content in both locales", (): void => {
    expect(validateContent(makeContentRoot())).toEqual([]);
  });

  it("reports an invalid file with its location", (): void => {
    const root: string = makeContentRoot({
      en: {
        timeline: {
          entries: [{ ...validTimeline.entries[0], title: undefined }],
        },
      },
    });
    const errors = validateContent(root);
    expect(errors).toHaveLength(1);
    expect(errors[0]).toContain("content/en/timeline.json");
    expect(errors[0]).toContain("entries.0.title");
  });

  it("reports a timeline entry that exists in only one locale", (): void => {
    const extra = { ...validTimeline.entries[0], id: "extra" };
    const root: string = makeContentRoot({
      es: { timeline: { entries: [...validTimeline.entries, extra] } },
    });
    expect(validateContent(root)).toContain(
      'timeline: id "extra" exists in es but is missing in en',
    );
  });

  it("reports a missing about life", (): void => {
    const root: string = makeContentRoot({ en: { about: null } });
    expect(validateContent(root)).toContain(
      "content/en/about.mdx: file not found",
    );
  });

  it("reports an invalid curation file", (): void => {
    const root: string = makeContentRoot();
    writeFileSync(
      path.join(root, "curation.json"),
      JSON.stringify({ featuredCount: 0 }),
    );
    const errors: string[] = validateContent(root);
    expect(errors).toHaveLength(1);
    expect(errors[0]).toContain("content/curation.json");
  });

  it("reports a project file with invalid frontmatter", (): void => {
    const root: string = makeContentRoot();
    mkdirSync(path.join(root, "projects"));
    writeFileSync(
      path.join(root, "projects", "shop.en.mdx"),
      `---\nscreenshots:\n  - src: /a.png\n---\nBody`,
    );
    const errors: string[] = validateContent(root);
    expect(errors[0]).toContain("content/projects/shop.en.mdx");
    expect(errors[0]).toContain("screenshots.0.alt");
  });

  it("reports a project file whose name has no valid language", (): void => {
    const root: string = makeContentRoot();
    mkdirSync(path.join(root, "projects"));
    writeFileSync(path.join(root, "projects", "shop.fr.mdx"), "Body");
    expect(validateContent(root)).toContain(
      'content/projects/shop.fr.mdx: the file name must end in ".en.mdx" or ".es.mdx"',
    );
  });
});
