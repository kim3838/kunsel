
import { defineNuxtPlugin } from "#app";
import lodash from "lodash";

export default defineNuxtPlugin(nuxtApp => {
    nuxtApp.provide('_', lodash);
})