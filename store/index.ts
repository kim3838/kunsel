
import { defineStore } from 'pinia'

export const useCoreStore = defineStore('core', {
    state: () => ({
        counter: 0,
    }),

    getters: {
        // getters receive the state as first parameter
        doubleCounter: (state) => state.counter * 2,
        // use getters in other getters
        doubleCounterPlusOne(): number {
            return this.doubleCounter + 1
        },
    },

    actions: {
        increment() {
            // `this` is the store instance
            this.counter++
        },
    },
})
