// Test-only: with ?e2e in the URL, exposes the hook of the e2e tests once the microservices are connected (see
// Utils/e2e.ts)

import { isE2e, registerE2eHook } from "@pegghy/utils/e2e";
import { Status } from "@ogw_front/utils/status";
import { useBackStore } from "@ogw_front/stores/back";
import { useViewerStore } from "@ogw_front/stores/viewer";

export default defineNuxtPlugin(() => {
  if (!isE2e()) {
    return;
  }
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
