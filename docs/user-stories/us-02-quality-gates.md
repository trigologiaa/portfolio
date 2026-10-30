# US-02 - Quality gates

**As** the site owner, **I want** a single `pnpm verify` command and test
tooling wired into CI, **so that** every story can be validated the same way
locally and in the pipeline.

> **Epic:** Foundation
>
> **Type:** Technicar (enabler)
>
> **Priority:** Must
>
> **Estimation:** M (configuring Vitest, Playwright and CI caching takes time,
> but there is litte logic)
>
> **Dependencies:** [US-01](docs/us-01-walking-skeleton.md)

Builds on the linters from US-01 (Biome for code, markdownlint + Prettier for
Markdown) and sets up TypeScript strict, Vitest (unit) and Playwright (e2e) and
exposes them through `pnpm verify` (lint + types + unit tests + build). **Its
critical point** is that CI runs exactly the same command as the developer, so
there is no "works locally" gap.

**Requirement:** None (personal project).

## Scope

Included:

- Scripts: `lint`, `typecheck`, `test` (Vitest), `test:e2e` (Playwright),
  `verify` (lint + typecheck + test + build).
- One sample unit test and one sample e2e test (home renders the title) proving
  the tooling works.
- CI updated to run `pnpm verify` and, in a separate job, `pnpm test:e2e`
  against the build; Playwright report uploaded artifact on failure.
- Lint is already set up in [US-01](/docs/us-01-walking-skeleton.md):
  `pnpm lint` runs Biome (lint, format, import order) and the Markdown checks,
  so `verify` needs no separate format step. ESLint is not used; Prettier only
  wraps Markdown.
- The Husky `pre-push` hook from US-01 is updated to run `pnpm verify` (lint,
  types, unit tests and build). The `commit-msg` hook (`type(us-NN): message`)
  is unchanged. e2e tests stay in CI only because of their duration.

Not included:

- Accessibility checks (axe) $→$ **US-22**.
- Lighthouse checks $→$ **US-23**.
- Tests for features that do not exist yet; each story adds its own.

## Acceptance scenarios

Verified automatically: the CI pipeline itself, plus running `pnpm verify`
locally.

```gherkin
Feature: Quality gates
  As the site owner
  I want one command that verifies the project
  So that local and CI checks are identical

  Scenario: verify passes on a healthy project
    Given a clean checkout of main
    When I run pnpm verify
    Then lint, type check, unit tests and build all pass
    And the exit code is 0

  Scenario: A failing unit test fails verify
    Given a unit test that asserts a false condition
    When I run pnpm verify
    Then the command exits with a non-zero code
    And the failing test name is printed

  Scenario: CI runs the same command
    Given a pull request is opened
    When the pipeline runs
    Then the log shows "pnpm verify" executing
    And the e2e job runs Playwright against the production build

  Scenario: e2e failure keeps its evidence
    Given an e2e test fails in CI
    When the job ends
    Then the Playwright HTML report is available as a downloadable artifact
```

## Non-functional requirements

- `pnpm verify` completes in under 3 minutes on the skeleton.
- TypeScript `strict: true` and `noUnchechedIndexedAccess: true`.
- Playwright runs Chromium only in CI (Firefox/WebKit optional later) to keep
  the pipeline under 6 minutes.

## Decisions

- **Vitest over Jest:** faster, native ESM/TypeScript. Jest discarded.
- **Playwright over Cypress:** parallel runs, built-in report, easy integration
  with axe in **US-22**.
- **Lint stack unchanged:** Biome for code, markdownlint + Prettier for Markdown
  (decided in [US-01](/docs/us-01-walking-skeleton.md)); `verify` just calls
  `pnpm lint`.
- **`pre-push` runs `verify`, not e2e:** keeps pushes fast; Playwright runs in
  CI.
- **e2e as a separate CI job:** keeps `verify` fast and lets both run in
  parallel.

## Definition of Done

- [ ] `pnpm verify` passes locally and in CI.
- [ ] Sample unit and e2e tests exists and pass.
- [ ] `.husky/pre-push` runs `pnpm verify` and blocks a push when a unit test
      fails (verified).
- [ ] e2e CI job failure artifact verified by breaking a test on a throw-away
      branch.
- [ ] PR merged via merge commit from `us-02-quality-gates`.
- [ ] README documents each script.
