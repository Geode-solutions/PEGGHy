<template>
  <v-container fluid class="pa-0 mt-10" style="min-height: 100vh">
    <v-row class="pa-6" align="stretch" justify="center" dense>
      <v-col cols="12" md="6">
        <v-card
          class="pa-4 mb-6 glass-card d-flex flex-column fill-height"
          flat
        >
          <v-card-title class="text-white text-h4 d-flex justify-center">
            Designers
          </v-card-title>
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
              <v-img
                :src="item.logo"
                max-height="100"
                max-width="200"
                contain
              />
            </v-col>
          </v-row>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card
          class="pa-4 mb-6 glass-card d-flex flex-column fill-height"
          flat
        >
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
              <v-img
                :src="item.logo"
                max-height="100"
                max-width="200"
                contain
              />
            </v-col>
          </v-row>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card
          class="pa-4 mb-6 glass-card d-flex flex-column fill-height"
          flat
        >
          <v-card-title class="text-white text-h4 d-flex justify-center">
            Patronage
          </v-card-title>
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
        <v-card
          class="pa-4 mb-6 glass-card d-flex flex-column fill-height"
          flat
        >
          <v-card-title class="text-white text-h4 d-flex justify-center">
            Partners
          </v-card-title>
          <v-spacer />
          <v-row justify="center">
            <v-col
              v-for="(item, i) in partners"
              :key="'pt' + i"
              cols="4"
              sm="3"
              md="2"
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

<script setup>
import geode from "@/assets/img/geode.png";
import otelo from "@/assets/img/otelo.png";
import udl from "@/assets/img/udl.png";
import grandest from "@/assets/img/grandest.png";
import geolnancy from "@/assets/img/geolnancy.png";
import idlorraine from "@/assets/img/idlorraine.png";
import fondationgeol from "@/assets/img/fondation-geol.png";
import soletanche from "@/assets/img/soletanche.png";
import totalenergies from "@/assets/img/totalenergies.png";
import slb from "@/assets/img/slb.png";
import imerys from "@/assets/img/imerys.png";
import anteagroup from "@/assets/img/anteagroup.png";
import enerex from "@/assets/img/enerex.png";
import sercel from "@/assets/img/sercel.png";
import loritz from "@/assets/img/loritz.png";
import andra from "@/assets/img/andra.png";
import humens from "@/assets/img/humens.png";

const designers = [{ logo: geode }, { logo: otelo }, { logo: udl }];
const cofounders = [
  { logo: grandest },
  { logo: geolnancy },
  { logo: idlorraine },
];
const patronage = [
  { logo: fondationgeol },
  { logo: soletanche },
  { logo: totalenergies },
  { logo: slb },
  { logo: imerys },
  { logo: anteagroup },
];
const partners = [
  { logo: enerex },
  { logo: sercel },
  { logo: loritz },
  { logo: andra },
  { logo: humens },
];
</script>

<style scoped>
.glass-card {
  background-color: rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}
</style>
