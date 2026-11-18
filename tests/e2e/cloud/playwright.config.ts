import { defineConfig, devices } from "@playwright/test";

// Launching the cloud instance and loading the demo data, then the test
const TIMEOUT = 250_000;
const MAX_DIFF_PIXEL_RATIO = 0.02;

const isCI = process.env.CI !== undefined && process.env.CI !== "";

// The deployed PEGGHy (cloud.test.ts): one app for every test, launched once
// oxlint-disable-next-line import/no-default-export -- Playwright requires its config to have a default export
export default defineConfig({
  testDir: "./",
  timeout: TIMEOUT,
  forbidOnly: isCI,
  retries: 0,
  workers: 1,
  reporter: "html",
  expect: {
    toHaveScreenshot: {
      maxDiffPixelRatio: MAX_DIFF_PIXEL_RATIO,
      // Screenshots/cloud.test.ts/<test name>.png, named by the app test of OpenGeodeWeb-Front
      pathTemplate: "./screenshots/{arg}{ext}",
    },
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        screenshot: "only-on-failure",
        trace: "retain-on-failure",
      },
    },
  ],
});
