import { expect, test } from "@playwright/test";
import { execSync } from "node:child_process";

const WAIT_TIME = 140_000;
const TIMEOUT = 150_000;
const HYBRID_VIEWER_TIMEOUT = 30_000;
const VISIBLE_TIMEOUT = 15_000;
const PICKER_TIMEOUT = 20_000;
const RENDERING_WAIT_TIME = 5000;

test.describe.configure({ mode: "serial" });

let page = undefined;

test.beforeAll(async ({ browser }) => {
  page = await browser.newPage();
  page.on("console", (msg) => console.log(`Browser console: ${msg.text()}`));

  let prefix = "";
  const branch = execSync("git branch --show-current", {
    encoding: "utf8",
  }).trim();
  console.log("Current branch:", branch);
  if (branch === "next") {
    prefix = "next.";
  }

  await page.goto(`https://${prefix}pegghy.geode-solutions.com`);
  console.log("Navigated to", page.url());
  const button = page.getByRole("button", { name: "Load the app" });
  if (await button.isVisible().catch(() => false)) {
    await button.click();
  }
  await page.waitForTimeout(WAIT_TIME);
}, TIMEOUT);

test.afterAll(async () => {
  await page?.close();
});

test("Microservices running", async () => {
  await expect(page).toHaveScreenshot({
    path: `microservices-running-${process.platform}.png`,
  });
});

test("Overlapping menu", async () => {
  const card = page.getByTestId("hybridViewer");
  await expect(card).toBeVisible({ timeout: VISIBLE_TIMEOUT });
  await page.getByTestId("hybridViewer").getByText("Objects").waitFor({ state: "visible", timeout: HYBRID_VIEWER_TIMEOUT });
  await page.waitForTimeout(RENDERING_WAIT_TIME);

  const box = await card.boundingBox();
  const clickX = box.x + box.width / 2;
  const clickY = box.y + box.height / 2;

  await page.mouse.move(clickX, clickY);
  await page.mouse.click(clickX, clickY, { button: "right" });
  await expect(
    page
      .getByTestId("overlappingObjectsPicker")
      .or(page.getByTestId("viewerContextMenu")),
  ).toBeVisible({
    timeout: PICKER_TIMEOUT,
  });
  await expect(page).toHaveScreenshot({
    path: `overlapping-menu-${process.platform}.png`,
  });
});
