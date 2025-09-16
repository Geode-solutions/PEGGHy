<template>
  <Launcher v-if="infra_store.status != Status.CREATED" />
  <v-card
    v-else
    ref="cardContainer"
    style="width: 100%; height: calc(100vh - 145px); border-radius: 15px"
    @click.right="openMenu"
  >
    <HybridRenderingView>
      <template #ui>
        <ViewerTreeObjectTree />
        <ViewerContextMenu
          v-if="display_menu"
          :id="menuStore.current_id || id"
          :x="menuStore.menuX"
          :y="menuStore.menuY"
          :containerWidth="containerWidth"
          :containerHeight="containerHeight"
        />
      </template>
    </HybridRenderingView>
  </v-card>
</template>

<script setup>
import viewer_schemas from "@geode/opengeodeweb-viewer/opengeodeweb_viewer_schemas.json";
import back_schemas from "@geode/opengeodeweb-back/opengeodeweb_back_schemas.json";
import Status from "@ogw_f/utils/status.js";

const infra_store = useInfraStore();
const viewer_store = useViewerStore();
const geode_store = useGeodeStore();
const menuStore = useMenuStore();
const dataStyleStore = useDataStyleStore();
const dataBaseStore = useDataBaseStore();

const menuX = ref(0);
const menuY = ref(0);
const containerWidth = ref(0);
const containerHeight = ref(0);
const id = ref("");
const cardContainer = useTemplateRef("cardContainer");
const { display_menu } = storeToRefs(menuStore);

const dataList = [
  { file_name: "barrel.pl", geode_object: "EdgedCurve3D", object_type: "mesh" },
  {
    file_name: "block_central.pl",
    geode_object: "EdgedCurve3D",
    object_type: "mesh",
  },
  {
    file_name: "block_east.pl",
    geode_object: "EdgedCurve3D",
    object_type: "mesh",
  },
  {
    file_name: "block_west.pl",
    geode_object: "EdgedCurve3D",
    object_type: "mesh",
  },
  {
    file_name: "metal_d5_east_shallow.pl",
    geode_object: "EdgedCurve3D",
    object_type: "mesh",
  },
  {
    file_name: "metal_d5_west_shallow.pl",
    geode_object: "EdgedCurve3D",
    object_type: "mesh",
  },
  {
    file_name: "metal_d10_east_shallow.pl",
    geode_object: "EdgedCurve3D",
    object_type: "mesh",
  },
  {
    file_name: "metal_d10_west_deep.pl",
    geode_object: "EdgedCurve3D",
    object_type: "mesh",
  },
  {
    file_name: "metal_d10_west_shallow.pl",
    geode_object: "EdgedCurve3D",
    object_type: "mesh",
  },
  {
    file_name: "PVC_d10_east_shallow.pl",
    geode_object: "EdgedCurve3D",
    object_type: "mesh",
  },
  {
    file_name: "PVC_d10_west_shallow.pl",
    geode_object: "EdgedCurve3D",
    object_type: "mesh",
  },
  {
    file_name: "PVCwater_d10_shallow.pl",
    geode_object: "EdgedCurve3D",
    object_type: "mesh",
  },
  {
    file_name: "Base_cut.ts",
    geode_object: "TriangulatedSurface3D",
    object_type: "mesh",
  },
  {
    file_name: "Main_fault_plane.ts",
    geode_object: "TriangulatedSurface3D",
    object_type: "mesh",
  },
  {
    file_name: "Reservoir_limit_plane.ts",
    geode_object: "TriangulatedSurface3D",
    object_type: "mesh",
  },
  {
    file_name: "Top_clay.ts",
    geode_object: "TriangulatedSurface3D",
    object_type: "mesh",
  },
  {
    file_name: "Top_eastern_sand.ts",
    geode_object: "TriangulatedSurface3D",
    object_type: "mesh",
  },
  {
    file_name: "Top_folded_limestone.ts",
    geode_object: "TriangulatedSurface3D",
    object_type: "mesh",
  },
  {
    file_name: "Topo_from_photogram.ts",
    geode_object: "TriangulatedSurface3D",
    object_type: "mesh",
  },
  {
    file_name: "Top_western_sand.ts",
    geode_object: "TriangulatedSurface3D",
    object_type: "mesh",
  },
  {
    file_name: "Top_western_trapp.ts",
    geode_object: "TriangulatedSurface3D",
    object_type: "mesh",
  },
  {
    file_name: "Top_eastern_trapp.ts",
    geode_object: "TriangulatedSurface3D",
    object_type: "mesh",
  },
  {
    file_name: "Vertical_contact_plane.ts",
    geode_object: "TriangulatedSurface3D",
    object_type: "mesh",
  },
];

