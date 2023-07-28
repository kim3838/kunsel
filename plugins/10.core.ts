
import {defineNuxtPlugin, useNuxtApp} from "#app";

export default defineNuxtPlugin(nuxtApp => {

    nuxtApp.provide('debug', function(key: string, payload: any){
        // @ts-ignore
        console.log({[`${useNuxtApp().$moment().format('YYYY-MM-DD H:m:s')} DEBUG: ${key}`] : payload})
    });
});