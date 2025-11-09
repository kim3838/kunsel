
import {defineStore} from 'pinia'
import type {NavigationLinkInterface} from "@/public/js/types/layout";

export const useLayoutStore = defineStore('layout', () => {
    const subNavigationDropAlign = ref('left');
    const subNavigationOptions = ref<NavigationLinkInterface[]>([]);

    function setSubNavigationDropAlign(align: string){
        subNavigationDropAlign.value = align;
    }
    function setSubNavigationOptions(options: NavigationLinkInterface[]){
        subNavigationOptions.value = options;
    }

    return {
        subNavigationDropAlign,
        subNavigationOptions,
        setSubNavigationDropAlign,
        setSubNavigationOptions
    }
})