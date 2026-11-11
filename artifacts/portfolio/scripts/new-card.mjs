// Starts a new gallery card: copies the template to content/cards/<name>.md.
// Usage: pnpm --filter @workspace/portfolio run new:card -- "My new project"
import { copyFile, readFile, writeFile, access } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const cardsDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "content", "cards");
const title = process.argv.slice(2).filter((arg) => arg !== "--").join(" ").trim();
if (!title) {
  console.error('Give the card a name, for example: pnpm --filter @workspace/portfolio run new:card -- "My new project"');
  process.exit(1);
}
const id = title.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const target = path.join(cardsDir, `${id}.md`);
try { await access(target); console.error(`${id}.md already exists.`); process.exit(1); } catch {}
await copyFile(path.join(cardsDir, "_template.md"), target);
await writeFile(target, (await readFile(target, "utf8")).replace("title: Name of the thing", `title: ${title}`));
console.log(`Created content/cards/${id}.md. Fill it in, add its picture to public/media, then rebuild.`);
