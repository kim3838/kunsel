// https://nuxt.com/docs/api/configuration/nuxt-config

import {defineNuxtConfig} from "nuxt/config";
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
    app: {
        baseURL: "/",
        head: {
            title: 'sn-f v3',
            "meta": [
                {"name": "viewport", "content": "width=device-width, initial-scale=1"},
                {"charset": "utf-8"}
            ],
            "link": [],
            "style": [],
            "script": [
                {src: '/js/common/moment.min.js'},
                {src: '/js/common/jquery.min.js'},
                {src: '/js/datetimepicker/index.js'}
            ],
            "htmlAttrs": {
                class: ''
            },
            "bodyAttrs": {
                class: 'font-standard'
            }
        },
    },

    //prints out hook names and timings on the server, and logs hook arguments as well in the browser.
    debug: false,

    imports: {
        dirs: [
            'composables/**',
            'stores'
        ],
        presets: [
            {
                from: 'lodash',
                imports: [
                    { name: 'get', as: '_get'},
                    { name: 'isEmpty', as: '_isEmpty'},
                    { name: 'difference', as: '_difference'},
                    { name: 'uniq', as: '_uniq'},
                    { name: 'castArray', as: '_castArray'},
                    { name: 'includes', as: '_includes'},
                    { name: 'toLower', as: '_toLower'},
                    { name: 'some', as: '_some'},
                    { name: 'upperCase', as: '_upperCase'},
                    { name: 'startCase', as: '_startCase'},
                    { name: 'map', as: '_map' },
                    { name: 'flatten', as: '_flatten'},
                    { name: 'without', as: '_without'},
                    { name: 'forEach', as: '_forEach'},
                    { name: 'replace', as: '_replace'},
                    { name: 'concat', as: '_concat'},
                    { name: 'remove', as: '_remove'},
                    { name: 'find', as: '_find'},
                    { name: 'filter', as: '_filter'},
                    { name: 'first', as: '_first'},
                    { name: 'compact', as: '_compact'},
                    { name: 'isNil', as: '_isNil'},
                    { name: 'negate', as: '_negate'},
                ]
            }
        ]
    },

    devtools: {
        enabled: true
    },

    css: [
        '@/assets/css/main.css',
        '@/assets/css/tailwind.css',
        '@/assets/css/fonts.css',
        '@/assets/css/datetimepicker.css'
    ],

    components: [
        {path: '@/components'},
        {path: '@/components/form'},
        {path: '@/components/modal'},
        {path: '@/components/modal/payroll-settings'},
        {path: '@/components/data'},
        {path: '@/components/deco'},
        {path: '@/components/accordion'},
        {path: '@/components/logo'},
        {path: '@/components/frame'},
        {path: '@/components/list'},
        {path: '@/components/layout'},
        {path: '@/components/card'},
        {path: '@/components/settings'},
        {path: '@/components/selection'},
        {path: '@/components/shift'},
    ],

    // lodash: {
    //     prefix: "_",
    //     prefixSkip: false,
    //     upperAfterPrefix: false,
    //     exclude: [],
    //     alias: [],
    // },

    modules: [
        '@vueuse/nuxt',
        '@pinia/nuxt',
        //'nuxt-lodash'
        '@nuxt/icon',
        '@nuxt/fonts'
    ],

    fonts: {
        families: [
            //Sans-Serif
            { name: 'Inter', provider: 'google' },
            { name: 'Roboto', provider: 'google' },
            { name: 'Roboto Condensed', provider: 'google' },
            { name: 'Sofia Sans Semi Condensed', provider: 'google' },
            { name: 'IBM Plex Sans Condensed', provider: 'google' },
            { name: 'Inclusive Sans', provider: 'google' },
            { name: 'Protest Revolution', provider: 'google' },
            { name: 'Hedvig Letters Sans', provider: 'google' },
            { name: 'Bricolage Grotesque', provider: 'google' },
            { name: 'Radio Canada Big', provider: 'google' },
            { name: 'National Park', provider: 'google' },
            { name: 'Funnel Sans', provider: 'google' },

            //Serif
            { name: 'Instrument Serif', provider: 'google' },
            { name: 'Oranienbaum', provider: 'google' },
            { name: 'Almendra', provider: 'google' },
            { name: 'Playfair Display', provider: 'google' },

            //Monospace
            { name: 'Roboto Mono', provider: 'google' },
            { name: 'Spline Sans Mono', provider: 'google' },

            //Stiff
            { name: 'Iceberg', provider: 'google' },
            { name: 'Bruno Ace SC', provider: 'google' },

            //Techno
            { name: 'Oxanium', provider: 'google' },

            //Appearance
            { name: 'Roboto Flex', provider: 'google' },
            { name: 'Merienda', provider: 'google' },

            //Sophisticated
            { name: 'Quintessential', provider: 'google' },
        ]
    },

    vite: {
        css: {
            preprocessorOptions: {
                scss: {
                    api: 'modern-compiler', // or "modern", "legacy"
                    additionalData: `@use "@/assets/scss/variables.scss" as *;`
                },
            },
        },
        plugins: [
            tailwindcss(),
        ],
        server: {
            allowedHosts: [
                '.server.local',
                'client.server.local',
            ]
        }
    },

    runtimeConfig: {
        // Keys within public are also exposed client-side
        public: {
            version: process.env.VERSION || '1.0.0',
            baseURL: process.env.BASE_URL || 'http://api.server.local',
            sessionDomain: process.env.SESSION_DOMAIN || '.server.local',
            frontendURL: process.env.FRONTEND_URL || 'http://client.server.local:3000',
            devUsername: process.env.DEV_USERNAME || 'username',
            devUserPassword: process.env.DEV_USER_PASSWORD || 'password'
        },
        // Private keys which are only available server-side
        apiSecret: '',// Replaced by process.env.NUXT_API_SECRET
        apiKey: '' // Default to an empty string, automatically set at runtime using process.env.NUXT_API_KEY
    },

    devServer: {
        host: 'client.server.local',
        https: false,
        port: 3000,
    },

    compatibilityDate: '2025-10-07'
})