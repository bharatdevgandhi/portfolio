// Known search and AI crawlers, by a short stable name. Order matters: the
// more specific token comes first, so "Google-Extended" is not read as
// "Googlebot" and "Applebot-Extended" is not read as "Applebot".
const known = [
  ["Google-Extended", /google-extended/i],
  ["Googlebot", /googlebot/i],
  ["Bingbot", /bingbot/i],
  ["OAI-SearchBot", /oai-searchbot/i],
  ["ChatGPT-User", /chatgpt-user/i],
  ["GPTBot", /gptbot/i],
  ["Claude-SearchBot", /claude-searchbot/i],
  ["Claude-User", /claude-user/i],
  ["ClaudeBot", /claudebot/i],
  ["Perplexity-User", /perplexity-user/i],
  ["PerplexityBot", /perplexitybot/i],
  ["Applebot-Extended", /applebot-extended/i],
  ["Applebot", /applebot/i],
  ["Amazonbot", /amazonbot/i],
  ["meta-externalfetcher", /meta-externalfetcher/i],
  ["meta-externalagent", /meta-externalagent/i],
  ["CCBot", /ccbot/i],
  ["Bytespider", /bytespider/i],
  ["DuckAssistBot", /duckassistbot/i],
  ["cohere-ai", /cohere-ai/i],
  ["MistralAI-User", /mistralai-user/i],
  ["LinkedInBot", /linkedinbot/i],
];

/** The crawler's short name for a user-agent string, or null if unknown. */
export function identifyCrawler(userAgent) {
  if (typeof userAgent !== "string" || userAgent === "") return null;
  for (const [name, pattern] of known) {
    if (pattern.test(userAgent)) return name;
  }
  return null;
}
