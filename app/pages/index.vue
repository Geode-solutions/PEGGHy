<script setup>
  import Status from "@ogw_front/utils/status"
  import { importWorkflow } from "@ogw_front/utils/file_import_workflow"
  import viewer_schemas from "@geode/opengeodeweb-viewer/opengeodeweb_viewer_schemas.json"

  import HybridRenderingView from "@ogw_front/components/HybridRenderingView"
  import Launcher from "@ogw_front/components/Launcher"
  import ViewerContextMenu from "@ogw_front/components/Viewer/ContextMenu"
  import ViewerTreeObjectTree from "@ogw_front/components/Viewer/Tree/ObjectTree"

  import { useDataStyleStore } from "@ogw_front/stores/data_style"
  import { useDataStore } from "@ogw_front/stores/data"
  import { useGeodeStore } from "@ogw_front/stores/geode"
  import { useHybridViewerStore } from "@ogw_front/stores/hybrid_viewer"
  import { useInfraStore } from "@ogw_front/stores/infra"
  import { useMenuStore } from "@ogw_front/stores/menu"
  import { useViewerStore } from "@ogw_front/stores/viewer"

  import Partners from "@pegghy/components/Partners"

  const MS_TO_SECONDS = 1000

  const infraStore = useInfraStore()
  const viewerStore = useViewerStore()
  const geodeStore = useGeodeStore()
  const menuStore = useMenuStore()
  const dataStore = useDataStore()
  const dataStyleStore = useDataStyleStore()
  const hybridViewerStore = useHybridViewerStore()

  const { query } = useRoute()
  if (query.geode_port) {
    console.log(
      "Modifying geode port from query parameters to",
      query.geode_port,
    )
    geodeStore.$patch({ default_local_port: query.geode_port })
  }
  if (query.viewer_port) {
    console.log(
      "Modifying viewer port from query parameters to",
      query.viewer_port,
    )
    viewerStore.$patch({ default_local_port: query.viewer_port })
  }

  const menuX = ref(0)
  const menuY = ref(0)
  const containerWidth = ref(0)
  const containerHeight = ref(0)
  const id = ref("")
  const cardContainer = useTemplateRef("cardContainer")
  const { display_menu } = storeToRefs(menuStore)

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
  ]

  watch(
    () => [viewerStore.status, geodeStore.status],
    async ([viewerStatus, geodeStatus]) => {
      console.log("Status viewer changed:", viewerStatus)
      console.log("Status geode changed:", geodeStatus)

      console.log("Status", Status)
      if (
        viewerStatus === Status.CONNECTED &&
        geodeStatus === Status.CONNECTED
      ) {
        const start = Date.now()
        // try {
        await importWorkflow(dataList)
        console.log(
          "importWorkflow duration :",
          (Date.now() - start) / MS_TO_SECONDS,
          "s",
        )
        hybridViewerStore.syncRemoteCamera()
        // } catch (error) {
        //   console.error("Error during importWorkflow:", error)
        // }
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
    () => viewerStore.status,
    (value) => {
      if (value === Status.CONNECTED) {
        resize()
      }
    },
  )

  onMounted(() => {
    if (viewerStore.status === Status.CONNECTED) {
      resize()
    }
  })

  async function get_viewer_id(x, y) {
    const ids = Object.keys(dataStyleStore.styles)
    await viewerStore.request(
      viewer_schemas.opengeodeweb_viewer.viewer.picked_ids,
      { x, y, ids },
      {
        response_function: (response) => {
          const array_ids = response.array_ids
          id.value = array_ids[0]
        },
      },
    )
  }

  async function handleTreeMenu({ event, itemId }) {
    const rect = cardContainer.value.$el.getBoundingClientRect()
    const x = event.clientX - rect.left
    const yUI = event.clientY - rect.top

    const item = dataStore.getItem(itemId)

    menuStore.openMenu(
      itemId,
      x,
      yUI,
      containerWidth.value,
      containerHeight.value,
      rect.top,
      rect.left,
      item.value,
    )
  }

  async function openMenu(event) {
    const rect = cardContainer.value.$el.getBoundingClientRect()
    const x = event.clientX - rect.left
    const yPicking = containerHeight.value - (event.clientY - rect.top)
    const yUI = event.clientY - rect.top

    await get_viewer_id(x, yPicking)
    const item = dataStore.getItem(id.value)

    menuStore.openMenu(
      id.value,
      x,
      yUI,
      containerWidth.value,
      containerHeight.value,
      rect.top,
      rect.left,
      item.value,
    )
  }
</script>

<template>
  <Launcher v-if="infraStore.status != Status.CREATED" />
  <Partners v-if="infraStore.status != Status.CREATED" />
  <v-card
    v-else
    ref="cardContainer"
    style="width: 100%; height: calc(100vh - 145px); border-radius: 15px"
    @click.right="openMenu"
  >
    <HybridRenderingView>
      <template #ui>
        <ViewerTreeObjectTree @show-menu="handleTreeMenu" />
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
