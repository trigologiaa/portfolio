# Design references

Output of the US-03 reference spike. Sources: the CSS Peeper color exports
(`colors-reference-NN.json`) and the Wappalyzer exports (`wappalyzer-NN.csv`) in
this folder, plus a visual pass of the five sites in Chrome (hero and first
sections of each, computed fonts, radii and shadows read from the live pages).

> **Evidence level.** Everything below was checked in the browser unless marked
> _(not verified)_. Hover states and exact animation timings were not recorded.

## What I take from each place

| Site                                  | Layout                                                                                                                                                                            | Typography                                                                                                                      | Colors                                                                                                                                                  | Animations                                                                                                                                       |
| ------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| <https://aditya.medhe.in/>            | Big rounded hero panel (64px), master-detail experience (company list left, details right, tilted photo), separate Study section, sticky header with icon links (US-10).          | Overpass (all text). La Belle Aurore (handwritten) for one tagline. The export said Times New Roman: that is only the fallback. | [01](colors-reference-01.json): near-black page, slate gradient hero, sky `#0EA5E9` accent, large sky glow shadow.                                      | Subtle: hero gradient, selected-company transitions. Illustration (pager) as a decorative break.                                                 |
| <https://aitezaz.xyz/>                | Intro loader ("Welcome" + percentage), light page with large dark rounded panels (32px), numbered/mono labels such as `(ABOUT ME)`, tabbed stack, marquee, copy-email (US-09/18). | Geist, Geist Mono, Space Grotesk, Instrument Serif. Headings mix caps sans with an italic green serif word (`WHO am I?`).       | [02](colors-reference-02.json): green-tinted near-blacks, emerald `#34D399` accent, light gray-green page behind the panels.                            | Word-by-word text reveal on scroll, particle canvas, loader. Large soft shadows (`0 25px 60px -12px`).                                           |
| <https://alihamza-fawn.vercel.app/>   | Floating bordered nav bar, two-column hero (text + "build pipeline" panel with a 3D wireframe and stat tiles), project cards with stats (US-14), client feedback section.         | DM Sans (body), Bricolage Grotesque (display headings), IBM Plex Mono (labels, code).                                           | [03](colors-reference-03.json): near-black `#0A0A0F`, warm off-white `#EDE9E1`, red-orange `#E8442F` accent.                                            | Headings and list items fade in from a blur on scroll. Typing cursor in the code panel. 3D knot (Three.js). Chat widget ("Ask about a project"). |
| <https://dvmiz-portfolio.vercel.app/> | Terminal theme (`$ whoami`, `> DEVELOPER.PROFILE()`), four icon cards under About, centered vertical timeline with alternating cards, thin-bordered boxes (8px).                  | Poppins (headings), monospace (body).                                                                                           | [04](colors-reference-04.json): pure black, white, grays. White solid buttons, one small yellow logo tag.                                               | Falling line particles over black, orbiting 3D shapes in the hero, glowing card borders. Heaviest of the five.                                   |
| <https://jamesmumo.vercel.app/>       | Centered hero, pill nav with active dot, side rail with social icons, scroll progress bar, "MY JOURNEY" badge, experience cards with logo and tech chips (US-10).                 | Nunito (body). A decorative display font for the hero name. The page loads about 15 Google fonts: do not copy that.             | [05](colors-reference-05.json): the export is incomplete (black and gray only). Visually: charcoal page, emerald green accent with a radial green glow. | Radial glow, active-section indicator, entrance fades. Light overall.                                                                            |

### Patterns worth taking (across sites)

- **Tinted neutrals, not pure black/white.** Sites 02, 03 and 05 use a charcoal
  or green/blue-tinted base with 1-2 slightly lighter surface steps and a thin,
  low-contrast border. The pure-black site (04) is the flattest of the five.
- **One accent per theme.** Emerald (02, 05), red-orange (03), sky (01). The
  rest is neutral. Used for links, active states, CTAs and small highlights.
- **Depth without heavy shadows.** Radial glows (05), gradient heroes (01),
  bordered panels with an inner highlight (03), big soft shadows (02).
- **Three text levels.** Primary, secondary and muted (02 has four grays from
  `#E2E8E4` to `#94A39B`).
- **Mono for metadata.** Section labels, tags and stats in a monospace (02, 03,
  04, 05 chips).
- **Section structure.** Master-detail or timeline for experience (01, 04, 05),
  cards with stats (03), numbered labels (02).
