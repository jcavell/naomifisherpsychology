import { defineConfig } from "astro/config";
import partytown from "@astrojs/partytown";
import sitemap from "@astrojs/sitemap";
import react from "@astrojs/react";
import netlify from "@astrojs/netlify";
import basicSsl from "@vitejs/plugin-basic-ssl";

export default defineConfig({
  site: "https://www.naomifisher.co.uk",

  output: "hybrid",
  adapter: netlify(),

  security: {
    contentSecurityPolicy: {
      directives: {
        "script-src": ["'self'", "https://*.stripe.com"],
        "frame-src": ["'self'", "https://*.stripe.com"],
        "connect-src": ["'self'", "https://*.stripe.com"],
        "default-src": ["'self'", "blob:"],
      },
    },
  },

  vite: {
    plugins: [basicSsl()],
    server: {
      https: true,
    },
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
