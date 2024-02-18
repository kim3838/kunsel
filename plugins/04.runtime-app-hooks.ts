/*
* App Hooks (runtime)
* https://nuxt.com/docs/api/advanced/hooks#app-hooks-runtime
*/
export default defineNuxtPlugin((nuxtApp) => {

    //Called on Suspense pending event.
    nuxtApp.hook('page:start', () => {
        console.log({'RUNTIME APP HOOK': 'page:start'});
    });

    //Called when SSR rendering is done.
    nuxtApp.hook('app:rendered', () => {
        console.log({'RUNTIME APP HOOK': 'app:rendered'});
    });
})

