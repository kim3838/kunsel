// https://nuxt.com/docs/api/configuration/nuxt-config

import tailwindcss from "@tailwindcss/vite";

// @ts-ignore
export default defineNuxtConfig({
    app: {
        baseURL: "/",
        head: {
            title: 'sn-f v3',
            "meta": [
                {"name": "viewport", "content": "width=device-width, initial-scale=1"},
                {"charset": "utf-8"}
            ],
            "link": [
                {rel: 'preconnect', href: 'https://fonts.googleapis.com'},
                {rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: 'use-credentials'},
                //Sans-Serif
                {rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap'},
                {rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap'},
                {rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Roboto+Condensed:ital,wght@0,300;0,400;0,700;1,300;1,400;1,700&display=swap'},
                {rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Sofia+Sans+Semi+Condensed:ital,wght@0,1;0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;0,1000;1,1;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900;1,1000&display=swap'},
                {rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Condensed:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&display=swap'},
                {rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inclusive+Sans:ital@0;1&display=swap" rel="stylesheet'},
                {rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Protest+Revolution&display=swap" rel="stylesheet'},
                {rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Hedvig+Letters+Sans&display=swap" rel="stylesheet'},
                //Serif
                {rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap'},
                {rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Oranienbaum&display=swap'},
                {rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Almendra:ital,wght@0,400;0,700;1,400;1,700&display=swap'},
                //Monospace
                {rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Roboto+Mono&display=swap'},
                {rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Spline+Sans+Mono:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&display=swap'},
                //Stiff
                {rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Iceberg&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap'},
                {rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Bruno+Ace+SC&display=swap'},
                //Techno
                {rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Oxanium:wght@200..800&display=swap'},
                //Appearance
                {rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Merienda:wght@300..900&display=swap'},

            ],
            "style": [],
            "script": [
                {src: '/js/common/moment.min.js'},
                {src: '/js/common/jquery.min.js'},
                {src: '/js/datetimepicker/index.js'}
            ],
            "noscript": [],
            "htmlAttrs": {
                class: ''
            },
            "bodyAttrs": {
                class: 'tw-font-standard'
            }
        },
        layoutTransition: false,
        pageTransition: false,
        rootId: "__nuxt",
        rootTag: "div"
    },

    //prints out hook names and timings on the server, and logs hook arguments as well in the browser.
    debug: false,

    imports: {
        dirs: [
            'composables/**',
            'stores'
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
        {path: '@/components/data'},
        {path: '@/components/deco'},
        {path: '@/components/accordion'},
        {path: '@/components/logo'},
        {path: '@/components/frame'},
        {path: '@/components/list'},
        {path: '@/components/layout'},
        {path: '@/components/card'},
        {path: '@/components/featured'},
    ],

    lodash: {
        prefix: "_",
        prefixSkip: false,
        upperAfterPrefix: false,
        exclude: [],
        alias: [],
    },

    modules: [
        '@vueuse/nuxt',
        '@pinia/nuxt',
        '@nuxt/icon',
        'nuxt-lodash'
    ],

    carousel: {
        prefix: 'CarouselModule'
    },

    vite: {
        css: {
            preprocessorOptions: {
                scss: {
                    api: 'modern-compiler', // or "modern", "legacy"
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

    compatibilityDate: '2024-08-30'
})