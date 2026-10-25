import assert from "node:assert/strict";
import { createServer as createHttpServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createServer as createViteServer } from "vite";
import { isImageBytes, validateSocialMetadata } from "./seo-assets.mjs";
import { createPortfolioServer } from "../server/index.mjs";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const artifactDir = path.resolve(scriptDir, "..");
const outputDir = path.join(artifactDir, "dist", "public");
const artifactConfigPath = path.join(artifactDir, ".replit-artifact", "artifact.toml");
const sitemapPath = path.join(outputDir, "sitemap.xml");
const errors = [];

process.env.PORT ||= "4173";
process.env.BASE_PATH ||= "/";

let vite;
let httpServer;

try {
  vite = await createViteServer({
    configFile: path.join(artifactDir, "vite.config.ts"),
    logLevel: "error",
    server: { middlewareMode: true, hmr: false },
  });

  const { seoPages, siteOrigin, socialImage } = await vite.ssrLoadModule("/src/seo.ts");
  const config = await readFile(artifactConfigPath, "utf8");
  const processHosted = config.includes("[services.production.run]");
  const rewrites = parseRewrites(config);
  const sitemap = await readFile(sitemapPath, "utf8");
  const port = processHosted ? await startProductionServer() : await startStaticServer(rewrites);
  const baseUrl = `http://127.0.0.1:${port}`;
  const routeDocuments = new Map();

  checkRouteMetadata(seoPages);
  checkSitemap(seoPages, sitemap);
  if (!processHosted) await checkRewriteConfiguration(seoPages, rewrites);

  for (const page of seoPages) {
    const routeUrl = new URL(page.path, baseUrl);
    const response = await fetch(routeUrl);
    const html = await response.text();

    if (!response.ok) {
      errors.push(`Route ${page.path} returned HTTP ${response.status} without JavaScript.`);
      continue;
    }

    if (!html.includes("<html")) {
      errors.push(`Route ${page.path} did not return an HTML document.`);
      continue;
    }

    routeDocuments.set(page.path, html);
    checkPageHtml(page, html);
    const metas = getTags(html, "meta").map(({ attributes }) =>
      Object.fromEntries(Object.entries(attributes).map(([key, value]) => [key, decodeHtml(value)])),
    );
    errors.push(...validateSocialMetadata(metas, page, socialImage)
      .map((problem) => `Route ${page.path}: ${problem}`));
    console.log(`Fetched ${page.canonical} without JavaScript`);
  }

  await checkSocialImage(socialImage, siteOrigin, baseUrl);

  for (const [pagePath, html] of routeDocuments) {
    await checkInternalReferences(pagePath, html, siteOrigin, baseUrl);
  }

  if (errors.length > 0) {
    throw new Error(`SEO check failed:\n${errors.map((error) => `- ${error}`).join("\n")}`);
  }

  console.log(
    `SEO check passed: ${seoPages.length} public pages, sitemap, social previews, preview image, routing, JSON-LD, and internal links verified.`,
  );
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
} finally {
  if (httpServer) {
    await new Promise((resolve) => httpServer.close(resolve));
  }
  if (vite) await vite.close();
}

async function checkSocialImage(image, siteOrigin, baseUrl) {
  const url = new URL(image);
  if (url.origin !== siteOrigin || url.protocol !== "https:") {
    errors.push("Social preview image must be an HTTPS asset on the canonical site.");
    return;
  }
  const filePath = staticTargetPath(url.pathname);
  if (!filePath || !(await exists(filePath))) {
    errors.push(`Social preview image is missing from static output: ${url.pathname}.`);
    return;
  }
  const response = await fetch(new URL(url.pathname, baseUrl));
  const bytes = Buffer.from(await response.arrayBuffer());
  if (!response.ok || !response.headers.get("content-type")?.startsWith("image/") || !isImageBytes(bytes)) {
    errors.push(`Social preview image ${url.pathname} must resolve to image bytes, not fallback HTML.`);
  }
}

