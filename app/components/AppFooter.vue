<template>
  <v-footer app padless :style="{ backgroundColor: '#f8fafc', borderTop: '1px solid #e6eef6' }">
    <v-container class="pa-4">
      <v-row>
        <v-col cols="12" md="6">
          <h3>Contact</h3>
          <div>123 Care Lane</div>
          <div>Anytown, USA</div>
          <div>Email: <a href="mailto:info@homehealth.example">info@homehealth.example</a></div>
          <div>Phone: <a href="tel:+15551234567">+1 (555) 123-4567</a></div>
        </v-col>

        <v-col cols="12" md="6" class="text-md-end">
          <h3>Follow us</h3>
          <v-btn icon href="https://twitter.com" target="_blank">
            <v-icon>mdi-twitter</v-icon>
          </v-btn>
          <v-btn icon href="https://facebook.com" target="_blank">
            <v-icon>mdi-facebook</v-icon>
          </v-btn>
          <v-btn icon href="https://linkedin.com" target="_blank">
            <v-icon>mdi-linkedin</v-icon>
          </v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" class="text-center mt-4">
          © {{ new Date().getFullYear() }} HomeHealth — All Rights Reserved
        </v-col>
      </v-row>
    </v-container>
  </v-footer>
</template>

<script setup lang="ts">
// relying on global Vuetify plugin for components
</script>
