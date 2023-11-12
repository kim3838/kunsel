/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./components/**/*.{js,vue,ts}",
        "./layouts/**/*.vue",
        "./pages/**/*.vue",
        "./plugins/**/*.{js,ts}",
        "./nuxt.config.{js,ts}",
        "./app.vue",
    ],

    prefix: 'tw-',

    darkMode: 'class',

    important: true,

    theme: {
        extend: {
            fontFamily : {
                sans : ['Sofia Sans Semi Condensed', 'Spline Sans', 'Google Sans Text', 'Barlow Semi Condensed', 'Source Sans Pro', 'Roboto', 'Roboto Condensed', 'Inter', 'sans-serif'],
                serif : ['Prociono', 'Almendra', 'Oranienbaum', 'Instrument Serif', 'Gupter', 'Kotta One', 'serif'],
                mono : ['Roboto Mono', 'Spline Sans Mono', 'monospace'],
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

