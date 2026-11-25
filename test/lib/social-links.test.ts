import { describe, expect, it } from "vitest";
import { socialLinks } from "@/lib/social-links";

describe("socialLinks", (): void => {
  it("returns GitHub and LinkedIn with their addresses, in that order", (): void => {
    expect(
      socialLinks({
        github: "https://github.com/ada",
        linkedin: "https://www.linkedin.com/in/ada",
      }),
    ).toEqual([
      { label: "GitHub", href: "https://github.com/ada" },
      { label: "LinkedIn", href: "https://www.linkedin.com/in/ada" },
    ]);
  });
});
