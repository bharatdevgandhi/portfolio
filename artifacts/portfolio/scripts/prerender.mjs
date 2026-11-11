import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { renderSitemap } from "./seo-assets.mjs";
import { renderPage, getSeoPages } from "../dist/server/entry-server.js";

const artifactDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputDir = path.join(artifactDir, "dist", "public");
// Use the compiled renderer so asset URLs match the production client bundle.
// Loading source through Vite's dev SSR loader emits /@fs/ URLs instead.
const rawTemplate = await readFile(path.join(outputDir, "index.html"), "utf8");
// The production server needs the original empty-root shell, not saved page HTML.
// The v2 pages load their own small entry. Record its files in the template so
// the renderer can swap them in for the app's script and stylesheet.
const manifest = JSON.parse(await readFile(path.join(outputDir, ".vite", "manifest.json"), "utf8"));
const v2Entry = Object.values(manifest).find((chunk) => chunk.isEntry && chunk.src?.endsWith("src/v2/client.ts"));
if (!v2Entry) throw new Error("The v2 client entry is missing from the build manifest.");
const v2Styles = new Set();
const collect = (chunk) => {
  (chunk.css ?? []).forEach((file) => v2Styles.add(file));
  (chunk.imports ?? []).forEach((key) => collect(manifest[key]));
};
collect(v2Entry);
const v2Assets = [
  ...[...v2Styles].map((file) => `<link rel="stylesheet" href="/${file}">`),
  `<script type="module" src="/${v2Entry.file}"></script>`,
].join("");
const template = rawTemplate.replace("</head>", `<!--V2_ASSETS ${v2Assets} V2_ASSETS-->\n  </head>`);
await writeFile(path.join(artifactDir, "dist", "client-template.html"), template);
const now = Date.now();
const pages = getSeoPages(now);
const sitemap = renderSitemap(pages.filter((page) => !page.noindex));
await writeFile(path.join(artifactDir, "public", "sitemap.xml"), sitemap);
await writeFile(path.join(outputDir, "sitemap.xml"), sitemap);
console.log(`Generated sitemap for ${pages.filter((page) => !page.noindex).length} indexable pages`);
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
