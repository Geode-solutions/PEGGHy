import { defineConfig, devices } from "@playwright/test";
import type { ConfigOptions } from "@nuxt/test-utils/playwright";
import { isWindows } from "std-env";

const WINDOWS_TIMEOUT = 90_000;
const TIMEOUT = 40_000;
const CI_RETRIES = 1;
const CI_WORKERS = 3;
const PAGE_WIDTH = 1200;
const PAGE_HEIGHT = 800;
const LINUX_MAX_DIFF_PIXEL_RATIO = 0.02;
// The baselines of the suites are generated on Linux, Windows text rendering (DirectWrite vs FreeType) adds ~2% diff
const WINDOWS_MAX_DIFF_PIXEL_RATIO = 0.025;
const SCREENSHOT_THRESHOLD = 0.3;

const isCI = process.env.CI !== undefined && process.env.CI !== "";
if (isCI) {
  // Reaches the spawned Nitro server through process.env: the app logs plain text instead of styled consola output
  process.env.NUXT_PUBLIC_PLAIN_LOGS = "true";
}

/**
 * @see https://playwright.dev/docs/test-configuration
 */
// oxlint-disable-next-line import/no-default-export -- Nuxt requires nuxt.config.ts to have a default export
export default defineConfig<ConfigOptions>({
  expect: {
    toHaveScreenshot: { maxDiffPixelRatio: 0.02 },
  },
  testDir: "./",
  timeout: isWindows ? WINDOWS_TIMEOUT : TIMEOUT,
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: Boolean(process.env.CI),
  retries: 0,
  workers: isCI ? CI_WORKERS : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: "html",
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    nuxt: {
      rootDir: import.meta.dirname,
      dev: true,
    },

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",
  },

  projects: [
    {
      name: "chromium",
      testMatch: "browser.test.ts",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: PAGE_WIDTH, height: PAGE_HEIGHT },
      },
    },
    // The viewer tests of OpenGeodeWeb-Front: one baseline for every OS
    {
      name: "opengeodeweb-front",
      testMatch: "opengeodeweb_front.test.ts",
      retries: isCI ? CI_RETRIES : 0,
      expect: {
        toHaveScreenshot: {
          maxDiffPixelRatio: isWindows ? WINDOWS_MAX_DIFF_PIXEL_RATIO : LINUX_MAX_DIFF_PIXEL_RATIO,
          threshold: SCREENSHOT_THRESHOLD,
          // Screenshots/<suite>.test.ts/<test name>.png, named by the app test of OpenGeodeWeb-Front
          pathTemplate: "./screenshots/{arg}{ext}",
        },
      },
      use: {
        ...devices["Desktop Chrome"],
        screenshot: "only-on-failure",
        trace: "retain-on-failure",
      },
    },
  ],
});
