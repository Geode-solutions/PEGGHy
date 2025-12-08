<template>
  <Launcher v-if="infraStore.status != Status.CREATED" />
  <Partners v-else />
</template>

<script setup>
  import Status from "@ogw_front/utils/status"
  import Launcher from "@ogw_front/components/Launcher.vue"
  import { useInfraStore } from "@ogw_front/stores/infra"
  import Partners from "@pegghy/components/Partners.vue"

  const infraStore = useInfraStore()
</script>

<style>
  html {
    overflow-y: auto;
  }
</style>
