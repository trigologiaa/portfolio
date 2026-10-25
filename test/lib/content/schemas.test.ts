import { describe, expect, it } from "vitest";
import {
  curationSchema,
  enrichmentSchema,
  profileSchema,
  stackSchema,
  timelineSchema,
} from "@/lib/content/schemas";
import {
  validProfile,
  validStack,
  validTimelineEntry,
} from "../../helpers/content-fixtures";

describe("curationSchema", (): void => {
  it("has sensible defaults", (): void => {
    expect(curationSchema.parse({})).toEqual({
      exclude: [],
      pin: [],
      featuredCount: 6,
      selfRepo: "portfolio",
    });
  });

  it("rejects a featuredCount below 1", (): void => {
    expect(curationSchema.safeParse({ featuredCount: 0 }).success).toBe(false);
  });
});

describe("enrichmentSchema", (): void => {
  it("accepts an empty frontmatter and fills the defaults", (): void => {
    const enrichment: ReturnType<typeof enrichmentSchema.parse> =
      enrichmentSchema.parse({});
    expect(enrichment.tags).toEqual([]);
    expect(enrichment.screenshots).toEqual([]);
  });

  it("requires alt text for every screenshot", (): void => {
    const result = enrichmentSchema.safeParse({
      screenshots: [{ src: "/projects/a/1.png" }],
    });
    expect(result.success).toBe(false);
  });
});

describe("profileSchema", (): void => {
  it("accepts a valid profile and defaults the highlights to an empty list", (): void => {
    const { highlights, ...withoutHighlights } = validProfile;
    void highlights;
    const profile: ReturnType<typeof profileSchema.parse> =
      profileSchema.parse(withoutHighlights);
    expect(profile.highlights).toEqual([]);
  });

  it("rejects an invalid email", (): void => {
    const result: ReturnType<typeof profileSchema.safeParse> =
      profileSchema.safeParse({
        ...validProfile,
        email: "not-an-email",
      });
    expect(result.success).toBe(false);
  });

  it("rejects a profile without a name", (): void => {
    const { name, ...withoutName } = validProfile;
    void name;
    expect(profileSchema.safeParse(withoutName).success).toBe(false);
  });
});

describe("stackSchema", (): void => {
  it("accepts categories with items", (): void => {
    expect(stackSchema.safeParse(validStack).success).toBe(true);
  });

  it("rejects a category without items", (): void => {
    const stack = {
      categories: [{ ...validStack.categories[0], items: [] }],
    };
    expect(stackSchema.safeParse(stack).success).toBe(false);
  });
});

describe("timelineSchema", (): void => {
  const entry = validTimelineEntry;

  it("accepts an ongoing entry (no end date)", (): void => {
    expect(timelineSchema.safeParse({ entries: [entry] }).success).toBe(true);
  });

  it("accepts a day-level date", (): void => {
    expect(
      timelineSchema.safeParse({ entries: [{ ...entry, end: "2024-12-15" }] })
        .success,
    ).toBe(true);
  });

  it("rejects a malformed date", (): void => {
    expect(
      timelineSchema.safeParse({ entries: [{ ...entry, start: "March 2020" }] })
        .success,
    ).toBe(false);
  });

  it("rejects an unknown type", (): void => {
    expect(
      timelineSchema.safeParse({ entries: [{ ...entry, type: "hobby" }] })
        .success,
    ).toBe(false);
  });
});
