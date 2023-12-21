import {defineNuxtPlugin} from "#app";

export default defineNuxtPlugin(({$pinia}) => {
    return {
        provide: {
            coreStore: useCoreStore($pinia),
            layoutStore: useLayoutStore($pinia),
            formStore: useFormStore($pinia),
            themeStore: useThemeStore($pinia),
        }
    }
})
