import { useBackStore } from "@ogw_front/stores/back";
import { useInfraStore } from "@ogw_front/stores/infra";
import { useViewerStore } from "@ogw_front/stores/viewer";

const UPLOAD_FOLDER_PATH = "/home/tao/Bureau/Geode/GeodeWeb-Workspaces/PEGGHy/PEGGHy-Data/";

export default defineNuxtPlugin(() => {
  const infraStore = useInfraStore();

  // Initialize and register back microservice
  const backStore = useBackStore();
  const defaultLaunch = backStore.launch.bind(backStore);
  backStore.launch = function launch(args) {
    return defaultLaunch({
      ...args,
      uploadFolderPath: UPLOAD_FOLDER_PATH,
    });
  };
  infraStore.register_microservice(backStore);

  // Initialize and register viewer microservice
  const viewerStore = useViewerStore();
  infraStore.register_microservice(viewerStore);
});
