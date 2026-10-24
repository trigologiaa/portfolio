import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { contrastRatio } from "../helpers/contrast";
import {
  type Flavor,
  flavors,
  resolveFlavor,
  type Tokens,
} from "../helpers/tokens";

const WCAG_MIN_TEXT_CONTRAST: number = 4.5;
const WCAG_MIN_UI_CONTRAST: number = 3;
const css: string = `
  /* comments are ignored */
  :root,
  [data-theme] {
    --background: var(--ctp-mantle);
    --foreground: var(--ctp-text);
  }
  :root:not([data-theme]),
  [data-theme="latte"] {
    --background: var(--ctp-base);
  }
  :root:not([data-theme]),
  [data-theme="latte"] {
    --ctp-base: #eff1f5;
    --ctp-mantle: #e6e9ef;
    --ctp-text: #4c4f69;
  }
  [data-theme="mocha"] {
    --ctp-base: #1e1e2e;
    --ctp-mantle: #181825;
    --ctp-text: #cdd6f4;
  }
`;
const pairs: [string, string, number][] = [
  ["foreground", "background", WCAG_MIN_TEXT_CONTRAST],
  ["card-foreground", "card", WCAG_MIN_TEXT_CONTRAST],
  ["popover-foreground", "popover", WCAG_MIN_TEXT_CONTRAST],
  ["muted-foreground", "background", WCAG_MIN_TEXT_CONTRAST],
  ["muted-foreground", "card", WCAG_MIN_TEXT_CONTRAST],
  ["muted-foreground", "muted", WCAG_MIN_TEXT_CONTRAST],
  ["primary-foreground", "primary", WCAG_MIN_TEXT_CONTRAST],
  ["secondary-foreground", "secondary", WCAG_MIN_TEXT_CONTRAST],
  ["accent-foreground", "accent", WCAG_MIN_TEXT_CONTRAST],
  ["primary", "background", WCAG_MIN_TEXT_CONTRAST],
  ["primary", "card", WCAG_MIN_TEXT_CONTRAST],
  ["destructive", "background", WCAG_MIN_TEXT_CONTRAST],
  ["input", "background", WCAG_MIN_UI_CONTRAST],
  ["input", "card", WCAG_MIN_UI_CONTRAST],
  ["ring", "background", WCAG_MIN_UI_CONTRAST],
  ["ring", "card", WCAG_MIN_UI_CONTRAST],
];
const themes: string = readFileSync(
  path.join(process.cwd(), "src/app/themes.css"),
  "utf8",
);

describe("resolveFlavor", (): void => {
  it("resolves the shared tokens against the palette of the flavor", (): void => {
    expect(resolveFlavor(css, "mocha")).toMatchObject({
      background: "#181825",
      foreground: "#cdd6f4",
    });
  });

  it("applies the overrides of a flavor on top of the shared tokens", (): void => {
    expect(resolveFlavor(css, "latte")).toMatchObject({
      background: "#eff1f5",
      foreground: "#4c4f69",
    });
  });

  it("ignores the palette of the other flavors", (): void => {
    expect(resolveFlavor(css, "mocha")["ctp-base"]).toBe("#1e1e2e");
  });
});

describe.each<Flavor>(flavors)("%s flavor", (flavor): void => {
  const tokens: Tokens = resolveFlavor(themes, flavor);

  it.each(
    pairs,
  )("%s on %s is at least %s:1", (foreground, background, minimum) => {
    expect(
      tokens[foreground],
      `--${foreground} is missing from ${flavor}`,
    ).toBeDefined();
    expect(
      tokens[background],
      `--${background} is missing from ${flavor}`,
    ).toBeDefined();
    expect(
      contrastRatio(tokens[foreground] as string, tokens[background] as string),
    ).toBeGreaterThanOrEqual(minimum);
  });
});

describe("the four flavors", (): void => {
  it("define exactly the same tokens", (): void => {
    const [first, ...others] = flavors.map((flavor: Flavor) =>
      Object.keys(resolveFlavor(themes, flavor)).sort(),
    );
    for (const names of others) {
      expect(names).toEqual(first);
    }
  });
});
