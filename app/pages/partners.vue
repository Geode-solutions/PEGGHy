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

<script setup>
import Partners from "@pegghy/components/Partners.vue"
onUnmounted(() => {
  console.log("Partners page unmounted")
})
</script>
