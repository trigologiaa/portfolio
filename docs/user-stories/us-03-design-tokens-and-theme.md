# US-03 - Design tokens and theme

**As** a visitor, **I want** a consistent look and a choice between four colour
themes, **so that** the site is comfortable to read in my preferred setting.

> **Epic:** Design system
>
> **Type:** Functional
>
> **Priority:** Must
>
> **Estimation:** M (the visual identity has to be defined, not only
> implemented)
>
> **Dependencies:** [US-02](./us-02-quality-gates.md)

Defines the visual identity (palette, typography, spacing, radii, motion
tokens), installs Tailwind and shadcn/ui and implements the theme selector.
**Its critical point** is the reference spike: the owner wants a creative style
and animations inspired by five reference sites, and the decisions taken here
drive US-05 through US-10 and US-25.

**Requirement:** None (personal project).

## Scope

Included:

- **Reference spike:** review the five reference sites in the browser
  (`aditya.medhe.in`, `aitezaz.xyz`, `alihamza-fawn.vercel.app`,
  `dvmiz-portfolio.vercel.app`, `jamesmumo.vercel.app`) and record in
  `docs/design-references/design-references.md` what is taken from each: layout,
  typography, colors, animations, plus which detected technologies are adopted
  or discarded. Two of them could not be read as plain text, so they were
  inspected visually. **Done:** the document is already written.
- **Palette:** the four [Catppuccin](https://catppuccin.com) flavors, each as a
  complete set of tokens: Latte (light), Frappé (dark), Macchiato (darker) and
  Mocha (darkest). Tokens give depth (layered surfaces, thin borders, accent
  glow, soft shadows), not flat fills.
- Tailwind CSS configured with design tokens as CSS variables (colors, font
  families, scale, radii, shadows, durations/easings).
- Fonts loaded with `next/font` (self-hosted, `display: swap`), no layout shift.
- shadcn/ui initialised (`components.json`, preset Nova, Radix), with Button, a
  dropdown menu and a base set of primitives themed to the tokens.
- Theme: a **flavor selector** (a dropdown) with the four flavors. Each option
  shows the flavor name and, in parentheses, how dark it is: Latte (light),
  Frappé (dark), Macchiato (darker), Mocha (darkest). There is no "system"
  option: with no saved choice, `prefers-color-scheme` picks Latte (light) or
  Mocha (dark). The choice is persisted in `localStorage`, and there is no flash
  of the wrong theme on first paint.
- A `/design` internal route is **not** created; tokens are shown in
  Storybook-less form in `docs/design-references/design-references.md` (token
  table and contrast table).

Not included:

- Header, navigation and footer -> **[US-05](./us-05-global-layout)**.
- Framer Motion animations -> **US-25** (only motion tokens are defined here).
- Language switcher → **[US-04](./us-04-internationalization)**.

## Acceptance scenarios

Verified with Playwright (theme behaviour) and manually for the visual review.

```gherkin
Feature: Design tokens and theme
  As a visitor
  I want to choose between four colour themes
  So that the site is comfortable to read

  Scenario: System preference is respected on first visit
    Given my operating system prefers dark mode and I have no saved choice
    When I open the site
    Then the document has the "mocha" theme applied before the first paint

  Scenario: Light system preference starts in Latte
    Given my operating system prefers light mode and I have no saved choice
    When I open the site
    Then the document has the "latte" theme applied before the first paint

  Scenario: Manual choice overrides and persists
    Given the site is in the "mocha" theme from my system preference
    When I choose "Latte (light)" in the theme selector and reload the page
    Then the "latte" theme is applied
    And localStorage contains the value "latte"

  Scenario: The selector lists the four flavors with their darkness
    When I open the theme selector
    Then I see "Latte (light)", "Frappé (dark)", "Macchiato (darker)" and "Mocha (darkest)"
    And the active flavor is marked

  Scenario: Corrupt stored value falls back to the system preference
    Given localStorage contains an invalid theme value
    When I open the site
    Then the system preference is used
    And no error is thrown in the console

  Scenario: Contrast meets the minimum in the four flavors
    Given the token palette of each flavor
    When I check every text/background pair
    Then each text pair has a contrast ratio of at least 4.5:1
    And each UI component pair (input border, focus ring) has at least 3:1
```

## Non-functional requirements

- Text contrast ≥ 4.5:1 (normal) and ≥ 3:1 (large text, UI components) in the
  four flavors.
- Maximum 2 font families and 4 font files loaded; no CLS from font loading (CLS
  < 0.1).
- Theme selector is keyboard operable and has an accessible name; the darkness
  in parentheses is part of each option's text, not only a colour cue.

## Decisions

- **shadcn/ui:** components are copied into the repo and built on Radix
  primitives, so accessibility comes included while the look stays fully
  customisable. Chosen over a closed library.
- **Tailwind + CSS variables:** one source of truth for the tokens of every
  flavor. CSS Modules discarded.
- **Four Catppuccin flavors, selected with `data-theme`:** the owner wants all
  four. The palette is defined once (`--ctp-*`) per flavor, and the semantic
  tokens (`--background`, `--primary`…) only reference it, so a flavor swaps the
  palette and nothing else. Accent: mauve, with blue as the second colour for
  gradients and glow.
- **Separate flavor selector, no "system" option:** with no saved choice,
  `prefers-color-scheme` decides (Latte or Mocha). A dropdown, not four buttons:
  the labels ("Macchiato (darker)") are long and must also fit the mobile menu.
- **Latte has no lighter layer than its base:** page and card share the base
  colour and depth comes from border and shadow. A few roles use darker steps
  (muted text, input border) to reach 4.5:1 and 3:1.
- **next-themes (or equivalent) for the selector:** avoids the flash of wrong
  theme.
- **Fonts: Geist + Geist Mono** (2 families, variable files): the same pair the
  aitezaz.xyz reference uses.
- **References documented in the repo:** so later stories can cite the decisions
  instead of re-deciding.

## Definition of Done

- [x] `docs/design-references/design-references.md` lists, per reference site,
      what is taken (layout, typography, colors, animations) and the technology
      verdicts.
- [x] Tokens, fonts and shadcn/ui configured; Button themed in the four flavors.
- [x] Theme scenarios covered by Playwright tests and passing.
- [x] Contrast of all token pairs checked in the four flavors and recorded.
- [x] PR merged via merge commit from `us-03-design-tokens-and-theme`.
