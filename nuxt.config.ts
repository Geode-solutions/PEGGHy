// Node imports
import fs from "node:fs";
import path from "node:path";

// Nuxt imports
import { defineNuxtConfig } from "nuxt/config";

// Local imports
import package_json from "./package.json";

// Constants
const __dirname = import.meta.dirname;

const serverDirectories = ["local, microservice, serverless, cloud"];

// Oxlint's type-aware linter auto-discovers each file's nearest tsconfig.json
// By walking up directories, and any "extends" on that discovered file makes
// Its whole type-aware resolution collapse: every symbol coming through the
// Aliases normally only defined in .nuxt/tsconfig.json (@ogw_shared, etc.,
// But also Nuxt's own #app/#imports/defineStore auto-imports) becomes an
// `error` type, even though tsc/vue-tsc resolve the exact same "extends"
// Chain correctly (oxc-project/oxc#22345). The only fix is for the root
// Tsconfig.json to be fully self-contained: no "extends", with its own copy
// Of .nuxt/tsconfig.json's compilerOptions.paths (re-relativized here, since
// They're written relative to .nuxt/) and a deliberately project-wide
// "include" (unlike .nuxt/tsconfig.json's own include, which only covers
// Nuxt's conventional folders and would otherwise silently drop internal/,
// Tests/, etc. from the program). Regenerated on every Nuxt prepare so it
// Can never drift from what Nuxt actually resolves.
function remap_path_to_root(target: string, build_dir: string): string {
  const relative = path
    .relative(__dirname, path.resolve(build_dir, target))
    .split(path.sep)
    .join("/");
  return relative.startsWith("./") || relative.startsWith("../") ? relative : `./${relative}`;
}

function getIgnoredDirectories(directoriesToKeep: string[]): string[] {
  return serverDirectories
    .filter((directory) => !directoriesToKeep.includes(directory))
    .map((directory) => `api/${directory}/**`);
}

function nitroIgnoreConfig(): string[] {
  const mode = process.env.MODE;
  if (mode === undefined || mode === "") {
    throw new Error("No mode provided");
  }
  if (mode === "DESKTOP" || mode === "BROWSER") {
    return getIgnoredDirectories(["local", "microservice"]);
  }
  if (mode === "CLOUD") {
    return getIgnoredDirectories(["serverless"]);
  }
  if (mode === "CLOUD_SERVER") {
    return getIgnoredDirectories(["cloud", "microservice"]);
  }
  throw new Error(`Unknown mode provided: ${mode}`);
}

// oxlint-disable-next-line import/no-default-export -- Nuxt requires nuxt.config.ts to have a default export
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      API_URL: "api_pegghy.geode-solutions.com",
      COMMAND_BACK: "pegghy-back",
      COMMAND_VIEWER: "pegghy-viewer",
      NUXT_ROOT_PATH: __dirname,
      PROJECT: package_json.name,
    },
  },
  compatibilityDate: "2025-07-15",
  extends: ["@geode/opengeodeweb-front"],

  alias: {
    "@pegghy": path.resolve(__dirname, "app"),
  },
  vuetify: {
    moduleOptions: {
      enableRules: false,
      rulesConfiguration: {
        fromLabs: false,
      },
    },
    vuetifyOptions: {
      defaults: {
        VImg: {
          draggable: false,
        },
      },
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
        { charset: "utf8" },
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
    "@vueuse/nuxt",
  ],
  imports: {
    scan: false,
  },

  nitro: {
    ignore: nitroIgnoreConfig(),
  },

  css: [path.resolve(__dirname, "app/assets/css/main.css")],

  vite: {
    server: {
      fs: {
        allow: [
          path.resolve(__dirname, "../../node_modules/@fontsource"),
          path.resolve(__dirname, "../../node_modules/@mdi/font"),
        ],
      },
    },
    optimizeDeps: {
      include: ["@kitware/vtk.js", "xmlbuilder2", "spark-md5"],
    },
    watch: {
      ignored: ["**"],
    },
  },

  hooks: {
    "prepare:types": ({ tsConfig }) => {
      const paths = tsConfig.compilerOptions?.paths;
      if (!paths) {
        return;
      }
      const build_dir = path.resolve(__dirname, ".nuxt");
      const root_paths = Object.fromEntries(
        Object.entries(paths).map(([alias, targets]) => [
          alias,
          targets.map((target) => remap_path_to_root(target, build_dir)),
        ]),
      );
      fs.writeFileSync(
        path.resolve(__dirname, "tsconfig.json"),
        `${JSON.stringify(
          {
            compilerOptions: { ...tsConfig.compilerOptions, paths: root_paths },
            include: ["**/*", "./.nuxt/nuxt.d.ts"],
          },
          undefined,
          2,
        )}\n`,
      );
    },
  },
});
