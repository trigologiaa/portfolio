import { describe, expect, it, vi } from "vitest";
import { copyToClipboard } from "@/lib/clipboard";

describe("copyToClipboard", (): void => {
  it("writes the text and reports 'copied'", async (): Promise<void> => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    expect(await copyToClipboard("ada@example.com", { writeText })).toBe(
      "copied",
    );
    expect(writeText).toHaveBeenCalledWith("ada@example.com");
  });

  it("reports 'failed' when the browser refuses (for example, no permission)", async (): Promise<void> => {
    const writeText = vi.fn().mockRejectedValue(new Error("denied"));
    expect(await copyToClipboard("ada@example.com", { writeText })).toBe(
      "failed",
    );
  });

  it("reports 'failed' when the Clipboard API does not exist", async (): Promise<void> => {
    expect(await copyToClipboard("ada@example.com", undefined)).toBe("failed");
  });
});
