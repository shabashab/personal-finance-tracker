import Nora from '@primeuix/themes/nora'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  modules: ['@nuxtjs/tailwindcss', '@primevue/nuxt-module'],
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      apiBaseUrl: '',
    },
  },
  tailwindcss: {
    exposeConfig: true,
    viewer: true,
  },
  primevue: {
    autoImport: false,
    options: {
      theme: {
        preset: Nora,
      },
    },
  },
})
