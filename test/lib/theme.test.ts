import { describe, expect, it } from "vitest";
import { flavors, sanitizeTheme, systemFlavor } from "../../src/lib/theme";

describe("flavors", (): void => {
  it("lists the four Catppuccin flavors from lightest to darkest", (): void => {
    expect(flavors).toEqual(["latte", "frappe", "macchiato", "mocha"]);
  });
});

describe("systemFlavor", (): void => {
  it("starts in Latte when the system is light", (): void => {
    expect(systemFlavor(false)).toBe("latte");
  });

  it("starts in Mocha when the system is dark", (): void => {
    expect(systemFlavor(true)).toBe("mocha");
  });
});

describe("sanitizeTheme", (): void => {
  it.each([...flavors, "system"])("keeps the valid value %s", (value) => {
    expect(sanitizeTheme(value)).toBe(value);
  });

  it("falls back to system when there is no stored value", (): void => {
    expect(sanitizeTheme("")).toBe("system");
  });

  it("falls back to system for an invalid value", (): void => {
    expect(sanitizeTheme("banana")).toBe("system");
    expect(sanitizeTheme("dark")).toBe("system");
  });
});
