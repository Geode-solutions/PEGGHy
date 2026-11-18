// The deployed PEGGHy with its demo data: the app is launched once for both tests, a screenshot is taken at the end
// Of each one (screenshots/cloud.test.ts/<test name>.png)

// Third party imports
import { expect } from "@playwright/test";

// Local imports
import {
  getHybridViewerCanvas,
  getHybridViewerCanvasBoundingBox,
  viewerContextMenu,
} from "#ogw_e2e/viewer_canvas.js";
import {
  resetCamera,
  selectCameraOrientation,
  toggleCameraOrientation,
} from "#ogw_e2e/camera_interaction.js";
import { test } from "./utils/fixtures";

const HALF = 0.5;
// The picking request goes to the cloud viewer
const PICKER_TIMEOUT_MS = 20_000;

test.use({ suiteId: import.meta.url });
test.describe.configure({ mode: "serial" });

test("microservices running", async ({ window }) => {
  await expect(window.getByTestId("mainObjectTree")).toBeVisible();
});

// The top view overlaps the demo objects at the center of the viewer
test("overlapping menu", async ({ window }) => {
  await resetCamera(window);
  await toggleCameraOrientation(window);
  await selectCameraOrientation(window, "Z+");
  await toggleCameraOrientation(window);
  const box = await getHybridViewerCanvasBoundingBox(getHybridViewerCanvas(window));
  await viewerContextMenu(window, box.width * HALF, box.height * HALF);
  await expect(
    window
      .getByTestId("overlappingObjectsPicker")
      .or(window.getByTestId("viewerContextMenu"))
      .or(window.getByTestId("circularMenuCenterButton")),
  ).toBeVisible({ timeout: PICKER_TIMEOUT_MS });
});
