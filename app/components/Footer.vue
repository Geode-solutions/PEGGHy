<script setup>
  import logoGeode from "@/assets/img/geode-no-text.png"
</script>

<template>
  <v-footer
    app
    fixed
    flat
    height="70"
    color="transparent"
    :elevation="0"
    style="z-index: 100"
  >
    <v-row class="pa-1 align-center justify-end">
      <span class="text-h6 mr-4 text-white">Powered by Geode-solutions</span>
      <v-img
        class="mr-8"
        :src="logoGeode"
        max-height="50"
        max-width="50"
        contain
        draggable="false"
      />
    </v-row>
  </v-footer>
</template>
