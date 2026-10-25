import { renderToString } from "react-dom/server";
import App from "./App";
import { getSeoPages, socialImage } from "./seo";

export { getSeoPages } from "./seo";

function escapeHtml(value: string) {
  return value.replaceAll("&", "&amp;").replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

export function renderPage(template: string, pathname: string, now = Date.now()): string | null {
  const page = getSeoPages(now).find((item) => item.path === pathname);
  if (!page) return null;
  if (!template.includes("ROUTE_SEO_START") || !template.includes("ROUTE_SEO_END")
    || !template.includes('<div id="root"></div>')) {
    throw new Error("Page template is missing its SEO or rendering placeholders.");
  }
  const title = escapeHtml(page.title);
  const description = escapeHtml(page.description);
  const canonical = escapeHtml(page.canonical);
  const image = escapeHtml(socialImage);
  const graph = JSON.stringify({
    "@context": "https://schema.org",
    "@graph": page.structuredData,
  }).replaceAll("<", "\\u003c");
  const head = [
    `<title>${title}</title>`,
    `<meta name="description" content="${description}" />`,
    `<link rel="canonical" href="${canonical}" />`,
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
  const markup = renderToString(<App ssrPath={page.path} renderTime={now} />);
  return template.replace(
    /<!-- ROUTE_SEO_START -->[\s\S]*?<!-- ROUTE_SEO_END -->/,
    `<!-- ROUTE_SEO_START -->\n    ${head}\n    <!-- ROUTE_SEO_END -->`,
  ).replace('<div id="root"></div>', `<div id="root">${markup}</div>`);
}
