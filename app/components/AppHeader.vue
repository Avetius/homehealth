<template>
  <div>
    <v-app-bar flat height="64" :style="{ backgroundColor: '#b3e5fc' }">
      <v-app-bar-nav-icon class="d-md-none" @click="drawer = !drawer" />
      <v-toolbar-title class="ms-2">HomeHealth</v-toolbar-title>

      <div class="d-none d-md-flex ms-4">
        <v-btn text to="/">Home</v-btn>
        <v-btn text to="/about">About</v-btn>
  <v-btn text to="/contact">Contact</v-btn>
  <v-btn text to="/upload">Upload</v-btn>
        <v-btn text to="/patients">Patients</v-btn>
        <v-btn text to="/visits">Visits</v-btn>
        <v-btn text to="/reports">Reports</v-btn>
      </div>

      <v-spacer />

      <v-btn icon>
        <v-icon>mdi-bell</v-icon>
      </v-btn>

      <v-avatar size="32" class="ms-2">
        <img src="/favicon.ico" alt="avatar" />
      </v-avatar>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" temporary class="d-md-none" :style="{ backgroundColor: '#b3e5fc' }">
      <v-list>
        <v-list-item to="/">
          <v-list-item-title>Home</v-list-item-title>
        </v-list-item>
        <v-list-item to="/patients">
          <v-list-item-title>Patients</v-list-item-title>
        </v-list-item>
        <v-list-item to="/visits">
          <v-list-item-title>Visits</v-list-item-title>
        </v-list-item>
        <v-list-item to="/reports">
          <v-list-item-title>Reports</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const drawer = ref(false)
</script>
