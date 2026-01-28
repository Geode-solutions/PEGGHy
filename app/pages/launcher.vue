<script setup>
  import Launcher from "@ogw_front/components/Launcher"
  import Partners from "@pegghy/components/Partners"
  import Status from "@ogw_front/utils/status"
  import { useInfraStore } from "@ogw_front/stores/infra"

  const infraStore = useInfraStore()
</script>

<template>
  <Launcher v-if="infraStore.status != Status.CREATED" />
  <Partners v-else />
</template>

<style>
  html {
    overflow-y: auto;
  }
</style>
