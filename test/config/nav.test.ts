import { describe, expect, it } from "vitest";
import { navItems, sectionHref } from "@/config/nav";
import en from "../../messages/en.json";
import es from "../../messages/es.json";

describe("navItems", (): void => {
  it("lists the home section in page order", (): void => {
    expect(navItems.map((item) => item.id)).toEqual([
      "projects",
      "about",
      "stack",
      "experience",
      "contact",
    ]);
  });

  it("has a label in both catalogs for every item", (): void => {
    for (const { id } of navItems) {
      expect(en.Nav, id).toHaveProperty(id);
      expect(es.Nav, id).toHaveProperty(id);
    }
  });
});

describe("sectionHref", (): void => {
  it("points to the section anchor on the home page", (): void => {
    expect(sectionHref("about")).toBe("/#about");
  });
});
