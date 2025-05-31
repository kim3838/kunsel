
import {defineStore} from 'pinia'
import type {NavigationLinkInterface} from "@/public/js/types/layout";

export const useLayoutStore = defineStore('layout', () => {
    const subNavigationOptions = ref<NavigationLinkInterface[]>([]);

    function setSubNavigationOptions(options: NavigationLinkInterface[]){
        subNavigationOptions.value = options;
    }

    return {
        subNavigationOptions,
        setSubNavigationOptions
    }
})