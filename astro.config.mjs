import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://katalog.goldenleafgranit.pl',
  output: 'static',
  build: {
    assets: 'assets'
  },
  trailingSlash: 'never'
});
