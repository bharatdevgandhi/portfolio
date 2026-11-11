import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const defaultDist = fileURLToPath(new URL("../dist/", import.meta.url));
const mimeTypes = {
  ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8", ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8", ".md": "text/markdown; charset=utf-8", ".json": "application/json; charset=utf-8",
  ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png",
  ".svg": "image/svg+xml", ".webp": "image/webp", ".gif": "image/gif",
  ".ico": "image/x-icon", ".pdf": "application/pdf", ".woff2": "font/woff2",
};

// Addresses that moved. The four long case studies became cards, and the
// preview lived under /v2 before it became the site.
const moved = new Map([
  ["/audible", "/work/audible"],
  ["/rategain", "/work/rategain"],
  ["/cornell", "/work/plaza"],
  ["/fubo", "/work/fubo"],
  ["/v2", "/"],
  ["/v2/meditation", "/meditation"],
  ["/v2/agents", "/agents"],
]);
const crawler = /bot|crawl|spider|slurp|preview|facebookexternalhit|embedly|quora|pinterest|vkshare|whatsapp|telegram|gptbot|chatgpt|oai-|claude|anthropic|perplexity|google-extended|applebot|amazonbot|ccbot|bytespider|meta-external|cohere|duckassist|lighthouse|headless/i;

/**
 * Which home a request gets. `share` is the percentage of new visitors shown
 * the earlier home (0 turns the comparison off). A visitor keeps the version
 * they were given for 30 days. Crawlers and assistants always get the current
 * home, so search and AI answers describe one stable page. `?home=v1` or
 * `?home=v2` picks a version by hand, for checking either one.
 */
export function chooseHome({ share, cookie = "", query = null, userAgent = "", random = Math.random }) {
  if (query === "v1" || query === "v2") return { variant: query, remember: true };
  if (!(share > 0) || crawler.test(userAgent)) return { variant: "v2", remember: false };
  const kept = cookie.match(/(?:^|;\s*)bg_home=(v1|v2)(?:;|$)/)?.[1];
  if (kept) return { variant: kept, remember: false };
  return { variant: random() * 100 < share ? "v1" : "v2", remember: true };
}

export async function createPortfolioServer({
  distDir = defaultDist,
  now = () => Date.now(),
  // Percentage of visitors shown the earlier home, from HOME_V1_SHARE.
  v1Share = Number(process.env.HOME_V1_SHARE ?? 0),
  random = Math.random,
} = {}) {
  const publicDir = path.resolve(distDir, "public");
  const template = await readFile(path.join(distDir, "client-template.html"), "utf8");
  const { renderPage, getSeoPages, siteOrigin } = await import(pathToFileURL(path.join(distDir, "server", "entry-server.js")).href);
  const routes = new Set(getSeoPages().map((page) => page.path));

  return createServer(async (request, response) => {
    const send = (status, content, type = "text/plain; charset=utf-8", cache = "no-store") => {
      response.writeHead(status, {
        "content-type": type,
        "cache-control": cache,
        "x-content-type-options": "nosniff",
        "content-length": Buffer.byteLength(content),
      });
      response.end(request.method === "HEAD" ? undefined : content);
    };
    try {
      if (!["GET", "HEAD"].includes(request.method ?? "")) {
        response.setHeader("allow", "GET, HEAD");
        send(405, "Method not allowed");
        return;
      }
      const url = new URL(request.url ?? "/", "http://portfolio.internal");
      let pathname;
      try { pathname = decodeURIComponent(url.pathname); }
      catch { send(400, "Invalid request path"); return; }
      if (pathname.includes("\0")) { send(400, "Invalid request path"); return; }
      if (pathname === "/healthz") { send(200, "ok"); return; }
      const forwardedHost = request.headers["x-forwarded-host"];
      const host = (typeof forwardedHost === "string" ? forwardedHost : request.headers.host ?? "")
        .toLowerCase().replace(/:\d+$/, "");
      if (host === "bharatdevgandhi.com") {
        // DNS and TLS must reach this server first; preserve Instagram query data.
        // A fixed origin prevents untrusted Host or request paths becoming open redirects.
        response.writeHead(308, {
          location: `${siteOrigin}${url.pathname}${url.search}`,
          "cache-control": "no-store",
        });
        response.end();
        return;
      }
      const route = pathname.replace(/\/index\.html$/, "").replace(/\/+$/, "") || "/";
      const target = moved.get(route) ?? (route.startsWith("/v2/work/") ? route.slice(3) : null);
      if (target) {
        response.writeHead(308, { location: target + url.search, "cache-control": "no-store" });
        response.end();
        return;
      }
      if (routes.has(route)) {
        if (pathname !== route) {
          response.writeHead(308, { location: route + url.search, "cache-control": "no-store" });
          response.end();
          return;
        }
        let variant = "v2";
        if (route === "/") {
          const choice = chooseHome({
            share: Math.min(100, Math.max(0, Number.isFinite(v1Share) ? v1Share : 0)),
            cookie: request.headers.cookie ?? "",
            query: url.searchParams.get("home"),
            userAgent: request.headers["user-agent"] ?? "",
            random,
          });
          variant = choice.variant;
          response.setHeader("vary", "Cookie");
          if (choice.remember) {
            response.setHeader("set-cookie", `bg_home=${variant}; Max-Age=2592000; Path=/; SameSite=Lax`);
          }
        }
        const html = renderPage(template, route, now(), variant);
        if (!html) throw new Error(`Missing page renderer for ${route}`);
        send(200, html, "text/html; charset=utf-8");
        return;
      }
      const filePath = path.resolve(publicDir, `.${pathname}`);
      if (!filePath.startsWith(`${publicDir}${path.sep}`)) {
        send(403, "Forbidden"); return;
      }
      let file;
      try {
        if (!(await stat(filePath)).isFile()) { send(404, "Not found"); return; }
        file = await readFile(filePath);
      } catch (error) {
        if (error.code === "ENOENT" || error.code === "ENOTDIR") {
          send(404, "Not found"); return;
        }
        throw error;
      }
      send(200, file, mimeTypes[path.extname(filePath).toLowerCase()] ?? "application/octet-stream",
        pathname.startsWith("/assets/") ? "public, max-age=31536000, immutable" : "no-cache");
    } catch (error) {
      console.error("Portfolio request failed:", error);
      if (!response.headersSent) send(500, "Unable to load this page.");
      else response.end();
    }
  });
}

if (process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url) {
  const port = Number(process.env.PORT);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("A valid PORT is required.");
  }
  const server = await createPortfolioServer();
  server.listen(port, "0.0.0.0", () => console.log(`Portfolio production server listening on ${port}`));
  const stop = () => server.close(() => process.exit(0));
  process.on("SIGTERM", stop);
  process.on("SIGINT", stop);
}
