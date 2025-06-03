
import {defineStore} from 'pinia'

type PaletteNames = 'light' | 'dark' | 'blue' | 'tulip' | 'emerald';

type ThemeT = {
    type: string;
    primary: string;
    secondary: string;
    accent: string;
    lining: string;
    thread: string;
    neutral: string;
    tint: string;
    body: string;
    shade: string;
    text: string;
    'text-invert': string;
    'text-secondary': string;
}

export const useThemeStore = defineStore('theme', {
    state: () => {
        return {
            appTheme: 'light' as PaletteNames,
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
                '100': 'FF',
            },
            palletes: {
                light: {
                    'type': 'light',
                    'primary': '#202020',
                    'secondary': '#787878',
                    'accent': '#c9c9c9',

                    'lining': '#b4b4b4',
                    'thread': '#c7c7c7',

                    'neutral': '#e5e5e5',

                    'tint': '#fdfdfd',
                    'body': '#ffffff',
                    'shade': '#f5f5f5',

                    'text': '#464646',
                    'text-invert': '#e0e8de',
                    'text-secondary': '#b4b4b4',
                },
                dark: {
                    'type': 'dark',
                    'primary': '#e5e5e5',
                    'secondary': '#464646',
                    'accent': '#707070',

                    'lining': '#e5e5e5',
                    'thread': '#898989',

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
                    'secondary': '#263b62',
                    'accent': '#dae3f0',

                    'lining': '#90a5cc',
                    'thread': '#c6c9cc',

                    'neutral': '#e5e5e5',

                    'tint': '#fdfdfd',
                    'body': '#ffffff',
                    'shade': '#f5f5f5',

                    'text': '#545c72',
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

                    'neutral': '#fff8e0',

                    'tint': '#fff8f0',
                    'body': '#fff8f0',
                    'shade': '#ffdec1',

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

                    'tint': '#016A70',
                    'body': '#016A70',
                    'shade': '#016A70',

                    'text': '#D0E7D2',
                    'text-invert': '#016A70',
                    'text-secondary': '#678369',
                }
            }
        }
    },

    getters: {
        getTheme(): string {
            return this.appTheme;
        },
        palletesComputed(): ThemeT{
            return this.palletes[this.appTheme];
        },
        type(): string {
            return this.palletesComputed['type'];
        },
        primary(): string {
            return this.palletesComputed['primary'];
        },
        secondary(): string {
            return this.palletesComputed['secondary'];
        },
        accent(): string {
            return this.palletesComputed['accent'];
        },
        lining(): string {
            return this.palletesComputed['lining'];
        },
        thread(): string {
            return this.palletesComputed['thread'];
        },
        neutral(): string {
            return this.palletesComputed['neutral'];
        },
        tint(): string {
            return this.palletesComputed['tint'];
        },
        body(): string {
            return this.palletesComputed['body'];
        },
        shade(): string {
            return this.palletesComputed['shade'];
        },
        text(): string {
            return this.palletesComputed['text'];
        },
        textInvert(): string {
            return this.palletesComputed['text-invert'];
        },
        textSecondary(): string {
            return this.palletesComputed['text-secondary'];
        },
    },

    actions: {
        setTheme(theme: PaletteNames){
            if(theme != this.appTheme){
                this.appTheme = theme;
            }
        }
    },
})