# US-03 — Design tokens and theme

**As** a visitor, **I want** a consistent look with light and dark modes, **so
that** the site is comfortable to read in my preferred setting.

> **Epic:** Design system
>
> **Type:** Functional
>
> **Priority:** Must
>
> **Estimation:** M (the visual identity has to be defined, not only
> implemented)
>
> **Dependencies:** [US-02](/docs/us-02-quality-gates.md)

Defines the visual identity (palette, typograhpy, spacing, radii, motion
tokens), installs Tailwind and shadcn/ui and implements the theme switcher.
**Its critical point** is the reference spike: the owner wants a creative style
and animations inspired by other sites, and the decisions taken here drive US-05
through US-10 and US-25.

_Requirement:_* None (personal project).

## Scope

Included:

- **Reference spike:** review the reference sites in the browser and record in
  `docs/design-references.md` what is taken from each: layout, typography,
  colors, animations. Two of them could not be read as plain text, so they must
  be inspected visually.
- Tailwind CSS configured with design tokens as CSS variables (colors, font
  families, scale, radii, shadows, durations/easings).
- Fonts loaded with `next/font` (self-hosted, `display: swap`), no layout shift.
- shadcn/ui initialised (`components.json`), with Button and a base set of
  primitives themed to the tokens.
- Theme: follows `prefers-color-scheme` by default, manual toggle (light / dark
  / system), persisted in `localStorage`, no flash of wrong theme on first
  paint.
- A `/design` internal route is **not** created; tokens are whown in
  Storybook-less form in `docs/design-references.md` (swatches and type scale).

Not included:

- Header, navigation and footer: US-05.
- Framer Motion animations: US-25 (only motion tokens are defined here).
- Language switcher: US-04.

## Acceptance scenarios

Verified with Playwright (theme behaviour) and manually for the visual review.

```gherkin
Feature: Design tokens and theme
  As a visitor
  I want light and dark modes
  So that the site is comfortable to read

  Scenario: System preference is respected on first visit
    Given my operating system prefers dark mode and I have no saved choice
    When I open the site
    Then the document has the "dark" theme applied before the first paint

  Scenario: Manual choice overrides and persists
    Given the site is in dark mode from my system preference
    When I choose "light" in the theme toggle and reload the page
    Then the light theme is applied
    And localStorage contains the value "light"

  Scenario: Corrupt stored value falls back to system
    Given localStorage contains an invalid theme value
    When I open the site
    Then the system preference is used
    And no error is thrown in the console

  Scenario: Contrast meets the minimum in both themes
    Given the token palette
    When I check every text/background pair used for body text
    Then each pair has a contrast ratio of at least 4.5:1
```

## Non-functional requirements

- Text contrast >= 4.5:1 (normal) and >= 3:1 (large text, UI components) in both
  themes.
- Maximum 2 font families and 4 font files loaded; no CLS from font loading (CLS
  < 0.1).
- Them toggle is keyboard operable and has an accesible name.

## Decisions

- **shadcn/ui:** components are copied into the repo and built on Radix
  primitives, so accessibility comes included while the look stays fully
  customisable.
- **Tailwind + CSS variables:** one source of truth for light/dark tokens. CSS
  Modules discarded.
- **next-themes (or equivalent) for the toggle:** avoids the flash of wrong
  theme.
- **References documented in the repo:** so later stories can cite the decisions
  instead of re-deciding.

## Definition of Done

- [ ] `docs/design-references.md` lists, per reference site, what is taken
      (layout, typography, colors, animations).
- [ ] Tokens, fonts and shadcn/ui configured; Button themed in both themes.
- [ ] Theme scenarios covered by Playwright tests and passing.
- [ ] Contrast of all token pairs checked and recorded.
- [ ] PR merged via merge commit from `us-03-design-tokens-and-theme`.
