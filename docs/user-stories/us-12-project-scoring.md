# US-12 - Project scoring

**As** the site owner, **I want** each repository to receive an automatic score,
**so that** my best projects are highlighted without choosing them by hand.

> **Epic:** GitHub projects
>
> **Type:** Technical (enabler)
>
> **Priority:** Must **Estimation:** M (pure logic, but weights and edge cases
> need care and tests)
>
> **Dependencies:** [US-11](./us-11-github-client-with-isr.md)

A pure, deterministic function `scoreRepository(repo, now)` returning a score
from 0 to 100 and a breakdown per signal. **Its critical point** is that the
score rewards completeness (a project a recruiter can actually evaluate) over
popularity, because a junior portfolio rarely has stars.

**Requirement:** None (personal project).

## Scope

Included:

- Signals and weights (total 100):
  - Live demo (`homepage` not empty): 25
  - README present: 20
  - Description present (≥ 20 characters): 15
  - Recent activity (`pushed_at`): 20 — full points within 90 days, linear decay
    to 0 at 730 days
  - Topics (≥ 3 topics = full, proportional below): 10
  - Stars + forks: 10 — logarithmic scale, capped (so 10 stars already give a
    meaningful part)
- Weights defined in a single configuration object, easy to tune.
- Breakdown returned with the score (used for debugging and for the owner's view
  in US-13).
- Tie-break: higher score, then most recent `pushed_at`, then name.
- Exhaustive unit tests, including boundaries.

Not included:

- Excluding or forcing repositories -> **US-13**.
- Displaying the ranking -> **US-14**.

## Acceptance scenarios

Verified with Vitest (pure function, injected `now`).

```gherkin
Feature: Project scoring
  As the site owner
  I want an automatic project score
  So that my best work is highlighted

  Scenario: Complete repository scores high
    Given a repo with demo, README, a 60-character description, 4 topics and a push 10 days ago
    When I compute its score
    Then the score is at least 85
    And the breakdown lists each signal with its points

  Scenario: Bare repository scores low
    Given a repo with no demo, no README, no description, no topics and a push 3 years ago
    When I compute its score
    Then the score is 0

  Scenario: Recency decays linearly
    Given a repo last pushed 410 days ago
    When I compute the recency points
    Then they equal 10 (half of 20)

  Scenario: Ties are broken deterministically
    Given two repos with the same score
    When I sort them
    Then the one pushed most recently comes first
    And if still tied, alphabetical order by name decides

  Scenario: Stars cannot dominate
    Given a repo with 10,000 stars and nothing else
    When I compute its score
    Then the stars and forks signal contributes at most 10 points
```

## Non-functional requirements

- Function is pure: same input and `now` always return the same output.
- Weights sum to exactly 100, enforced by a unit test.
- Scoring 100 repos takes less than 10 ms.

## Decisions

- **Completeness over popularity:** a junior profile has few stars; completeness
  shows care. Stars-first ranking discarded.
- **Logarithmic stars:** prevents one viral repo from dominating.
- **Injected `now`:** makes time-dependent tests deterministic.

## Definition of Done

- [ ] `scoreRepository` and the config implemented and documented in
      `docs/scoring.md` with the table above.
- [ ] All scenarios and boundaries (0, 90, 730 days) covered by tests.
- [ ] PR merged via merge commit from `us-12-project-scoring`.
