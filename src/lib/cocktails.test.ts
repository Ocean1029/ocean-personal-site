import { describe, expect, it } from 'vitest';
import { filterCocktails, type CocktailIndexEntry } from './cocktails';

describe('filterCocktails', () => {
  it('keeps classic variations in the classic filter', () => {
    const entries: CocktailIndexEntry[] = [
      { slug: 'negroni', title: 'Negroni', spirit: 'Gin', tags: [], style: 'classic', isVariation: false, publishedAt: '2026-08-01T00:00:00+08:00' },
      { slug: 'white-negroni', title: 'White Negroni', spirit: 'Gin', tags: [], style: 'classic', isVariation: true, baseClassic: 'Negroni', publishedAt: '2026-08-01T00:00:00+08:00' },
      { slug: 'garden', title: 'Garden', spirit: 'Gin', tags: [], style: 'improvisation', isVariation: false, publishedAt: '2026-08-01T00:00:00+08:00' },
    ];

    expect(filterCocktails(entries, { style: 'classic' }).map((entry) => entry.slug)).toEqual(['negroni', 'white-negroni']);
  });
});
