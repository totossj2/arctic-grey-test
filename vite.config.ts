// vite.config.ts
import { defineConfig } from 'vite';
import { hydrogen } from '@shopify/hydrogen/vite';
import { oxygen } from '@shopify/mini-oxygen/vite';
import { vitePlugin as remix } from '@remix-run/dev';
import tsconfigPaths from 'vite-tsconfig-paths';
import tailwindcss from '@tailwindcss/vite';
import { netlifyPlugin } from '@netlify/remix-edge-adapter/plugin';

declare module '@remix-run/server-runtime' {
  interface Future {
    v3_singleFetch: true;
  }
}

const isProduction = process.env.NODE_ENV === 'production';

const plugins = [
  tailwindcss(),
  hydrogen(),
  oxygen(),
  remix({
    presets: [hydrogen.v3preset()],
    future: {
      v3_fetcherPersist: true,
      v3_relativeSplatPath: true,
      v3_throwAbortReason: true,
      v3_lazyRouteDiscovery: true,
      v3_routeConfig: true,
      v3_singleFetch: true,
    },
  }),
  tsconfigPaths(),
];

if (isProduction) {
  // Para deploy, agregamos el plugin de Netlify al inicio de la cadena.
  plugins.unshift(netlifyPlugin());
}

export default defineConfig({
  plugins,
  build: {
    // Evita inlining de assets en base64, ideal para un CSP estricto
    assetsInlineLimit: 0,
  },
  ssr: {
    optimizeDeps: {
      include: [],
    },
  },
});
