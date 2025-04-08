import { defineConfig } from "astro/config";
import partytown from "@astrojs/partytown";
import sitemap from "@astrojs/sitemap";
import react from "@astrojs/react";
import netlify from "@astrojs/netlify";
import basicSsl from "@vitejs/plugin-basic-ssl";

export default defineConfig({
  site: "https://www.naomifisher.co.uk",

  output: "hybrid",

  adapter: netlify({
    edge: false,
    serverLogging: true,
    functionPerRoute: true,
  }),

  // security: {
  //   contentSecurityPolicy: {
  //     directives: {
  //       "script-src": [
  //         "'self'",
  //         "https://*.stripe.com",
  //         "https://*.hcaptcha.com",
  //         "'unsafe-inline'",
  //       ],
  //       "frame-src": [
  //         "'self'",
  //         "https://*.stripe.com",
  //         "https://*.hcaptcha.com",
  //       ],
  //       "connect-src": [
  //         "'self'",
  //         "https://*.stripe.com",
  //         "https://*.hcaptcha.com",
  //       ],
  //       "style-src": ["'self'", "'unsafe-inline'"],
  //       "img-src": ["'self'", "data:", "https:", "blob:"],
  //     },
  //   },
  // },

  vite: {
    plugins: [basicSsl()],
    build: {
      sourcemap: true,
    },
    optimizeDeps: {
      exclude: ["@hcaptcha/types"],
    },
    server: {
      https: true,
    },
  },
  css: {
    devSourcemap: false,
  },

  // Using integrations
  integrations: [
    sitemap(),
    partytown({
      config: {
        forward: ["dataLayer.push"],
      },
    }),
    react(),
  ],
});
