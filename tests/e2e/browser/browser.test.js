// Third party imports
import { expect, test } from "@playwright/test";
import kill from "kill-port";
import { runBrowser } from "@geode/opengeodeweb-front/server/utils/scripts.js";

// Local imports

// Constants
const TIMEOUT_SECONDS = 30;
const MILLISECONDS = 1000;
const TIMEOUT = TIMEOUT_SECONDS * MILLISECONDS;

let nuxtPort = 0;

test.beforeEach(async ({ page }) => {
  nuxtPort = await runBrowser("preview:browser");
  page.on("console", (msg) => console.log(`Browser console: ${msg.text()}`));
  await page.goto(`http://localhost:${nuxtPort}`);
  console.log("Navigated to", page.url());
});

test.afterEach(async () => {
  console.log("Killing Nuxt process", { nuxtPort });
  await kill(nuxtPort);
  console.log("Killed Nuxt process", { nuxtPort });
});

test("Microservices running", async ({ page }) => {
  await page.waitForTimeout(TIMEOUT);
  await expect(page).toHaveScreenshot({
    path: `microservices-running-${process.platform}.png`,
  });
});

test("Overlapping menu", async ({ page }) => {
  await page.waitForTimeout(TIMEOUT);
  const card = page.locator(".v-card").first();
  const box = await card.boundingBox();
  await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2, {
    button: "right",
  });
  await expect(
    page.getByTestId("overlappingObjectsPicker").or(page.getByTestId("viewerContextMenu")),
  ).toBeVisible({
    timeout: 10_000,
  });
  await expect(page).toHaveScreenshot({
    path: `overlapping-menu-${process.platform}.png`,
  });
});
