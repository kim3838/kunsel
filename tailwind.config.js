/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./components/**/*.{js,vue,ts}",
        "./layouts/**/*.vue",
        "./pages/**/*.vue",
        "./app.vue",
        "./error.vue",
    ],

    prefix: 'tw-',

    darkMode: 'class',

    important: true,

    theme: {
        extend: {
            fontFamily : {
                sans : [
                    'IBM Plex Sans Condensed',//Headers
                    'Spline Sans',
                    'Google Sans Text',
                    'Barlow Semi Condensed',
                    'Roboto Condensed',
                    'Inter',
                    'Inclusive Sans',
                    //Design
                    'Protest Revolution',
                    'sans-serif'
                ],
                data: [
                    'Sofia Sans Semi Condensed'
                ],
                standard: [
                    'Roboto',
                    'Hedvig Letters Sans',
                    'Source Sans Pro',
                ],
                serif : [
                    'Oranienbaum',
                    'Instrument Serif',
                    'Almendra',
                    'Prociono',
                    'Gupter',
                    'Kotta One',
                    'serif'
                ],
                mono : [
                    'Spline Sans Mono',
                    'Roboto Mono',
                    'monospace'
                ],
            },
            spacing: {
                'sidebar': '250px',
            },
        },
    },

    plugins: [
        require("@tailwindcss/forms")({
            strategy: 'class',
        }),
    ],
}

