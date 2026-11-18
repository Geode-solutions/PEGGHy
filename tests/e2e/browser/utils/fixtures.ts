// The test of PEGGHy: the app test of OpenGeodeWeb-Front (one app per worker, opened and closed by the tests, a
// Screenshot at the end of each passing test), launched in browser mode with ?e2e (no demo data, see
// App/utils/e2e.ts)

// Third party imports
import { consola } from "consola";
import kill from "kill-port";
import { runBrowser } from "@geode/opengeodeweb-front/server/utils/scripts.js";

// Local imports
import { test as appTest } from "#ogw_e2e/app_test.js";

const PAGE_WIDTH = 1200;
const PAGE_HEIGHT = 800;
// Fixed so number/date formatting matches the baselines on every OS
const LOCALE = "en-US";
const TIMEZONE = "UTC";
// The server answers before the microservices are up, slower on a cold Windows runner
const APP_READY_TIMEOUT_MS = 120_000;

const test = appTest.extend({
  launchApp: [
    async ({ playwright, browserName, headless, channel, launchOptions }, use): Promise<void> => {
      await use(async () => {
        const browser = await playwright[browserName].launch({
          ...launchOptions,
          headless,
          channel,
        });
        const context = await browser.newContext({
          viewport: { width: PAGE_WIDTH, height: PAGE_HEIGHT },
          locale: LOCALE,
          timezoneId: TIMEZONE,
          permissions: ["clipboard-read", "clipboard-write"],
        });
        const window = await context.newPage();
        window.on("console", (message) => {
          consola.info(`Browser console: ${message.text()}`);
        });
        const nuxtPort = await runBrowser("preview:browser");
        await window.goto(`http://localhost:${nuxtPort}/?e2e`);
        consola.info("Navigated to", window.url());
        await window.waitForFunction(() => globalThis.pegghyE2e !== undefined, undefined, {
          timeout: APP_READY_TIMEOUT_MS,
        });
        return {
          window,
          cleanup: async (): Promise<void> => {
            await window.close();
            await browser.close();
            await kill(nuxtPort);
          },
        };
      });
    },
    { scope: "worker" },
  ],
});

export { test };
