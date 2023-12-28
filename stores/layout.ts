import {defineStore, storeToRefs} from 'pinia'

export const useLayoutStore = defineStore('layout', () => {
    const $themeStore = useThemeStore();
    const {body: bodyColor} = storeToRefs($themeStore);

    const navigationHeight = ref(0);
    const navigation = ref({
        mode: 'clear'
    });

    const navigationMode = computed(() => {
        return navigation.value.mode;
    });
    const navigationBackground = computed(()=>{
        if(navigationMode.value == 'clear'){
            return 'transparent';
        }

        return bodyColor.value;
    });
    const navigationHeightInPixels = computed(() => {
        return (navigationHeight.value + 'px');
    });
    const spotlightContentHeight = computed(() => {
        return 'calc(100vh - '+(navigationHeight.value + 'px')+')';
    });

    function setNavigationHeight(value){
        navigationHeight.value = value;
    }
    function setNavigationMode(mode){
        if(mode != navigation.value.mode){
            navigation.value.mode = mode;
        }
    }

    return {
        navigation,
        navigationMode,
        navigationBackground,
        navigationHeight,
        navigationHeightInPixels,
        spotlightContentHeight,
        setNavigationHeight,
        setNavigationMode
    }
})
