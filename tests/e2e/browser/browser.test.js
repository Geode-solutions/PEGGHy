// Third party imports
import { expect, test } from "@playwright/test";
import kill from "kill-port";
import { runBrowser } from "@geode/opengeodeweb-front/server/utils/scripts.js";

// Constants
const TIMEOUT_SECONDS = 60;
const MILLISECONDS = 1000;
const TIMEOUT = TIMEOUT_SECONDS * MILLISECONDS;
const HYBRID_VIEWER_TIMEOUT = 30_000;
const VISIBLE_TIMEOUT = 15_000;
const PICKER_TIMEOUT = 20_000;
const RENDERING_WAIT_TIME = 5000;

let nuxtPort = 0;

test.beforeEach(async ({ page }) => {
  nuxtPort = await runBrowser("preview:browser");
  page.on("console", (msg) => console.log(`Browser console: ${msg.text()}`));
  await page.goto(`http://localhost:${nuxtPort}`);
  console.log("Navigated to", page.url());
}, TIMEOUT);

test.afterEach(async () => {
  console.log("Killing Nuxt process", { nuxtPort });
  await kill(nuxtPort);
  console.log("Killed Nuxt process", { nuxtPort });
});

test("Microservices running", async ({ page }) => {
  await page
    .getByTestId("hybridViewer")
    .waitFor({ state: "visible", timeout: HYBRID_VIEWER_TIMEOUT });
  await page
    .getByTestId("hybridViewer")
    .getByText("Objects")
    .waitFor({ state: "visible", timeout: HYBRID_VIEWER_TIMEOUT });
  await page.waitForTimeout(RENDERING_WAIT_TIME);
  await expect(page).toHaveScreenshot({
    path: `microservices-running-${process.platform}.png`,
  });
});

test("Overlapping menu", async ({ page }) => {
  const card = page.getByTestId("hybridViewer");
  await expect(card).toBeVisible({ timeout: VISIBLE_TIMEOUT });
  await page
    .getByTestId("hybridViewer")
    .getByText("Objects")
    .waitFor({ state: "visible", timeout: HYBRID_VIEWER_TIMEOUT });
  await page.waitForTimeout(RENDERING_WAIT_TIME);

  const box = await card.boundingBox();
  const clickX = box.x + box.width / 2;
  const clickY = box.y + box.height / 2;

  await page.mouse.move(clickX, clickY);
  await page.mouse.click(clickX, clickY, { button: "right" });
  await expect(
    page.getByTestId("overlappingObjectsPicker").or(page.getByTestId("viewerContextMenu")),
  ).toBeVisible({
    timeout: PICKER_TIMEOUT,
  });
  await expect(page).toHaveScreenshot({
    path: `overlapping-menu-${process.platform}.png`,
  });
});
