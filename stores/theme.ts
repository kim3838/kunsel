import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', {
    state: () => ({
        theme: 'blue',
        palletes: {
            light: {
                'primary': '#323232',
                'secondary': '#787878',
                'accent': '#969696',

                'lining': '#b4b4b4',
                'thread': '#e5e5e5',

                'neutral': '#e5e5e5',

                'tint': '#ffffff',
                'shade': '#9B9B9B',

                'text': '#646464',
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
                'shade': '#afa4a4',

                'text': '#686a7e',
                'text-invert': '#dbe8ee',
                'text-secondary': '#99aed0',
            }
        }
    }),

    getters: {
        getTheme() {
            return this.theme;
        },
        palletesComputed() {
            return this.palletes[this.theme];
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
            this.theme = theme;
        }
    },
})