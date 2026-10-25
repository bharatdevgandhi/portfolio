export function renderSitemap(pages) {
  const canonicals = pages.map(({ canonical }) => canonical);
  if (new Set(canonicals).size !== canonicals.length) {
    throw new Error("Cannot generate sitemap: duplicate canonical URLs.");
  }
  for (const canonical of canonicals) {
    const url = new URL(canonical);
    if (url.protocol !== "https:" || url.username || url.password || url.hash) {
      throw new Error(`Cannot generate sitemap: invalid canonical ${canonical}`);
    }
  }
  const escape = (value) => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&apos;");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<!-- Generated from public route metadata; do not edit manually. -->\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${canonicals.map((url) => `  <url><loc>${escape(url)}</loc></url>`).join("\n")}\n</urlset>\n`;
}

export function validateSocialMetadata(metas, page, image) {
  const expected = {
    "og:title": page.title,
    "og:description": page.description,
    "og:url": page.canonical,
    "og:type": page.ogType,
    "og:site_name": "Bharat Gandhi",
    "og:image": image,
    "twitter:card": "summary_large_image",
    "twitter:title": page.title,
    "twitter:description": page.description,
    "twitter:image": image,
  };
  const errors = [];
  for (const [key, value] of Object.entries(expected)) {
    const field = key.startsWith("og:") ? "property" : "name";
    const matches = metas.filter((meta) => meta[field] === key);
    if (matches.length !== 1) {
      errors.push(`Expected exactly one ${key} tag; found ${matches.length}.`);
    } else if (matches[0].content !== value) {
      errors.push(`${key} does not match this page's route metadata.`);
    }
  }
  return errors;
}

export function isImageBytes(bytes) {
  return (bytes.length > 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff)
    || (bytes.length > 8 && bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])))
    || (bytes.length > 12 && bytes.subarray(0, 4).toString() === "RIFF" && bytes.subarray(8, 12).toString() === "WEBP")
    || (bytes.length > 6 && /^GIF8[79]a$/.test(bytes.subarray(0, 6).toString()))
    || /^\s*(?:<\?xml[^>]*>\s*)?<svg[\s>]/i.test(bytes.subarray(0, 2048).toString());
}
