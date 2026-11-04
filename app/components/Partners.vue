<script setup lang="ts">
import { images } from "@/assets/images";

const {
  andra,
  anteagroup,
  enerex,
  "fondation-geol": fondationgeol,
  geode,
  geolnancy,
  grandest,
  humens,
  idlorraine,
  imerys,
  loritz,
  otelo,
  sercel,
  slb,
  soletanche,
  totalenergies,
  udl,
} = images;

const designers = [{ logo: otelo }, { logo: udl }];
const cofounders = [{ logo: grandest }, { logo: geolnancy }, { logo: idlorraine }];
const patronage = [
  { logo: fondationgeol },
  { logo: soletanche },
  { logo: totalenergies },
  { logo: slb },
  { logo: imerys },
  { logo: anteagroup },
];
const partners = [
  { logo: geode },
  { logo: enerex },
  { logo: sercel },
  { logo: loritz },
  { logo: andra },
  { logo: humens },
];
</script>

<template>
  <v-container fluid class="pa-0 mt-10" style="min-height: 100vh">
    <v-row class="pa-6" align="stretch" justify="center" dense>
      <v-col cols="12" md="6">
        <v-card class="pa-4 mb-6 glass-card d-flex flex-column fill-height" flat>
          <v-card-title class="text-white text-h4 d-flex justify-center"> Designers </v-card-title>
          <v-spacer />
          <v-row class="justify-center" no-gutters>
            <v-col
              v-for="(item, i) in designers"
              :key="'d' + i"
              cols="4"
              sm="3"
              md="4"
              class="d-flex justify-center"
            >
              <v-img :src="item.logo" max-height="100" max-width="200" contain />
            </v-col>
          </v-row>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card class="pa-4 mb-6 glass-card d-flex flex-column fill-height" flat>
          <v-card-title class="text-white text-h4 d-flex justify-center">
            Co-founders
          </v-card-title>
          <v-spacer />
          <v-row justify="center">
            <v-col
              v-for="(item, i) in cofounders"
              :key="'c' + i"
              cols="4"
              sm="3"
              md="3"
              class="d-flex justify-center"
            >
              <v-img :src="item.logo" max-height="100" max-width="200" contain />
            </v-col>
          </v-row>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card class="pa-4 mb-6 glass-card d-flex flex-column fill-height" flat>
          <v-card-title class="text-white text-h4 d-flex justify-center"> Patronage </v-card-title>
          <v-spacer />
          <v-row justify="center">
            <v-col
              v-for="(item, i) in patronage"
              :key="'pa' + i"
              cols="4"
              sm="3"
              md="4"
              class="d-flex justify-center"
            >
              <v-img :src="item.logo" max-height="80" max-width="180" contain />
            </v-col>
          </v-row>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card class="pa-4 mb-6 glass-card d-flex flex-column fill-height" flat>
          <v-card-title class="text-white text-h4 d-flex justify-center"> Partners </v-card-title>
          <v-spacer />
          <v-row justify="center">
            <v-col
              v-for="(item, i) in partners"
              :key="'pa' + i"
              cols="4"
              sm="3"
              md="4"
              class="d-flex justify-center"
            >
              <v-img :src="item.logo" max-height="80" max-width="180" contain />
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.glass-card {
  background-color: rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}
</style>
