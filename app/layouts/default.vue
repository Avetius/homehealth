<template>
  <div>
    <AppHeader />
    <v-main>
      <v-container class="pa-4">
        <NuxtPage />
      </v-container>
    </v-main>
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import AppHeader from '../components/AppHeader.vue'
import AppFooter from '../components/AppFooter.vue'

// relying on global Vuetify plugin for v-main and v-container
</script>