- **Radius.** Mostly 8px for cards and buttons, 12-16px for panels, full pill
  for chips and nav. Large radii (24-64px) only for hero-sized panels (01, 02).
- **Motion vocabulary.** Reveal on scroll (fade/blur/word-by-word), card hover,
  marquee, one decorative accent. 3D and particle canvases are the costly ones.

## Technologies detected and what to do with them

Judged against the stories (US-01 to US-27) and the decisions already made.

| Technology (seen on)                   | Used there for                   | Verdict       | Reason / story                                                                    |
| -------------------------------------- | -------------------------------- | ------------- | --------------------------------------------------------------------------------- |
| Next.js, React (01, 02, 03)            | Framework                        | Already using | US-01.                                                                            |
| Tailwind CSS (all)                     | Styling                          | Already using | US-03.                                                                            |
| Lucide (02, 03, 05)                    | Icons                            | Using         | Comes with the shadcn preset. Covers US-05, US-09, US-18.                         |
| Framer Motion (03, 04)                 | Component animations             | Using (US-25) | Already the decision in the README. Package is now `motion`.                      |
| Vercel Analytics (02, 03)              | Visit stats                      | Using (US-24) | Privacy-friendly, no cookie banner.                                               |
| Vercel (02-05)                         | Hosting                          | Using         | Decided.                                                                          |
| Turbopack (03)                         | Bundler                          | Already using | Default in this Next.js version.                                                  |
| Priority Hints (02, 03)                | `fetchpriority` on the LCP image | Yes, for free | `next/image` `priority` emits it. Relevant for US-23.                             |
| GSAP (02, 03)                          | Timeline / scroll animations     | No            | Overlaps Framer Motion and adds weight against Lighthouse >= 90 (US-23).          |
| Lenis (02, 03)                         | Smooth scroll                    | No (for now)  | Hijacks native scroll: risk for anchors, keyboard, reduced motion (US-22), US-23. |
| Three.js (03, 04)                      | 3D hero (canvas confirmed)       | No            | Heavy, hurts LCP/TBT. Recruiters need to read, not to watch a scene.              |
| Google Analytics + Tag Manager (01-03) | Analytics                        | No            | Contradicts US-24 (privacy-friendly) and adds a cookie banner.                    |
| reCAPTCHA (03)                         | Form spam protection             | No            | US-19 already specifies honeypot + Upstash rate limit.                            |
| Google AdSense (03)                    | Ads                              | No            | Not applicable.                                                                   |
| Google Font API (05)                   | Fonts at runtime                 | No            | US-03 requires `next/font`, self-hosted. Site 05 loads about 15 families.         |
| Cloudinary (05)                        | Image CDN                        | No (for now)  | `next/image` on Vercel is enough. Revisit if screenshots become heavy.            |
| React Router (04, 05)                  | Client routing (Vite SPA)        | No            | App Router already covers routing and SEO (US-21).                                |
| PWA, AMP (02, 03)                      | Installability, AMP pages        | No            | Out of scope.                                                                     |
| Netlify, Cloudflare, cdnjs, AWS (01)   | Hosting, CDN                     | No            | Vercel covers it.                                                                 |

## Decisions

- **Palette (light):** Catppuccin **Latte**. Accent and surface roles follow the
  patterns above. Token values and contrast check: see _Final tokens_.
- **Palette (dark):** Catppuccin **Frappé**, **Macchiato** and **Mocha**, in
  increasing darkness. Mocha is the closest to references 02, 03 and 05 (tinted
  near-black plus one accent). To avoid the flat look of site 04: three surface
  steps, thin borders, and a soft radial glow of the accent behind the hero.
- **Typographys (max 2 families):** proposed **Geist** (sans, body and headings,
  comes with the Nova preset) + **Geist Mono** (labels, section numbers, tech
  tags). Variable fonts keep it at 2 files, under the 4-file limit. Geist and
  Geist Mono are also what site 02 uses. The italic serif accent word of 02
  (Instrument Serif) would be a third family, so it is left out unless one of
  the two is dropped.
- **Corner radius / shadow:** `--radius` of 8px for cards and buttons (the value
  seen on 02, 03, 04), 12-16px for panels, full pill for chips and nav. Depth
  from surface steps plus a thin border, a soft glow on the accent, and one
  large soft shadow for floating elements. No heavy drop shadows.
