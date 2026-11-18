// Test-only: with ?e2e in the URL in browser mode, skips the demo data and exposes the hook of the e2e tests once
// The microservices are connected (see utils/e2e.ts)

import { isE2e, registerE2eHook } from "@pegghy/utils/e2e";
import { Status } from "@ogw_front/utils/status";
import { setHasImportedData } from "@pegghy/utils/data_settings";
import { useBackStore } from "@ogw_front/stores/back";
import { useViewerStore } from "@ogw_front/stores/viewer";

export default defineNuxtPlugin(() => {
  if (!isE2e()) {
    return;
  }
  // The tests import their own data: the home page must not load the demo one
  setHasImportedData(true);
  const backStore = useBackStore();
  const viewerStore = useViewerStore();
  watch(
    () => [viewerStore.status, backStore.status],
    ([viewerStatus, backStatus]) => {
      if (viewerStatus === Status.CONNECTED && backStatus === Status.CONNECTED) {
        registerE2eHook();
      }
    },
    { immediate: true },
  );
});
