export default defineNuxtPlugin(() => {
    onNuxtReady(async () => {
        //Nuxt app has finished initializing.

        console.log('client ready ClientReadyState = true');
        useClientReadyState().value = true;
    })
})