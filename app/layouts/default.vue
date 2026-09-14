<script setup>
import FeedBackSnackers from "@ogw_front/components/FeedBack/Snackers";
import FeedbackErrorBanner from "@ogw_front/components/FeedBack/ErrorBanner";
import Launcher from "@ogw_front/components/Launcher";
import { Status } from "@ogw_front/utils/status";
import { useInfraStore } from "@ogw_front/stores/infra";

import Footer from "@pegghy/components/Footer";
import TopBar from "@pegghy/components/TopBar";
import logoPegghy from "@pegghy/assets/img/pegghy.png";

const infraStore = useInfraStore();
</script>

<template>
  <v-app>
    <TopBar />
    <v-main class="custom-background">
      <Launcher
        v-if="infraStore.status != Status.CREATED"
        app-name="PEGGHy"
        email="noreply@geode-solutions.com"
        :logo="logoPegghy"
        isUserAuthenticated="true"
      />
      <v-row class="fill-height py-0 px-2 my-0 mx-1">
        <v-col cols="12" class="py-0 px-1">
          <FeedbackErrorBanner style="border-radius: 15px" />
          <NuxtPage z-index="1" />
        </v-col>
      </v-row>
      <FeedBackSnackers />
    </v-main>
    <Footer />
  </v-app>
</template>
