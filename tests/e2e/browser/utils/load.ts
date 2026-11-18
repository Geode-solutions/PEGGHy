// The loadTestDatas of the OpenGeodeWeb-Front suites: their files (published with its package) are sent to the page,
// Which uploads and imports them through the e2e hook of PEGGHy (app/utils/e2e.ts)

// Node imports
import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";

// Third party imports
import type { Page } from "@playwright/test";
import { consola } from "consola";

// Local imports
import type { E2eFile } from "@pegghy/utils/e2e";
import { waitForActionSettled } from "#ogw_e2e/wait_for_action_settled.js";

const LOAD_TIMEOUT_MS = 8000;
const ogwTestDataPath = path.join(
  path.dirname(createRequire(import.meta.url).resolve("@geode/opengeodeweb-front/package.json")),
  "tests",
  "browser",
  "data",
);

async function loadOgwTestDatas(
  window: Page,
  inputDataFilenames: string[],
  { loadTimeout = LOAD_TIMEOUT_MS }: { loadTimeout?: number } = {},
): Promise<void> {
  consola.info(`Loading datas: ${inputDataFilenames.join(", ")} from ${ogwTestDataPath}`);
  const files: E2eFile[] = inputDataFilenames.map((name) => ({
    name,
    base64: fs.readFileSync(path.join(ogwTestDataPath, name)).toString("base64"),
  }));
  await window.evaluate(async (filesToImport) => {
    if (globalThis.pegghyE2e === undefined) {
      throw new Error("The e2e hook of PEGGHy is not registered: open the app with ?e2e");
    }
    await globalThis.pegghyE2e.importFiles(filesToImport);
  }, files);
  await waitForActionSettled(window, loadTimeout);
}

export { loadOgwTestDatas };
