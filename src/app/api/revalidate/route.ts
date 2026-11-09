import { timingSafeEqual } from "node:crypto";
import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

function isAuthorized(request: Request, secret: string | undefined): boolean {
  if (!secret) {
    return false;
  }
  const provided: Buffer<ArrayBuffer> = Buffer.from(
    request.headers.get("x-revalidate-secret") ?? "",
  );
  const expected: Buffer<ArrayBuffer> = Buffer.from(secret);
  return (
    provided.length === expected.length && timingSafeEqual(provided, expected)
  );
}

export function POST(request: Request): Response {
  if (!isAuthorized(request, process.env.REVALIDATE_SECRET)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  revalidateTag("github", "max");
  revalidatePath("/", "layout");
  return NextResponse.json({ revalidated: true, at: new Date().toISOString() });
}
