import { renderToString } from "react-dom/server";
import App from "./App";
import { getSeoPages, socialImage } from "./seo";

export { getSeoPages, siteOrigin } from "./seo";

function escapeHtml(value: string) {
  return value.replaceAll("&", "&amp;").replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

/**
 * The v2 pages are not hydrated. Swap the app's script, stylesheet and web
 * fonts for the small v2 entry recorded in the template at build time.
 */
function v2Shell(template: string) {
  const assets = template.match(/<!--V2_ASSETS (.*?) V2_ASSETS-->/s)?.[1];
  if (!assets) return template;
  // Park a marker where the v2 files go, strip the app's files, then fill it.
  const marker = "<!--v2-entry-->";
  return template
    .replace(/<!--V2_ASSETS .*? V2_ASSETS-->/s, marker)
    .replace(/<script type="module"[^>]*><\/script>\s*/g, "")
    .replace(/<link rel="(?:stylesheet|modulepreload|preconnect)"[^>]*>\s*/g, "")
    .replace(marker, assets);
}

export type HomeVariant = "v1" | "v2";

/**
 * Renders one page. `variant` only matters for "/": "v1" serves the earlier
 * home there, for the share of visitors the server put in the comparison.
 */
export function renderPage(
  template: string,
  pathname: string,
  now = Date.now(),
  variant: HomeVariant = "v2",
): string | null {
  const page = getSeoPages(now).find((item) => item.path === pathname);
  if (!page) return null;
  if (!template.includes("ROUTE_SEO_START") || !template.includes("ROUTE_SEO_END")
    || !template.includes('<div id="root"></div>')) {
    throw new Error("Page template is missing its SEO or rendering placeholders.");
  }
  const title = escapeHtml(page.title);
  const description = escapeHtml(page.description);
  const canonical = escapeHtml(page.canonical);
  const image = escapeHtml(page.image ?? socialImage);
  const graph = JSON.stringify({
    "@context": "https://schema.org",
    "@graph": page.structuredData,
  }).replaceAll("<", "\\u003c");
  const head = [
    `<title>${title}</title>`,
    `<meta name="description" content="${description}" />`,
    `<link rel="canonical" href="${canonical}" />`,
    ...(page.noindex ? [`<meta name="robots" content="noindex, follow" />`] : []),
    `<link rel="alternate" type="text/plain" href="/llms.txt" title="llms.txt" />`,
    `<link rel="alternate" type="application/json" href="/profile.json" title="Profile (JSON Resume)" />`,
    `<meta property="og:title" content="${title}" />`,
    `<meta property="og:description" content="${description}" />`,
    `<meta property="og:type" content="${page.ogType}" />`,
    `<meta property="og:site_name" content="Bharat Gandhi" />`,
    `<meta property="og:url" content="${canonical}" />`,
    `<meta property="og:image" content="${image}" />`,
    `<meta property="og:image:alt" content="Bharat Gandhi — product manager and AI builder" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${title}" />`,
    `<meta name="twitter:description" content="${description}" />`,
    `<meta name="twitter:image" content="${image}" />`,
    `<script id="page-structured-data" type="application/ld+json">${graph}</script>`,
  ].join("\n    ");
  // The earlier home needs the app bundle; every other page is the portfolio.
  const earlier = page.path === "/v1" || (page.path === "/" && variant === "v1");
  const markup = renderToString(<App ssrPath={page.path} renderTime={now} variant={earlier ? "v1" : "v2"} />);
  const shell = (earlier ? template.replace(/<!--V2_ASSETS .*? V2_ASSETS-->\s*/s, "") : v2Shell(template))
    .replace("<html lang=\"en\">", `<html lang="en" data-variant="${earlier ? "v1" : "v2"}">`);
  return shell.replace(
    /<!-- ROUTE_SEO_START -->[\s\S]*?<!-- ROUTE_SEO_END -->/,
    `<!-- ROUTE_SEO_START -->\n    ${head}\n    <!-- ROUTE_SEO_END -->`,
  ).replace('<div id="root"></div>', `<div id="root">${markup}</div>`);
}
