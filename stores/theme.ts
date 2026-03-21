
import {defineStore} from 'pinia'
import type {PaletteName} from "@/public/js/types/theme";

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

export type ColorsT = {
    primary: string;
    secondary: string;
}

export type CommonColorsT = {
    clear: ColorsT;
    default: ColorsT;
    success: ColorsT;
    danger: ColorsT;
    caution: ColorsT;
    warning: ColorsT;
    info: ColorsT;
}

export const useThemeStore = defineStore('theme', () => {

    const SELECTED_THEME_STORAGE_KEY = 'pt';

    const appTheme = ref<PaletteName>('default-blue');
    const common = ref<CommonColorsT>({
        'clear': {primary: 'transparent', secondary: 'transparent'},
        'default': {primary: '#777', secondary: '#e5e5e5'},
        'success': {primary: '#4cb74c', secondary: '#ccffcc'},
        'danger': {primary: '#d9534f', secondary: '#ffd1d2'},
        'caution': {primary: '#d28b29', secondary: '#ffe1cd'},
        'warning': {primary: '#c4bf08', secondary: '#eceaca'},
        'info': {primary: '#35a4c5', secondary: '#e1eef1'},
    });
    const hexAlpha = ref({
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
    });
    const palletes = ref({
        'light-slate': {
            'type': 'light',
            'primary': '#3b3b3b',
            'secondary': '#777676',
            'accent': '#efefef',

            'cell': '#ffffff',
            'lining': '#b4b4b4',
            'thread': '#c7c7c7',

            'neutral': '#efefef',

            'header': '#efefef',
            'body': '#f4f4f4',
            'shade': '#f6f6f6',
            'tint': '#ffffff',

            'text': '#282828',
            'subtitle': '#797e8a',
            'text-invert': '#e0e8de',
            'text-secondary': '#b4b4b4',
        },
        'dark-silver': {
            'type': 'dark',
            'primary': '#e5e5e5',
            'secondary': '#464646',
            'accent': '#707070',

            'cell': '#555756',
            'lining': '#ababab',
            'thread': '#6b6b6b',

            'neutral': '#484646',

            'header': '#484646',
            'body': '#323232',
            'shade': '#414141',
            'tint': '#3b3b3b',

            'text': '#c7c7c7',
            'subtitle': '#c7c7c7',
            'text-invert': '#c7c7c7',
            'text-secondary': '#7a7a7a',
        },
        'default-blue': {
            'type': 'light',
            'primary': '#18418c',
            'secondary': '#263b62',
            'accent': '#c3d8f6',

            'cell': '#ffffff',
            'lining': '#90a5cc',
            'thread': '#c6c9cc',

            'neutral': '#e5e5e5',

            'header': '#ececec',
            'body': '#f4f4f4',
            'shade': '#f8f8f8',
            'tint': '#fdfdfd',

            'text': '#2d3656',
            'subtitle': '#797e8a',
            'text-invert': '#ffffff',
            'text-secondary': '#99aed0',
        },
        'light-green': {
            'type': 'light',
            'primary': '#307c24',
            'secondary': '#2d6026',
            'accent': '#b9f1b0',

            'cell': '#f7f7f7',
            'lining': '#8bbd77',
            'thread': '#c6ccc6',

            'neutral': '#e5e5e5',

            'header': '#ececec',
            'body': '#f4f4f4',
            'shade': '#f8f8f8',
            'tint': '#fdfdfd',

            'text': '#173416',
            'subtitle': '#173416',
            'text-invert': '#ddeedb',
            'text-secondary': '#a9d099',
        },
        'light-tulip': {
            'type': 'light',
            'primary': '#D45E5E',
            'secondary': '#dab4c3',
            'accent': '#ffcad9',

            'cell': '#ffffff',
            'lining': '#f18e8e',
            'thread': '#d7bfcb',

            'neutral': '#efd8e1',

            'header': '#f6f6f6',
            'body': '#f4f4f4',
            'shade': '#fff0f4',
            'tint': '#fffbfb',

            'text': '#503d46',
            'subtitle': '#503d46',
            'text-invert': '#ffffff',
            'text-secondary': '#ab7676',
        },
        'dark-emerald': {
            'type': 'dark',
            'primary': '#27b062',//27abb0
            'secondary': '#288a5d',
            'accent': '#678577',//b9f3d8

            'cell': '#597a5b',
            'lining': '#75a979',
            'thread': '#678369',

            'neutral': '#2b654b',

            'header': '#2b654b',
            'body': '#175639',
            'shade': '#19593c',
            'tint': '#1e6444',

            'text': '#bcd0bd',
            'subtitle': '#bcd0bd',
            'text-invert': '#b3e5e8',
            'text-secondary': '#678369',
        }
    });

    const type = computed(() => palletes.value[appTheme.value]['type']);
    const primary = computed(() => palletes.value[appTheme.value]['primary']);
    const secondary = computed(() => palletes.value[appTheme.value]['secondary']);
    const accent = computed(() => palletes.value[appTheme.value]['accent']);
    const cell = computed(() => palletes.value[appTheme.value]['cell']);
    const lining = computed(() => palletes.value[appTheme.value]['lining']);
    const thread = computed(() => palletes.value[appTheme.value]['thread']);
    const neutral = computed(() => palletes.value[appTheme.value]['neutral']);
    const header = computed(() => palletes.value[appTheme.value]['header']);
    const tint = computed(() => palletes.value[appTheme.value]['tint']);
    const body = computed(() => palletes.value[appTheme.value]['body']);
    const shade = computed(() => palletes.value[appTheme.value]['shade']);
    const text = computed(() => palletes.value[appTheme.value]['text']);
    const subtitle = computed(() => palletes.value[appTheme.value]['subtitle']);
    const textInvert = computed(() => palletes.value[appTheme.value]['text-invert']);
    const textSecondary = computed(() => palletes.value[appTheme.value]['text-secondary']);

    const setTheme = (theme: PaletteName) => {

        if(theme !== appTheme.value){
            appTheme.value = theme;
        }
    }

    return {
        SELECTED_THEME_STORAGE_KEY,

        appTheme,
        common,
        hexAlpha,
        palletes,

        type,
        primary,
        secondary,
        accent,
        cell,
        lining,
        thread,
        neutral,
        header,
        tint,
        body,
        shade,
        text,
        subtitle,
        textInvert,
        textSecondary,

        setTheme,
    }
});