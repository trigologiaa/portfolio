# US-13 - Manual curation

**As** the site owner, **I want** to exclude, force or enrich specific
repositories and refresh the data on demand, **so that** the portfolio shows
exactly what I want and I can see changes immediately.

> **Epic:** GitHub projects
>
> **Type:** Functional (owner)
>
> **Priority:** Must
>
> **Estimation:** M (config file, merging logic and a protected revalidation
> endpoint)
>
> **Dependencies:** [US-06](./us-06-content-model.md),
> [US-11](./us-11-github-client-with-isr.md),
> [US-12](./us-12-project-scoring.md)

Adds a curation layer between GitHub data and the UI: an exclusion list, a "pin"
list that forces projects to be featured, and per-project MDX enrichment
(screenshots, long description, demo link overrides). Also adds a secured
endpoint to refresh GitHub data on demand. **Its critical point** is that
private or unwanted repos can never appear, and that automatic and manual
criteria combine predictably.

**Requirement:** None (personal project).

## Scope

Included:

- `content/curation.json`: `exclude` (repo names), `pin` (repo names, ordered),
  `featuredCount` (default 6).
- Default exclusions: forks, archived repos, the portfolio repo itself, and
  repos without any description _and_ README.
- Merge function `curateProjects(repos, curation, now)`: removes excluded, puts
  pinned first in the given order, then the rest by score, and marks the first
  `featuredCount` as featured.
- Enrichment: `content/projects/{repo}.{locale}.mdx` frontmatter (title
  override, summary, screenshots, demo, tags) merged over GitHub data; the
  screenshot files live in `public/projects/{repo}/`.
- `POST /api/revalidate` protected by a secret header (`REVALIDATE_SECRET`) that
  revalidates the GitHub data, so the owner sees changes immediately.
- Validation: names in `exclude`/`pin` that do not match any repo produce a
  warning in the build log.

Not included:

- Rendering -> **US-14**, **US-16**.
- Handling GitHub failures -> **US-17**.

## Acceptance scenarios

Verified with Vitest (merge logic) and Playwright/API tests (endpoint).

```gherkin
Feature: Manual curation
  As the site owner
  I want to control which projects are shown
  So that the portfolio shows what I want

  Scenario: Excluded repo never appears
    Given "old-experiment" is in the exclude list and has the highest score
    When projects are curated
    Then "old-experiment" is not in the result

  Scenario: Pinned repos come first, in order
    Given pin is ["b", "a"] and "c" has the highest score
    When projects are curated
    Then the result starts with "b", "a" and then "c"

  Scenario: Forks and archived repos are hidden by default
    Given a fork and an archived repo
    When projects are curated
    Then neither appears

  Scenario: Revalidation requires the secret
    When I POST /api/revalidate without the secret header
    Then the response status is 401
    And no data is revalidated

  Scenario: Revalidation with the secret refreshes data
    When I POST /api/revalidate with the correct secret
    Then the response status is 200
    And the next request fetches fresh GitHub data

  Scenario: Unknown name in curation
    Given pin contains "does-not-exist"
    When the build runs
    Then a warning names the unknown repository
    And the build does not fail
```

## Non-functional requirements

- The secret is compared in constant time and never logged.
- Endpoint responds in under 2 seconds and accepts POST only (405 otherwise).
- Enrichment images are optimised with `next/image` and have required `alt` text
  in the frontmatter schema.

## Decisions

- **Exclude by default:** forks and archived repos rarely represent the owner's
  work.
- **Pin beats score:** manual intent always wins; score only fills the remaining
  slots.
- **Secret header instead of a login UI:** the owner needs a refresh trigger,
  not an admin panel. A UI is out of scope.

## Definition of Done

- [ ] `curation.json`, merge function and enrichment loader implemented.
- [ ] Endpoint protected and covered by tests for 401, 405 and 200.
- [ ] `REVALIDATE_SECRET` documented in `.env.example` and configured on Vercel.
- [ ] `docs/content-guide.md` explains how to exclude, pin and enrich.
- [ ] PR merged via merge commit from `us-13-manual-curation`.
