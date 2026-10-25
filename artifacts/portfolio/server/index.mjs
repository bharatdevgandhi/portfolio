import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const defaultDist = fileURLToPath(new URL("../dist/", import.meta.url));
const mimeTypes = {
  ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8", ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8", ".json": "application/json; charset=utf-8",
  ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png",
  ".svg": "image/svg+xml", ".webp": "image/webp", ".gif": "image/gif",
  ".ico": "image/x-icon", ".pdf": "application/pdf", ".woff2": "font/woff2",
};

export async function createPortfolioServer({ distDir = defaultDist, now = () => Date.now() } = {}) {
  const publicDir = path.resolve(distDir, "public");
  const template = await readFile(path.join(distDir, "client-template.html"), "utf8");
  const { renderPage, getSeoPages } = await import(pathToFileURL(path.join(distDir, "server", "entry-server.js")).href);
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
      const route = pathname.replace(/\/index\.html$/, "").replace(/\/+$/, "") || "/";
      if (routes.has(route)) {
        if (pathname !== route) {
          response.writeHead(308, { location: route + url.search, "cache-control": "no-store" });
          response.end();
          return;
        }
        const html = renderPage(template, route, now());
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
