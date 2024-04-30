import { defineConfig } from "astro/config";

import preact from "@astrojs/preact";

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
  integrations: [preact()]
});