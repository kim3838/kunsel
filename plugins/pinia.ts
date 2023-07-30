
import { useCoreStore } from '~/store/index';
import { useFormStore } from '~/store/form';
import {defineNuxtPlugin} from "#app";

export default defineNuxtPlugin(({ $pinia }) => {
    return {
        provide: {
            storeCore: useCoreStore($pinia),
            formStore: useFormStore($pinia),
        }
    }
})
