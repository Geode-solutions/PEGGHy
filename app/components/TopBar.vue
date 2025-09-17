<template>
  <v-app-bar
    :key="$route.path"
    flat
    color="transparent"
    height="75"
    :elevation="0"
    style="z-index: 100"
  >
    <v-row class="mr-8 ml-8 align-center">
      <v-img
        :src="logoPegghy"
        max-height="60"
        max-width="60"
        contain
        draggable="false"
      />
      <v-spacer />
      <v-tooltip>
        <template v-slot:activator="{ props: tooltipProps }">
          <v-btn
            v-bind="tooltipProps"
            style="border-radius: 20%"
            flat
            icon
            @click="navigate"
          >
            <v-icon
              class="icon-style pa-6"
              :icon="icon"
              color="white"
              size="40"
            />
          </v-btn>
        </template>
        <span>{{ isPartnersPage ? "Home" : "Partners" }}</span>
      </v-tooltip>
    </v-row>
  </v-app-bar>
</template>

<script setup>
import logoPegghy from "@/assets/img/pegghy.png";

const $route = useRoute();
const $router = useRouter();
const isPartnersPage = ref(false);

const icon = computed(() => {
  return $route.path === "/partners" ? "mdi-home" : "mdi-information-variant";
});

const updateRouteState = () => {
  isPartnersPage.value = $route.path === "/partners";
  console.log("Route:", $route.path, "isPartnersPage:", isPartnersPage.value);
};

onMounted(() => {
  updateRouteState();
  $router.afterEach(() => {
    updateRouteState();
  });
});

watch(
  () => $route.path,
  (newPath) => {
    console.log("Route changed to:", newPath);
    updateRouteState();
  },
  { immediate: true }
);

const navigate = () => {
  const path = isPartnersPage.value ? "/" : "/partners";
  console.log("Navigating to:", path);
  $router.push(path);
};
</script>

<style scoped></style>
