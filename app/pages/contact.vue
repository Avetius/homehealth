<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="8" class="mx-auto">
        <v-card class="pa-4">
          <v-card-title>Contact Us</v-card-title>
          <v-card-text>
            <p>If you have questions or need services, reach out using the form below or via our contact details.</p>

            <v-form>
              <v-text-field label="Name" required></v-text-field>
              <v-text-field label="Email" required></v-text-field>
              <v-textarea label="Message" rows="4"></v-textarea>
              <v-btn color="primary" class="mt-3">Send</v-btn>
            </v-form>

            <h4 class="mt-4">Other ways to reach us</h4>
            <div>Email: <a href="mailto:info@homehealth.example">info@homehealth.example</a></div>
            <div>Phone: <a href="tel:+15551234567">+1 (555) 123-4567</a></div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
// relies on global Vuetify components
</script>
