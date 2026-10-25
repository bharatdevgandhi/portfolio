import writing from "@/data/writing.json";

// The build refreshes this same-site snapshot directly from the publishers.
// Reading the bundled copy avoids browser CORS, RSS proxies and runtime outages.
export function useWriting() {
  return {
    data: writing,
    isLoading: false,
    isError: false,
  };
}
