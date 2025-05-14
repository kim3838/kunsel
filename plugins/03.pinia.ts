
import type {Pinia} from "pinia";

//Inject pinia stores into nuxt instance
//Allowing usage outside Vue components
export default defineNuxtPlugin(nuxtApp => {

    const $pinia = nuxtApp.$pinia as Pinia;

    return {
        provide: {
            coreStore: useCoreStore($pinia),
            promptStore: usePromptStore($pinia),
            formStore: useFormStore($pinia),
            themeStore: useThemeStore($pinia),
            authStore: useAuthStore($pinia),
        }
    }
})
