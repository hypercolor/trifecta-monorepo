import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import routes from './route-builder';

declare module "@remix-run/node" {
  interface Future {
    v3_singleFetch: true;
  }
}

export default defineConfig({
  optimizeDeps: {
    include: ['shared-types'],
  },
  build: {
    commonjsOptions: {
      include: [/shared-types/, /node_modules/],
      transformMixedEsModules: true,
    },
  },
  plugins: [
    remix({
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
        v3_singleFetch: true,
        v3_lazyRouteDiscovery: true,
      },
      routes
    }),
  ],

  logLevel: 'info', // Add this to increase logging verbosity
});
