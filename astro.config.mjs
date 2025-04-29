import { defineConfig } from "astro/config";
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
    ssr: {
      noExternal: [
        '@nanostores/react',
        '@nanostores/persistent'
      ]
    },
    plugins: [process.env.NODE_ENV === "development" && basicSsl()].filter(
      Boolean,
    ),
    server:
      process.env.NODE_ENV === "development" ? { https: true } : undefined,
  },

  integrations: [sitemap(), react()],
});
