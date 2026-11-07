# US-11 - GitHub client with ISR

**As** the site owner, **I want** my public repositories fetched from GitHub and
refreshed periodically, **so that** the projects section stays up to date
without redeploying.

> **Epic:** GitHub projects
>
> **Type:** Technical (enabler)
>
> **Priority:** Must **Estimation:** M (API integration, normalization, caching
> and rate-limit awareness)
>
> **Dependencies:** [US-02](./us-02-quality-gates)

A server-only module that fetches the owner's repositories (and, per repo, the
data needed for scoring: topics, languages, README presence) and returns a
normalized, typed list, cached with Incremental Static Regeneration. **Its
critical point** is resilience: the site must never break or hit the rate limit
because of GitHub.

**Requirement:** None (personal project).

## Scope

Included:

- Server-only `getRepositories()` using the GitHub REST API with `GITHUB_TOKEN`
  (read-only, public repos only) and `GITHUB_USERNAME` from environment
  variables.
- Fetch: name, description, `html_url`, `homepage`, `topics`, `language`,
  languages breakdown, `stargazers_count`, `forks_count`, `pushed_at`, `fork`,
  `archived`, README existence.
- Normalization to an internal `Repository` type, independent of the API shape.
- ISR: results cached with `revalidate = 3600` seconds (one hour); API calls
  grouped to stay well below the limit (5,000/hour authenticated).
- Forks and archived repos are returned with flags so
  [US-13](./us-13-manual-curation) decides what to hide.
- Unit tests with mocked responses (no network in tests).

Not included:

- Scoring -> **US-12**.
- Manual exclusions and overrides -> **US-13**.
- UI and the failure/empty states -> **US-14** and **US-17** (this story only
  exposes a typed result with an error variant).
- On-demand revalidation endpoint -> **US-13**.

## Acceptance scenarios

Verified with Vitest using mocked `fetch` responses.

```gherkin
Feature: GitHub client with ISR
  As the site owner
  I want repositories fetched and cached
  So that the section stays current without redeploys

  Scenario: Repositories are normalized
    Given the API returns 3 repositories
    When I call getRepositories()
    Then I receive 3 Repository objects with name, url, topics, languages and pushedAt

  Scenario: Token is sent and never exposed
    Given GITHUB_TOKEN is set
    When the client calls the API
    Then the Authorization header is included on the server request
    And the token does not appear in any client bundle

  Scenario: Rate limit reached
    Given the API responds 403 with x-ratelimit-remaining 0
    When I call getRepositories()
    Then the result is an error of kind "rate_limited"
    And no exception propagates to the caller

  Scenario: Network failure
    Given fetch rejects with a network error
    When I call getRepositories()
    Then the result is an error of kind "unavailable"

  Scenario: Missing configuration
    Given GITHUB_USERNAME is not set
    When the app starts the build
    Then the build fails with a message naming the missing variable
```

## Non-functional requirements

- Revalidation period: 3,600 s; never more than one regeneration per period per
  path.
- No more than `1 + N` API calls per revalidation (N = number of non-excluded
  repos), with README and languages requests made in parallel (max 5
  concurrent).
- Token has read-only access to public data only.

## Decisions

- **ISR over build-only or client fetch:** fresh enough, great SEO and respects
  the rate limit. Client-side fetching discarded because it exposes the visitor
  to limits and hurts SEO.
- **REST over GraphQL:** simple and no pinned-repo dependency. GraphQL discarded
  for now.
- **Keep last good data:** Next.js serves the stale cached page if a
  revalidation fails.

## Definition of Done

- [ ] Typed `Repository` model and `getRepositories()` implemented.
- [ ] Error variants (`rate_limited`, `unavailable`, `not_configured`) covered
      by tests.
- [ ] Environment variables documented in `.env.example` and README.
- [ ] Vercel project has the variables configured; production returns real data.
- [ ] PR merged via merge commit from `us-11-github-client-with-isr`.
