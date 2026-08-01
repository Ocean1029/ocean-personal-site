export type DatedEntry = {
  slug: string;
  publishedAt: string;
};

export function sortByPublication<T extends DatedEntry>(entries: T[]): T[] {
  return [...entries].sort((left, right) => {
    const byDate = new Date(right.publishedAt).getTime() - new Date(left.publishedAt).getTime();
    return byDate || left.slug.localeCompare(right.slug);
  });
}
