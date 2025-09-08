<template>
  <v-container fluid class="fill-height">
    <Launcher v-if="infra_store.status !== Status.CREATED" />
    <v-row
      v-else
      no-gutters
      justify="center"
      align="center"
      class="fill-height"
    >
      <v-col md="12" lg="12" class="d-flex justify-center align-center">
        <v-card
          ref="cardContainer"
          class="rounded-lg d-flex flex-column"
          style="width: 100%; max-height: 100%"
          flat
        >
          <v-card-text class="pa-0 flex-grow-1 d-flex flex-column">
            <HybridRenderingView
              height="calc(100vh - 160px)"
              @click="openMenu"
            />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import viewer_schemas from "@geode/opengeodeweb-viewer/opengeodeweb_viewer_schemas.json";
import Status from "@ogw_f/utils/status.js";

const infra_store = useInfraStore();
const viewer_store = useViewerStore();
const menuStore = useMenuStore();
const dataStyleStore = useDataStyleStore();
const cardContainer = useTemplateRef("cardContainer");
const { display_menu } = storeToRefs(menuStore);

const menuX = ref(0);
const menuY = ref(0);
const containerWidth = ref(0);
const containerHeight = ref(0);
const id = ref("");

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

function resize() {
  if (cardContainer.value) {
    const { width, height } = useElementSize(cardContainer);
    containerWidth.value = width.value;
    containerHeight.value = height.value;
    useHybridViewerStore().resize(width.value, height.value);
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

onUnmounted(() => {
  console.log("Index page unmounted");
});

onErrorCaptured((error, instance, info) => {
  console.error("Error captured in index.vue:", error, info);
  return false;
});
</script>

<style scoped>
.v-card {
  max-width: 100%;
}
</style>
