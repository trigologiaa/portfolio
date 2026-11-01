# US-09 - Stack and skills

**As** a technical recruiter, **I want** to see the technologies the owner works
with, grouped by category, **so that** I can match them against a job
description.

> **Epic:** Content · **Type:** Functional **Priority:** Must **Estimation:** S
> (data-driven grid with category tabs or groups) **Dependencies:**
> [US-05](./us-05-global-layout), [US-06](./us-06-content-model)

A "Stack" section listing technologies grouped by category (for example
Frontend, Backend, Tools). **Its critical point** is to show tools without
skill-level bars or percentages, which would state a seniority level.

**Requirement:** None (personal project).

## Scope

Included:

- Section `#stack` driven by `stack.json`: categories, each with items (name,
  icon key, optional link).
- Category tabs (inspired by a reference site) on desktop and all categories
  expanded on mobile, or a simple grouped layout if tabs hurt accessibility.
- Icons as inline SVG or a local icon set (no external icon CDN).
- Technology names are plain text, so they are readable by crawlers and screen
  readers.

Not included:

- Skill levels, percentages or years of experience (explicitly excluded; see
  Decisions).
- Filtering projects by technology -> **US-15**.

## Acceptance scenarios

Verified with Playwright and Vitest.

```gherkin
Feature: Stack and skills
  As a technical recruiter
  I want grouped technologies
  So that I can match them to a job

  Scenario: Categories and items are shown
    Given stack.json defines 3 categories
    When I open the home page
    Then I see the 3 category names and each of their items

  Scenario: Tabs are keyboard operable
    Given the tabs variant is rendered
    When I focus the tablist and press the Right Arrow key
    Then the next tab is selected and its panel is shown

  Scenario: Item with unknown icon key
    Given an item references an icon key that does not exist
    When I run pnpm verify
    Then validation fails naming the item and the key

  Scenario: No level indicators
    When the section renders
    Then no percentage, progress bar or "years" text is displayed
```

## Non-functional requirements

- Tabs follow the WAI-ARIA tabs pattern (roles, `aria-selected`, roving
  tabindex).
- Icons add no more than 30 KB to the page weight in total.
- Layout works from 320 px wide without horizontal scroll.

## Decisions

- **No skill bars:** they are subjective and would signal a level, which the
  owner does not want to declare.
- **Local icons:** avoid third-party requests and layout shift.

## Definition of Done

- [x] Section renders from `stack.json` in both locales.
- [x] Keyboard behavior verified by Playwright.
- [x] Icon key validation added to the content validation of
      [US-06](./us-06-content-model).
- [x] PR merged via merge commit from `us-09-stack-and-skills`.
