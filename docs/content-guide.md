# Content guide

All of the site's own content lives in `content/`, in two folders: `en/` and
`es/`. After editing, run `pnpm content:check`.

| File                           | What it is                                       | Notes                                                                                |
| ------------------------------ | ------------------------------------------------ | ------------------------------------------------------------------------------------ |
| `profile.json`                 | Name, headline, pitch, email, links, highlights  | `highlights`: short list                                                             |
| `stack.json`                   | Technologies by category                         | the `id`s must be **the same** in both languages; `icon` is a key from the icon list |
| `timeline.json`                | Education, courses and work                      | dates as `YYYY-MM`; no `end` = ongoing                                               |
| `about.mdx`                    | "About me" text                                  | Markdown/MDX                                                                         |
| `curation.json`                | Which projects to exclude or pin (US-13)         | at the root of `content/`                                                            |
| `projects/{repo}.{locale}.mdx` | Description and screenshots of a project (US-13) | validated frontmatter                                                                |

## Rules

- Every `id` that exists in one language must exist in the other.
- Dates are `YYYY-MM` or `YYYY-MM-DD`.
- Anything that says `TODO` is a placeholder: replace it before publishing
  (US-27 checks this).
