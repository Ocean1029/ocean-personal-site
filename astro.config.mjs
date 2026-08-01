import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://ocean1029.com',
  base: process.env.GITHUB_ACTIONS ? '/ocean-personal-site' : undefined,
  integrations: [sitemap()],
  i18n: {
    defaultLocale: 'zh-tw',
    locales: ['zh-tw', 'en'],
    routing: { prefixDefaultLocale: false },
  },
});
