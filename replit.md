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
- Single-page scroll with sections: Hero, About, Work, Writing, Projects, Education, Contact
- Hero with animated SVG circuit-trace and staggered text reveal
- Scroll-triggered Framer Motion animations on all sections
- Writing section serves a bundled snapshot of Substack and Medium articles; no browser RSS proxy is used.
- The portfolio build refreshes both feeds directly, preserving each source's last successful articles if a refresh fails. Refresh preview data manually with `pnpm --filter @workspace/portfolio run refresh:writing`; published content updates on republish.
- `/cornell` route — editorial long-form case study page
- Mobile responsive, editorial typography
- Uses wouter for routing, @tanstack/react-query for data fetching

### Backend (`artifacts/api-server`)
- `GET /api/writing` — returns cached Substack RSS articles as JSON
- Cron job (node-cron) refreshes Substack feed every 4 hours
- Initial fetch on server startup
- In-memory cache (no database needed)

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
- `src/pages/cornell/` — Long-form startup story page
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