- **Motion (US-25):** Framer Motion only. Three durations (fast / base / slow)
  and one ease-out curve as tokens. Scroll reveal (fade, optionally with blur),
  card hover and marquee. Everything off or reduced under
  `prefers-reduced-motion`. No particle or 3D canvases.

## Open points

- **Theme selector (decided):** a separate flavor selector with the 4 Catppuccin
  flavors, each labelled with its name and its darkness in parentheses: Latte
  (light), Frappé (dark), Macchiato (darker), Mocha (darkest). No "system"
  option: with no saved choice, `prefers-color-scheme` picks Latte (light) or
  Mocha (dark). The choice is stored in `localStorage`, and an invalid value
  falls back to the system preference.
- US-03 still says light / dark / system: its scope, the "Manual choice"
  scenario and the Definition of Done need to be updated to match.
- The CSS Peeper export for 04 and 05 is incomplete, so their palettes are only
  described visually. No exact hex values were taken from them.

## Final tokens

Palette and semantic tokens live in `src/app/themes.css`. Flavors are selected
with `data-theme="latte | frappe | macchiato | mocha"` on `<html>`; with no
attribute, Latte applies.

Layers, from deepest to highest: crust, mantle, base, surface0, surface1. Dark
flavors use mantle for the page and base for cards (raised). Latte is the
lightest flavor and cannot go lighter than base, so page and card are both base
and depth comes from the border and the shadow.

| Role                           | Latte    | Frappé, Macchiato, Mocha    |
| ------------------------------ | -------- | --------------------------- |
| background                     | base     | mantle                      |
| card                           | base     | base                        |
| popover                        | base     | surface0                    |
| muted                          | mantle   | surface0                    |
| muted-foreground               | subtext1 | subtext0 (Frappé: subtext1) |
| accent (hover)                 | surface0 | surface1                    |
| input border                   | overlay2 | overlay1                    |
| primary / ring                 | mauve    | mauve                       |
| highlight (gradient, 2nd glow) | blue     | blue                        |

Depth tokens: `--glow` and `--glow-secondary` (accent at 20% / 16%, used as two
radial gradients on the page), `--gradient-accent`, `--shadow-soft`,
`--shadow-float`. Shape and motion: `--radius` 0.5rem, `--duration-fast` 150ms,
`--duration-base` 250ms, `--duration-slow` 500ms, `--ease-out-soft`.

### Contrast of every pair

Computed with the WCAG 2.1 formula (text 4.5:1, UI components and focus ring
3:1). All pairs pass.

| Pair                             | Min   | Latte | Frappé | Macchiato | Mocha |
| -------------------------------- | ----- | ----- | ------ | --------- | ----- |
| foreground / background          | 4.5:1 | 7.06  | 9.04   | 10.85     | 12.14 |
| card-foreground / card           | 4.5:1 | 7.06  | 8.06   | 9.92      | 11.34 |
| popover-foreground / popover     | 4.5:1 | 7.06  | 6.19   | 7.55      | 8.69  |
| muted-foreground / background    | 4.5:1 | 5.53  | 7.58   | 7.24      | 7.89  |
| muted-foreground / card          | 4.5:1 | 5.53  | 6.75   | 6.62      | 7.37  |
| muted-foreground / muted         | 4.5:1 | 5.14  | 5.19   | 5.03      | 5.65  |
| primary-foreground / primary     | 4.5:1 | 4.79  | 5.60   | 6.84      | 8.07  |
| secondary-foreground / secondary | 4.5:1 | 5.17  | 6.19   | 7.55      | 8.69  |
| accent-foreground / accent       | 4.5:1 | 5.17  | 4.68   | 5.59      | 6.31  |
| primary as link / background     | 4.5:1 | 4.79  | 6.28   | 7.48      | 8.64  |
| primary as link / card           | 4.5:1 | 4.79  | 5.60   | 6.84      | 8.07  |
| destructive / background         | 4.5:1 | 4.80  | 5.21   | 6.52      | 7.58  |
| input border / background        | 3:1   | 3.49  | 4.09   | 4.53      | 4.75  |
| input border / card              | 3:1   | 3.49  | 3.65   | 4.14      | 4.44  |
| ring / background                | 3:1   | 4.79  | 6.28   | 7.48      | 8.64  |
| ring / card                      | 3:1   | 4.79  | 5.60   | 6.84      | 8.07  |

Not checked: decorative borders (`--border`), which are meant to be subtle.
