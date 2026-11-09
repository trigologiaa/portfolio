// @vitest-environment node

import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  type Mock,
  vi,
} from "vitest";
import * as route from "@/app/api/revalidate/route";

interface CacheMocks {
  revalidateTag: Mock<(tag: string, profile: string) => void>;
  revalidatePath: Mock<(path: string, type?: "layout" | "page") => void>;
}

const { revalidateTag, revalidatePath }: CacheMocks = vi.hoisted(
  (): CacheMocks => ({
    revalidateTag: vi.fn<(tag: string, profile: string) => void>(),
    revalidatePath: vi.fn<(path: string, type?: "layout" | "page") => void>(),
  }),
);

const HTTP_OK: number = 200;
const HTTP_UNAUTHORIZED: number = 401;

vi.mock("next/cache", (): object => ({ revalidateTag, revalidatePath }));

function request(headers: Record<string, string> = {}): Request {
  return new Request("http://localhost/api/revalidate", {
    method: "POST",
    headers,
  });
}

beforeEach((): void => {
  vi.stubEnv("REVALIDATE_SECRET", "s3cret-value");
  revalidateTag.mockClear();
  revalidatePath.mockClear();
});

afterEach((): void => {
  vi.unstubAllEnvs();
});

describe("POST /api/revalidate", (): void => {
  it("rejects a request without the secret and revalidates nothing", async (): Promise<void> => {
    const response: Response = await route.POST(request());
    expect(response.status).toBe(HTTP_UNAUTHORIZED);
    expect(revalidateTag).not.toHaveBeenCalled();
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it("rejects a wrong secret, including one of a different length", async (): Promise<void> => {
    expect(
      (await route.POST(request({ "x-revalidate-secret": "nope" }))).status,
    ).toBe(HTTP_UNAUTHORIZED);
    expect(
      (await route.POST(request({ "x-revalidate-secret": "s3cret-valuX" })))
        .status,
    ).toBe(HTTP_UNAUTHORIZED);
  });

  it("rejects every request when no secret is configured, even an empty one", async (): Promise<void> => {
    vi.stubEnv("REVALIDATE_SECRET", "");
    expect(
      (await route.POST(request({ "x-revalidate-secret": "" }))).status,
    ).toBe(HTTP_UNAUTHORIZED);
  });

  it("refreshes the GitHub data and the pages with the correct secret", async (): Promise<void> => {
    const response: Response = await route.POST(
      request({ "x-revalidate-secret": "s3cret-value" }),
    );
    expect(response.status).toBe(HTTP_OK);
    expect(await response.json()).toMatchObject({ revalidated: true });
    expect(revalidateTag).toHaveBeenCalledWith("github", "max");
    expect(revalidatePath).toHaveBeenCalledWith("/", "layout");
  });

  it("accepts POST only", (): void => {
    expect("GET" in route).toBe(false);
    expect("PUT" in route).toBe(false);
  });
});
