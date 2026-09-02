import { expect, test } from "@playwright/test";
import { execSync } from "node:child_process";

const WAIT_TIME = 140_000;
const TIMEOUT = 150_000;
const VISIBLE_TIMEOUT = 15_000;
const PICKER_TIMEOUT = 20_000;

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
  await button.click();
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
  const hybridViewer = page.getByTestId("hybridViewer");
  await expect(hybridViewer).toBeVisible({ timeout: VISIBLE_TIMEOUT });
  const mainObjectTree = page.getByTestId("mainObjectTree");
  await expect(mainObjectTree).toBeVisible({ timeout: VISIBLE_TIMEOUT });

  const boundingBox = await hybridViewer.boundingBox();
  const clickX = boundingBox.x + boundingBox.width / 2;
  const clickY = boundingBox.y + boundingBox.height / 2;

  await page.mouse.click(clickX, clickY, { button: "right" });
  const overlappingObjectsPicker = page.getByTestId("overlappingObjectsPicker");
  const viewerContextMenu = page.getByTestId("viewerContextMenu");
  await expect(overlappingObjectsPicker.or(viewerContextMenu)).toBeVisible({
    timeout: PICKER_TIMEOUT,
  });
  const afterActionWait = 2000
  await page.waitForTimeout(afterActionWait);
  await expect(page).toHaveScreenshot({
    path: `overlapping-menu-${process.platform}.png`,
  });
});
