import { describe, expect, it } from "vitest";
import { profileSchema } from "@/lib/content/schemas";

interface ProfileLinks {
  github: string;
  linkedin: string;
}

interface ProfileInput {
  name: string;
  headline: string;
  pitch: string;
  email: string;
  links: ProfileLinks;
  highlights?: string[];
}

const validProfile: ProfileInput = {
  name: "Ada Lovelace",
  headline: "Full-stack developer",
  pitch: "I build things for the web.",
  email: "ada@example.com",
  links: {
    github: "https://github.com/ada",
    linkedin: "https://www.linkedin.com/in/ada",
  },
};

describe("profileSchema", (): void => {
  it("accepts a valid profile and defaults the highlights to an empty list", (): void => {
    const profile: ReturnType<typeof profileSchema.parse> =
      profileSchema.parse(validProfile);
    expect(profile.highlights).toEqual([]);
  });

  it("rejects an invalid email", (): void => {
    const result: ReturnType<typeof profileSchema.safeParse> =
      profileSchema.safeParse({
        ...validProfile,
        email: "not-an-email",
      });
    expect(result.success).toBe(false);
  });

  it("rejects a profile without a name", (): void => {
    const { name, ...withoutName } = validProfile;
    void name;
    expect(profileSchema.safeParse(withoutName).success).toBe(false);
  });
});
