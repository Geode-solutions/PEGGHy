<template>
  <Launcher v-if="infraStore.status != Status.CREATED" />
  <Partners v-else />
</template>

<script setup>
  import Status from "@ogw_f/utils/status.js"
  import Launcher from "@ogw_f/components/Launcher.vue"

  import Partners from "@pegghy/components/Partners.vue"

  const infraStore = useInfraStore()
</script>

<style>
  html {
    overflow-y: auto;
  }
</style>
