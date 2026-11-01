import { describe, expect, it } from "vitest";
import type { ZodSafeParseResult } from "zod";
import { iconKeys } from "@/lib/content/icon-keys";
import { type Stack, stackSchema } from "@/lib/content/schemas";

const stackWith = (icon: string): Stack => ({
  categories: [
    {
      id: "c",
      name: "C",
      items: [
        {
          id: "i",
          name: "I",
          icon,
        },
      ],
    },
  ],
});

describe("icon keys", (): void => {
  it("includes every technology used by the sample content", (): void => {
    for (const key of [
      "typescript",
      "react",
      "nextjs",
      "tailwind",
      "nodejs",
      "git",
    ]) {
      expect(iconKeys).toContain(key);
    }
  });

  it("are accepted by the stack schema", (): void => {
    expect(stackSchema.safeParse(stackWith("react")).success).toBe(true);
  });

  it("make the schema reject an unknown icon", (): void => {
    const result: ZodSafeParseResult<Stack> = stackSchema.safeParse(
      stackWith("does-not-exist"),
    );
    expect(result.success).toBe(false);
  });
});
