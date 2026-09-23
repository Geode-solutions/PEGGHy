import { type Page, expect, test } from "@playwright/test";
import { execSync } from "node:child_process";

function assertDefined<Value>(
  value: Value | null | undefined,
  message: string,
): asserts value is Value {
  if (value === null || value === undefined) {
    throw new Error(message);
  }
}

const WAIT_TIME = 140_000;
const TIMEOUT = 150_000;
const VISIBLE_TIMEOUT = 15_000;
const PICKER_TIMEOUT = 20_000;
const RENDER_WAIT = 5000;
const RESET_WAIT = 1000;
const ANIMATION_WAIT = 2000;
const AFTER_ACTION_WAIT = 2000;
const CENTER_RATIO = 0.5;

test.describe.configure({ mode: "serial" });

let page: Page | undefined = undefined;

function getPage(): Page {
  if (!page) {
    throw new Error("Page not initialized");
  }
  return page;
}

test.beforeAll(async ({ browser }) => {
  test.setTimeout(TIMEOUT);
  page = await browser.newPage();
  page.on("console", (msg) => {
    console.log(`Browser console: ${msg.text()}`);
  });

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
});

test.afterAll(async () => {
  await page?.close();
});

test("Microservices running", async () => {
  const currentPage = getPage();
  const dataLoadingOverlay = currentPage.getByTestId("dataLoadingOverlay");
  await expect(dataLoadingOverlay).toBeVisible({ timeout: WAIT_TIME });
  await expect(dataLoadingOverlay).toBeHidden({ timeout: WAIT_TIME });

  const mainObjectTree = currentPage.getByTestId("mainObjectTree");
  await expect(mainObjectTree).toBeVisible({ timeout: VISIBLE_TIMEOUT });

  await currentPage.waitForTimeout(RENDER_WAIT);
  await expect(currentPage).toHaveScreenshot(`microservices-running.png`);
});

test("Overlapping menu", async () => {
  const currentPage = getPage();
  const hybridViewer = currentPage.getByTestId("hybridViewer");
  await expect(hybridViewer).toBeVisible({ timeout: VISIBLE_TIMEOUT });
  const mainObjectTree = currentPage.getByTestId("mainObjectTree");
  await expect(mainObjectTree).toBeVisible({ timeout: VISIBLE_TIMEOUT });

  const resetCameraButton = currentPage.getByTestId("resetCameraButton");
  await expect(resetCameraButton).toBeVisible({ timeout: VISIBLE_TIMEOUT });
  await resetCameraButton.click();
  await currentPage.waitForTimeout(RESET_WAIT);

  // Switch to top view (Z+) to overlap objects in 2D projection
  const cameraOrientationButton = currentPage.getByTestId("cameraOrientationButton");
  await expect(cameraOrientationButton).toBeVisible({ timeout: VISIBLE_TIMEOUT });
  await cameraOrientationButton.click();

  const zPlusButton = currentPage.getByTestId("cameraOrientationZPlusButton");
  await expect(zPlusButton).toBeVisible({ timeout: VISIBLE_TIMEOUT });
  await zPlusButton.click();

  // Close camera orientation panel
  await cameraOrientationButton.click();
  await expect(zPlusButton).toBeHidden();

  // Wait for camera movement animation
  await currentPage.waitForTimeout(ANIMATION_WAIT);

  const boundingBox = await hybridViewer.boundingBox();
  assertDefined(boundingBox, "hybridViewer has no bounding box");
  const clickX = boundingBox.x + boundingBox.width * CENTER_RATIO;
  const clickY = boundingBox.y + boundingBox.height * CENTER_RATIO;

  await currentPage.mouse.click(clickX, clickY, { button: "right" });
  const overlappingObjectsPicker = currentPage.getByTestId("overlappingObjectsPicker");
  const viewerContextMenu = currentPage.getByTestId("viewerContextMenu");
  const circularMenuCenterButton = currentPage.getByTestId("circularMenuCenterButton");
  await expect(
    overlappingObjectsPicker.or(viewerContextMenu).or(circularMenuCenterButton),
  ).toBeVisible({
    timeout: PICKER_TIMEOUT,
  });
  await currentPage.waitForTimeout(AFTER_ACTION_WAIT);
  await expect(currentPage).toHaveScreenshot(`overlapping-menu.png`);
});
