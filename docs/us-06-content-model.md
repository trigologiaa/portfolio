# US-06 — Content model

**As** the site owner, **I want** all my personal content stored as typed
MDX/JSON files in the repo, **so that** I can update it by editing files and the
build catches mistakes.

> **Epic:** Content
>
> **Type:** Technical (enabler)
>
> **Priority:** Must
>
> **Estimation:** M (schemas, loaders and per-locale conventions for several
> content types)
>
> **Dependencies:** [US-04](/docs/us-04-internationalization.md)

Defines the `/content` directory, the schemas (validated with Zod) and typed
loader functions for: profile, stack, experience/education entries and project
overrides. **Its critical point** is that invalid or missing content fails the
build with a clear message, instead of rendering a broken page.

**Requirement:** None (personal project).

## Scope

Included:

- Folder layout: `content/{locale}/profile.json`, `stack.json`, `timeline.json`,
  `about.mdx`; and `content/projects/{repo-name}.{locale}.mdx` for project
  enrichment (US-13 consumes it).
- Zod schemas and TypeScript types for each file.
- Loader functions (`getProfile(locale)`, `getStack(locale)`,
  `getTimeline(locale)`, `getAbout(locale)`), server-only.
- Validation script run in `pnpm verify` that checks every file against its
  schema and that every item exists in both locales.
- Sample content with realistic placeholders, clearly marked `TODO` where the
  owner must replace it.
- `docs/content-guide.md` explaining how to edit each file.

Not included:

- Rendering of each content type - US-07 to US-10
- Github data -> US-11
- Blog posts -> US-26

## Acceptance scenarios

Verified with Vitest on the loaders and validation script.

```gherkin
Feature: Content model
  As the site owner
  I want typed, validated content files
  So that mistakes are caught at build time

  Scenario: Valid content loads
    Given valid content files for es and en
    When I call getProfile("es")
    Then I get an object matching the Profile type

  Scenario: Invalid field fails the build with a clear message
    Given timeline.json has an entry without a "title"
    When I run pnpm verify
    Then the validation step fails
    And the message names the file, the entry index and the missing field

  Scenario: Missing translation is detected
    Given an entry id exists in content/es/timeline.json but not in content/en/timeline.json
    When I run the validation script
    Then it fails and lists the missing id and locale

  Scenario: Unknown locale is rejected
    When I call getProfile("fr")
    Then a typed error is thrown
```

## Non-functional requirements

- Loaders are server-only (importing them from a client component fails the
  build).
- Validation of the whole content directory runs in under 5 seconds.
- Dates stored as ISO 8601 strings (`YYYY-MM` or `YYYY-MM-DD`).

## Decisions

- **MDX/JSON in the repo:** versioned, reviewable in PRs, no external service. A
  headless CMS was discarded as unnecessary.
- **Zod:** a single source of truth for runtime validation and TypeScript types.
- **One folder per locale:** the owner edits Spanish and English side by side
  without a translation framework for long text.

## Definition of Done

- [ ] Schemas, loaders and sample content exist for all liste types.
- [ ] Validation runs in `pnpm verify` and fails on the scenarios above.
- [ ] `docs/content-guide.md` written.
- [ ] PR merged via merge commit from `us-06-content-model`.
