<template>
  <Launcher v-if="infra_store.status != Status.CREATED" />
  <Partners v-else />
</template>

<script setup>
import Status from "@ogw_f/utils/status.js";

const infra_store = useInfraStore();
</script>

<style>
html {
  overflow-y: auto;
}
</style>
