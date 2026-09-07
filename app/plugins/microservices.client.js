import { useBackStore } from "@ogw_front/stores/back";
import { useInfraStore } from "@ogw_front/stores/infra";
import { useViewerStore } from "@ogw_front/stores/viewer";

export default defineNuxtPlugin(() => {
  const infraStore = useInfraStore();

  // Initialize and register back microservice
  const backStore = useBackStore();
  infraStore.register_microservice(backStore);

  // Initialize and register viewer microservice
  const viewerStore = useViewerStore();
  infraStore.register_microservice(viewerStore);
});
