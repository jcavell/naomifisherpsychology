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
        // Previous directives...
        "script-src": [
          "'self'",
          "https://js.stripe.com",
          "https://m.stripe.network",
          "https://checkout.stripe.com",
          "https://newassets.hcaptcha.com",
          "https://hcaptcha.com",
          "'sha256-5DA+a07wxWmEka9IdoWjSPVHb17Cp5284/lJzfbl8KA='",
          "'sha256-/5Guo2nzv5n/w6ukZpOBZOtTJBJPSkJ6mhHpnBgm3Ls='",
        ],
        "frame-src": [
          "'self'",
          "https://js.stripe.com",
          "https://hooks.stripe.com",
          "https://checkout.stripe.com",
          "https://m.stripe.network",
          "https://newassets.hcaptcha.com",
          "https://hcaptcha.com",
        ],
        "connect-src": [
          "'self'",
          "https://api.stripe.com",
          "https://m.stripe.network",
          "https://newassets.hcaptcha.com",
          "https://hcaptcha.com",
        ],
        "worker-src": ["'self'", "blob:", "https://newassets.hcaptcha.com"],
        "style-src": [
          "'self'",
          "'unsafe-inline'",
          "https://newassets.hcaptcha.com",
        ],
        "img-src": ["'self'", "data:", "https:", "blob:"],
        "wasm-src": ["'self'", "https://newassets.hcaptcha.com"],
      },
    },
  },

  vite: {
    plugins: [basicSsl()],
    build: {
      sourcemap: true,
    },
    optimizeDeps: {
      exclude: ["@hcaptcha/types"],
    },
    server: {
      headers: {
        https: true,
        "Cross-Origin-Opener-Policy": "same-origin",
        "Cross-Origin-Embedder-Policy": "require-corp",
      },
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
