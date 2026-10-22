import { describe, expect, it } from "vitest";
import { resolveFlavor } from "../helpers/tokens";

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
