// The test of the deployed PEGGHy: the app test of OpenGeodeWeb-Front (screenshot at the end of each passing test),
// Launched on the cloud instance of the branch, with its demo data loaded

// Node imports
import { execSync } from "node:child_process";

// Third party imports
import { consola } from "consola";
import { expect } from "@playwright/test";

// Local imports
import { PAGE_HEIGHT, PAGE_WIDTH } from "#ogw_e2e/constants.js";
import { test as appTest } from "#ogw_e2e/app_test.js";

// Fixed so number/date formatting matches the baselines
const LOCALE = "en-US";
const TIMEZONE = "UTC";
// The cloud instance starts on demand, then loads the demo data
const DEMO_DATA_TIMEOUT_MS = 140_000;

// Next.pegghy.geode-solutions.com for the next branch, pegghy.geode-solutions.com otherwise
function cloudUrl(): string {
  const branch = execSync("git branch --show-current", { encoding: "utf8" }).trim();
  consola.info("Current branch:", branch);
  const prefix = branch === "next" ? "next." : "";
  return `https://${prefix}pegghy.geode-solutions.com`;
}

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
        });
        const window = await context.newPage();
        window.on("console", (message) => {
          consola.info(`Browser console: ${message.text()}`);
        });
        await window.goto(cloudUrl());
        consola.info("Navigated to", window.url());
        await window.getByRole("button", { name: "Load the app" }).click();
        return {
          window,
          cleanup: async (): Promise<void> => {
            await window.close();
            await browser.close();
          },
        };
      });
    },
    { scope: "worker" },
  ],

  // The home page loads the demo data once the microservices are connected (see app/pages/index.vue)
  afterAppLaunch: [
    // oxlint-disable-next-line no-empty-pattern
    async ({}, use): Promise<void> => {
      await use(async (window) => {
        const dataLoadingOverlay = window.getByTestId("dataLoadingOverlay");
        await expect(dataLoadingOverlay).toBeVisible({ timeout: DEMO_DATA_TIMEOUT_MS });
        await expect(dataLoadingOverlay).toBeHidden({ timeout: DEMO_DATA_TIMEOUT_MS });
      });
    },
    { scope: "worker" },
  ],
});

export { test };
