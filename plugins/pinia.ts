
import { useCoreStore } from '~/store/index';
import { useFormStore } from '~/store/form';
import { useAuthStore } from "~/store/auth";
import {defineNuxtPlugin} from "#app";

export default defineNuxtPlugin(({ $pinia }) => {
    return {
        provide: {
            coreStore: useCoreStore($pinia),
            formStore: useFormStore($pinia),
            authStore: useAuthStore($pinia),
        }
    }
})
