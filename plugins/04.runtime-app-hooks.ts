/*
* App Hooks (runtime)
* https://nuxt.com/docs/api/advanced/hooks#app-hooks-runtime
*/
export default defineNuxtPlugin((nuxtApp) => {

    //Called when the setup() of the new page is running.
    nuxtApp.hook('page:loading:start', () => {
        //console.log('PAGE NAVIGATE: setup() of the new page is running');
    });

    //Called when initial vueApp instance is created.
    nuxtApp.hook('app:created', () => {
        //console.log('RUNTIME APP HOOK: vueApp instance is created');
        useClientReadyState().value = false;
    });

    //Called when Vue app is initialized and mounted in browser.
    nuxtApp.hook('app:mounted', () => {
        //console.log('RUNTIME APP HOOK: vueApp mounted in browser');
    });

    //Called when SSR rendering is done.
    nuxtApp.hook('app:rendered', () => {
        //console.log('RUNTIME APP HOOK: SSR rendering is done');
    });

    //Called on Suspense pending event.
    nuxtApp.hook('page:start', () => {
        //console.log('PAGE NAVIGATE: Suspense pending event');
    });

    //Called on Suspense resolved event.
    nuxtApp.hook('page:finish', () => {
        //console.log('PAGE NAVIGATE: Suspense resolved event');
    });

    //Called after page:finish
    nuxtApp.hook('page:loading:end', () => {
        //console.log('PAGE NAVIGATE: page:finish');
    });
})

