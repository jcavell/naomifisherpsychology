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
        "default-src": ["'self'"],
        "script-src": [
          "'self'",
          "https://js.stripe.com",
          "https://m.stripe.network",
          "https://checkout.stripe.com",
          "'sha256-5DA+a07wxWmEka9IdoWjSPVHb17Cp5284/lJzfbl8KA='",
          "'sha256-/5Guo2nzv5n/w6ukZpOBZOtTJBJPSkJ6mhHpnBgm3Ls='",
        ],
        "frame-src": [
          "'self'",
          "https://js.stripe.com",
          "https://hooks.stripe.com",
          "https://checkout.stripe.com",
          "https://m.stripe.network",
        ],
        "connect-src": [
          "'self'",
          "https://api.stripe.com",
          "https://m.stripe.network",
        ],
        "img-src": ["'self'", "https:", "data:"],
        "style-src": ["'self'", "'unsafe-inline'"],
        "font-src": ["'self'", "data:"],
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
