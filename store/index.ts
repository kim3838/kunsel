
import { defineStore } from 'pinia'
// import { defineStore } from '@pinia/nuxt';

export const useMainStore = defineStore('main', {
    state: () => ({
        counter: 0,
    }),
    actions: {
        increment() {
            // `this` is the store instance
            this.counter++
        },
    },
})
