import {storeToRefs} from "pinia";
import type {
    NavigationLinkInterface
} from "@/public/js/types/layout";

export const useLayout = () => {
    const nuxtApp = useNuxtApp();
    const isRoutePathActive = nuxtApp.$isRoutePathActive as (path: string | undefined) => boolean;
    const {isAuthenticated, userIsSuperAdmin, destroyAuthentication} = useAuth();
    const companyAssignmentTypeIsAdmin = companyAssignmentTypeIsAdminState();
    const adminInAnyCompany = adminInAnyCompanyState();
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
                            params: {key: 'value'},
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
                    //icon: 'ic:baseline-miscellaneous-services',
                    to: '/profile',
                },
                {
                    key: 'login',
                    type: 'action',
                    title: 'Logout',
                    //icon: 'mdi:connection',
                    callback: () => {
                        destroyAuthentication();
                    },
                },
                //...(debugRequests as NavigationLinkInterface[])
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
                icon: 'ic:sharp-double-arrow',
                to: '/',
                route_active: 'index'
            },
            ...(false ? [
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
                    {
                        key: 'lab',
                        type: 'link',
                        title: 'Lab',
                        to: '/lab',
                    },
                    {
                        key: 'example',
                        type: 'link',
                        title: 'Example',
                        to: '/example',
                    },
                ]:[]
            ) as NavigationLinkInterface[],
            ...(false ? [
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
                key: 'workforce',
                type: 'sub-nav',
                title: 'Workforce',
                //icon: 'ic:round-diversity-3',
                path_active: '/workforce',
                options:[
                    {
                        key: 'workforce/employees',
                        type: 'link',
                        title: 'Employees',
                        //icon: 'mdi:account-multiple',
                        to: '/workforce/employees',
                        route_active: 'workforce-employees'
                    },
                    {
                        key: 'workforce/departments',
                        type: 'link',
                        title: 'Departments',
                        //icon: 'ic:baseline-all-inbox',
                        to: '/workforce/departments',
                        route_active: 'workforce-departments'
                    },
                    {
                        key: 'workforce/designations',
                        type: 'link',
                        title: 'Designations',
                        //icon: 'ic:baseline-inbox',
                        to: '/workforce/designations',
                        route_active: 'workforce-designations'
                    },
                ]
            },{
                key: 'policies',
                type: 'sub-nav',
                title: 'Policies',
                path_active: '/policies',
                options:[
                    {
                        key: 'policies/pay-frequencies',
                        type: 'link',
                        title: 'Pay Frequency',
                        to: '/policies/payfrequencies',
                        route_active: 'policies-payfrequencies'
                    },
                    {
                        key: 'policies/payroll-components',
                        type: 'link',
                        title: 'Payroll Components',
                        to: '/policies/payrollcomponents',
                        route_active: 'policies-payrollcomponents'
                    },
                    {
                        key: 'policies/shifts',
                        type: 'link',
                        title: 'Shifts',
                        to: '/policies/shifts',
                        route_active: 'policies-shifts'
                    },
                ]
            }, {
                key: 'settings',
                type: 'sub-nav',
                title: 'Settings',
                //icon: 'ic:baseline-miscellaneous-services',
                path_active: '/settings',
                options: [
                    {
                        key: 'settings/salary-statement-modules',
                        type: 'link',
                        title: 'Salary Statement Modules',
                        //icon: 'ic:baseline-dynamic-form',
                        to: '/settings/salarystatementmodules',
                        route_active: 'settings-salarystatementmodules'
                    },
                    {
                        key: 'settings/formula-settings',
                        type: 'link',
                        title: 'Formula Settings',
                        //icon: 'ic:baseline-architecture',
                        to: '/settings/formulasettings',
                        route_active: 'settings-formulasettings'
                    },
                ]
            },{
                key: 'import',
                type: 'sub-nav',
                title: 'Import',
                path_active: '/import',
                //icon: 'mdi:file-upload',
                options: [
                    {
                        key: 'import/employees',
                        type: 'link',
                        title: 'Employees',
                        //icon: 'mdi:account-multiple',
                        to: '/import/employees',
                        route_active: 'import-employees'
                    }
                ],
            }] : []) as NavigationLinkInterface[],
            ...((userIsSuperAdmin.value || adminInAnyCompany.value) ? [{
                key: 'admin',
                type: 'sub-nav',
                title: 'Admin',
                path_active: '/admin',
                //icon: 'ep:management',
                options: [
                    ...(userIsSuperAdmin.value ? [
                        {
                            key: 'admin/accounts',
                            type: 'link',
                            title: 'Accounts',
                            //icon: 'ic:baseline-all-inbox',
                            to: '/admin/accounts',
                            route_active: 'admin-accounts'
                        },{
                            key: 'admin/companies',
                            type: 'link',
                            title: 'Companies',
                            //icon: 'ic:baseline-curtains-closed',
                            to: '/admin/companies',
                            route_active: 'admin-companies'
                        },
                        {
                            key: 'admin/users',
                            type: 'link',
                            title: 'Users',
                            //icon: 'ic:baseline-recent-actors',
                            to: '/admin/users',
                            route_active: 'admin-users'
                        },
                    ]: []),
                    ...(!userIsSuperAdmin.value ? [
                        {
                            key: 'admin/associated-accounts',
                            type: 'link',
                            title: 'Subscription',
                            //icon: 'ic:baseline-all-inbox',
                            to: '/admin/associated-accounts',
                            route_active: 'admin-associated-accounts'
                        },
                        {
                            key: 'admin/associated-companies',
                            type: 'link',
                            title: 'Companies',
                            //icon: 'ic:baseline-curtains-closed',
                            to: '/admin/associated-companies',
                            route_active: 'admin-associated-companies'
                        },
                        {
                            key: 'admin/associated-users',
                            type: 'link',
                            title: 'Users',
                            //icon: 'ic:baseline-recent-actors',
                            to: '/admin/associated-users',
                            route_active: 'admin-associated-users'
                        },
                    ]: []),
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