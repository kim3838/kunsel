import {defineStore, storeToRefs} from 'pinia'

export const useLayoutStore = defineStore('layout', () => {
    const navigationHeight = ref(0);

    const navigationHeightInPixels = computed(() => {
        return (navigationHeight.value + 'px');
    });

    function setNavigationHeight(value){
        navigationHeight.value = value;
    }

    return {
        navigationHeight,
        navigationHeightInPixels,
        setNavigationHeight
    }
})
