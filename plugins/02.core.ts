import {defineNuxtPlugin, useNuxtApp} from "#app";

export default defineNuxtPlugin(nuxtApp => {

    nuxtApp.provide('debug', function (key: string, payload: any) {
        // @ts-ignore
        console.log({[`${useNuxtApp().$moment().format('YYYY-MM-DD H:m:s')} DEBUG: ${key}`]: payload})
    });

    nuxtApp.provide('ordinal', function (number) {
        let s = ["th", "st", "nd", "rd"];
        let v = number%100;
        return number + (s[(v-20)%10] || s[v] || s[0]);
    });
});