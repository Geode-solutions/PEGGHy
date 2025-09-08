export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  extends: ["@geode/opengeodeweb-front"],
  devtools: { enabled: true },
  future: {
    compatibilityVersion: 4,
  },
  vuetify: {
    defaults: {
      VImg: {
        draggable: false,
      },
    },
    moduleOptions: {},
    vuetifyOptions: {
      labComponents: true,
      theme: {
        defaultTheme: "lightTheme",
        themes: {
          lightTheme: {
            dark: false,
            colors: {
              primary: "#3c9983",
              secondary: "#424242",
              accent: "#82B1FF",
              error: "#FF5252",
              info: "#2196F3",
              success: "#4CAF50",
              warning: "#FB8C00",
            },
          },
        },
      },
    },
  },
  ssr: false,

  app: {
    head: {
      titleTemplate: "PEGGHy",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          hid: "description",
          name: "description",
          content: "Platform for geological data visualization",
        },
      ],
      link: [{ rel: "icon", type: "image/ico", href: "/favicon.ico" }],
    },
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

  imports: {
    dirs: [
      "/app/stores",
      "@geode/opengeodeweb-front/stores",
      "@geode/vease/app/stores",
    ],
  },

  css: ["/assets/css/main.css"],

  vite: {
    optimizeDeps: {
      include: ["@kitware/vtk.js", "xmlbuilder2", "spark-md5"],
    },
    resolve: {
      alias: {
        "@geode/vease": "@geode/vease/app",
        "@ogw_f": "@geode/opengeodeweb-front",
      },
    },
    watch: {
      ignored: ["**"],
    },
  },
});
