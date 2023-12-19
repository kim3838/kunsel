import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', {
    state: () => ({
        appTheme: 'tulip',
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
                'type': 'light',
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
                'type': 'dark',
                'primary': '#e5e5e5',
                'secondary': '#464646',
                'accent': '#707070',

                'lining': '#e5e5e5',
                'thread': '#464646',

                'neutral': '#656565',

                'tint': '#4f4f4f',
                'body': '#323232',
                'shade': '#414141',

                'text': '#e3e3e3',
                'text-invert': '#464646',
                'text-secondary': '#7a7a7a',
            },
            blue: {
                'type': 'light',
                'primary': '#132e60',
                'secondary': '#132e60',
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
            tulip: {
                'type': 'light',
                'primary': '#D45E5E',
                'secondary': '#D45E5E',
                'accent': '#f4978e',

                'lining': '#F08080',
                'thread': '#F8AD9D',

                'neutral': '#e5e5e5',

                'tint': '#ffead7',
                'body': '#ffeee0',
                'shade': '#ffdab9',

                'text': '#502e2e',
                'text-invert': '#ffffff',
                'text-secondary': '#ab7676',
            },
            emerald: {
                'type': 'dark',
                'primary': '#d2f5c6',
                'secondary': '#ffffff',
                'accent': '#79AC78',

                'lining': '#d2f5c6',
                'thread': '#678369',

                'neutral': '#4d7779',

                'tint': '#027177',
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
        type() {
            return this.palletesComputed['type'];
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