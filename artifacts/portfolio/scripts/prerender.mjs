import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { renderSitemap } from "./seo-assets.mjs";
import { renderPage, getSeoPages } from "../dist/server/entry-server.js";

const artifactDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputDir = path.join(artifactDir, "dist", "public");
// Use the compiled renderer so asset URLs match the production client bundle.
// Loading source through Vite's dev SSR loader emits /@fs/ URLs instead.
const template = await readFile(path.join(outputDir, "index.html"), "utf8");
// The production server needs the original empty-root shell, not saved page HTML.
await writeFile(path.join(artifactDir, "dist", "client-template.html"), template);
const now = Date.now();
const pages = getSeoPages(now);
const sitemap = renderSitemap(pages);
await writeFile(path.join(artifactDir, "public", "sitemap.xml"), sitemap);
await writeFile(path.join(outputDir, "sitemap.xml"), sitemap);
console.log(`Generated sitemap for ${pages.length} public pages`);
for (const page of pages) {
  const html = renderPage(template, page.path, now);
  if (!html || html.includes('id="root"></div>')) {
    throw new Error(`Could not render route ${page.path}`);
  }
  if (/\b(?:href|src)=["']\/(?:@fs\/|@vite\/|src\/)/.test(html)) {
    throw new Error(`Development-only asset URL found in production HTML for ${page.path}`);
  }
  const destination = page.path === "/"
    ? path.join(outputDir, "index.html")
    : path.join(outputDir, page.path.slice(1), "index.html");
  await mkdir(path.dirname(destination), { recursive: true });
  await writeFile(destination, html);
  console.log(`Prerendered ${page.path}`);
}
