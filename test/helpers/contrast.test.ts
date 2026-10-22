import { describe, expect, it } from "vitest";
import { contrastRatio } from "./contrast";

describe("contrastRatio", (): void => {
  const maxContrastRatio: number = 21;
  const minContrastRatio: number = 1;
  const knownWcagContrast: number = 4.54;
  const lowPrecision: number = 1;
  const highPrecision: number = 5;

  it("is 21 for black on white", (): void => {
    expect(contrastRatio("#000000", "#ffffff")).toBeCloseTo(
      maxContrastRatio,
      lowPrecision,
    );
  });

  it("is 1 for the same color", () => {
    expect(contrastRatio("#336699", "#336699")).toBeCloseTo(
      minContrastRatio,
      highPrecision,
    );
  });

  it("does not depend on the order of the colors", () => {
    expect(contrastRatio("#767676", "#ffffff")).toBeCloseTo(
      contrastRatio("#ffffff", "#767676"),
      highPrecision,
    );
  });

  it("matches the known WCAG value for #767676 on white (4.54)", () => {
    expect(contrastRatio("#767676", "#ffffff")).toBeCloseTo(
      knownWcagContrast,
      lowPrecision,
    );
  });

  it("accepts 3-digit hex colors", () => {
    expect(contrastRatio("#000", "#fff")).toBeCloseTo(
      maxContrastRatio,
      lowPrecision,
    );
  });
});
