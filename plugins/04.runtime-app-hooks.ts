/*
* App Hooks (runtime)
* https://nuxt.com/docs/api/advanced/hooks#app-hooks-runtime
*/
export default defineNuxtPlugin((nuxtApp) => {

    //Called when initial vueApp instance is created.
    nuxtApp.hook('app:created', () => {
        console.log({'RUNTIME APP HOOK': 'app:created'});
        const route = useRoute();

        if(['index'].indexOf(_toLower(route.name)) >= 0){
            useLayout().setNavigationMode('clear');
        } else {
            useLayout().setNavigationMode('solid');
        }
    });

    //Called when SSR rendering is done.
    nuxtApp.hook('app:rendered', () => {
        console.log({'RUNTIME APP HOOK': 'app:rendered'});
    });
})

