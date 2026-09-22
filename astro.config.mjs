import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  site: 'https://thebombingofdarwin.com.au',
  compressHTML: true,

  output: 'server',
  adapter: node({ mode: 'standalone' }),

  devToolbar: {
    enabled: false
  }
});
