import { describe, expect, it } from 'vitest';
import { sortByPublication } from './collection';

describe('sortByPublication', () => {
  it('sorts newest first and uses slug as a stable tie-breaker', () => {
    expect(
      sortByPublication([
        { slug: 'zeta', publishedAt: '2026-07-30T09:00:00+08:00' },
        { slug: 'alpha', publishedAt: '2026-07-30T09:00:00+08:00' },
        { slug: 'older', publishedAt: '2026-07-29T09:00:00+08:00' },
      ]).map((entry) => entry.slug),
    ).toEqual(['alpha', 'zeta', 'older']);
  });
});
