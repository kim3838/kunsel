import {defineStore, storeToRefs} from 'pinia'

export const useLayoutStore = defineStore('layout', () => {
    const layout = ref('landing');
    const navigationHeight = ref(0);
    const navigation = ref({
        mode: 'clear'
    });

    const navigationMode = computed(() => {
        return navigation.value.mode;
    })
    const navigationHeightInPixels = computed(() => {
        return (navigationHeight.value + 'px');
    });

    function setNavigationHeight(value){
        navigationHeight.value = value;
    }
    function setNavigationMode(mode){
        if(mode != navigation.value.mode){
            navigation.value.mode = mode;
        }
    }
    function setLayout(layout){
        if(layout != layout.value){
            layout.value = layout;
        }
    }

    return {
        layout,
        navigation,
        navigationMode,
        navigationHeight,
        navigationHeightInPixels,
        setLayout,
        setNavigationHeight,
        setNavigationMode
    }
})
