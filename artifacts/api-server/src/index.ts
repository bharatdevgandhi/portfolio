import app from "./app";
import cron from "node-cron";
import { fetchSubstackFeed } from "./routes/writing";

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

fetchSubstackFeed();

cron.schedule("0 */4 * * *", () => {
  console.log("Cron: refreshing Substack feed...");
  fetchSubstackFeed();
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
