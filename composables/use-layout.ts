import {storeToRefs} from "pinia";

export const useLayout = () => {
    const route = useRoute();
    const {screens, width: screenWidth, height: screenHeight } = useScreen();
    const $themeStore = useThemeStore();
    const {body: bodyColor} = storeToRefs($themeStore);

    const enableScrollSnap = computed(() => {
        return ['index'].includes(_toLower(route.name));
    });
    const navigationMode = useState('navigation-mode', () => 'clear');
    const navigationHeight = ref(0);
    const navigationBackground = computed(()=>{
        if(navigationMode.value == 'clear'){
            return 'transparent';
        }

        return bodyColor.value;
    });
    const navigationHeightInPixels = computed(() => {
        return (navigationHeight.value + 'px');
    });
    const topAllocationInPixels = computed(()=>{
        if(navigationMode.value == 'clear'){
            return '0px';
        }

        if(['index'].includes(_toLower(route.name))){
            return '0px';
        }

        return (navigationHeight.value + 'px');
    });
    const spotlightContentHeight = computed(() => {
        return 'calc(100vh - '+(navigationHeight.value + 'px')+')';
    });
    const navigationHeaderSize = computed(() => {
        let size = 'lg'

        if (screenWidth.value >= screens['2xl']) {//3xl
            size = 'lg';
        } else if (screenWidth.value >= screens['xl'] && screenWidth.value < screens['2xl']) {//2xl
            size = 'lg';
        } else if (screenWidth.value >= screens['lg'] && screenWidth.value < screens['xl']) {//xl
            size = 'lg';
        } else if (screenWidth.value >= screens['md'] && screenWidth.value < screens['lg']) {//lg
            size = 'md';
        } else if (screenWidth.value >= screens['sm'] && screenWidth.value < screens['md']) {//md
            size = 'md';
        } else if (screenWidth.value < screens['sm']) {//sm
            size = 'md';
        }

        return size;
    });
    const rightNavigationDropAlign = computed(()=>{
        let dropAlign = 'right';

        if (screenWidth.value >= screens['lg']) {
            dropAlign = 'right';
        } else {
            dropAlign = 'left';
        }

        return dropAlign;
    })

    function setNavigationHeight(height: any){
        navigationHeight.value = height;
    }
    function setNavigationMode(mode: any){
        if(mode != navigationMode.value){
            navigationMode.value = mode;
        }
    }

    return {
        enableScrollSnap,
        navigationMode,
        navigationHeight,
        navigationBackground,
        navigationHeaderSize,
        navigationHeightInPixels,
        topAllocationInPixels,
        spotlightContentHeight,
        setNavigationHeight,
        setNavigationMode,
        rightNavigationDropAlign
    }
}