<template>
  <v-app>
    <TopBar />
    <v-main
      class="custom-background"
      style="padding-bottom: 70px; min-height: calc(100vh - 70px)"
    >
      <NuxtPage />
      <FeedBackSnackers />
    </v-main>
    <Footer />
  </v-app>
</template>
