# Design references

Output of the US-03 reference spike. Sources: the CSS Peeper color exports
(`colors-reference-NN.json`) and the Wappalyzer exports (`wappalyzer-NN.csv`) in
this folder, plus the takeaways noted in the user stories README.

> **Evidence level.** Colors and technologies come from the exports. Layout and
> animation cells marked _(to confirm)_ are inferred from the detected libraries
> or from the README and still need a visual pass in the browser.

## What I take from each place

| Site                                  | Layout                                                                          | Typography      | Colors                                                                                                           | Animations                                                                       |
| ------------------------------------- | ------------------------------------------------------------------------------- | --------------- | ---------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| <https://aditya.medhe.in/>            | Education / work timeline (US-10). Plain, text-first structure.                 | Times New Roman | [01](colors-reference-01.json): Tailwind slate/stone neutrals, sky `#0EA5E9` accent, dark 900-level tints        | None detected. CSS only _(to confirm)_. Nothing to take.                         |
| <https://aitezaz.xyz/>                | Numbered sections, tabbed stack (US-09), copy-email button, marquee (US-09/18). | ui-sans-serif   | [02](colors-reference-02.json): green-tinted near-blacks, emerald `#34D399` accent, layered surfaces and borders | GSAP + Lenis (smooth scroll), Lucide icons. Scroll reveals, marquee _(confirm)_. |
| <https://alihamza-fawn.vercel.app/>   | Project cards with stats (US-14), hero with 3D accent.                          | DM Sans         | [03](colors-reference-03.json): near-black `#0A0A0F`, warm off-white `#EDE9E1`, red-orange `#E8442F` accent      | Framer Motion + GSAP + Lenis + Three.js. Card hover and reveals _(confirm)_.     |
| <https://dvmiz-portfolio.vercel.app/> | Unreadable as text. Visual pass pending.                                        | Poppins         | [04](colors-reference-04.json): only black, white and gray exported. Monochrome _(to confirm)_                   | Framer Motion + Three.js _(to confirm)_.                                         |
| <https://jamesmumo.vercel.app/>       | Unreadable as text. Visual pass pending.                                        | Nunito          | [05](colors-reference-05.json): only black and gray exported. Monochrome _(to confirm)_                          | None detected _(to confirm)_.                                                    |

### Patterns worth taking (across sites)

- **Tinted neutrals, not pure black/white.** Sites 02 and 03 never use `#000` as
  a surface: backgrounds are `#0A0F0D` / `#0A0A0F`, with 1-2 slightly lighter
  surface steps and a low-contrast border. This is what keeps dark themes from
  looking flat.
- **One accent per theme.** Emerald (02), red-orange (03), sky (01). The rest is
  neutral. Accent is used for links, active states and small highlights.
- **Three text levels.** Primary, secondary and muted (02 has four grays from
  `#E2E8E4` to `#94A39B`). Maps directly to `foreground`, `muted-foreground` and
  a subtle variant.
- **Section structure.** Numbered section labels (02), cards with stats (03),
  timeline (01).
- **Motion vocabulary.** Reveal on scroll, hover on cards, marquee. Nothing here
  needs 3D.

## Technologies detected and what to do with them

Judged against the stories (US-01 to US-27) and the decisions already made.

| Technology (seen on)                   | Used there for                   | Verdict       | Reason / story                                                                       |
| -------------------------------------- | -------------------------------- | ------------- | ------------------------------------------------------------------------------------ |
| Next.js, React (01, 02, 03)            | Framework                        | Already using | US-01.                                                                               |
| Tailwind CSS (all)                     | Styling                          | Already using | US-03.                                                                               |
| Lucide (02, 03, 05)                    | Icons                            | Using         | Comes with the shadcn preset. Covers US-05, US-09, US-18.                            |
| Framer Motion (03, 04)                 | Component animations             | Using (US-25) | Already the decision in the README. Package is now `motion`.                         |
| Vercel Analytics (02, 03)              | Visit stats                      | Using (US-24) | Privacy-friendly, no cookie banner.                                                  |
| Vercel (02-05)                         | Hosting                          | Using         | Decided.                                                                             |
| Turbopack (03)                         | Bundler                          | Already using | Default in this Next.js version.                                                     |
| Priority Hints (02, 03)                | `fetchpriority` on the LCP image | Yes, for free | `next/image` `priority` emits it. Relevant for US-23.                                |
| GSAP (02, 03)                          | Timeline / scroll animations     | No            | Overlaps Framer Motion, adds weight against the Lighthouse >= 90 goal (US-23).       |
| Lenis (02, 03)                         | Smooth scroll                    | No (for now)  | Hijacks native scroll: risk for anchors, keyboard, reduced motion (US-22) and US-23. |
| Three.js (03, 04)                      | 3D hero                          | No            | Heavy, hurts LCP/TBT, and recruiters need to read, not to watch a scene.             |
| Google Analytics + Tag Manager (01-03) | Analytics                        | No            | Contradicts US-24 (privacy-friendly) and adds a cookie banner.                       |
| reCAPTCHA (03)                         | Form spam protection             | No            | US-19 already specifies honeypot + Upstash rate limit.                               |
| Google AdSense (03)                    | Ads                              | No            | Not applicable.                                                                      |
| Google Font API (05)                   | Fonts at runtime                 | No            | US-03 requires `next/font`, self-hosted.                                             |
| Cloudinary (05)                        | Image CDN                        | No (for now)  | `next/image` on Vercel is enough. Revisit if screenshots become heavy.               |
| React Router (04, 05)                  | Client routing (Vite SPA)        | No            | App Router already covers routing and SEO (US-21).                                   |
| PWA, AMP (02, 03)                      | Installability, AMP pages        | No            | Out of scope.                                                                        |
| Netlify, Cloudflare, cdnjs, AWS (01)   | Hosting, CDN                     | No            | Vercel covers it.                                                                    |

## Decisions

- **Palette (light):** Catppuccin **Latte**. Accent and surface roles follow the
  patterns above. Token values and contrast check: see _Final tokens_.
- **Palette (dark):** Catppuccin **Frappé**, **Macchiato** and **Mocha**, in
  increasing darkness. Mocha is the closest to references 02 and 03 (tinted
  near-black plus one accent).
- **Typographys (max 2 families):** proposed **Geist** (sans, body and headings,
  comes with the Nova preset) + **Geist Mono** (labels, section numbers, tech
  tags). Variable fonts keep it at 2 files, under the 4-file limit. Closest
  match to the geometric sans of 03/04/05 without a third family.
- **Corner radius / shadow:** moderate radius driven by one `--radius` token
  (rounded cards, as in 03). Depth comes from surface steps plus a thin border
  (as in 02), not from heavy shadows. Exact values pending visual pass.
- **Motion (US-25):** Framer Motion only. Three durations (fast / base / slow)
  and one ease-out curve as tokens. Scroll reveal, card hover and marquee.
  Everything off or reduced under `prefers-reduced-motion`.

## Open points

- The README says light / dark / system; Catppuccin brings four flavors. How
  they map to the toggle is not decided yet.
- Sites 04 and 05 need a visual pass: layout and animation cells are unverified.

## Final tokens

(To be completed in cycle 2: copy the table of contrast pairs).
