<script setup>
  import FeedbackErrorBanner from "@ogw_front/components/FeedBack/ErrorBanner"
  import FeedBackSnackers from "@ogw_front/components/FeedBack/Snackers"

  import Footer from "@pegghy/components/Footer"
  import TopBar from "@pegghy/components/TopBar"
</script>

<template>
  <v-app>
    <TopBar />
    <v-main
      class="custom-background"
      style="padding-bottom: 70px; min-height: calc(100vh - 70px)"
    >
      <v-row class="fill-height pa-2 mr-1 ml-1">
        <v-col cols="12" class="pa-1">
          <FeedbackErrorBanner style="border-radius: 15px" />
          <NuxtPage style="z-index: 1" />
        </v-col>
      </v-row>
      <FeedBackSnackers />
    </v-main>
    <Footer />
  </v-app>
</template>
