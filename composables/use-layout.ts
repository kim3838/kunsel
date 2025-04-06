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
                    icon: 'ic:baseline-arrow-right',
                    to: '/profile',
                },
                {
                    type: 'action',
                    title: 'Logout',
                    icon: 'ic:baseline-arrow-right',
                    callback: () => {
                        logout();
                    },
                },
            ]);

            let debugRequests = [
                {
                    type: 'action',
                    title: 'CSR Post',
                    icon: 'material-symbols:request-quote-sharp',
                    callback: async () => {
                        await laraFetch("/api/utility/post", {
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
            ];
        } else {
            links.unshift({
                type: 'link',
                title: 'Login',
                to: '/login',
            });
        }

        return links;
    });
    const navigationLinks = computed(()=>{
        let links: object[] = [];

        links = links.concat([
            {
                type: 'link',
                title: 'Dashboard',
                to: '/',
                route: 'index'
            },
            {
                type: 'drop',
                title: 'About',
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
                    }
                ]
            }
        ]);

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
    const navigationHeaderSize = computed(() => {
        let size = 'md'

        if (screenWidth.value >= screenWidthBreakpoint['2xl']) {//3xl
            size = 'md';
        } else if (screenWidth.value >= screenWidthBreakpoint['xl'] && screenWidth.value < screenWidthBreakpoint['2xl']) {//2xl
            size = 'md';
        } else if (screenWidth.value >= screenWidthBreakpoint['lg'] && screenWidth.value < screenWidthBreakpoint['xl']) {//xl
            size = 'md';
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
        setNavigationHeight,
        setNavigationMode,
        rightNavigationDropAlign
    }
}