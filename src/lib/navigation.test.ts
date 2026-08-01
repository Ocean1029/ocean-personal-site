import { describe, expect, it } from 'vitest';
import { isActiveNavigationItem, navigationFor } from './navigation';

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

describe('isActiveNavigationItem', () => {
  it('activates only the link matching the current page, including a deployed base path', () => {
    expect(isActiveNavigationItem('/ocean-personal-site/blog/', '/blog/', '/ocean-personal-site/')).toBe(true);
    expect(isActiveNavigationItem('/ocean-personal-site/blog/', '/', '/ocean-personal-site/')).toBe(false);
  });
});
