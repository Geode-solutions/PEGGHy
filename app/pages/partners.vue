<script setup lang="ts">
import Partners from "@pegghy/components/Partners";
import { consola } from "consola";

onUnmounted(() => {
  consola.debug("Partners page unmounted");
});
</script>

<template>
  <v-container fluid class="ma-0 pa-0">
    <ClientOnly :key="$route.path">
      <Partners />
      <template #fallback>
        <v-progress-circular indeterminate />
      </template>
    </ClientOnly>
  </v-container>
</template>
