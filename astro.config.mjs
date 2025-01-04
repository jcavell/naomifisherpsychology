import { defineConfig } from "astro/config";

import partytown from "@astrojs/partytown";
import sitemap from "@astrojs/sitemap";

import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  site: "https://www.naomifisher.co.uk",
  // output: "server",
  // server: {
  //     headers: {
  //     "Access-Control-Allow-Origin": "*",
  //     "Access-Control-Allow-Methods": "*",
  //     "Access-Control-Allow-Headers": "*",
  //     "Access-Control-Allow-Credentials" : "*"
  //     }
  // },
  integrations: [sitemap(), partytown({
    config: {
      forward: ["dataLayer.push"],
    },
  }), react()],
});