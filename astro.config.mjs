import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
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
    plugins: [
      tailwindcss(),
      process.env.NODE_ENV === "development" && basicSsl()].filter(
        Boolean,
      ),
    server:
      process.env.NODE_ENV === "development" ? { https: true } : undefined,
  },

  integrations: [sitemap({
    filter: (page) =>
      page !== 'https://www.naomifisher.co.uk/basket/' &&
      page !== 'https://www.naomifisher.co.uk/checkout/' &&
      page !== 'https://www.naomifisher.co.uk/media/' &&
      page !== 'https://www.naomifisher.co.uk/privacy-policy/' &&
      page !== 'https://www.naomifisher.co.uk/school-burnout-toolkit-signup/' &&
      page !== 'https://www.naomifisher.co.uk/subscribed-low-demand-toolkit/' &&
      page !== 'https://www.naomifisher.co.uk/subscribed-toolkit/' &&
      page !== 'https://www.naomifisher.co.uk/subscribed/' &&
      page !== 'https://www.naomifisher.co.uk/low-demand-toolkit-signup/' &&
      page !== 'https://www.naomifisher.co.uk/terms-and-conditions/' &&
      page !== 'https://www.naomifisher.co.uk/transitions-toolkit-signup/'
  }), react()],
});
