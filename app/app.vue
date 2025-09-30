<template>
  <v-app>
    <!-- Toolbar at the top of the screen -->
    <v-app-bar color="primary" height="48">
      <!-- Title of the application with adjusted margin and font size -->
      <v-app-bar-title class="text-h6 ms-3">
        <v-icon icon="mdi-apps"></v-icon>

        <span class="ms-1">My Application</span>
      </v-app-bar-title>
    </v-app-bar>

    <!-- Main content of the application -->
    <v-main>
      <NuxtPage />
    </v-main>
  </v-app>
</template>