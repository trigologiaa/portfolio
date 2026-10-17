## Story

<!-- Link to the story and PR title: `US-NN — name` -->

[US-NN — name](user-stories/us-NN-name.md)

## What changes

<!-- 2-4 lines: what this PR does and why. Don't repeat the diff. -->

-

## How to test it

<!-- Steps to verify by hand, or the Gherkin scenario that covers it. -->

1.
2.

## Verification

- [ ] `pnpm verify` passes locally (`pnpm lint && pnpm typecheck && pnpm build` until US-02)
- [ ] The `ci` check is green
- [ ] The story's scenarios are covered (tests or manual verification)
- [ ] Checked at 360 px and 1280 px, in light and dark theme (if there is UI)

## Definition of Done

- [ ] Every item in the story's DoD is met
- [ ] Commits follow `type(us-NN): message`
- [ ] No secrets in the repo; new variables added to `.env.example`
- [ ] README updated (if scripts, workflow or URLs change)

## Notes

<!-- Decisions, trade-offs, technical debt, screenshots of the Vercel preview.
     Delete this section if it doesn't apply. -->

> Merge with a **merge commit** (no squash), from branch `us-NN-short-name`.
