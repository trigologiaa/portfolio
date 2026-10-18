import { describe, expect, it } from "vitest";
import { formatPageTitle, siteConfig } from "@/lib/site";

describe("formatPageTitle", (): void => {
  it("returns the site name with the suffix when there is no page title", (): void => {
    expect(formatPageTitle()).toBe(`${siteConfig.name} - Portfolio`);
  });

  it("prefixes the page title to the site name", (): void => {
    expect(formatPageTitle("Projects")).toBe(`Projects | ${siteConfig.name}`);
  });
});
