import { describe, expect, it } from "vitest";
import { formatGithubFailure, redact } from "@/features/projects/logging";
import { NOW } from "../../helpers/repo-factory";

describe("formatGithubFailure", (): void => {
  it("includes the kind of error and the time", (): void => {
    expect(formatGithubFailure("rate_limited", NOW)).toBe(
      "[projects] GitHub request failed (rate_limited) at 2026-10-16T12:00:00.000Z",
    );
  });
});

describe("redact", (): void => {
  it("replaces every occurrence of a secret", (): void => {
    expect(
      redact("token ghp_SECRET and again ghp_SECRET", ["ghp_SECRET"]),
    ).toBe("token *** and again ***");
  });

  it("ignores empty or missing secrets, so it never blanks the whole text", (): void => {
    expect(redact("keep this", ["", undefined])).toBe("keep this");
  });

  it("does not fail without secrets", (): void => {
    expect(redact("plain text", [])).toBe("plain text");
  });
});
