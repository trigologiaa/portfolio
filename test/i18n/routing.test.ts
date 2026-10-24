import { describe, expect, it } from "vitest";
import { localeNames } from "@/i18n/locale-names";
import { routing } from "@/i18n/routing";

describe("routing", (): void => {
  it("supports English and Spanish with English as the default", (): void => {
    expect(routing.locales).toEqual(["en", "es"]);
    expect(routing.defaultLocale).toBe("en");
  });

  it("has a display name for every locale", (): void => {
    for (const locale of routing.locales) {
      expect(localeNames[locale], locale).toBeTruthy();
    }
  });
});
