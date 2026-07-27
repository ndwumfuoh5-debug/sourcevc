import axios from "axios";
import useSWR, { mutate } from "swr";

export const apiClient = axios.create({
  baseURL: "/api",
});

const fetcher = <T>(url: string) => apiClient.get<T>(url).then((res) => res.data);

/*
// Example code
// You can use this code as a reference to implement the API client.
// Reads: SWR hooks. Writes: optimistic mutate — the UI updates instantly, the server
// reconciles in the background, and errors roll the cache back.

export function useItems() {
  return useSWR<Item[], Error>('/items', fetcher);
}

export async function createItem(name: string) {
  const optimisticItem: Item = { id: crypto.randomUUID(), name };
  // mutate<CacheShape, MutationResult>: second type arg is the async fn's return (one Item), so
  // populateCache is typed with that entity. A single type arg defaults it to Item[] and won't typecheck.
  await mutate<Item[], Item>(
    '/items',
    // Return just the created entity; the callbacks below merge it into the *latest* cache.
    async () => apiClient.post<Item>('/items', { name }).then((res) => res.data),
    {
      // Prepend to match a newest-first list (ORDER BY created_at DESC) so the row doesn't jump.
      optimisticData: (current) => [optimisticItem, ...(current ?? [])],
      populateCache: (created, current) => [created, ...(current ?? []).filter((i) => i.id !== optimisticItem.id)],
      rollbackOnError: true,
      // The server assigns the real id/ordering and two creates can race, so let the list
      // revalidate afterwards to reconcile. Deterministic in-place edits (toggle/status) can
      // instead pass `revalidate: false`, since the exact result is computable client-side.
      revalidate: true,
    },
  );
}

// Callers must catch: rollbackOnError re-throws, so wrap createItem/toggleItemDone in the submit
// handler with try/catch to show an error toast and keep the user's input for retry.
*/
