import tailwindcss from "@tailwindcss/vite";// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
    compatibilityDate: '2025-02-01',
    devtools: { enabled: false },

    nitro: {
        experimental: {
            tasks: true
        }
    },

    modules: ['@nuxt/fonts', '@nuxt/icon/module', '@nuxt/eslint', '@pinia/nuxt'],
    vite: {
        plugins: [
            tailwindcss(),
        ],
    },

    // routeRules: { '/': { redirect: '/tabs' } },

    ssr: false,

    app: {
        head: {
            meta: [
                { name: 'title', content: 'Plantly : take care of your plants' },
                { name: 'description', content: 'TODO' },
                { name: 'author', content: 'Valentin Le Lièvre' },
            ],
        },
    },

    css: ['~/assets/main.css'],
})
