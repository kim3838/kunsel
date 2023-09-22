import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', {
    state: () => ({
        theme: 'light',
        palletes: {
            light: {
                'primary': '#323232',
                'secondary': '#787878',
                'accent': '#969696',
                'shade': '#b4b4b4',
                'neutral': '#e5e5e5',
                'tint': '#ffffff',
                'text': '#646464',
                'text-invert': '#ffffff',
                'text-secondary': '#b4b4b4',
            },
            pink: {
                'background': '#ffffff',
                'neutral' : '#e5e5e5',
                'lighter': '#F8ECD1',
                'light': '#DEB6AB',
                'dark': '#AC7D88',
                'darker': '#85586F',
                'accent': '#80506b',
            },
            green: {
                'background': '#ffffff',
                'neutral' : '#e5e5e5',
                'lighter': '#EAE7B1',
                'light': '#A6BB8D',
                'dark': '#61876E',
                'darker': '#3C6255',
                'accent': '#3C6255',
            },
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
        shade() {
            return this.palletesComputed['shade'];
        },
        neutral() {
            return this.palletesComputed['neutral'];
        },
        tint() {
            return this.palletesComputed['tint'];
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