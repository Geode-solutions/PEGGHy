// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  future: {
    compatibilityVersion: 4,
  },
  modules: [
    "vuetify-nuxt-module",
    [
      "@pinia/nuxt",
      {
        autoImports: ["storeToRefs", "defineStore"],
      },
    ],
    "@nuxt/devtools",
    "@vueuse/nuxt",
  ],
});
