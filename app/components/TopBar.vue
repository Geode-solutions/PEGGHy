<template>
  <v-app-bar flat color="transparent" class="ma-0" height="70" :elevation="0">
    <v-row class="pa-1 ma-1 align-center">
      <v-img
        :src="logo"
        max-height="60"
        max-width="60"
        class="ml-8 mt-4 mr-0"
        contain
        draggable="false"
      />
      <v-spacer />
      <v-tooltip>
        <template v-slot:activator="{ props }">
          <v-btn
            v-bind="props"
            class="ml-2 mt-4 mr-8"
            style="border-radius: 20%"
            flat
            icon
            to="/"
          >
            <v-icon
              class="icon-style pa-6"
              icon="mdi-home"
              color="white"
              size="40"
            />
          </v-btn>
        </template>
        <span>Home</span>
      </v-tooltip>
    </v-row>
  </v-app-bar>
</template>

<script setup>
import logo from "@/assets/img/pegghy.png";
</script>
