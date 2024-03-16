export default defineNuxtPlugin(() => {
    onNuxtReady(async () => {
        //Nuxt app has finished initializing.

        setTimeout(()=>{
            useClientReadyState().value = true;
        }, 2000);
    })
})