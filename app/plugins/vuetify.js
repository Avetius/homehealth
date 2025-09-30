import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

// debug log so you can see plugin load in the server/dev output
/* eslint-disable no-console */
console.log('[vuetify] plugin module loaded')

export default defineNuxtPlugin((nuxtApp) => {
  console.log('[vuetify] defineNuxtPlugin executing')
  const vuetify = createVuetify({ components, directives })
  nuxtApp.vueApp.use(vuetify)
})
