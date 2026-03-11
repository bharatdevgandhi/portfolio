import { useGetWriting } from "@workspace/api-client-react";

export function useWriting() {
  return useGetWriting({
    query: {
      retry: 1,
      refetchOnWindowFocus: false,
    }
  });
}
