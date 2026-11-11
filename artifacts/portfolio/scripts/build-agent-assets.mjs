// Writes the machine-readable versions of the portfolio into public/:
// llms.txt, llms-full.txt, resume.md, profile.json and a stable résumé PDF URL.
// All text is rendered from src/v2/content.ts, the same model the pages use.
// Node runs the TypeScript sources directly (type stripping, Node 22.18+).
import { copyFile, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  renderLlmsTxt,
  renderLlmsFullTxt,
  renderResumeMarkdown,
  renderProfileJson,
} from "../src/v2/agent-assets.ts";

const artifactDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = path.join(artifactDir, "public");
const assetsDir = path.resolve(artifactDir, "..", "..", "attached_assets");

export async function buildAgentAssets() {
  const { articles } = JSON.parse(
    await readFile(path.join(artifactDir, "src", "data", "writing.json"), "utf8"),
  );
  const files = {
    "llms.txt": renderLlmsTxt(articles),
    "llms-full.txt": renderLlmsFullTxt(articles),
    "resume.md": renderResumeMarkdown(),
    "profile.json": renderProfileJson(articles),
  };
  // Licence credits for the Creative Commons photographs, kept off the pages.
  const credits = JSON.parse(
    await readFile(path.join(artifactDir, "src", "v2", "photo-credits.json"), "utf8"),
  );
  files["credits.txt"] = [
    "Credits",
    "",
    "Photographs of places and of the Cornell Tech campus are from Wikimedia Commons,",
    "used under the licence shown for each.",
    "",
    ...Object.values(credits).map((item) => `- ${item.title.replace(/\.[A-Za-z]+$/, "")}, by ${item.author}. ${item.license}. ${item.page}`),
    "",
    "Typefaces are cut from Amstelvar (SIL Open Font License 1.1).",
    "Logos and product screens belong to their owners.",
    "",
  ].join("\n");
  for (const [name, content] of Object.entries(files)) {
    await writeFile(path.join(publicDir, name), content);
  }
  // The newest résumé export gets one stable public URL that agents can cite.
  const resumes = (await readdir(assetsDir))
    .filter((name) => /^Bharat_Gandhi_Resume.*\.pdf$/i.test(name))
    .sort();
  if (resumes.length === 0) throw new Error("No résumé PDF found in attached_assets.");
  await copyFile(
    path.join(assetsDir, resumes.at(-1)),
    path.join(publicDir, "Bharat_Gandhi_Resume.pdf"),
  );
  return [...Object.keys(files), "Bharat_Gandhi_Resume.pdf"];
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const written = await buildAgentAssets();
  console.log(`Agent assets written: ${written.join(", ")}`);
}
