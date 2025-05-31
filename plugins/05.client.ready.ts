export default defineNuxtPlugin(() => {
    onNuxtReady(async () => {
        //Nuxt app has finished initializing, client-side hydration.
        useClientReadyState().value = true;
    })
})