// @vitest-environment node
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const forbidden: RegExp =
  /\b(junior|jr\.?|semi[\s-]?senior|senior|sr\.?|trainee|principiante)\b/i;
const files: string[] = [
  "messages/en.json",
  "messages/es.json",
  "content/en/profile.json",
  "content/es/profile.json",
  "content/en/about.mdx",
  "content/es/about.mdx",
];

describe("copy does not state a seniority level", (): void => {
  it.each(files)("%s", (file: string) => {
    const text: string = readFileSync(path.join(process.cwd(), file), "utf8");
    expect(text).not.toMatch(forbidden);
  });
});