function parseRewrites(toml) {
  const rewriteBlocks = [
    ...toml.matchAll(/\[\[services\.production\.rewrites\]\]\s*([\s\S]*?)(?=\n\[\[|\n\[|$)/g),
  ];

  return rewriteBlocks.map(([, block]) => {
    const from = block.match(/^\s*from\s*=\s*"([^"]+)"\s*$/m)?.[1];
    const to = block.match(/^\s*to\s*=\s*"([^"]+)"\s*$/m)?.[1];
    if (!from || !to) {
      errors.push(`Could not read a static rewrite rule: ${block.trim().replaceAll("\n", " ")}`);
      return null;
    }
    return { from, to };
  }).filter(Boolean);
}

function checkRouteMetadata(pages) {
  const titles = new Map();
  const canonicals = new Map();
  const paths = new Set();

  for (const page of pages) {
    if (paths.has(page.path)) errors.push(`Route metadata declares ${page.path} more than once.`);
    paths.add(page.path);

    if (titles.has(page.title)) {
      errors.push(`Routes ${titles.get(page.title)} and ${page.path} share the title "${page.title}".`);
    } else {
      titles.set(page.title, page.path);
    }

    if (canonicals.has(page.canonical)) {
      errors.push(
        `Routes ${canonicals.get(page.canonical)} and ${page.path} share canonical ${page.canonical}.`,
      );
    } else {
      canonicals.set(page.canonical, page.path);
    }

    const canonicalUrl = new URL(page.canonical);
    if (canonicalUrl.origin !== "https://bharatdevgandhi.com" || canonicalUrl.pathname !== page.path) {
      errors.push(`Route ${page.path} has an unexpected canonical URL: ${page.canonical}.`);
    }
  }
}

function checkSitemap(pages, sitemap) {
  const urls = [...sitemap.matchAll(/<loc>\s*([\s\S]*?)\s*<\/loc>/gi)]
    .map(([, url]) => decodeXml(url.trim()));
  const actual = new Set(urls);
  const expected = new Set(pages.map((page) => page.canonical));

  for (const url of expected) {
    if (!actual.has(url)) errors.push(`Sitemap is missing declared public URL ${url}.`);
  }
  for (const url of actual) {
    if (!expected.has(url)) errors.push(`Sitemap contains undeclared public URL ${url}.`);
  }
  if (actual.size !== urls.length) errors.push("Sitemap contains duplicate URLs.");
  if (!sitemap.includes("<urlset")) errors.push("Sitemap is missing its <urlset> root element.");
}

async function checkRewriteConfiguration(pages, rewrites) {
  const rulesByPath = new Map(rewrites.map((rewrite) => [rewrite.from, rewrite.to]));

  for (const { from, to } of rewrites) {
    if (from.includes("*")) continue;
    const targetPath = staticTargetPath(to);
    if (!targetPath) {
      errors.push(`Static rewrite ${from} targets an unsafe path: ${to}.`);
      continue;
    }
    if (!(await exists(targetPath))) {
      errors.push(`Static rewrite ${from} points to missing output ${to}.`);
    }
  }

  for (const page of pages) {
    if (page.path === "/") continue;
    const target = `/${page.path.slice(1)}/index.html`;
    for (const routePath of [page.path, `${page.path}/`]) {
      if (rulesByPath.get(routePath) !== target) {
        errors.push(
          `Static rewrite for ${routePath} must target ${target}; found ${rulesByPath.get(routePath) ?? "none"}.`,
        );
      }
    }
  }

  if (rulesByPath.get("/*") !== "/index.html") {
    errors.push("The static-host fallback rewrite must map /* to /index.html.");
  }
}

function checkPageHtml(page, html) {
  const mainContent = html.match(/<main\b[^>]*>([\s\S]*?)<\/main\s*>/i)?.[1] ?? "";
  const mainText = decodeHtml(mainContent.replace(/<[^>]*>/g, " ")).replace(/\s+/g, " ").trim();
  if (!mainText) {
    errors.push(`Route ${page.path} has no crawler-visible main content in its static HTML.`);
  }

  const titleMatches = [...html.matchAll(/<title\b[^>]*>([\s\S]*?)<\/title>/gi)];
  if (titleMatches.length !== 1) {
    errors.push(`Route ${page.path} must contain exactly one static <title>; found ${titleMatches.length}.`);
  } else if (decodeHtml(titleMatches[0][1].trim()) !== page.title) {
    errors.push(`Route ${page.path} has the wrong static title.`);
  }

  const canonicals = getTags(html, "link")
    .filter((tag) => tag.attributes.rel?.toLowerCase() === "canonical");
  if (canonicals.length !== 1) {
    errors.push(`Route ${page.path} must contain exactly one canonical link; found ${canonicals.length}.`);
  } else if (decodeHtml(canonicals[0].attributes.href ?? "") !== page.canonical) {
    errors.push(`Route ${page.path} has the wrong static canonical URL.`);
  }

  const schemaScripts = getTags(html, "script")
    .filter((tag) => tag.attributes.id === "page-structured-data");
  if (schemaScripts.length !== 1 || !schemaScripts[0].body) {
    errors.push(`Route ${page.path} must contain one static page-specific JSON-LD script.`);
    return;
  }

  try {
    const jsonLd = JSON.parse(schemaScripts[0].body);
    const graph = jsonLd["@graph"];
    const pageNode = graph?.find((node) => node["@type"] === "WebPage");
    if (jsonLd["@context"] !== "https://schema.org" || !Array.isArray(graph)) {
      errors.push(`Route ${page.path} has malformed page-specific JSON-LD.`);
      return;
    }
    if (
      !pageNode ||
      pageNode["@id"] !== `${page.canonical}#webpage` ||
      pageNode.url !== page.canonical ||
      pageNode.name !== page.title
    ) {
      errors.push(`Route ${page.path} JSON-LD does not describe its own canonical URL and title.`);
    }
    assert.deepStrictEqual(
      graph,
      page.structuredData,
      `generated JSON-LD graph differs from SEO metadata for ${page.path}`,
    );
  } catch (error) {
    errors.push(
      `Route ${page.path} has invalid or inconsistent JSON-LD: ${error instanceof Error ? error.message : error}`,
    );
  }
}

async function checkInternalReferences(pagePath, html, siteOrigin, baseUrl) {
  const documentUrl = new URL(pagePath, baseUrl);
  const ids = new Set(
    getTags(html, "*")
      .flatMap((tag) => [tag.attributes.id, tag.attributes.name])
      .filter(Boolean),
  );
  const references = [];

  for (const tagName of ["a", "area", "form", "img", "script", "source", "iframe", "link"]) {
    for (const tag of getTags(html, tagName)) {
      const attribute = ["img", "script", "source", "iframe"].includes(tagName)
        ? "src"
        : tagName === "form"
          ? "action"
          : "href";
      const value = tag.attributes[attribute];
      if (!value) continue;

      let target;
      try {
        target = new URL(decodeHtml(value), documentUrl);
      } catch {
        errors.push(`Route ${pagePath} has an invalid ${attribute} reference: ${value}.`);
        continue;
      }

      if (target.origin !== baseUrlOrigin(baseUrl) && target.origin !== siteOrigin) continue;
      references.push({ target, tagName, value });
    }
  }

  for (const { target, tagName, value } of references) {
    const requestUrl = new URL(target.pathname + target.search, baseUrl);
    try {
      const response = await fetch(requestUrl);
      if (!response.ok) {
        errors.push(
          `Internal ${tagName} reference "${value}" on ${pagePath} returned HTTP ${response.status}.`,
        );
        continue;
      }
      if (target.hash && (tagName === "a" || tagName === "area")) {
        const destinationHtml = await response.text();
        const destinationIds = new Set(
          getTags(destinationHtml, "*")
            .flatMap((tag) => [tag.attributes.id, tag.attributes.name])
            .filter(Boolean),
        );
        const fragment = decodeURIComponent(target.hash.slice(1));
        if (!destinationIds.has(fragment)) {
          errors.push(`Internal link "${value}" on ${pagePath} points to a missing #${fragment} target.`);
        }
      }
    } catch (error) {
      errors.push(
        `Could not request internal ${tagName} reference "${value}" on ${pagePath}: ${error.message}.`,
      );
    }
  }
}

async function startStaticServer(rewrites) {
  httpServer = createHttpServer(async (request, response) => {
    const requestPath = new URL(request.url ?? "/", "http://localhost").pathname;
    const exactRewrite = rewrites.find((rewrite) => rewrite.from === requestPath);
    let target = exactRewrite?.to;
    if (!target) {
      const directTarget = staticTargetPath(requestPath);
      if (directTarget && (await exists(directTarget))) {
        target = requestPath;
      } else {
        target = rewrites.find((rewrite) => rewrite.from.includes("*"))?.to;
      }
    }

    const filePath = target && staticTargetPath(target);
    if (!filePath || !(await exists(filePath))) {
      response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
      response.end("Not found");
      return;
    }

    const extension = path.extname(filePath);
    const imageTypes = {
      ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png",
      ".webp": "image/webp", ".gif": "image/gif", ".svg": "image/svg+xml",
    };
    const contentType = imageTypes[extension] ?? (extension === ".html"
      ? "text/html; charset=utf-8"
      : extension === ".css"
        ? "text/css; charset=utf-8"
        : extension === ".js"
          ? "text/javascript; charset=utf-8"
          : extension === ".xml"
            ? "application/xml; charset=utf-8"
            : "application/octet-stream");
    response.writeHead(200, { "content-type": contentType });
    response.end(await readFile(filePath));
  });

  await new Promise((resolve, reject) => {
    httpServer.once("error", reject);
    httpServer.listen(0, "127.0.0.1", resolve);
  });
  return httpServer.address().port;
}

async function startProductionServer() {
  httpServer = await createPortfolioServer();
  await new Promise((resolve, reject) => {
    httpServer.once("error", reject);
    httpServer.listen(0, "127.0.0.1", resolve);
  });
  return httpServer.address().port;
}

function staticTargetPath(urlPath) {
  let decoded;
  try {
    decoded = decodeURIComponent(urlPath);
  } catch {
    return null;
  }
  const resolved = path.resolve(outputDir, `.${decoded}`);
  return resolved.startsWith(`${outputDir}${path.sep}`) || resolved === outputDir
    ? resolved
    : null;
}

async function exists(filePath) {
  try {
    return (await stat(filePath)).isFile();
  } catch {
    return false;
  }
}

function getTags(html, requestedName) {
  const tags = [];
  const tagPattern = /<([a-z][\w:-]*)\b([^>]*)>/gi;
  for (const match of html.matchAll(tagPattern)) {
    const name = match[1].toLowerCase();
    if (requestedName !== "*" && name !== requestedName) continue;
    const attributes = {};
    const attributePattern =
      /([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;
    for (const attribute of match[2].matchAll(attributePattern)) {
      attributes[attribute[1].toLowerCase()] = decodeHtml(attribute[2] ?? attribute[3] ?? attribute[4] ?? "");
    }

    let body = "";
    if (name === "script") {
      const afterOpeningTag = html.slice(match.index + match[0].length);
      body = afterOpeningTag.match(/^[\s\S]*?<\/script\s*>/i)?.[0].replace(/<\/script\s*>$/i, "") ?? "";
    }
    tags.push({ name, attributes, body });
  }
  return tags;
}

function decodeHtml(value) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");
}

function decodeXml(value) {
  return decodeHtml(value).replaceAll("&apos;", "'");
}

function baseUrlOrigin(baseUrl) {
  return new URL(baseUrl).origin;
}
