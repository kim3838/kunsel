import {storeToRefs} from "pinia";

export const useLayout = () => {
    const routeTo = useRouteTo();
    const {isAuthenticated, logout} = useAuth();
    const {screens, width: screenWidth, height: screenHeight } = useScreen();
    const $themeStore = useThemeStore();
    const {body: bodyColor} = storeToRefs($themeStore);
    const navigationMode = useState('navigation-mode', () => 'clear');

    const enableScrollSnap = computed(() => {
        return ['index'].includes(routeTo.value.name);
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
                    title: 'CSR Post',
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
                },
                {
                    type: 'action',
                    title: 'CSR Get',
                    icon: 'material-symbols:request-quote-sharp',
                    callback: async () => {
                        await csrFetch("/api/user", {
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
                        await csrFetch("/sanctum/csrf-cookie", {
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
                title: 'Home',
                to: '/',
                route: 'index'
            },
            {
                type: 'link',
                title: 'Featured',
                to: '/featured',
                route: 'featured'
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
        if(navigationMode.value == 'clear'){
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
        let size = 'lg'

        if (screenWidth.value >= screens['2xl']) {//3xl
            size = 'md';
        } else if (screenWidth.value >= screens['xl'] && screenWidth.value < screens['2xl']) {//2xl
            size = 'md';
        } else if (screenWidth.value >= screens['lg'] && screenWidth.value < screens['xl']) {//xl
            size = 'md';
        } else if (screenWidth.value >= screens['md'] && screenWidth.value < screens['lg']) {//lg
            size = 'sm';
        } else if (screenWidth.value >= screens['sm'] && screenWidth.value < screens['md']) {//md
            size = 'sm';
        } else if (screenWidth.value < screens['sm']) {//sm
            size = 'sm';
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
    function setNavigationMode(mode: any, callie = ''){
        if(mode != navigationMode.value){
            console.log({[(callie ? (callie + ' ') : '') + 'setNavigationMode']: mode});
            
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