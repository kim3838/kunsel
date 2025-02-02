/** @type {import('tailwindcss').Config} */
module.exports = {
    // content: [
    //     "./components/**/*.{js,vue,ts}",
    //     "./layouts/**/*.vue",
    //     "./pages/**/*.vue",
    //     "./app.vue",
    //     "./error.vue",
    // ],

    // darkMode: 'class',

    // important: true,

    theme: {
        extend: {
            fontFamily : {
                sans : [
                    'Google Sans Text',
                    'Spline Sans',
                    'Barlow Semi Condensed',
                    'Roboto Condensed',
                    'Inter',
                    'Inclusive Sans',
                    //Design
                    'Protest Revolution',
                    'sans-serif'
                ],
                appearance:[
                    'Merienda'
                ],
                techno:[
                    'Oxanium'
                ],
                stiff:[
                    'Iceberg',
                ],
                'stiff-wide':[
                    'Bruno Ace SC',
                ],
                data: [
                    'Sofia Sans Semi Condensed'
                ],
                header: [
                    'IBM Plex Sans Condensed',//Headers
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