async function saveAllViewables() {
  const savePromises = dataList.map((file) => {
    return api_fetch({
      schema: back_schemas.opengeodeweb_back.save_viewable_file,
      params: {
        input_geode_object: file.geode_object,
        filename: file.file_name,
      },
    });
  });
  const responses = await Promise.all(savePromises);
  return responses;
}

async function registerAllObjects(responses) {
  console.log("viewer_store.status", viewer_store.status);
  console.log("responses pour registration", responses);
  const registerPromises = responses.map((response, index) => {
    console.log("response.data.value.id", response.data.value.id);
    console.log("index", index);
    const id = response.data.value.id;
    const schema = viewer_schemas.opengeodeweb_viewer.generic.register;
    return viewer_call({
      schema: schema,
      params: {
        id,
        file_name: response.data.value.viewable_file_name,
        viewer_object: dataList[index].object_type,
      },
    });
  });
  await Promise.all(registerPromises);
}

async function addAllItems(responses) {
  responses.forEach((response, index) => {
    console.log("response", response);
    console.log("index", index);

    const file = dataList[index];
    dataBaseStore.addItem(response.data.value.id, {
      object_type: file.object_type,
      geode_object: file.geode_object,
      native_filename: file.file_name,
      viewable_filename: file.file_name,
      displayed_name: response.data.value.name,
      vtk_js: {
        binary_light_viewable: response.data.value.binary_light_viewable,
      },
    });
  });
  console.log("dataBaseStore.db", dataBaseStore.db);
}

async function loaddataList() {
  const responses = await saveAllViewables();
  console.log("responses", responses);
  await registerAllObjects(responses);
  await addAllItems(responses);
}

watch(
  () => [viewer_store.status, geode_store.status],
  async ([viewerStatus, geodeStatus]) => {
    console.log("Status viewer changed:", viewerStatus);
    console.log("Status geode changed:", geodeStatus);

    console.log("Status", Status);
    if (viewerStatus === Status.CONNECTED && geodeStatus === Status.CONNECTED) {
      console.log("loaddataList");
      await loaddataList();
    }
  },
  { immediate: true }
);

function resize() {
  if (cardContainer.value) {
    const { width, height } = useElementSize(cardContainer.value);
    containerWidth.value = width.value;
    containerHeight.value = height.value;
  }
}
watch(
  () => viewer_store.status,
  (value) => {
    if (value === Status.CONNECTED) {
      resize();
    }
  }
);

onMounted(async () => {
  if (viewer_store.status === Status.CONNECTED) {
    resize();
  }
});

async function get_viewer_id(x, y) {
  const ids = dataStyleStore.selectedObjects;
  await viewer_call(
    {
      schema: viewer_schemas.opengeodeweb_viewer.viewer.picked_ids,
      params: { x, y, ids },
    },
    {
      response_function: (response) => {
        const array_ids = response.array_ids;
        id.value = array_ids[0];
      },
    }
  );
}

async function openMenu(event) {
  event.preventDefault();
  menuX.value = event.clientX;
  menuY.value = event.clientY;

  await get_viewer_id(event.offsetX, event.offsetY);
  menuStore.openMenu(
    id.value,
    event.clientX,
    event.clientY,
    containerWidth.value,
    containerHeight.value
  );
}
</script>
