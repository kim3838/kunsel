//Inject pinia stores into nuxt instance
//Allowing usage outside of Vue components
export default defineNuxtPlugin(nuxtApp => {

    const {$pinia} = nuxtApp;

    return {
        provide: {
            coreStore: useCoreStore($pinia),
            promptStore: usePromptStore($pinia),
            formStore: useFormStore($pinia),
            themeStore: useThemeStore($pinia),
        }
    }
})
