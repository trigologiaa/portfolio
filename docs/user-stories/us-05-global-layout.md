# US-05 — Global layout

**As** a visitor, **I want** a header with navigation and a footer on every
page, **so that** I can move around the site and always find the main links.

> **Epic:** Design system
>
> **Type:** Functional
>
> **Priority:** Must
>
> **Estimation:** M (responsive navigation with anchors and cross-page links,
> plus mobile menu)
>
> **Dependencies:** [US-03](/docs/us-03-design-tokens-and-theme.md),
> [US-04](/docs/us-04-internationalization.md)

Builds the shared shell: skip link, header (logo/name, section navigation,
language switcher, theme selector), mobile menu and footer. **Its critical
point** is that the navigation works both on the home page (scroll to section)
and on inner pages (go back to the home section).

**Requirement:** None (personal project).

## Scope

Included:

- Header with links to the home sections: Projects, About, Stack, Experience,
  Contact; plus CV link slot and the language/theme controls. The theme control
  is the flavor dropdown from [US-03](/docs/us-03-design-tokens-and-theme.md);
  on small screens it shows only its icon, so it fits next to the menu button.
- Anchor navigation on `/[locale]`; on other pages, links point to
  `[locale]#section`.
- Active section highlight while scrolling on the home page.
- Mobile menu (below 768 px) built on an accesible primitive (Sheet/Dialog from
  shadcn/ui), closing on navigation and on `Esc`.
- "Skip to content" link as first focusable element.
- Footer with copyright, social links placeholder (fille by US-18) and local
  year.
- Empty `<main id="content">` sections as placeholders for the next stories.

Not included:

- Content of each section - US-07 to US-10.
- Contact details in the footer - US-18.
- Scroll and entrance animations- US-25.

## Acceptance scenarios

Verified with Playwright at 375 px and 1280 px widths.

```gherkin
Feature: Global layout
  As a visitor
  I want consistent navigation
  So that I can reach any section quickly

  Scenario: Desktop navigation scrolls to a section
    Given I am on the home page at 1280 px width
    When I click "About" in the header
    Then the URL hash becomes "#about"
    And the About section is in the viewport

  Scenario: Navigation from an inner page returns to the home section
    Given I am on a project detail page
    When I click "Contact" in the header
    Then I land on the home page at the "#contact" anchor

  Scenario: Mobile menu opens, closes with Escape
    Given I am on the home page at 375 px width
    When I open the menu and press Escape
    Then the menu is closed
    And focus returns to the menu button

  Scenario: Skip link is the first focusable element
    Given I load any page
    When I press Tab once
    Then the "Skip to content" link receives focus
    And activating it moves focus to the main content
```

## Non-functional requirements

- Header remains usable from 320 px to 1920 px with no horizontal scroll.
- Touch targets at least 44 x 44 px on mobile.
- Header JS is limited to the mobile menu and theme/language controls; the rest
  is server-rendered.

## Decisions

- **Sticky header with solid background on scroll:** keeps navigation reachable.
  Hidden-on-scroll variants are discarded until US-25.
- **Section anchors on a single home page:** matches the hybrid structure.

## Definition of Done

- [ ] Header, mobile menu and footer implemented in both languages and the four
      flavors.
- [ ] Playwright scenarios pass at both widths.
- [ ] Skip link and focus return verified manually with the keyboard.
- [ ] PR merged via merge commit from `us-05-global-layout`.
