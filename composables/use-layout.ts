import {storeToRefs} from "pinia";

export const useLayout = () => {
    const route = useRoute();
    const {isAuthenticated, logout} = useAuth();
    const {screens, width: screenWidth, height: screenHeight } = useScreen();
    const $themeStore = useThemeStore();
    const {body: bodyColor} = storeToRefs($themeStore);

    const enableScrollSnap = computed(() => {
        return ['index'].includes(_toLower(route.name));
    });
    const navigationAccountLinks = computed(() => {
        let links: object[] = [];

        if(isAuthenticated.value){
            links = links.concat([
                {
                    type: 'link',
                    title: 'Account Settings',
                    icon: 'eos-icons:rotating-gear',
                    to: '/profile',
                },
                {
                    type: 'action',
                    title: 'Logout',
                    callback: () => {
                        logout();
                    },
                },
                {
                    type: 'action',
                    title: 'Test Post',
                    icon: 'material-symbols:request-quote-sharp',
                    callback: async () => {
                        await csrFetch("/api/test-post", {
                            method: 'POST',
                        }, {
                            onResponse: (request, response, options) => {
                                console.log({'CSR POST RESPONSE' : response._data.code});
                            }
                        });
                    },
                }
            ]);
        } else {
            links.unshift({
                type: 'link',
                title: 'Login',
                to: '/login',
            });
        }

        links.push({
            type: 'link',
            title: 'Shop',
            icon: 'ic:sharp-shop',
            to: '',
        });

        return links;
    });
    const navigationLinks = computed(()=>{
        let links: object[] = [];

        links = links.concat([
            {
                type: 'link',
                title: 'Home',
                to: '/',
                route: 'index'
            },
            {
                type: 'link',
                title: 'Lab',
                to: '/lab',
                route: 'lab'
            },
            {
                type: 'link',
                title: 'Prototype',
                to: '/prototype',
                route: 'prototype'
            },
            {
                type: 'link',
                title: 'Prototypes',
                to: '/prototypes',
                route: 'prototypes'
            },
            {
                type: 'drop',
                title: 'About',
                icon: 'ic:baseline-arrow-right',
                options: [
                    {
                        type: 'anchor-link',
                        title: 'Latest news',
                        icon: 'ic:baseline-arrow-right',
                        to: '/#latest-news'
                    },
                ]
            },
            {
                type: 'drop',
                title: 'Help',
                icon: 'ic:baseline-arrow-right',
                options: [
                    {
                        type: 'anchor-link',
                        title: 'FAQ',
                        icon: 'ic:baseline-arrow-right',
                        to: '/#faq'
                    },
                    {
                        type: 'link',
                        title: 'Support',
                        icon: 'ic:baseline-arrow-right',
                    },
                    {
                        type: 'link',
                        title: 'Live Chat',
                        icon: 'ic:baseline-arrow-right',
                    },
                ]
            }
        ]);

        if(!isAuthenticated.value){
            links = links.concat([{
                type: 'drop',
                title: 'Account',
                options: navigationAccountLinks.value
            },]);
        }

        return links;
    })
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
        navigationLinks,
        navigationAccountLinks,
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