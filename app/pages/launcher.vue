<script setup>
  import Status from "@ogw_f/utils/status.js"

  const infra_store = useInfraStore()
</script>

<template>
  <Launcher v-if="infra_store.status != Status.CREATED" />
  <Partners v-else />
</template>

<style>
  html {
    overflow-y: auto;
  }
</style>
