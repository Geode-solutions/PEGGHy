<script setup lang="ts">
import FeedBackSnackers from "@ogw_front/components/FeedBack/Snackers";
import FeedbackErrorBanner from "@ogw_front/components/FeedBack/ErrorBanner";
import Launcher from "@ogw_front/components/Launcher";
import { Status } from "@ogw_front/utils/status";
import { appMode } from "@ogw_shared/app_mode";
import { useInfraStore } from "@ogw_front/stores/infra";

import Footer from "@pegghy/components/Footer";
import TopBar from "@pegghy/components/TopBar";
import logoPegghy from "@pegghy/assets/img/pegghy.png";

import schemas, { type ServerlessCloudTokenResponse } from "pegghy/pegghy_typed_schemas.js";

const infraStore = useInfraStore();

// Token sent to the Cloud API on launch; it expires after an hour, reloading the page gets a new one
const authToken = ref<string>();

onMounted(async () => {
  if (infraStore.app_mode !== appMode.CLOUD) {
    return;
  }
  const { token } = await $fetch<ServerlessCloudTokenResponse>(
    `/${schemas.api.serverless.cloud_token.$id}`,
  );
  authToken.value = token;
});
</script>

<template>
  <v-app>
    <TopBar />
    <v-main class="custom-background">
      <Launcher
        v-if="infraStore.status != Status.CREATED"
        app-name="PEGGHy"
        :auth-token="authToken"
        :logo="logoPegghy"
        :is-user-authenticated="authToken !== undefined"
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
