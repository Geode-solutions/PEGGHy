import { consola } from "consola";
import { useBackStore } from "@ogw_front/stores/back";
import { useInfraStore } from "@ogw_front/stores/infra";
import { useViewerStore } from "@ogw_front/stores/viewer";

export default defineNuxtPlugin(() => {
  consola.info("[PLUGIN] Initializing microservices plugin...");

  const infraStore = useInfraStore();

  // Initialize and register back microservice
  consola.info("[PLUGIN] Registering back microservice");
  const backStore = useBackStore();
  infraStore.register_microservice(backStore);

  // Initialize and register viewer microservice
  consola.info("[PLUGIN] Registering viewer microservice");
  const viewerStore = useViewerStore();
  infraStore.register_microservice(viewerStore);

  consola.info("[PLUGIN] All microservices registered and stores initialized");
});
