
import { useMainStore } from '~/store'
import {defineNuxtPlugin} from "#app";

export default defineNuxtPlugin(({ $pinia }) => {
    return {
        provide: {
            store: useMainStore($pinia)
        }
    }
})
