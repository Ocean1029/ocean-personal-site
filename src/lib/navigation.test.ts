import { describe, expect, it } from 'vitest';
import { navigationFor } from './navigation';

describe('navigationFor', () => {
  it('returns Chinese labels and paths for the Chinese site', () => {
    expect(navigationFor('zh-TW').primary.map(({ label, href }) => [label, href])).toEqual([
      ['首頁', '/'],
      ['履歷', '/resume/'],
      ['作品集', '/projects/'],
      ['部落格', '/blog/'],
      ['調酒', '/cocktails/'],
      ['觀影', '/shows/'],
    ]);
  });

  it('marks cocktails and screenings as the collection navigation group', () => {
    expect(navigationFor('zh-TW').primary.filter((item) => item.group === 'collection').map((item) => item.label)).toEqual([
      '調酒',
      '觀影',
    ]);
  });
});
