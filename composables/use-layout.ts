import {storeToRefs} from "pinia";
import type {
    NavigationLinkInterface
} from "@/public/js/types/layout";

export const useLayout = () => {
    const nuxtApp = useNuxtApp();
    const isRoutePathActive = nuxtApp.$isRoutePathActive as (path: string | undefined) => boolean;
    const {isAuthenticated, userIsSuperAdmin, destroyAuthentication} = useAuth();
    const companyAssignmentTypeIsAdmin = companyAssignmentTypeIsAdminState();
    const {screenWidthBreakpoint, width: screenWidth, height: screenHeight } = useScreen();
    const $themeStore = useThemeStore();
    const {body: bodyColor} = storeToRefs($themeStore);
    const navigationMode = useState('navigation-mode', () => 'clear-none-background');

    const navigationAccountLinks = computed<NavigationLinkInterface[]>(() => {
        let links: NavigationLinkInterface[] = [];

        if(isAuthenticated.value){

            let debugRequests = [
                {
                    key: 'debug-csr-post',
                    type: 'action',
                    title: 'CSR Post',
                    icon: 'material-symbols:request-quote-sharp',
                    callback: async () => {
                        await laraFetch("/api/utility/post", {
                            method: 'POST',
                        }, {
                            onResponse: (request, options, response) => {
                                //@ts-ignore
                                console.log({'CSR POST RESPONSE' : response._data.code});
                            }
                        });
                    },
                },
                {
                    key: 'debug-csr-get',
                    type: 'action',
                    title: 'CSR Get',
                    icon: 'material-symbols:request-quote-sharp',
                    callback: async () => {
                        await laraFetch("/api/user", {
                            method: 'GET',
                        }, {
                            onResponse: (request, options, response) => {
                                //@ts-ignore
                                console.log({'CSR GET RESPONSE' : response._data.code});
                            }
                        });
                    },
                },
                {
                    key: 'debug-csr-csrf',
                    type: 'action',
                    title: 'CSR Get CSRF',
                    icon: 'material-symbols:request-quote-sharp',
                    callback: async () => {
                        await laraFetch("/sanctum/csrf-cookie", {
                            method: 'GET',
                        }, {
                            onResponse: (request, options, response) => {
                                //@ts-ignore
                                console.log({'CSR GET CSRF' : response._data.code});
                            }
                        });
                    },
                },
            ];

            links = links.concat([
                {
                    key: 'account-settings',
                    type: 'link',
                    title: 'Account Settings',
                    icon: 'ic:baseline-miscellaneous-services',
                    to: '/profile',
                },
                {
                    key: 'login',
                    type: 'action',
                    title: 'Logout',
                    icon: 'mdi:connection',
                    callback: () => {
                        destroyAuthentication();
                    },
                },
                ...(debugRequests as NavigationLinkInterface[])
            ]);

        } else {
            links.unshift({
                key: 'login',
                type: 'link',
                title: 'Login',
                to: '/login',
            });
        }

        return links;
    });
    const navigationLinks = computed<NavigationLinkInterface[]>(()=>{
        let links: NavigationLinkInterface[] = [];

        links = links.concat([
            {
                key: 'dashboard',
                type: 'link',
                title: 'Dashboard',
                to: '/',
                route_active: 'index'
            },
            {
                key: 'prototype',
                type: 'link',
                title: 'Prototype',
                to: '/prototype',
                route_active: 'prototype'
            },
            {
                key: 'prototypes',
                type: 'link',
                title: 'Prototypes',
                to: '/prototypes',
                route_active: 'prototypes'
            },
            ...(isAuthenticated.value ? [
                    {
                        key: 'about',
                        type: 'drop',
                        title: 'About',
                        options: [
                            {
                                key: 'latest-news',
                                type: 'anchor-link',
                                title: 'Latest news',
                                icon: 'ic:baseline-arrow-right',
                                to: '/#latest-news'
                            },
                        ]
                    },
                    {
                        key: 'help',
                        type: 'drop',
                        title: 'Help',
                        options: [
                            {
                                key: 'faq',
                                type: 'anchor-link',
                                title: 'FAQ',
                                icon: 'ic:baseline-arrow-right',
                                to: '/#faq'
                            },
                            {
                                key: 'support',
                                type: 'link',
                                title: 'Support',
                                icon: 'ic:baseline-arrow-right',
                            }
                        ]
                    }
                ] : []
            ) as NavigationLinkInterface[],
            ...((isAuthenticated.value && (userIsSuperAdmin.value || companyAssignmentTypeIsAdmin.value)) ? [{
                key: 'settings',
                type: 'sub-nav',
                title: 'Settings',
                icon: 'ic:baseline-miscellaneous-services',
                path_active: '/settings',
                options: [
                    {
                        key: 'settings/compensations',
                        type: 'link',
                        title: 'Compensations',
                        icon: 'mdi:cash-plus',
                        to: '/settings/compensations',
                        route_active: 'settings-compensations'
                    },
                    {
                        key: 'settings/deductions',
                        type: 'link',
                        title: 'Deductions',
                        icon: 'mdi:cash-minus',
                        to: '/settings/deductions',
                        route_active: 'settings-deductions'
                    },
                    {
                        key: 'settings/income-taxes',
                        type: 'link',
                        title: 'Income Tax',
                        icon: 'mdi:receipt-text-minus-outline',
                        to: '/settings/incometaxes',
                        route_active: 'settings-incometaxes'
                    },
                ]
            }] : []) as NavigationLinkInterface[],
        ] as NavigationLinkInterface[]);

        return links;
    })

    const subNavigationLinks = computed<NavigationLinkInterface[]>(()=> navigationLinks.value.filter(navigationLink => navigationLink.type == 'sub-nav'));
    const activeSubNavigationLink = computed<NavigationLinkInterface|null>( () => {
        return subNavigationLinks.value.filter((subNavigationLink: NavigationLinkInterface|null) => isRoutePathActive(subNavigationLink?.path_active)).pop() || null;
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

        if (screenWidth.value >= screenWidthBreakpoint['md']) {
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
        subNavigationLinks,
        activeSubNavigationLink,
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