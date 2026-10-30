# US-07 — Hero

**As** a technical recruiter, **I want** to understand who the owner is and what
they do within seconds, **so that** I decide quickly whether to keep reading.

> **Epic:** Content
>
> **Type:** Functional
>
> **Priority:** Must
>
> **Estimation:** S (one section, content comes from the profile file)
>
> **Dependencies:** US-05, US-06

The first section of the home page: name, role headline, a one-line pitch and
the main calls to action. **Its critical point** is that it communicates value
without stating a seniority level and without relying on animation to be
readable.

**Requirement:** None (personal project).

## Scope

Included:

- Name, headline (for example "Full-stack developer"), short pitch and optional
  availability note, all from `profile.json` per locale.
- Primary CTA "View projects" (anchor to `#projects`), secondary CTA "Contact"
  (anchor to `#contact`) and tertiary "Download CV" (link wired to US-20; hidden
  until that file exists).
- Optional profile photo with meaningful `alt`, optimised with `next/image`.
- The `<h1>` of the home page lives here.
- No seniority label ("junior", "senior") anywhere in the copy.

Not included:

- CV file itself -> **US-20**.
- Entrance and background animations -> **US-25**.
- Preloader (not planned; see Decisions).

## Acceptance scenarios

Verified with Playwright and Vitest.

```gherkin
Feature: Hero
  As a technical recruiter
  I want an immediate summary of the owner
  So that I decide whether to continue

  Scenario: Hero shows localized content
    Given the profile has Spanish and English headlines
    When I open "/es"
    Then the h1 shows the owner's name
    And the headline is displayed in Spanish

  Scenario: Primary call to action scrolls to projects
    Given I am at the top of the home page
    When I click "View projects"
    Then the Projects section is in the viewport

  Scenario: Missing photo does not break the layout
    Given profile.json has no photo
    When the home page renders
    Then the hero renders without an image and without layout errors

  Scenario: CV button is hidden when no CV exists
    Given no CV file is configured
    When the home page renders
    Then no "Download CV" button is shown
```

## Non-functional requirements

- Largest Contentful Paint element is text or a priority-loaded image: LCP < 2.5
  s on throttled mobile.
- Exactly one `<h1>` on the page.
- Photo has explicit `width`/`height` to avoid layout shift.

## Decisions

- **No preloader:** a preloader (as seen in one reference) delays the content
  that recruiters need and hurts LCP. Revisit only if it stays within the budget
  of US-23.
- **Availability note is optional:** shown only if present in the profile.

## Definition of Done

- [ ] Hero renders in both languages and the four flavors.
- [ ] Scenarios above covered by tests and passing.
- [ ] No seniority wording in either locale (checked by review).
- [ ] PR merged via merge commit from `us-07-hero`.
