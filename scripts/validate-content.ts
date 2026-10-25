import path from "node:path";
import { validateContent } from "@/lib/content/validate";

const errors: string[] = validateContent(path.join(process.cwd(), "content"));

if (errors.length > 0) {
  console.error(
    `Content validation failed (${errors.length} problem${errors.length === 1 ? "" : "s"}):`,
  );
  for (const error of errors) {
    console.error(`  - ${error}`);
  }
  process.exit(1);
}

console.log("Content OK");
