import { describe, expect, it } from "vitest";
import en from "../../messages/en.json";
import es from "../../messages/es.json";

function flattenKeys(value: unknown, prefix: string = ""): string[] {
  if (typeof value !== "object" || value === null) {
    return [prefix];
  }
  return Object.entries(value).flatMap(
    ([key, child]: [string, unknown]): string[] =>
      flattenKeys(child, prefix ? `${prefix}.${key}` : key),
  );
}

describe("message catalogs", (): void => {
  it("contain exactly the same keys in English and Spanish", (): void => {
    expect(flattenKeys(es).sort()).toEqual(flattenKeys(en).sort());
  });

  it("have no empty translations", (): void => {
    for (const catalog of [en, es]) {
      for (const key of flattenKeys(catalog)) {
        const value: unknown = key
          .split(".")
          .reduce<unknown>(
            (node: unknown, part: string): unknown =>
              (node as Record<string, unknown>)[part],
            catalog,
          );
        expect(value, key).not.toBe("");
      }
    }
  });
});
