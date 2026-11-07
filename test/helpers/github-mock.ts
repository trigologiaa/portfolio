import { type Mock, vi } from "vitest";

export function jsonResponse(body: unknown, init: ResponseInit = {}): Response {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: {
      "content-type": "application/json",
    },
    ...init,
  });
}

export function rawRepo(
  overrides: Record<string, unknown> = {},
): Record<string, unknown> {
  const name: string = (overrides.name as string | undefined) ?? "repo";
  return {
    name,
    description: "A repository",
    // biome-ignore-start lint/style/useNamingConvention: GitHub API field names are snake_case
    html_url: `https://github.com/ada/${name}`,
    homepage: null,
    topics: [],
    language: "TypeScript",
    stargazers_count: 0,
    forks_count: 0,
    pushed_at: "2026-09-01T10:00:00Z",
    created_at: "2025-01-01T10:00:00Z",
    // biome-ignore-end lint/style/useNamingConvention: GitHub API field names are snake_case
    fork: false,
    archived: false,
    owner: { login: "ada" },
    ...overrides,
  };
}

interface Scenario {
  repos?: unknown[];
  list?: () => Response | Promise<Response>;
  languages?: Record<string, Record<string, number>>;
  readmes?: Record<string, boolean>;
  delayMs?: number;
}

type FetchMock = Mock<
  (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>
>;

function detailResponse(
  scenario: Scenario,
  name: string,
  kind: string,
): Response {
  if (kind === "languages") {
    return jsonResponse(scenario.languages?.[name] ?? {});
  }
  return scenario.readmes?.[name] === false
    ? new Response("{}", { status: 404 })
    : jsonResponse({ name: "README.md" });
}

function routeResponse(
  scenario: Scenario,
  pathname: string,
): Response | Promise<Response> {
  if (/^\/users\/[^/]+\/repos$/.test(pathname)) {
    return scenario.list ? scenario.list() : jsonResponse(scenario.repos ?? []);
  }
  const detail = /^\/repos\/[^/]+\/([^/]+)\/(languages|readme)$/.exec(pathname);
  const [, name, kind] = detail ?? [];
  if (name !== undefined && kind !== undefined) {
    return detailResponse(scenario, name, kind);
  }
  return new Response("not found", { status: 404 });
}

export function makeFetch(scenario: Scenario = {}): FetchMock {
  return vi.fn(
    async (
      input: RequestInfo | URL,
      _init?: RequestInit,
    ): Promise<Response> => {
      const { pathname } = new URL(String(input));
      if (scenario.delayMs) {
        await new Promise((resolve) => setTimeout(resolve, scenario.delayMs));
      }
      return routeResponse(scenario, pathname);
    },
  );
}
