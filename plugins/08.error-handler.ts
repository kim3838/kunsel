export default defineNuxtPlugin(nuxtApp => {
    nuxtApp.hook('vue:error', (err) => {
        showError(err instanceof Error ? err : new Error(String(err)));
    })
})