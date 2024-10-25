export default defineNuxtPlugin(() => {
    onNuxtReady(async () => {
        //Nuxt app has finished initializing.
        useClientReadyState().value = true;
    })
})