# Portfolio

Personal portfolio (Next.js + TypeScript). Production:
<https://portfolio-trigologiaa.vercel.app/>

## Workflow

- One branch and one pull request per story: `us-NN-short-name`.
- `main` is protected: changes only get in through a PR with the `ci` check
  green.
- PRs are merged with a **merge commit** (no squash).
- Conventional commits with the story number as scope: `type(us-NN): message`
  (for example `feat(us-01): add the minimal home page`). A Husky hook enforces
  it.

## Development

```sh
pnpm install   # also installs the Git hooks (Husky)
pnpm dev
pnpm lint      # Biome (lint + format)
```

## Git hooks (Husky)

- `commit-msg`: rejects any message that isn't `type(us-NN): message`.
- `pre-push`: runs lint, type check and build before pushing.
