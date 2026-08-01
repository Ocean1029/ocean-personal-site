import { describe, expect, it } from 'vitest';
import { publishedEntries, type PublishableEntry } from './published';

describe('publishedEntries', () => {
  it('returns only published entries whose publication time has arrived', () => {
    const entries: Array<PublishableEntry & { slug: string }> = [
      { slug: 'draft', status: 'draft', publishedAt: '2026-07-01T09:00:00+08:00' },
      { slug: 'future', status: 'published', publishedAt: '2026-08-02T09:00:00+08:00' },
      { slug: 'live', status: 'published', publishedAt: '2026-07-31T09:00:00+08:00' },
    ];

    expect(publishedEntries(entries, new Date('2026-08-01T12:00:00+08:00'))).toEqual([
      entries[2],
    ]);
  });
});
