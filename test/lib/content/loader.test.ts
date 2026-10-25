import { describe, expect, it } from "vitest";
import {
  ContentError,
  loadAbout,
  loadProfile,
  loadStack,
  loadTimeline,
} from "@/lib/content/loader";
import type { Profile } from "@/lib/content/schemas";
import { makeContentRoot, validProfile } from "../../helpers/content-fixtures";

describe("loadProfile", (): void => {
  it("returns the profile of the requested locale", (): void => {
    const root: string = makeContentRoot({
      es: {
        profile: { ...validProfile, headline: "Desarrolladora full-stack" },
      },
    });
    expect(loadProfile(root, "es").headline).toBe("Desarrolladora full-stack");
    expect(loadProfile(root, "en").headline).toBe("Full-stack developer");
  });

  it("throws a typed error for an unsupported locale", (): void => {
    const root: string = makeContentRoot();
    const load = (): Profile => loadProfile(root, "fr");
    expect(load).toThrow(ContentError);
    expect(load).toThrow(
      expect.objectContaining({ code: "unsupported_locale" }),
    );
  });
});

describe("error reporting", (): void => {
  it("names the file, the entry index and the field of an invalid timeline", (): void => {
    const root: string = makeContentRoot({
      en: {
        timeline: {
          entries: [
            {
              id: "ok",
              type: "course",
              title: "Course",
              organization: "X",
              start: "2023-01",
              description: "d",
            },
            {
              id: "bad",
              type: "course",
              organization: "X",
              start: "2023-01",
              description: "d",
            },
          ],
        },
      },
    });
    expect(() => loadTimeline(root, "en")).toThrow(
      /content\/en\/timeline\.json/,
    );
    expect(() => loadTimeline(root, "en")).toThrow(/entries\.1\.title/);
  });

  it("reports a missing file", (): void => {
    const root: string = makeContentRoot({ es: { about: null } });
    expect(() => loadAbout(root, "es")).toThrow(
      /content\/es\/about\.mdx: file not found/,
    );
  });

  it("rejects a profile that is not an object", (): void => {
    const root: string = makeContentRoot({ en: { profile: "just text" } });
    expect(() => loadProfile(root, "en")).toThrow(/content\/en\/profile\.json/);
  });
});

describe("loadAbout, loadStack and loadTimeline", (): void => {
  it("load valid content", (): void => {
    const root: string = makeContentRoot();
    expect(loadStack(root, "en").categories[0]?.items[0]?.name).toBe("React");
    expect(loadTimeline(root, "en").entries).toHaveLength(1);
    expect(loadAbout(root, "en")).toBe("Hello, I am Ada.");
  });

  it("rejects an empty about file", (): void => {
    const root: string = makeContentRoot({ en: { about: "   " } });
    expect(() => loadAbout(root, "en")).toThrow(
      /content\/en\/about\.mdx: file is empty/,
    );
  });
});
