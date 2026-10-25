import assert from "node:assert/strict";
import { test } from "node:test";
import { renderSitemap, validateSocialMetadata, isImageBytes } from "./seo-assets.mjs";

test("sitemap includes every route once and changes when a route is added", () => {
  const pages = [{ canonical: "https://example.com/" }, { canonical: "https://example.com/meditation" }];
  assert.equal((renderSitemap(pages).match(/<loc>/g) || []).length, 2);
  assert.ok(renderSitemap([...pages, { canonical: "https://example.com/new" }]).includes("https://example.com/new"));
  assert.throws(() => renderSitemap([...pages, pages[0]]), /duplicate/);
  assert.throws(() => renderSitemap([{ canonical: "http://example.com" }]), /invalid/);
  assert.ok(renderSitemap([{ canonical: "https://example.com/?a=1&b=2" }]).includes("&amp;"));
});

const page = {
  title: "Bharat & breathwork",
  description: "A page-specific description",
  canonical: "https://example.com/meditation",
  ogType: "website",
};
const image = "https://example.com/opengraph.jpg";
const metas = [
  ["og:title", page.title], ["og:description", page.description], ["og:url", page.canonical],
  ["og:type", page.ogType], ["og:site_name", "Bharat Gandhi"], ["og:image", image],
  ["twitter:card", "summary_large_image"], ["twitter:title", page.title],
  ["twitter:description", page.description], ["twitter:image", image],
].map(([key, content]) => ({ [key.startsWith("og:") ? "property" : "name"]: key, content }));

test("valid social metadata passes; missing, duplicated or stale tags fail", () => {
  assert.deepEqual(validateSocialMetadata(metas, page, image), []);
  for (const target of metas) {
    assert.ok(validateSocialMetadata(metas.filter((tag) => tag !== target), page, image).length > 0);
    assert.ok(validateSocialMetadata([...metas, target], page, image).length > 0);
    assert.ok(validateSocialMetadata(metas.map((tag) => tag === target ? { ...tag, content: "stale" } : tag), page, image).length > 0);
  }
});

test("preview validation accepts image signatures and rejects fallback HTML", () => {
  assert.equal(isImageBytes(Buffer.from("<!doctype html><html>Fallback</html>")), false);
  assert.equal(isImageBytes(Buffer.from([255, 216, 255, 224, 0, 16])), true);
  assert.equal(isImageBytes(Buffer.from([])), false);
  assert.equal(isImageBytes(Buffer.from("<svg xmlns='http://www.w3.org/2000/svg'></svg>")), true);
});
