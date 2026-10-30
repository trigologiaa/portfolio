# US-08 - About me

**As** a recruiter or potential client, **I want** a short personal summary,
**so that** I get to know the person behind the projects.

> **Epic:** Content
>
> **Type:** Functional
>
> **Priority:** Must
>
> **Estimation:** S (renders one MDX file with a few highlights)
>
> **Dependencies:** [US-05](./us-05-global-layout),
> [US-06](./us-06-content-model)

An "About" section on the home page, rendering `about.mdx` per locale plus a few
highlight facts. **Its critical point** is the tone: concise, concrete and
without declaring a seniority level.

**Requirement:** None (personal project).

## Scope

Included:

- Section `#about` rendering the MDX content for the current locale with styled
  prose.
- Up to 4 highlight items (for example location, languages spoken, interests)
  from `profile.json`.
- Section heading and anchor consistent with the header navigation.

Not included:

- Skills and tools list -> **US-09**.
- Education and work history -> **US-10**.
- Long-form posts -> **US-26**.

## Acceptance scenarios

Verified with Playwright.

```gherkin
Feature: About me
  As a visitor
  I want to read a short bio
  So that I know the person

  Scenario: Bio renders in the current language
    Given about.mdx exists for es and en
    When I open "/en#about"
    Then the English bio is visible under the heading "About"

  Scenario: Highlights are limited
    Given profile.json defines 6 highlights
    When the section renders
    Then only the first 4 are shown

  Scenario: Missing bio for a locale fails the build
    Given content/en/about.mdx is missing
    When I run pnpm verify
    Then validation fails naming the missing file

  Scenario: MDX with unsupported component
    Given about.mdx uses an unregistered component
    When the page builds
    Then the build fails with a message naming the component
```

## Non-functional requirements

- Prose line length between 45 and 80 characters at desktop width.
- Body font size at least 16 px; contrast per
  [US-03](./us-03-design-tokens-and-theme).
- No client JavaScript is required for this section.

## Decisions

- **MDX for the bio:** allows links and emphasis without a CMS. Plain text field
  discarded.
- **Highlight cap:** keeps the section scannable.

## Definition of Done

- [x] Section renders in both locales and the four flavors.
- [x] Scenarios covered by tests and passing.
- [x] Placeholder copy replaced or clearly marked `TODO` in content files.
- [x] PR merged via merge commit from `us-08-about-me`.
