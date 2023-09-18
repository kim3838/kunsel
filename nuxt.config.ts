// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
    // @ts-ignore
    app: {
        baseURL: "/",
        head: {
            title: 'sn-f v3',
            "meta": [
                {"name": "viewport","content": "width=device-width, initial-scale=1"},
                {"charset": "utf-8"}
            ],
            "link": [
                {rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap'},
                {rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Spline+Sans:wght@300;400;500;600;700&display=swap'},
                {rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap'},
                {rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Roboto+Condensed:ital,wght@0,300;0,400;0,700;1,300;1,400;1,700&display=swap'},
                {rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Sofia+Sans+Semi+Condensed:ital,wght@0,1;0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;0,1000;1,1;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900;1,1000&display=swap'},
                //Sans-Serif
                {rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Gupter:wght@400;500;700&family=Kotta+One&display=swap'},
                {rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap'},
                {rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Oranienbaum&display=swap'},
                {rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Almendra:ital,wght@0,400;0,700;1,400;1,700&display=swap'},
                //Monospace
                {rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Roboto+Mono&display=swap'},
                {rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Spline+Sans+Mono:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&display=swap'}
            ],
            "style": [],
            "script": [
                {src: '/js/common/moment.min.js'},
                {src: '/js/common/jquery.min.js'},
                {src: '/js/datetimepicker/index.js'}
            ],
            "noscript": [],
            "htmlAttrs": {
                class: ''//tw-dark
            },
            "bodyAttrs": {
                class: 'tw-text-accent tw-font-sans tw-bg-white dark:tw-bg-gray-800'
            }
        },
        layoutTransition: false,
        pageTransition: false,
        rootId: "__nuxt",
        rootTag: "div"
    },

    debug: false,//prints out hook names and timings on the server, and logs hook arguments as well in the browser.

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
        {path: '~/components'},
        {path: '~/components/form'},
        {path: '~/components/modal'},
        {path: '~/components/data'},
    ],

    lodash: {
        prefix: "_",
        prefixSkip: false,
        upperAfterPrefix: false,
        exclude: [],
        alias: [],
    },

    modules: [
        '@nuxtjs/tailwindcss',
        '@pinia/nuxt',
        'nuxt-lodash',
        'nuxt-icon',
    ],

    postcss: {
        plugins: {
            tailwindcss: {},
            autoprefixer: {},
        },
    },

    runtimeConfig: {
        // Keys within public are also exposed client-side
        public: {
            version: process.env.VERSION || '1.0.0',
            baseURL: process.env.BASE_URL || 'http://localhost:8000',
            frontendURL: process.env.FRONTEND_URL || 'http://localhost:3000',
        },
        // Private keys which are only available server-side
        apiSecret: '',// Replaced by process.env.NUXT_API_SECRET
        apiKey: '' // Default to an empty string, automatically set at runtime using process.env.NUXT_API_KEY
    },

    server: {
        https: false,
        //https: {key: './server.key',cert: './server.crt'},
    }
})