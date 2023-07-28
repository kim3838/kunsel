
import {defineNuxtPlugin, useNuxtApp} from "#app";

export default defineNuxtPlugin(nuxtApp => {

    nuxtApp.provide('debug', function(payload: string){
        // @ts-ignore
        console.log(`${useNuxtApp().$moment().format('YYYY-MM-DD H:m:s')} DEBUG: [${payload}]`)
    });
});