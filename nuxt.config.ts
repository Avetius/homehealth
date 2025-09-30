// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  pages: true,
  ssr: false,
  devtools: { enabled: false },
  css: [
    'vuetify/styles',
  ],
  plugins: ['~/plugins/vuetify.js'],
  components: true,
  build: {
    transpile: ['vuetify'],
  },
  modules: [
    '@nuxt/content',
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/scripts',
    '@nuxt/test-utils',
    '@nuxt/ui',
    'vuetify-nuxt-module'
  ],
  vuetify: {
    moduleOptions: {
      /* module specific options */
    },
    vuetifyOptions: {
      /* vuetify options */
    }
  }
})
    // '@mdi/font/css/materialdesignicons.min.css',
// 
// export default defineNuxtConfig({
//   pages: true,
//   ssr: false,
//   devtools: { enabled: false },
//   css: [
//     'vuetify/styles',
//     '@mdi/font/css/materialdesignicons.min.css',
//   ],
//   plugins: ['~/plugins/vuetify.js'],
//   components: true,
//   build: {
//     transpile: ['vuetify'],
//   },
// })

// Nuxt config file
// import { defineNuxtConfig } from 'nuxt/config'

// export default defineNuxtConfig({
//   modules: [
//     'vuetify-nuxt-module'
//   ],
//   vuetify: {
//     moduleOptions: {
//       /* module specific options */
//     },
//     vuetifyOptions: {
//       /* vuetify options */
//     }
//   }
// })