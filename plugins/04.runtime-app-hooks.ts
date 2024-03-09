/*
* App Hooks (runtime)
* https://nuxt.com/docs/api/advanced/hooks#app-hooks-runtime
*/
export default defineNuxtPlugin((nuxtApp) => {

    //Called when the setup() of the new page is running.
    nuxtApp.hook('page:loading:start', () => {
        //console.log({'RUNTIME APP HOOK': 'page:loading:start'});
    });

    //Called when initial vueApp instance is created.
    nuxtApp.hook('app:created', () => {
        //console.log({'RUNTIME APP HOOK': 'app:created'});
    });

    //Called when SSR rendering is done.
    nuxtApp.hook('app:rendered', () => {
        //console.log({'RUNTIME APP HOOK': 'app:rendered'});
    });

    //Called on Suspense pending event.
    nuxtApp.hook('page:start', () => {
        //console.log({'RUNTIME APP HOOK': 'page:start'});
    });

    //Called on Suspense resolved event.
    nuxtApp.hook('page:finish', () => {
        //console.log({'RUNTIME APP HOOK': 'page:finish'});
    });

    //Called after page:finish
    nuxtApp.hook('page:loading:end', () => {
        //console.log({'RUNTIME APP HOOK': 'page:loading:end'});
    });
})

