import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', {
    state: () => ({
        appTheme: 'light',
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
            blue: {
                'primary': '#30405d',
                'secondary': '#853838',
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