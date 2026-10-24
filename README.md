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

## Scripts

| Script                           | What it does                                                             |
| -------------------------------- | ------------------------------------------------------------------------ |
| `pnpm dev`                       | Development server                                                       |
| `pnpm build` / `pnpm start`      | Production build and server                                              |
| `pnpm lint`                      | Biome (code) + markdownlint and Prettier (Markdown)                      |
| `pnpm lint:fix`                  | Applies the automatic fixes of all of them                               |
| `pnpm typecheck`                 | Type check (`next typegen` + `tsc --noEmit`)                             |
| `pnpm format` / `pnpm format:md` | Code formatting (Biome) / Markdown formatting (Prettier)                 |
| `pnpm test` / `pnpm test:run`    | Vitest (watch mode / single run)                                         |
| `pnpm test:e2e`                  | Playwright against the production build                                  |
| `pnpm verify`                    | Lint/format + types + tests + build (same as CI and the `pre-push` hook) |

## Git hooks (Husky)

- `commit-msg`: rejects any message that isn't `type(us-NN): message`.
- `pre-push`: runs lint, type check and build before pushing.

## Internationalization

- Languages: `en` (default) and `es`, with a URL prefix (`/en`, `/es`).
- UI texts live in `messages/en.json` and `messages/es.json`; **the keys must be
  the same in both** (a test checks it).
- **Adding a text:** add the key to both catalogs and use it with
  `useTranslations("Namespace")` (client, or server without `async`) or
  `await getTranslations(...)` (`async` server).
- **Adding a language:** add it to `locales` in `src/i18n/routing.ts` and to
  `src/i18n/locale-names.ts`, create `messages/<code>.json` with the same keys
  and add its folder in `content/` (US-06).
- For links and navigation always use `@/i18n/navigation` (not `next/link` or
  `next/navigation`).
