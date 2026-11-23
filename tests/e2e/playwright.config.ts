import { defineConfig, devices } from "@playwright/test";
import { isWindows } from "std-env";

const SECOND = 1000;
const LINUX_BROWSER_TIMEOUT_SECONDS = 40;
const WINDOWS_BROWSER_TIMEOUT_SECONDS = 90;
const BROWSER_TIMEOUT =
  (isWindows ? WINDOWS_BROWSER_TIMEOUT_SECONDS : LINUX_BROWSER_TIMEOUT_SECONDS) * SECOND;
// Launching the cloud instance and loading the demo data, then the test
const CLOUD_TIMEOUT_SECONDS = 250;
const CLOUD_TIMEOUT = CLOUD_TIMEOUT_SECONDS * SECOND;
const CI_RETRIES = 1;
const CI_WORKERS = 3;
const LINUX_MAX_DIFF_PIXEL_RATIO = 0.02;
// The baselines are generated on Linux, Windows text rendering (DirectWrite vs FreeType) adds ~2% diff
const WINDOWS_MAX_DIFF_PIXEL_RATIO = 0.025;
const SCREENSHOT_THRESHOLD = 0.3;

const isCI = process.env.CI !== undefined && process.env.CI !== "";
if (isCI) {
  // Reaches the spawned Nitro server through process.env: the app logs plain text instead of styled consola output
  process.env.NUXT_PUBLIC_PLAIN_LOGS = "true";
}

// The e2e tests of PEGGHy, one project per target:
// - browser: the viewer suites of OpenGeodeWeb-Front against the local app (one baseline for every OS)
// - cloud: the deployed app with its demo data, launched once for every test
// oxlint-disable-next-line import/no-default-export -- Playwright requires its config to have a default export
export default defineConfig({
  testMatch: "**/*.test.ts",
  forbidOnly: isCI,
  retries: isCI ? CI_RETRIES : 0,
  workers: isCI ? CI_WORKERS : undefined,
  reporter: "html",
  expect: {
    toHaveScreenshot: {
      maxDiffPixelRatio: isWindows ? WINDOWS_MAX_DIFF_PIXEL_RATIO : LINUX_MAX_DIFF_PIXEL_RATIO,
      threshold: SCREENSHOT_THRESHOLD,
      // <project folder>/screenshots/<test file>/<test name>.png, named by the app test of OpenGeodeWeb-Front
      pathTemplate: "{testDir}/screenshots/{arg}{ext}",
    },
  },
  use: {
    ...devices["Desktop Chrome"],
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "browser",
      testDir: "./browser",
      timeout: BROWSER_TIMEOUT,
      fullyParallel: true,
    },
    {
      name: "cloud",
      testDir: "./cloud",
      timeout: CLOUD_TIMEOUT,
    },
  ],
});
