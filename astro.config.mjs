import { defineConfig } from "astro/config";

import preact from "@astrojs/preact";
import partytown from '@astrojs/partytown'
import sitemap from "@astrojs/sitemap";

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
  integrations: [preact(), sitemap(), partytown({
            config: {
              forward: ["dataLayer.push"],
            },
        }),]
});