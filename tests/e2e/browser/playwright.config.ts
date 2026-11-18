import { defineConfig, devices } from "@playwright/test";
import { isWindows } from "std-env";

const WINDOWS_TIMEOUT = 90_000;
const TIMEOUT = 40_000;
const CI_RETRIES = 1;
const CI_WORKERS = 3;
const LINUX_MAX_DIFF_PIXEL_RATIO = 0.02;
// The baselines of the suites are generated on Linux, Windows text rendering (DirectWrite vs FreeType) adds ~2% diff
const WINDOWS_MAX_DIFF_PIXEL_RATIO = 0.025;
const SCREENSHOT_THRESHOLD = 0.3;

const isCI = process.env.CI !== undefined && process.env.CI !== "";
if (isCI) {
  // Reaches the spawned Nitro server through process.env: the app logs plain text instead of styled consola output
  process.env.NUXT_PUBLIC_PLAIN_LOGS = "true";
}

// The viewer tests of OpenGeodeWeb-Front (opengeodeweb_front.test.ts), run against the local PEGGHy app: one
// Baseline for every OS
// oxlint-disable-next-line import/no-default-export -- Playwright requires its config to have a default export
export default defineConfig({
  testDir: "./",
  testMatch: "opengeodeweb_front.test.ts",
  timeout: isWindows ? WINDOWS_TIMEOUT : TIMEOUT,
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? CI_RETRIES : 0,
  workers: isCI ? CI_WORKERS : undefined,
  reporter: "html",
  expect: {
    toHaveScreenshot: {
      maxDiffPixelRatio: isWindows ? WINDOWS_MAX_DIFF_PIXEL_RATIO : LINUX_MAX_DIFF_PIXEL_RATIO,
      threshold: SCREENSHOT_THRESHOLD,
      // Screenshots/<suite>.test.ts/<test name>.png, named by the app test of OpenGeodeWeb-Front
      pathTemplate: "./screenshots/{arg}{ext}",
    },
  },
  projects: [
    {
      name: "opengeodeweb-front",
      use: {
        ...devices["Desktop Chrome"],
        screenshot: "only-on-failure",
        trace: "retain-on-failure",
      },
    },
  ],
});
