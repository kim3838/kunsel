import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', {
    state: () => ({
        theme: 'light',
        blueprint: {
            color: 'accent'
        },
        palletes: {
            light: {
                'background': '#ffffff',
                'neutral' : '#e5e5e5',
                'lighter': '#b4b4b4',
                'light': '#969696',
                'dark': '#787878',
                'darker': '#323232',
                'accent': '#646464',
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
        colorComputed() {
            return this.palletesComputed[this.blueprint.color];
        },
        backgroundComputed() {
            return this.palletesComputed['background'];
        },
        accentComputed() {
            return this.palletesComputed['accent'];
        },
        lightComputed() {
            return this.palletesComputed['light'];
        },
        lighterComputed() {
            return this.palletesComputed['lighter'];
        },
    },

    actions: {
        setTheme(theme){
            this.theme = theme;
        }
    },
})