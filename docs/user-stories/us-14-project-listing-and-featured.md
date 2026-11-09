# US-14 - Project listing and featured

**As** a technical recruiter, **I want** to see the owner's best projects first
and browse the rest, **so that** I can judge their work quickly.

> **Epic:** GitHub projects
>
> **Type:** Functional
>
> **Priority:** Must
>
> **Estimation:** L (home highlights, full listing page, card design and data
> wiring)
>
> **Dependencies:** [US-05](./us-05-global-layout.md),
> [US-12](./us-12-project-scoring.md), [US-13](./us-13-manual-curation.md)

Shows the featured projects in the home `#projects` section and the full list in
`/[locale]/projects`. **Its critical point** is the card: it must carry enough
information (what it is, stack, links, freshness) for a recruiter to decide in a
few seconds.

**Requirement:** None (personal project).

## Scope

Included:

- Home section with the featured projects (cards), plus a "View all projects"
  link.
- `/[locale]/projects` page with all curated projects, ordered by curation
  result.
- Project card: image or fallback gradient, title, summary (enrichment, else
  GitHub description), main languages/tech tags, repo link, demo link (if any),
  last update date, "Featured" marker.
- Cards link to the detail page (US-16).
- Data comes from the ISR pipeline of
  [US-11](./us-11-github-client-with-isr.md); pages are statically generated and
  revalidated.

Not included:

- Filtering -> **US-15**.
- Detail page -> **US-16**.
- Failure, rate limit and empty states -> **US-17**.
- Carousel or animated transitions -> **US-25**.

## Acceptance scenarios

Verified with Playwright using a mocked GitHub data layer.

```gherkin
Feature: Project listing and featured
  As a technical recruiter
  I want to see the best projects first
  So that I can judge the owner's work

  Scenario: Home shows only featured projects
    Given 10 curated projects and featuredCount 6
    When I open the home page
    Then the Projects section shows exactly 6 cards
    And a "View all projects" link is visible

  Scenario: Full list shows every curated project
    When I open "/en/projects"
    Then I see 10 cards in curated order

  Scenario: Card shows essential information
    Given a project with demo, 3 languages and a recent update
    When its card renders
    Then it shows the title, summary, 3 tech tags, repo and demo links and the update date

  Scenario: Project without demo
    Given a project with no homepage URL
    When its card renders
    Then no demo link is displayed
    And the repo link remains

  Scenario: Project without description or image
    Given a project with no description and no screenshot
    When its card renders
    Then a fallback summary and a placeholder image are used
```

## Non-functional requirements

- Images use `next/image` with explicit sizes, lazy-loaded below the fold.
- External links open with `rel="noopener noreferrer"` and have discernible
  names (for example "Demo of <project>").
- Grid is responsive: 1 column below 640 px, 2 up to 1024 px, 3 above.
- Page data is static with `revalidate = 3600`.

## Decisions

- **Featured on home, full list on its own page:** keeps the home focused and
  gives a crawlable list of everything.
- **Fallback summary:** when the description is empty, the card shows the
  primary language and last update instead of blank space.

## Definition of Done

- [ ] Home section and `/projects` page implemented in both locales.
- [ ] Playwright scenarios pass.
- [ ] Card is verified at 320 px, 768 px and 1280 px.
- [ ] PR merged via merge commit from `us-14-project-listing-and-featured`.
