# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Personal portfolio website for Bharat Gandhi — a PM, strategist, and angel investor. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM (available but not used by portfolio)
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **Frontend**: React + Vite + Tailwind CSS + Framer Motion
- **Fonts**: EB Garamond (serif body), Space Mono / Departure Mono (monospace display)
- **Colors**: #FBFBFB background, #103DFF blue primary, #F2A33B amber accent

## Structure

```text
artifacts-monorepo/
├── artifacts/
│   ├── api-server/         # Express API server (Substack RSS cron + health)
│   └── portfolio/          # React + Vite portfolio frontend (single-page + /cornell)
├── lib/
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
├── scripts/
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── tsconfig.json
└── package.json
```

## Portfolio Features

### Frontend (`artifacts/portfolio`)
- The earlier home (`src/pages/home`, served at `/v1`): single-page scroll with Hero, About, Work, Writing, Projects, Education, Contact
- Hero with animated SVG circuit-trace and staggered text reveal
- Scroll-triggered Framer Motion animations on all sections
- Writing section serves a bundled snapshot of Substack and Medium articles; no browser RSS proxy is used.
- The portfolio build refreshes both feeds directly, preserving each source's last successful articles if a refresh fails. Refresh preview data manually with `pnpm --filter @workspace/portfolio run refresh:writing`; published content updates on republish.
- Mobile responsive, editorial typography
- Uses wouter for routing, @tanstack/react-query for data fetching

### Backend (`artifacts/api-server`)
- `GET /api/writing` — returns cached Substack RSS articles as JSON
- Cron job (node-cron) refreshes Substack feed every 4 hours
- Initial fetch on server startup
- In-memory cache (no database needed)

## The site

The gallery design is the site. Pages:

- `/` — home: introduction and rising line, a drifting line of logos, a gallery with filters (including "For recruiters"), a short places strip and writing.
- `/work/:id` — one card per gallery entry: pictures, a short lede, tags, results, the story in chapters, and one back button.
- `/meditation` — breathwork and meditation: workshops with expiry, background, research note, questions, gallery. This is where Instagram links land.
- `/agents` — plain semantic HTML for assistants, scrapers and screen readers. Not linked from the human pages.
- `/v1` — the earlier home page, kept for comparison. Never indexed.

Retired addresses redirect permanently: `/audible`, `/rategain`, `/fubo` go to their cards, `/cornell` goes to `/work/plaza`, and `/v2…` goes to the matching current page.

### Comparing the earlier home with the current one

The server can show the earlier home at `/` to a share of visitors. It is off by default.

1. In Replit, open Publishing, then the deployment's secrets or environment variables, and add `HOME_V1_SHARE` with a number from 0 to 100 (50 for an even split). Republish.
2. Each new visitor is assigned once and keeps that version for 30 days (cookie `bg_home`). Crawlers and AI assistants always get the current home, so search results describe one page.
3. Every analytics event carries `site_version` (`v1` or `v2`), and each home view sends `home_viewed`. Compare, per version: `resume_download_clicked`, `contact_clicked`, `social_link_clicked` and `work_clicked` / `project_clicked`, each divided by `home_viewed`.
4. To look at either version yourself, open `/?home=v1` or `/?home=v2`.
5. To end the comparison, set `HOME_V1_SHARE` to 0 (or remove it) and republish. To retire the earlier home for good, delete `src/pages/home`, the `/v1` page in `src/seo.ts` and the variant handling in `src/App.tsx`, `src/entry-server.tsx` and `server/index.mjs`.

The split needs the server-hosted (Autoscale) deployment. A static deployment serves one prebuilt home to everyone.

### Adding a card

Run:

```bash
pnpm --filter @workspace/portfolio run new:card -- "Name of the thing"
```

This creates `artifacts/portfolio/content/cards/<name>.md` from `_template.md`. Fill in the header (title, group, role, dates, place, intro, tags, picture, results, link) and write the story under `##` headings. Put the picture in `artifacts/portfolio/public/media/` and rebuild. The tile, the card at `/work/<name>`, the agent files and the SEO entry are generated. Delete the file to remove the card.

For a card with several pictures, a video or a logo cover, add an object to `coreEntries` in `src/v2/content.ts` and its chapters to `src/v2/chapters.ts`.

Other additions: an organisation is one line in `orgs` (logo in `public/media/logos/`); a place is one object in `places`; articles appear on their own from the Substack and Medium feeds at build time.

### How the pages load

Every page except the earlier home is server-rendered and not hydrated. They load one small entry (`src/v2/client.ts`, about 6 KB with its shared chunk, plus `v2.css`) instead of the app bundle. `scripts/prerender.mjs` reads the build manifest and records that entry in the page template; `src/entry-server.tsx` swaps it in for every page except the earlier home. Because of this, v2 components must not rely on React state, effects or event handlers: use plain HTML and CSS, and put anything that needs script in `client.ts`, found through a `data-` attribute.

The same model generates the machine-readable files in `public/` (`llms.txt`, `llms-full.txt`, `resume.md`, `profile.json`, `credits.txt`, and the stable `Bharat_Gandhi_Resume.pdf`) via `pnpm --filter @workspace/portfolio run build:agent-assets`, which also runs during the build. Do not edit those generated files by hand.

Rules that hold for v2:

- Work authorization (`workAuthorization`) and the skills synonym index (`skillIndex`) appear only in machine-readable surfaces. Never render them in the human UI.
- No metrics on the home page. Numbers live on the cards.
- The rising line is a background motif. Do not label it or turn it into a timeline.
- Do not show image sourcing on the pages. The Creative Commons photographs still need attribution, so it lives in `/credits.txt`, linked once from the footer and generated from `src/v2/photo-credits.json`.
- Card copy in `chapters.ts` is first person and follows the humanizer checklist (github.com/blader/humanizer): no dashes, no staged contrasts. Résumé wording stays in `shipped`, which only the agent files use.
- Media in `public/media/`: `shot-*` are captures of public sites, `photo-*` and `thumb-*` are Wikimedia Commons, `gen-*` were generated with Gemini, logos come from each organisation.
- Places show a name and a thumbnail only, in the order New York, New Delhi, San Francisco, Bengaluru, Gurugram.
- Every tile and card carries tags: its kind first (Work, Project, Education, Teaching), then the entry's own.
- One typeface, Gandhi Serif, in `src/v2/fonts/`: a custom cut of Amstelvar (SIL OFL 1.1) with weight and optical-size axes, so text and headings are the same letterforms.
- The stylesheet was audited with Hallmark (github.com/Nutlope/hallmark): tokens only, 4px spacing scale, sentence-case labels.

## TypeScript & Composite Projects

Every package extends `tsconfig.base.json` which sets `composite: true`. The root `tsconfig.json` lists all packages as project references. This means:

- **Always typecheck from the root** — run `pnpm run typecheck`
- **`emitDeclarationOnly`** — we only emit `.d.ts` files during typecheck
- **Project references** — when package A depends on package B, A's `tsconfig.json` must list B in its `references` array

## Root Scripts

- `pnpm run build` — runs `typecheck` first, then recursively runs `build` in all packages
- `pnpm run typecheck` — runs `tsc --build --emitDeclarationOnly` using project references

## Packages

### `artifacts/api-server` (`@workspace/api-server`)

Express 5 API server with routes:
- `GET /api/healthz` — health check
- `GET /api/writing` — Substack RSS feed (cached, auto-refreshed via cron)
- Entry: `src/index.ts` — reads PORT, starts Express, initializes cron job
- Routes: `src/routes/writing.ts` — Substack RSS fetching and caching

### `artifacts/portfolio` (`@workspace/portfolio`)

React + Vite portfolio frontend. Key files:
- `src/pages/home/` — Hero, About, Work, Writing, Projects, Education, Contact sections
- `src/components/layout/` — Navbar, Footer
- `src/components/ui/` — AnimatedText, Tag, SectionHeading
- `src/hooks/use-writing.ts` — exposes the local writing snapshot for pagination
- `src/index.css` — Design tokens and Tailwind theme

### `lib/api-spec` (`@workspace/api-spec`)

OpenAPI 3.1 spec with endpoints for health and writing. Run codegen: `pnpm --filter @workspace/api-spec run codegen`

### `lib/db` (`@workspace/db`)

Database layer (available but not currently used by portfolio).

### `scripts` (`@workspace/scripts`)

Utility scripts package.

## Deployment

### Server-Hosted Deployment Configuration

The portfolio publishing configuration runs a **Node production server**, with current-time HTML and structured data for workshop expiry. The per-artifact configuration is authoritative; do not restore static hosting or point publishing at build snapshots.

- **Build command**: `pnpm --filter @workspace/portfolio run build`
- **Production run**: `node artifacts/portfolio/server/index.mjs`
- **Startup probe**: `/healthz`

The root `.replit` retains `deployment.publicDir = "artifacts/portfolio/dist/public"` for compatibility with the existing Static publishing form. Do not remove it while that form is active: publishing rejects an empty public directory before starting a build. This field does not force Static hosting; select Autoscale in Publishing to activate the server-hosted configuration.

The build creates browser assets, prerendered validation snapshots, an empty-root client template and an SSR bundle. The production server renders public routes for each request, returns uncached HTML, and serves files from `dist/public`. It binds to `0.0.0.0` on `PORT`. The development workflow still uses Vite. Writing feeds refresh only during builds, with last-successful data preserved on publisher failures.

### Publishing to bharatdevgandhi.com

Follow these steps to deploy and set up the custom domain:

1. **Configure publishing**: Use the process-based production build/run configuration in the portfolio's artifact metadata, not a static public-directory deployment. The old live static deployment is unchanged until the user publishes.

2. **Publish the site**: Click the **Publish** button in the Replit UI (top right of the editor). This will build the portfolio and make it live on a `.replit.app` domain.

3. **Add custom domain**: After publishing, go to the deployment dashboard and navigate to the **Custom Domains** section. Add `bharatdevgandhi.com` as a custom domain.

4. **Set DNS records at your domain registrar**: Replit will show you the exact DNS records to configure. Typically you need:
   - **For the apex domain (`bharatdevgandhi.com`)**: Add an A record or ALIAS record pointing to the IP address or hostname Replit provides.
   - **For `www.bharatdevgandhi.com`**: Add a CNAME record pointing to the value Replit provides (usually your `.replit.app` domain).

5. **Wait for DNS propagation**: DNS changes can take up to 48 hours to propagate, though they usually complete within a few minutes to a few hours. Replit will automatically provision an SSL certificate once DNS is verified.
