<template>
  <div style="border:2px dashed #777; padding:12px;">
    <div style="background:#ffd7d7;padding:8px;text-align:center;font-weight:700;">PAGE: index.vue rendered (debug)</div>
    <v-container>
    <v-row>
      <v-col cols="12" md="8" class="mx-auto">
        <v-card class="pa-4">
          <v-card-title>Welcome to HomeHealth</v-card-title>
          <v-card-text>
            This is a simple demo home page with a header and footer. Use the navigation above to explore.
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary">Get Started</v-btn>
            <v-btn outlined class="ms-2">Learn More</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
// No local Vuetify imports — use global plugin registrations so kebab-case tags resolve
</script>