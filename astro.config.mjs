import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import alpinejs from "@astrojs/alpinejs";

// https://astro.build/config
export default defineConfig({
  site: "https://quack.host",
  integrations: [tailwind(), alpinejs()],
  compressHTML: true,
  build: {
    inlineStylesheets: 'auto',
  },
});
