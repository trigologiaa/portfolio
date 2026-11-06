import { describe, expect, it } from "vitest";
import type { TimelineEntry } from "@/lib/content";
import { availableTypes, sortEntries } from "@/lib/timeline";

function entry(
  overrides: Partial<TimelineEntry> & { id: string },
): TimelineEntry {
  return {
    type: "education",
    title: `Title ${overrides.id}`,
    organization: "Org",
    start: "2020-01",
    description: "Description",
    ...overrides,
  };
}

describe("sortEntries", (): void => {
  it("orders the entries from the latest start date to the earliest", (): void => {
    const sorted: TimelineEntry[] = sortEntries([
      entry({ id: "old", start: "2018-03" }),
      entry({ id: "new", start: "2023-09" }),
      entry({ id: "mid", start: "2020-06" }),
    ]);
    expect(sorted.map((item: TimelineEntry): string => item.id)).toEqual([
      "new",
      "mid",
      "old",
    ]);
  });

  it("puts the ongoing entry first when two start in the same month", (): void => {
    const sorted: TimelineEntry[] = sortEntries([
      entry({ id: "finished", start: "2022-01", end: "2022-06" }),
      entry({ id: "ongoing", start: "2022-01" }),
    ]);
    expect(sorted.map((item: TimelineEntry): string => item.id)).toEqual([
      "ongoing",
      "finished",
    ]);
  });

  it("does not modify the original array", (): void => {
    const original: TimelineEntry[] = [
      entry({ id: "a", start: "2019-01" }),
      entry({ id: "b", start: "2021-01" }),
    ];
    sortEntries(original);
    expect(original.map((item: TimelineEntry): string => item.id)).toEqual([
      "a",
      "b",
    ]);
  });
});

describe("availableTypes", (): void => {
  it("lists only the types that have entries, in a fixed order", (): void => {
    const types: TimelineEntry["type"][] = availableTypes([
      entry({ id: "a", type: "work" }),
      entry({ id: "b", type: "education" }),
      entry({ id: "c", type: "work" }),
    ]);
    expect(types).toEqual(["education", "work"]);
  });

  it("returns an empty list when there are no entries", (): void => {
    expect(availableTypes([])).toEqual([]);
  });
});
