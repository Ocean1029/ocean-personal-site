export type PublishableEntry = {
  status: 'draft' | 'published';
  publishedAt: string;
};

export function publishedEntries<T extends PublishableEntry>(
  entries: T[],
  now = new Date(),
): T[] {
  return entries.filter(
    (entry) => entry.status === 'published' && new Date(entry.publishedAt) <= now,
  );
}
