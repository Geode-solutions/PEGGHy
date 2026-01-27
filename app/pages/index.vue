<script setup>
  import viewer_schemas from "@geode/opengeodeweb-viewer/opengeodeweb_viewer_schemas.json"
  import { importWorkflow } from "@geode/opengeodeweb-front/utils/file_import_workflow"
  import Status from "@ogw_f/utils/status.js"

  const query = useRoute().query
  if (query.geode_port) {
    console.log(
      "Modifying geode port from query parameters to",
      query.geode_port,
    )
    const geodeStore = useGeodeStore()
    geodeStore.$patch({ default_local_port: query.geode_port })
  }
  if (query.viewer_port) {
    console.log(
      "Modifying viewer port from query parameters to",
      query.viewer_port,
    )
    const viewerStore = useViewerStore()
    viewerStore.$patch({ default_local_port: query.viewer_port })
  }

  const infra_store = useInfraStore()
  const viewer_store = useViewerStore()
  const geode_store = useGeodeStore()
  const menuStore = useMenuStore()
  const dataStyleStore = useDataStyleStore()
  const hybridViewerStore = useHybridViewerStore()

  const menuX = ref(0)
  const menuY = ref(0)
  const containerWidth = ref(0)
  const containerHeight = ref(0)
  const id = ref("")
  const cardContainer = useTemplateRef("cardContainer")
  const { display_menu } = storeToRefs(menuStore)

  const dataList = [
    { filename: "barrel.pl", geode_object: "EdgedCurve3D" },
    {
      filename: "block_central.pl",
      geode_object: "EdgedCurve3D",
    },
    {
      filename: "block_east.pl",
      geode_object: "EdgedCurve3D",
    },
    {
      filename: "block_west.pl",
      geode_object: "EdgedCurve3D",
    },
    {
      filename: "metal_d5_east_shallow.pl",
      geode_object: "EdgedCurve3D",
      object_type: "mesh",
    },
    {
      filename: "metal_d5_west_shallow.pl",
      geode_object: "EdgedCurve3D",
    },
    {
      filename: "metal_d10_east_shallow.pl",
      geode_object: "EdgedCurve3D",
    },
    {
      filename: "metal_d10_west_deep.pl",
      geode_object: "EdgedCurve3D",
    },
    {
      filename: "metal_d10_west_shallow.pl",
      geode_object: "EdgedCurve3D",
    },
    {
      filename: "PVC_d10_east_shallow.pl",
      geode_object: "EdgedCurve3D",
    },
    {
      filename: "PVC_d10_west_shallow.pl",
      geode_object: "EdgedCurve3D",
    },
    {
      filename: "PVCwater_d10_shallow.pl",
      geode_object: "EdgedCurve3D",
    },
    {
      filename: "Base_cut.ts",
      geode_object: "TriangulatedSurface3D",
    },
    {
      filename: "Main_fault_plane.ts",
      geode_object: "TriangulatedSurface3D",
    },
    {
      filename: "Reservoir_limit_plane.ts",
      geode_object: "TriangulatedSurface3D",
    },
    {
      filename: "Top_clay.ts",
      geode_object: "TriangulatedSurface3D",
    },
    {
      filename: "Top_eastern_sand.ts",
      geode_object: "TriangulatedSurface3D",
      object_type: "mesh",
    },
    {
      filename: "Top_folded_limestone.ts",
      geode_object: "TriangulatedSurface3D",
    },
    {
      filename: "Topo_from_photogram.ts",
      geode_object: "TriangulatedSurface3D",
    },
    {
      filename: "Top_western_sand.ts",
      geode_object: "TriangulatedSurface3D",
    },
    {
      filename: "Top_western_trapp.ts",
      geode_object: "TriangulatedSurface3D",
    },
    {
      filename: "Top_eastern_trapp.ts",
      geode_object: "TriangulatedSurface3D",
    },
    {
      filename: "Vertical_contact_plane.ts",
      geode_object: "TriangulatedSurface3D",
    },
  ]

  watch(
    () => [viewer_store.status, geode_store.status],
    ([viewerStatus, geodeStatus]) => {
      console.log("Status viewer changed:", viewerStatus)
      console.log("Status geode changed:", geodeStatus)

      console.log("Status", Status)
      if (
        viewerStatus === Status.CONNECTED &&
        geodeStatus === Status.CONNECTED
      ) {
        console.log("loaddataList")
        importWorkflow(dataList).then(() => hybridViewerStore.remoteRender())
      }
    },
    { immediate: true },
  )

  function resize() {
    if (cardContainer.value) {
      const { width, height } = useElementSize(cardContainer.value)
      containerWidth.value = width.value
      containerHeight.value = height.value
    }
  }
  watch(
    () => viewer_store.status,
    (value) => {
      if (value === Status.CONNECTED) {
        resize()
      }
    },
  )

  onMounted(async () => {
    if (viewer_store.status === Status.CONNECTED) {
      resize()
    }
  })

  async function get_viewer_id(x, y) {
    const ids = dataStyleStore.selectedObjects
    await viewer_call(
      {
        schema: viewer_schemas.opengeodeweb_viewer.viewer.picked_ids,
        params: { x, y, ids },
      },
      {
        response_function: (response) => {
          const array_ids = response.array_ids
          id.value = array_ids[0]
        },
      },
    )
  }

  async function openMenu(event) {
    event.preventDefault()
    menuX.value = event.clientX
    menuY.value = event.clientY

    await get_viewer_id(event.offsetX, event.offsetY)
    menuStore.openMenu(
      id.value,
      event.clientX,
      event.clientY,
      containerWidth.value,
      containerHeight.value,
    )
  }
</script>

<template>
  <Launcher v-if="infra_store.status != Status.CREATED" />
  <Partners v-if="infra_store.status != Status.CREATED" />
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
