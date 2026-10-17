# US-01 — Walking skeleton

**As** the site owner, **I want** a minimal Next.js app with only a title, deployed to a public URL through a CI pipeline, **so that** deployment and pipeline problems surface while they are still cheap to fix.

> **Epic:** Foundation · **Type:** Technical (enabler)
> **Priority:** Must
> **Estimation:** M (several external services to wire up: GitHub, Vercel, branch protection; the app code itself is trivial)
> **Dependencies:** none

This story creates the repository skeleton: Next.js (App Router, TypeScript), a single page with a title, a GitHub Actions workflow, Git hooks with Husky and a Vercel deployment. **Its critical point** is that the full path "branch → PR → CI green → merge → production URL" works end to end before any feature exists.

**Requirement:** None (personal project).

## Scope

Included:

- Next.js app (App Router, TypeScript strict) created with pnpm, showing a single `<h1>` with the owner's name.
- GitHub repository with `main` protected: pull request required, CI status check required, direct pushes blocked, merge commits allowed and squash merge disabled.
- GitHub Actions workflow that on every PR and push to `main` installs dependencies (with pnpm cache), runs lint, type check and build.
- Biome as the single linter and formatter (`pnpm lint` runs `biome check`); ESLint and Prettier are not used.
- Husky Git hooks: `commit-msg` rejects any commit whose message is not `type(us-NN): message` (Conventional Commits with the story number as scope), and `pre-push` runs the local checks (lint, type check and build) before anything leaves the machine.
- Vercel project connected to the repo: preview deployment per PR, production deployment from `main`, public `*.vercel.app` URL.
- `README.md` stub with the production URL and the branch/PR workflow (`us-NN-short-name` branches, merge commits).

Not included:

- `pnpm verify`, unit tests and e2e tests → **[US-02](us-02-quality-gates.md)** (which also adds the tests to the `pre-push` hook).
- Design, theme and styling beyond defaults → **[US-03](us-03-design-tokens-and-theme.md)**.
- Analytics → **[US-24](us-24-privacy-friendly-analytics.md)**.
- Custom domain (out of scope for the whole project, see [README](README.md)).

## Acceptance scenarios

Verified manually by opening a throw-away PR and observing the pipeline, and by visiting the public URL.

```gherkin
Feature: Walking skeleton
  As the site owner
  I want a minimal deployed app with CI
  So that deployment problems surface early

  Scenario: Production URL serves the minimal app
    Given the skeleton has been merged into main
    When I open the production *.vercel.app URL
    Then the response status is 200
    And the page contains an h1 with the owner's name

  Scenario: Pull request runs CI and gets a preview
    Given I open a pull request from a branch named us-01-walking-skeleton
    When the pipeline finishes
    Then the "ci" check is reported on the PR
    And a Vercel preview URL is commented on the PR

  Scenario: Broken code cannot reach main
    Given a pull request whose code fails the type check
    When the pipeline runs
    Then the "ci" check is red
    And the merge button is disabled

  Scenario: Direct push to main is rejected
    Given branch protection is enabled
    When I try to push a commit directly to main
    Then GitHub rejects the push

  Scenario: A commit message without the convention is rejected
    Given the Husky hooks are installed
    When I commit with the message "added stuff"
    Then the commit is aborted
    And the hook explains the expected format "type(us-NN): message"

  Scenario: A conventional commit message is accepted
    Given the Husky hooks are installed
    When I commit with the message "feat(us-01): add the minimal home page"
    Then the commit is created

  Scenario: A push with failing local checks is blocked
    Given the Husky hooks are installed
    And the code fails the type check
    When I run git push
    Then the pre-push hook runs lint, type check and build
    And the push is aborted before reaching GitHub
```

## Non-functional requirements

- CI completes in under 5 minutes on the skeleton (dependency cache enabled).
- Node.js version pinned (`.nvmrc` / `engines`) and identical in CI and Vercel.
- No secrets committed; `.env*` files are git-ignored and `.env.example` is provided.
- Allowed commit types: `feat`, `fix`, `chore`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `revert`. The scope is always the story number (`us-01` … `us-27`). Header at most 100 characters.
- Hooks are versioned in `.husky/` and installed automatically by `pnpm install` (`prepare` script), so a fresh clone has them without extra steps.

## Decisions

- **Vercel:** native ISR support (needed by [US-11](us-11-github-client-with-isr.md)) and PR previews. Netlify discarded for weaker Next.js support.
- **GitHub Actions for CI:** keeps CI next to the code. Vercel's build alone is not used as the gate because it does not run lint/tests.
- **Merge commits, no squash:** explicit owner decision; keeps each story's commits visible in history.
- **`.vercel.app` domain:** custom domain postponed.
- **Biome instead of ESLint + Prettier:** one tool, one config (`biome.json`), faster. `create-next-app --biome` generates it.
- **Husky with plain shell hooks:** the message check is a regex in `.husky/commit-msg`; no commitlint or lint-staged dependencies. The check is a `commit-msg` hook (not `pre-commit`) because `pre-commit` runs before the message exists.
- **Heavy checks on `pre-push`, not on commit:** commits stay instant; nothing broken leaves the machine. CI remains the real gate (hooks can be skipped with `--no-verify`).

## Definition of Done

- [ ] Production URL is public and returns 200 with the title.
- [ ] `main` protected as described and verified with a rejected direct push.
- [ ] CI workflow runs on PRs and is a required status check.
- [ ] PR merged via merge commit (no squash) from branch `us-01-walking-skeleton`.
- [ ] `README.md` documents the production URL and the workflow.
- [ ] `.env.example` exists and no secrets are in the repo.
- [ ] Husky installed: `commit-msg` rejects a bad message, `pre-push` blocks a push with failing checks (both verified).
- [ ] Lint is Biome only (no ESLint/Prettier in `package.json`).
