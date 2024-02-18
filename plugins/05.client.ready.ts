export default defineNuxtPlugin(() => {
    onNuxtReady(async () => {
        console.log({'PLUGIN': 'CLIENT READY'});
    })
})