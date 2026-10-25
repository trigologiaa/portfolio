import { describe, expect, it } from "vitest";
import { ContentError, loadProfile } from "@/lib/content/loader";
import type { Profile } from "@/lib/content/schemas";
import { makeContentRoot, validProfile } from "../../helpers/content-fixtures";

describe("loadProfile", (): void => {
  it("returns the profile of the requested locale", (): void => {
    const root: string = makeContentRoot({
      es: {
        profile: { ...validProfile, headline: "Desarrolladora full-stack" },
      },
    });
    expect(loadProfile(root, "es").headline).toBe("Desarrolladora full-stack");
    expect(loadProfile(root, "en").headline).toBe("Full-stack developer");
  });

  it("throws a typed error for an unsupported locale", (): void => {
    const root: string = makeContentRoot();
    const load = (): Profile => loadProfile(root, "fr");
    expect(load).toThrow(ContentError);
    expect(load).toThrow(
      expect.objectContaining({ code: "unsupported_locale" }),
    );
  });
});
