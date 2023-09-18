import {defineNuxtPlugin} from "#app";

export default defineNuxtPlugin(({$pinia}) => {
    return {
        provide: {
            coreStore: useCoreStore($pinia),
            formStore: useFormStore($pinia),
            authStore: useAuthStore($pinia),
            themeStore: useThemeStore($pinia),
        }
    }
})
