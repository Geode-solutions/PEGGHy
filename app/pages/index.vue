<script setup lang="ts">
import { Status } from "@ogw_front/utils/status";
import { importWorkflow } from "@ogw_front/utils/import_workflow";

import HybridRenderingView from "@ogw_front/components/HybridRenderingView";
import ViewerUI from "@ogw_front/components/Viewer/Ui";

import { useBackStore } from "@ogw_front/stores/back";
import { useDataStore } from "@ogw_front/stores/data";
import { useDataStyleStore } from "@ogw_front/stores/data_style";
import { useHybridViewerStore } from "@ogw_front/stores/hybrid_viewer";
import { useInfraStore } from "@ogw_front/stores/infra";
import { useMenuStore } from "@ogw_front/stores/menu";
import { useViewerContextMenu } from "@ogw_front/composables/viewer_context_menu";
import { useViewerStore } from "@ogw_front/stores/viewer";

import {
  DATA_COLORS,
  applyInitialCamera,
  getHasImportedData,
  hexToRgba,
  setHasImportedData,
} from "@pegghy/utils/data_settings";
import Partners from "@pegghy/components/Partners";
import pegghyLogo from "@pegghy/assets/img/pegghy.png";

const MS_TO_SECONDS = 1000;

const infraStore = useInfraStore();
const viewerStore = useViewerStore();
const backStore = useBackStore();
const menuStore = useMenuStore();
const dataStore = useDataStore();
const dataStyleStore = useDataStyleStore();
const hybridViewerStore = useHybridViewerStore();

const cardContainer = useTemplateRef("cardContainer");
const viewerUI = useTemplateRef("viewerUI");
const { display_menu } = storeToRefs(menuStore);
const { containerWidth, containerHeight, openTreeMenu, openViewerMenu } = useViewerContextMenu(
  cardContainer,
  viewerUI,
);

const isDataLoading = ref(!getHasImportedData());
const loadedCount = ref(0);
const totalDataCount = ref(0);

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
  () => [viewerStore.status, backStore.status],
  async ([viewerStatus, backStatus]) => {
    if (
      viewerStatus === Status.CONNECTED &&
      backStatus === Status.CONNECTED &&
      !getHasImportedData()
    ) {
      setHasImportedData(true);
      isDataLoading.value = true;
      totalDataCount.value = dataList.length;
      try {
        const itemIds = await importWorkflow(dataList, (loaded, total) => {
          loadedCount.value = loaded;
          totalDataCount.value = total;
        });

        const stylePromises = itemIds.map(async (id) => {
          try {
            const item = await dataStore.item(id);
            if (!item) {
              return;
            }

            const colorHex = DATA_COLORS[item.name];
            if (colorHex) {
              await dataStyleStore.setMeshPolygonsColor(item.id, hexToRgba(colorHex));
            }

            if (item.geode_object_type === "EdgedCurve3D") {
              await dataStyleStore.setMeshPointsVisibility(item.id, false);
            }
          } catch {
            // Ignore styling errors for individual items
          }
        });
        await Promise.all(stylePromises);

        applyInitialCamera(hybridViewerStore);
        await hybridViewerStore.remoteRender();
      } finally {
        isDataLoading.value = false;
      }
    }
  },
  { immediate: true },
);
</script>

<template>
  <Partners v-if="infraStore.status != Status.CREATED" />
  <div
    v-else
    ref="cardContainer"
    data-testid="viewerCard"
    style="
      width: 100%;
      height: calc(100vh - 150px);
      border-radius: 15px;
      overflow: hidden;
      position: relative;
      isolation: isolate;
    "
    @contextmenu.prevent="openViewerMenu"
  >
    <div
      v-if="isDataLoading"
      data-testid="dataLoadingOverlay"
      class="d-flex flex-column align-center justify-center fill-height w-100"
      style="
        position: absolute;
        inset: 0;
        z-index: 10;
        background: rgba(30, 30, 30, 0.7);
        backdrop-filter: blur(8px);
        border-radius: 15px;
        pointer-events: auto;
      "
    >
      <v-img :src="pegghyLogo" max-width="80" max-height="80" class="mb-4" contain />
      <v-progress-circular indeterminate color="primary" size="56" width="4" class="mb-4" />
      <div class="text-subtitle-1 font-weight-bold text-white mb-1">Loading data ...</div>
      <div class="text-caption text-grey-lighten-1">{{ loadedCount }} / {{ totalDataCount }}</div>
    </div>

    <HybridRenderingView>
      <template #ui>
        <ViewerUI
          ref="viewerUI"
          :display-menu="display_menu"
          :container-width="containerWidth"
          :container-height="containerHeight"
          @show-menu="openTreeMenu"
        />
      </template>
    </HybridRenderingView>
  </div>
</template>
