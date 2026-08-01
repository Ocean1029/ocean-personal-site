export type SiteLanguage = 'zh-TW' | 'en';

type NavigationItem = { label: string; href: string; group?: 'collection' };

const navigation = {
  'zh-TW': {
    primary: [
      { label: '首頁', href: '/' },
      { label: '履歷', href: '/resume/' },
      { label: '作品集', href: '/projects/' },
      { label: '部落格', href: '/blog/' },
      { label: '調酒', href: '/cocktails/', group: 'collection' },
      { label: '觀影', href: '/shows/', group: 'collection' },
    ],
    contact: { label: '聯絡', href: '/contact/' },
    language: { label: 'EN', href: '/en/' },
  },
  en: {
    primary: [
      { label: 'Home', href: '/en/' },
      { label: 'Resume', href: '/en/resume/' },
      { label: 'Work', href: '/projects/' },
      { label: 'Blog', href: '/blog/' },
      { label: 'Cocktails', href: '/cocktails/', group: 'collection' },
      { label: 'Screenings', href: '/shows/', group: 'collection' },
    ],
    contact: { label: 'Contact', href: '/en/contact/' },
    language: { label: '中文', href: '/' },
  },
} satisfies Record<SiteLanguage, { primary: NavigationItem[]; contact: NavigationItem; language: NavigationItem }>;

export function navigationFor(language: SiteLanguage) {
  return navigation[language];
}

function normalizePath(path: string) {
  const trimmed = path.replace(/^\/+|\/+$/g, '');
  return trimmed ? `/${trimmed}/` : '/';
}

export function isActiveNavigationItem(currentPathname: string, href: string, basePath = '/') {
  const currentPath = normalizePath(currentPathname);
  const base = normalizePath(basePath);
  const pathWithoutBase = base !== '/' && currentPath.startsWith(base)
    ? `/${currentPath.slice(base.length)}`
    : currentPath;

  return normalizePath(pathWithoutBase) === normalizePath(href);
}
