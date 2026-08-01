export type CocktailStyle = 'classic' | 'improvisation';

export type CocktailIndexEntry = {
  slug: string;
  title: string;
  spirit: string;
  tags: string[];
  style: CocktailStyle;
  isVariation: boolean;
  baseClassic?: string;
  publishedAt: string;
};

export type CocktailFilters = {
  style?: CocktailStyle;
  spirit?: string;
  query?: string;
};

export function filterCocktails<T extends CocktailIndexEntry>(entries: T[], filters: CocktailFilters): T[] {
  const query = filters.query?.trim().toLocaleLowerCase() ?? '';
  return entries
    .filter((entry) => !filters.style || entry.style === filters.style)
    .filter((entry) => !filters.spirit || entry.spirit === filters.spirit)
    .filter((entry) => !query || [entry.title, entry.spirit, ...entry.tags].join(' ').toLocaleLowerCase().includes(query))
    .sort((left, right) => new Date(right.publishedAt).getTime() - new Date(left.publishedAt).getTime() || left.slug.localeCompare(right.slug));
}

export function assertUniqueCocktailSlugs(entries: Array<{ slug: string }>): void {
  const seen = new Set<string>();
  for (const entry of entries) {
    if (seen.has(entry.slug)) throw new Error(`Duplicate cocktail slug: ${entry.slug}`);
    seen.add(entry.slug);
  }
}
