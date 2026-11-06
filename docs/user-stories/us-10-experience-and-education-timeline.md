# US-10 - Experience and education timeline

**As** a recruiter, **I want** to see the owner's education and any work
experience on a single timeline, **so that** I understand their background.

> **Epic:** Content
>
> **Type:** Functional
>
> **Priority:** Must
>
> **Estimation:** S (one data-driven list; the owner has limited work
> experience)
>
> **Dependencies:** [US-05](./us-05-global-layout),
> [US-06](./us-06-content-model)

A combined timeline of education, courses and work, sorted by date, with an
entry type label. **Its critical point** is that the section looks complete and
credible even with few work entries, and degrades gracefully when there are
none.

**Requirement:** None (personal project).

## Scope

Included:

- Section `#experience` driven by `timeline.json`: entries with type
  (`education`, `course`, `work`), title, organization, start, end (or
  "present"), short description and optional logo and link.
- Sorted by start date, newest first; entries filtered by type via simple label
  chips (all / education / work).
- Visual timeline (vertical line and markers) inspired by the reference site,
  adapted to the design tokens.
- Dates formatted per locale (`Intl.DateTimeFormat`).

Not included:

- Downloadable CV -> **US-20**.
- Entrance animations -> **US-25**.

## Acceptance scenarios

Verified with Vitest (sorting, formatting) and Playwright.

```gherkin
Feature: Experience and education timeline
  As a recruiter
  I want a timeline of background
  So that I understand the owner's path

  Scenario: Entries are sorted newest first
    Given three entries with different start dates
    When the section renders
    Then they appear ordered from the latest start date to the earliest

  Scenario: Ongoing entry shows "Present"
    Given an entry without an end date
    When I open "/en"
    Then it displays "Present"
    And in "/es" it displays "Actualidad"

  Scenario: Filter by type
    Given entries of types education and work
    When I choose the "Work" chip
    Then only work entries are visible

  Scenario: No work entries
    Given the file has only education entries
    When the section renders
    Then the "Work" chip is not shown
    And no empty state or error is displayed
```

## Non-functional requirements

- Timeline is a semantic ordered list (`<ol>`), readable without CSS.
- Date format follows the active locale.
- Logos have empty `alt` when decorative, meaningful `alt` otherwise.

## Decisions

- **Single combined timeline:** matches the "little experience, more education
  and projects" profile. Two separate sections discarded to avoid a nearly empty
  Work block.
- **Chips instead of tabs:** simpler and lighter.

## Definition of Done

- [ ] Timeline renders in both locales and the four flavors.
- [ ] Sorting, "Present" label and no-work case covered by tests.
- [ ] PR merged via merge commit from `us-10-experience-and-education-timeline`.
