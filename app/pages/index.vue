<script setup>
import { Status } from "@ogw_front/utils/status";
import { importWorkflow } from "@ogw_front/utils/file_import_workflow";
import viewer_schemas from "@geode/opengeodeweb-viewer/opengeodeweb_viewer_schemas.json";

import HybridRenderingView from "@ogw_front/components/HybridRenderingView";
import Launcher from "@ogw_front/components/Launcher";

import ViewerUI from "@ogw_front/components/Viewer/Ui";
import { useDataStore } from "@ogw_front/stores/data";
import { useDataStyleStore } from "@ogw_front/stores/data_style";
import { useGeodeStore } from "@ogw_front/stores/geode";
import { useHybridViewerStore } from "@ogw_front/stores/hybrid_viewer";
import { useInfraStore } from "@ogw_front/stores/infra";
import { useMenuStore } from "@ogw_front/stores/menu";
import { useViewerStore } from "@ogw_front/stores/viewer";

import Partners from "@pegghy/components/Partners";

const MS_TO_SECONDS = 1000;

const infraStore = useInfraStore();
const viewerStore = useViewerStore();
const geodeStore = useGeodeStore();
const menuStore = useMenuStore();
const dataStore = useDataStore();
const dataStyleStore = useDataStyleStore();
const hybridViewerStore = useHybridViewerStore();

const containerWidth = ref(0);
const containerHeight = ref(0);
const cardContainer = useTemplateRef("cardContainer");
const viewerUI = useTemplateRef("viewerUI");
const { display_menu } = storeToRefs(menuStore);

const dataList = [
  { filename: "barrel.pl", geode_object_type: "EdgedCurve3D" },
  {
    filename: "block_central.pl",
    geode_object_type: "EdgedCurve3D",
  },
  {
    filename: "block_east.pl",
    geode_object_type: "EdgedCurve3D",
  },
  {
    filename: "block_west.pl",
    geode_object_type: "EdgedCurve3D",
  },
  {
    filename: "metal_d5_east_shallow.pl",
    geode_object_type: "EdgedCurve3D",
    object_type: "mesh",
  },
  {
    filename: "metal_d5_west_shallow.pl",
    geode_object_type: "EdgedCurve3D",
  },
  {
    filename: "metal_d10_east_shallow.pl",
    geode_object_type: "EdgedCurve3D",
  },
  {
    filename: "metal_d10_west_deep.pl",
    geode_object_type: "EdgedCurve3D",
  },
  {
    filename: "metal_d10_west_shallow.pl",
    geode_object_type: "EdgedCurve3D",
  },
  {
    filename: "PVC_d10_east_shallow.pl",
    geode_object_type: "EdgedCurve3D",
  },
  {
    filename: "PVC_d10_west_shallow.pl",
    geode_object_type: "EdgedCurve3D",
  },
  {
    filename: "PVCwater_d10_shallow.pl",
    geode_object_type: "EdgedCurve3D",
  },
  {
    filename: "Base_cut.ts",
    geode_object_type: "TriangulatedSurface3D",
  },
  {
    filename: "Main_fault_plane.ts",
    geode_object_type: "TriangulatedSurface3D",
  },
  {
    filename: "Reservoir_limit_plane.ts",
    geode_object_type: "TriangulatedSurface3D",
  },
  {
    filename: "Top_clay.ts",
    geode_object_type: "TriangulatedSurface3D",
  },
  {
    filename: "Top_eastern_sand.ts",
    geode_object_type: "TriangulatedSurface3D",
    object_type: "mesh",
  },
  {
    filename: "Top_folded_limestone.ts",
    geode_object_type: "TriangulatedSurface3D",
  },
  {
    filename: "Topo_from_photogram.ts",
    geode_object_type: "TriangulatedSurface3D",
  },
  {
    filename: "Top_western_sand.ts",
    geode_object_type: "TriangulatedSurface3D",
  },
  {
    filename: "Top_western_trapp.ts",
    geode_object_type: "TriangulatedSurface3D",
  },
  {
    filename: "Top_eastern_trapp.ts",
    geode_object_type: "TriangulatedSurface3D",
  },
  {
    filename: "Vertical_contact_plane.ts",
    geode_object_type: "TriangulatedSurface3D",
  },
];

watch(
  () => [viewerStore.status, geodeStore.status],
  async ([viewerStatus, geodeStatus]) => {
    console.log("Status viewer changed:", viewerStatus);
    console.log("Status geode changed:", geodeStatus);

    console.log("Status", Status);
    if (viewerStatus === Status.CONNECTED && geodeStatus === Status.CONNECTED) {
      const start = Date.now();
      await importWorkflow(dataList);
      console.log("importWorkflow duration :", (Date.now() - start) / MS_TO_SECONDS, "s");
      hybridViewerStore.resetCamera();
    }
  },
  { immediate: true },
);

const { width: elWidth, height: elHeight } = useElementSize(cardContainer);

watch([elWidth, elHeight], ([width, height]) => {
  containerWidth.value = width;
  containerHeight.value = height;
});

async function handleTreeMenu({ event, itemId, context_type, modelId, modelComponentType }) {
  const rect = cardContainer.value.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const yUI = event.clientY - rect.top;

  let meta_data;
  if (context_type === "model_component") {
    meta_data = {
      viewer_type: "model_component",
      geode_object_type: "component",
      modelId,
      pickedComponentId: itemId,
    };
  } else if (context_type === "model_component_type") {
    meta_data = {
      viewer_type: "model_component_type",
      geode_object_type: "type",
      modelId,
      modelComponentType: modelComponentType,
    };
  } else {
    meta_data = await dataStore.item(itemId);
  }

  menuStore.openMenu(
    modelId,
    x,
    yUI,
    containerWidth.value,
    containerHeight.value,
    rect.top,
    rect.left,
    meta_data,
  );
}

async function openMenu(event) {
  const rect = cardContainer.value.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const yPicking = containerHeight.value - (event.clientY - rect.top);
  const yUI = event.clientY - rect.top;

  const { id: pickedId, viewer_id } = await viewerUI.value.get_viewer_id(x, yPicking);
  if (!pickedId) {
    return;
  }
  const item = await dataStore.item(pickedId);

  if (item.viewer_type === "model" && viewer_id !== undefined) {
    const component = await dataStore.getComponentByViewerId(pickedId, viewer_id);
    if (component) {
      item.pickedComponentId = component.geode_id;
    }
  }

  menuStore.openMenu(
    pickedId,
    x,
    yUI,
    containerWidth.value,
    containerHeight.value,
    rect.top,
    rect.left,
    item,
  );
}
</script>

<template>
  <Launcher v-if="infraStore.status != Status.CREATED" />
  <Partners v-if="infraStore.status != Status.CREATED" />
  <v-card
    v-else
    ref="cardContainer"
    style="width: 100%; height: calc(100vh - 145px); border-radius: 15px"
    @contextmenu.prevent="openMenu"
  >
    <HybridRenderingView>
      <template #ui>
        <ViewerUI
          ref="viewerUI"
          :display-menu="display_menu"
          :container-width="containerWidth"
          :container-height="containerHeight"
          @show-menu="handleTreeMenu"
        />
      </template>
    </HybridRenderingView>
  </v-card>
</template>
