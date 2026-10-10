# jeanducrot.com

Personal portfolio for Jean Ducrot. Static site built with [Build Awesome](https://build.awesome.me/) (`4.0.0-alpha.10`, the Eleventy successor) and deployed on Vercel. Markdown content, hand-written CSS, one small script for the theme toggle.

**Requires Node 22.15 or newer** (`nvm use` reads `.nvmrc`).

```bash
npm install
npm run dev      # local server with live reload
npm run build    # static output in _site/
npm run a11y     # builds, then audits every page in light and dark with pa11y-ci and axe (WCAG 2.2 A/AA)
npm run lighthouse   # builds, then fails if any Lighthouse category is under 95
npm run og       # regenerates public/og.png
```

## Where things live

| Path | What |
|---|---|
| `src/_data/site.js` | **Site settings: contact email, LinkedIn, GitHub, URL.** |
| `src/_data/resume.json` | Content of the HTML résumé at `/resume/`. |
| `src/work/*.md` | Case studies (one file per page). |
| `src/writing/*.md` | Talks and writing. |
| `src/index.njk` | Homepage. |
| `src/_includes/layouts/` | Base, case study and post layouts. |
| `src/css/site.css` | All styles and theme tokens. |
| `public/` | Copied to the site root: headshot, OG image, résumé PDF, favicon. |
| `vercel.json` | Trailing slashes and the `/feed.xml` → `/rss.xml` redirect. |

## Change the contact email

Edit `email` in `src/_data/site.js`. The homepage button and everything else read from it.

## Add a case study

Create `src/work/my-project.md`. The file name becomes the URL (`/work/my-project/`), and it appears on the homepage automatically.

```md
---
title: "Project title"
organization: "Company"
dates: "2024–2025"
order: 6            # position on the homepage; lower comes first
summary: "One paragraph shown on the homepage."
result: "One-line result shown in the highlighted chip"
---

## The problem
...
## What I did
...
## The result
...
```

Images: put them in `public/images/` and reference them with `![Descriptive alt text](/images/file.png)`. Always write real alt text, or `![]()` for decorative images.

## Add a post, talk, or article

Create `src/writing/my-entry.md`:

```md
---
title: "Entry title"
type: article        # talk | article | blog
year: 2026
label: "Article"     # text shown on the right of the list (e.g. "CSUN 2026")
order: 7
url: "https://example.com/where-it-lives"   # optional external link
---
```

- Entries with a `url` link out. Without one, they show as plain text.
- To host a post on this site, add `permalink: /blog/my-post/` and write the body below the frontmatter. See `src/writing/the-dreaded-first-post.md`.
- Every entry appears in `/rss.xml`.

## Résumé

Replace `public/jean-ducrot-resume.pdf` with the real file (keep the name). Edit `src/_data/resume.json` for the HTML version.

## Deploy

Push to GitHub, import the repo in Vercel, and keep the defaults: build command `npm run build`, output directory `_site`. Vercel reads `.nvmrc`/`engines` for the Node version. Make sure the project uses Node 22.x in Vercel settings.

## Accessibility notes

- Skip link, landmarks, one `h1` per page, visible 3px focus ring.
- Theme toggle is a `<button aria-pressed>`; the saved theme is applied in `<head>` before paint, and the button stays hidden without JavaScript.
- `prefers-reduced-motion` disables smooth scrolling and transitions.
- Automated checks cover only part of WCAG. Keyboard order, zoom/reflow and screen reader use should be checked by hand after content changes.

## Differences from the original mockup

Small fixes made for WCAG 2.2 AA: darker link and button hover colors (the mockup's hover pink failed 4.5:1), a fixed "Dark mode" toggle label driven by `aria-pressed`, a descriptive headshot `alt`, larger target sizes for nav links, and a footer résumé link.
