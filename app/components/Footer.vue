<script setup lang="ts">
import logoGeode from "@/assets/img/geode.png";
</script>

<template>
  <v-footer app fixed flat height="75" color="transparent" :elevation="0" z-index="3">
    <v-row class="pa-1 align-center justify-end">
      <div class="powered-by d-flex align-center mr-8">
        <span class="text-h6 text-white">Powered by</span>
        <img :src="logoGeode" alt="Geode Solutions" height="40" draggable="false" />
      </div>
    </v-row>
  </v-footer>
</template>

<style scoped>
.powered-by {
  gap: 8px;
}
</style>
