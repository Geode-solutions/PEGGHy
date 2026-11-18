// Test-only hook of the e2e tests (tests/e2e/browser): with ?e2e in the URL, the home page skips the demo data and,
// Once the microservices are connected, globalThis.pegghyE2e imports the files of the tests (see plugins/e2e.client.ts)

import type { GeodeObjectType } from "@ogw_front/types/identifiers";
import back_schemas from "@geode/opengeodeweb-back/opengeodeweb_back_typed_schemas.js";
import { importWorkflow } from "@ogw_front/utils/import_workflow";
import { resolveAllowedObjectsPerFile } from "@ogw_shared/utils/response_handlers/load.js";
import { useBackStore } from "@ogw_front/stores/back";

// A file of the tests, read on the test side and sent to the page
interface E2eFile {
  name: string;
  base64: string;
}

interface PegghyE2e {
  importFiles: (files: E2eFile[]) => Promise<string[]>;
}

declare global {
  // oxlint-disable-next-line no-var -- a global declaration needs var
  var pegghyE2e: PegghyE2e | undefined;
}

function isE2e(): boolean {
  return new URLSearchParams(globalThis.location.search).has("e2e");
}

function toFile({ name, base64 }: E2eFile): File {
  const bytes = Uint8Array.from(atob(base64), (character) => character.codePointAt(0) ?? 0);
  return new File([bytes], name);
}

// The object type the import UI would preselect: the one chosen by the back, or its best candidate
async function geodeObjectType(filename: string): Promise<GeodeObjectType> {
  const schema = back_schemas.opengeodeweb_back.allowed_objects;
  const response = await useBackStore().request({ schema, params: { filename } });
  const [file] = resolveAllowedObjectsPerFile([filename], [response]);
  const [selectedGeodeObject] = [
    ...(file?.selectedGeodeObjects ?? []),
    ...(file?.candidates ?? []),
  ];
  if (selectedGeodeObject === undefined) {
    throw new Error(`No geode object type could be chosen for ${filename}`);
  }
  // oxlint-disable-next-line typescript/no-unsafe-type-assertion -- the back only answers with its own object types
  return selectedGeodeObject;
}

async function importFiles(files: E2eFile[]): Promise<string[]> {
  const backStore = useBackStore();
  await Promise.all(
    files.map(async (file) => {
      await backStore.upload(toFile(file));
    }),
  );
  const filesToImport = await Promise.all(
    files.map(async ({ name }) => ({
      filename: name,
      geode_object_type: await geodeObjectType(name),
    })),
  );
  return importWorkflow(filesToImport);
}

function registerE2eHook(): void {
  globalThis.pegghyE2e = { importFiles };
}

export { isE2e, registerE2eHook };
export type { E2eFile, PegghyE2e };
