# US-04 — Internationalization

**As** a visitor, **I want** to read the site in Spanish or English, **so that**
I understand it in my own language.

> **Epic:** Foundation
>
> **Type:** Functional
>
> **Priority:** Must
>
> **Estimation:** M (routing, message catalogs and language detection touch
> every later page)
>
> **Dependencies:** [US-02](us-02-quality-gates.md)

Adds locale-based routing (`/es`, `/en`) with message catalogs and a language
switcher. **Its critical point** is to get the routing and the
content-per-locale convention right now, because every later story relies on it.

**Requirement:** None (personal project).

## Scope

Included:

- `next-intl` (or equivalent) with App Router: routes under `/[locale]/...`,
  locales `es` and `en`, default locale `en`.
- Redirect from `/` to the best locale using `Accept-Language`, falling back to
  `en`.
- Message catalogs `messages/es.json` and `messages/en.json`, with a test that
  both have exactly the same keys.
- Language switcher component that keeps the user on the equivalent page and
  remembers the choice in a cookie.
- `<html lang>` set per locale.

Not included:

- `hreflang`, canonical URLs and sitemap entries per locale -> US-21.
- Translated long-form content (MDX/JSON) -> US-06.
- Header placement of the switcher -> US-05 (the component is created here).

## Acceptance scenarios

Verified with Vitest (catalog parity) and Playwright (routing).

```gherkin
Feature: Internationalization
  As a visitor
  I want to choose Spanish or English
  So that I understand the site

  Scenario: Browser language decides the first redirect
    Given my browser sends Accept-Language "es-AR,es;q=0.9"
    When I open "/"
    Then I am redirected to "/es"
    And the html element has lang="es"

  Scenario: Unsupported language falls back to English
    Given my browser sends Accept-Language "fr-FR"
    When I open "/"
    Then I am redirected to "/en"

  Scenario: Switching language keeps the page
    Given I am on "/en" and a project detail path exists
    When I click the language switcher and choose Español
    Then I land on the same page under "/es"
    And the choice is stored in a cookie

  Scenario: Unknown locale returns 404
    When I open "/fr"
    Then the response status is 404

  Scenario: Catalogs stay in sync
    Given messages/es.json and messages/en.json
    When the unit test compares their keys
    Then both files contain exactly the same key set
```

## Non-functional requirements

- Locale redirect adds no more than one 307/308 hop.
- Language switcher is keyboard operable and announces the target language
  (`lang` attribute on each option).
- Missing translation keys fail the build, not at runtime.

## Decisions

- **Locale prefix in the URL:** needed for SEO and shareable links. Cookie.only
  detection discarded.
- **Default locale `en`:** aims at recruiters beyond the region; Spanish is one
  click away.
- **Catalog parity test:** prevents shipping half-translated pages.

## Definition of Done

- [ ] `/es` and `/en` render the placeholder home in their language.
- [ ] Redirect, fallback, switcher and 404 scenarios pass in Playwright.
- [ ] Key parity unit test passes.
- [ ] PR merged via merge commit from `us-04-internationalization`.
- [ ] README explains how to add a string and a locale.
