import {defineNuxtPlugin, useNuxtApp} from "#app";
import {watch} from 'vue';
import {storeToRefs} from 'pinia';

export default defineNuxtPlugin(nuxtApp => {
    const route = useRoute();

    nuxtApp.provide('debug', function (key: string, payload: any) {
        // @ts-ignore
        console.log({[`${useNuxtApp().$moment().format('YYYY-MM-DD H:m:s')} DEBUG: ${key}`]: payload})
    });

    nuxtApp.provide('ordinal', function (number) {
        let s = ["th", "st", "nd", "rd"];
        let v = number % 100;
        return number + (s[(v - 20) % 10] || s[v] || s[0]);
    });

    nuxtApp.provide('isRouteActive', function (routeSlug: string) {
        return [route.path, _toLower(route.name)].indexOf(_toLower(routeSlug)) >= 0;
    });

    /*
    * App Hooks (runtime)
    * https://nuxt.com/docs/api/advanced/hooks#app-hooks-runtime
    */
    nuxtApp.hook('app:beforeMount', () => {
        console.log({'HOOK': 'app:beforeMount'});
        const {$themeStore} = useNuxtApp();

        const {
            appTheme,
            body: bodyColor,
        } = storeToRefs($themeStore);

        document.body.style.backgroundColor = bodyColor.value;

        watch(appTheme, (newTheme) => {
            document.body.style.backgroundColor = bodyColor.value;
        });
    });
});