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
                sans : ['Sofia Sans Semi Condensed', 'Source Sans Pro', 'Spline Sans', 'Roboto', 'Roboto Condensed', 'Inter', 'sans-serif'],
                serif : ['Almendra', 'Oranienbaum', 'Instrument Serif', 'Gupter', 'Kotta One', 'serif'],
                mono : ['Roboto Mono', 'Spline Sans Mono', 'monospace'],
            },
            spacing: {
                'sidebar': '250px',
            },
            colors: {
                'lighter': '#b4b4b4',
                'light': '#969696',
                'dark': '#787878',
                'darker': '#323232',
                'accent': '#646464'
            }
        },
    },

    plugins: [
        require("@tailwindcss/forms")({
            strategy: 'class',
        }),
    ],
}

