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

  vite: {
    plugins: [process.env.NODE_ENV === "development" && basicSsl()].filter(
      Boolean,
    ),
    server:
      process.env.NODE_ENV === "development" ? { https: true } : undefined,
  },

  integrations: [
    sitemap(),
    partytown({
      dir: "static/~partytown", // important: this ensures scripts are self-hosted
      config: {
        forward: ["dataLayer.push"], // allows GTM to function
      },
    }),
    react(),
  ],
});
