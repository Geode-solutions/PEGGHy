<template>
  <Launcher v-if="infra_store.status != Status.CREATED" />
  <Sponsors />
</template>

<script setup>
const infra_store = use_infra_store();
</script>

<style>
html {
  overflow-y: auto;
}
</style>
