import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', {
    state: () => ({
        appTheme: 'dark',
        hexAlpha: {
            '10': '19',
            '20': '33',
            '30': '4C',
            '40': '66',
            '50': '7F',
            '60': '99',
            '70': 'B2',
            '80': 'CC',
            '90': 'E5',
        },
        palletes: {
            light: {
                'primary': '#323232',
                'secondary': '#787878',
                'accent': '#c9c9c9',

                'lining': '#b4b4b4',
                'thread': '#e5e5e5',

                'neutral': '#e5e5e5',

                'tint': '#ffffff',
                'body': '#ffffff',
                'shade': '#f5f5f5',

                'text': '#5a5a5a',
                'text-invert': '#e0e8de',
                'text-secondary': '#b4b4b4',
            },
            dark: {
                'primary': '#414141',
                'secondary': '#ffffff',
                'accent': '#707070',

                'lining': '#e5e5e5',
                'thread': '#464646',

                'neutral': '#4f4f4f',

                'tint': '#707070',
                'body': '#323232',
                'shade': '#323232',

                'text': '#ffffff',
                'text-invert': '#a8a8a8',
                'text-secondary': '#c2c2c2',
            },
            blue: {
                'primary': '#132e60',
                'secondary': '#ad3d1d',
                'accent': '#8b97a9',

                'lining': '#90a5cc',
                'thread': '#c6c9cc',

                'neutral': '#e5e5e5',

                'tint': '#ffffff',
                'body': '#ffffff',
                'shade': '#f5f5f5',

                'text': '#636580',
                'text-invert': '#dbe8ee',
                'text-secondary': '#99aed0',
            },
            emerald: {
                'primary': '#d2f5c6',
                'secondary': '#ffffff',
                'accent': '#79AC78',

                'lining': '#d2f5c6',
                'thread': '#678369',

                'neutral': '#4d7779',

                'tint': '#016A70',
                'body': '#016A70',
                'shade': '#016A70',

                'text': '#D0E7D2',
                'text-invert': '#016A70',
                'text-secondary': '#678369',
            }
        }
    }),

    getters: {
        getTheme() {
            return this.appTheme;
        },
        palletesComputed() {
            return this.palletes[this.appTheme];
        },
        primary() {
            return this.palletesComputed['primary'];
        },
        secondary() {
            return this.palletesComputed['secondary'];
        },
        accent() {
            return this.palletesComputed['accent'];
        },
        lining() {
            return this.palletesComputed['lining'];
        },
        thread() {
            return this.palletesComputed['thread'];
        },
        neutral() {
            return this.palletesComputed['neutral'];
        },
        tint() {
            return this.palletesComputed['tint'];
        },
        body() {
            return this.palletesComputed['body'];
        },
        shade() {
            return this.palletesComputed['shade'];
        },
        text() {
            return this.palletesComputed['text'];
        },
        textInvert() {
            return this.palletesComputed['text-invert'];
        },
        textSecondary() {
            return this.palletesComputed['text-secondary'];
        },
    },

    actions: {
        setTheme(theme){
            if(theme != this.appTheme){
                this.appTheme = theme;
            }
        }
    },
})