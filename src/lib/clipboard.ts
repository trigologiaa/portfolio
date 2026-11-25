export type CopyResult = "copied" | "failed";

type ClipboardLike = Pick<Clipboard, "writeText">;

export async function copyToClipboard(
  text: string,
  clipboard: ClipboardLike | undefined = typeof navigator === "undefined"
    ? undefined
    : navigator.clipboard,
): Promise<CopyResult> {
  if (!clipboard) {
    return "failed";
  }
  try {
    await clipboard.writeText(text);
    return "copied";
  } catch {
    return "failed";
  }
}
