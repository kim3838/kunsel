import {storeToRefs} from "pinia";

export const useLayout = () => {
    const {isAuthenticated, logout} = useAuth();
    const {screenWidthBreakpoint, width: screenWidth, height: screenHeight } = useScreen();
    const $themeStore = useThemeStore();
    const {body: bodyColor} = storeToRefs($themeStore);
    const navigationMode = useState('navigation-mode', () => 'clear-none-background');

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
                    title: 'CSR Post',
                    icon: 'material-symbols:request-quote-sharp',
                    callback: async () => {
                        await laraFetch("/api/test-post", {
                            method: 'POST',
                        }, {
                            onResponse: (request, response, options) => {
                                console.log({'CSR POST RESPONSE' : response._data.code});
                            }
                        });
                    },
                },
                {
                    type: 'action',
                    title: 'CSR Get',
                    icon: 'material-symbols:request-quote-sharp',
                    callback: async () => {
                        await laraFetch("/api/user", {
                            method: 'GET',
                        }, {
                            onResponse: (request, response, options) => {
                                console.log({'CSR GET RESPONSE' : response._data.code});
                            }
                        });
                    },
                },
                {
                    type: 'action',
                    title: 'CSR Get CSRF',
                    icon: 'material-symbols:request-quote-sharp',
                    callback: async () => {
                        await laraFetch("/sanctum/csrf-cookie", {
                            method: 'GET',
                        }, {
                            onResponse: (request, response, options) => {
                                console.log({'CSR GET CSRF' : response._data.code});
                            }
                        });
                    },
                },
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
                title: 'Featured',
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
                title: 'Example',
                to: '/example',
                route: 'example'
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

    const navigationHeight = ref(0);
    const navigationBackground = computed(()=>{
        if(
            navigationMode.value == 'clear-none-background'
            || navigationMode.value == 'clear-with-background'
        ){
            return 'transparent';
        }

        return bodyColor.value;
    });
    const navigationHeightInPixels = computed(() => {
        return (navigationHeight.value + 'px');
    });
    const topAllocationInPixels = computed(()=>{
        return (navigationHeight.value + 'px');
    });
    const spotlightContentHeight = computed(() => {
        return 'calc(100vh - '+(navigationHeight.value + 'px')+')';
    });
    const navigationHeaderSize = computed(() => {
        let size = 'md'

        if (screenWidth.value >= screenWidthBreakpoint['2xl']) {//3xl
            size = 'lg';
        } else if (screenWidth.value >= screenWidthBreakpoint['xl'] && screenWidth.value < screenWidthBreakpoint['2xl']) {//2xl
            size = 'lg';
        } else if (screenWidth.value >= screenWidthBreakpoint['lg'] && screenWidth.value < screenWidthBreakpoint['xl']) {//xl
            size = 'lg';
        } else if (screenWidth.value >= screenWidthBreakpoint['md'] && screenWidth.value < screenWidthBreakpoint['lg']) {//lg
            size = 'md';
        } else if (screenWidth.value >= screenWidthBreakpoint['sm'] && screenWidth.value < screenWidthBreakpoint['md']) {//md
            size = 'md';
        } else if (screenWidth.value < screenWidthBreakpoint['sm']) {//sm
            size = 'md';
        }

        return size;
    });
    const rightNavigationDropAlign = computed(()=>{
        let dropAlign = 'right';

        if (screenWidth.value >= screenWidthBreakpoint['lg']) {
            dropAlign = 'right';
        } else {
            dropAlign = 'left';
        }

        return dropAlign;
    })

    function setNavigationHeight(height: any){
        navigationHeight.value = height;
    }
    function setNavigationMode(mode: any, callie = ''){
        if(mode != navigationMode.value){
            
            navigationMode.value = mode;
        }
    }

    return {
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