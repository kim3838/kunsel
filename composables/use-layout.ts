import {storeToRefs} from "pinia";
import type {
    NavigationLinkInterface
} from "@/public/js/types/layout";
import type {
    SelectedAccountSubscriptionT
} from "@/public/js/types/association";

export const useLayout = () => {
    const nuxtApp = useNuxtApp();
    const isRoutePathActive = nuxtApp.$isRoutePathActive as (path: string | undefined) => boolean;
    const {isAuthenticated, userIsSuperAdmin, destroyAuthentication} = useAuth();
    const userIsAdminOfSelectedCompany = userIsAdminOfSelectedCompanyState();
    const userIsEmployeeOfSelectedCompany = userIsEmployeeOfSelectedCompanyState();
    const userIsAdminInAnyCompany = userIsAdminInAnyCompanyState();
    const {screenWidthBreakpoint, width: screenWidth, height: screenHeight } = useScreen();
    const $themeStore = useThemeStore();
    const {body: bodyColor} = storeToRefs($themeStore);
    const navigationMode = useState('navigation-mode', () => 'clear-none-background');

    const navigationAccountLinks = computed<NavigationLinkInterface[]>(() => {
        let links: NavigationLinkInterface[] = [];

        let debugRequests = [
            {
                key: 'debug-csr-post',
                type: 'action',
                title: 'DEBUG',
                icon: 'material-symbols:request-quote-sharp',
                callback: async () => {
                    await laraFetch("/api/utility/debug", {
                        method: 'POST',
                    }, {});
                },
            },
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

        if(isAuthenticated.value){

            links = links.concat([
                {
                    key: 'account-settings',
                    type: 'link',
                    title: 'Account Settings',
                    //icon: 'ic:baseline-miscellaneous-services',
                    to: '/account-settings',
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
            ]);

        } else {
            links.unshift({
                key: 'login',
                type: 'link',
                title: 'Login',
                to: '/login',
            });
        }

        if(process.env.NODE_ENV === 'development'){

            links = links.concat([
                ...(debugRequests as NavigationLinkInterface[])
            ]);
        }

        return links;
    });
    const navigationLinks = computed<NavigationLinkInterface[]>(()=>{
        const {$authStore} = useNuxtApp();

        let links: NavigationLinkInterface[] = [];

        links = links.concat([
            ...((isAuthenticated.value) ? [{
                key: 'dashboard',
                type: 'link',
                title: 'Dashboard',
                to: '/',
                route_active: 'index'
            }] : []) as NavigationLinkInterface[],
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
                            },
                            {
                                key: 'support',
                                type: 'link',
                                title: 'Support',
                            },
                            {
                                key: 'help',
                                type: 'drop',
                                title: 'Helpful Links',
                                options: [
                                    {
                                        key: 'ease-of-access',
                                        type: 'anchor-link',
                                        title: 'Ease of access',
                                    },
                                    {
                                        key: 'rma',
                                        type: 'drop',
                                        title: 'RMA',
                                        options: [
                                            {
                                                key: 'refund',
                                                type: 'anchor-link',
                                                title: 'Refund',
                                            },
                                            {
                                                key: 'return-exchange',
                                                type: 'link',
                                                title: 'Return Exchange',
                                            },
                                            {
                                                key: 'warranty',
                                                type: 'link',
                                                title: 'Warranty',
                                            },
                                            {
                                                key: 'wrong-delivery',
                                                type: 'link',
                                                title: 'Wrong delivery',
                                            },
                                            {
                                                key: 'disfunctional',
                                                type: 'link',
                                                title: 'Disfunctional',
                                            },
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ] : []
            ) as NavigationLinkInterface[],

        ] as NavigationLinkInterface[]);

        const storedAccountSubscription = useCookie<SelectedAccountSubscriptionT>($authStore.SELECTED_ACCOUNT_SUBSCRIPTION_STORAGE_KEY);

        let moduleNavigationLinkMap = {
            [SUBSCRIPTION_MODULE.EMPLOYEE_PORTAL as number]: [
                ...((isAuthenticated.value && (userIsSuperAdmin.value || userIsEmployeeOfSelectedCompany.value)) ? [{
                    key: `${SUBSCRIPTION_MODULE.EMPLOYEE_PORTAL}-attendance`,
                    type: 'link',
                    title: 'Attendance',
                    to: `/${SUBSCRIPTION_MODULE.EMPLOYEE_PORTAL}/attendance`,
                    route_active: `${SUBSCRIPTION_MODULE.EMPLOYEE_PORTAL}-attendance`
                }] : []) as NavigationLinkInterface[],
            ],
            [SUBSCRIPTION_MODULE.HR_PAYROLL as number]: [
                ...((isAuthenticated.value && (userIsSuperAdmin.value || userIsAdminOfSelectedCompany.value)) ? [{
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
                            route_active: 'workforce-employees',
                            path_active: '/workforce/employees',
                        },
                        {
                            key: 'workforce/employee-groups',
                            type: 'link',
                            title: 'Employee Groups',
                            to: '/workforce/employee-groups',
                            route_active: 'workforce-employee-groups'
                        },
                        {
                            key: 'workforce/employment-profiles',
                            type: 'link',
                            title: 'Employment Profiles',
                            to: '/workforce/employment-profiles',
                            route_active: 'workforce-employment-profiles'
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
                        {
                            key: 'workforce/attendance',
                            type: 'link',
                            title: 'Attendance',
                            to: '/workforce/attendance',
                            route_active: 'workforce-attendance',
                            path_active: '/workforce/attendance',
                        },
                        {
                            key: 'workforce/overtime',
                            type: 'link',
                            title: 'Overtime',
                            to: '/workforce/overtime',
                            route_active: 'workforce-overtime',
                            path_active: '/workforce/overtime',
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
                            to: '/policies/pay-frequencies',
                            route_active: 'policies-pay-frequencies'
                        },
                        {
                            key: 'policies/payroll-components',
                            type: 'link',
                            title: 'Payroll Components',
                            to: '/policies/payroll-components',
                            route_active: 'policies-payroll-components'
                        },
                        {
                            key: 'policies/shifts',
                            type: 'link',
                            title: 'Shifts',
                            to: '/policies/shifts',
                            route_active: 'policies-shifts',
                            path_active: '/policies/shifts',
                        },
                        {
                            key: 'policies/shift-assignment',
                            type: 'link',
                            title: 'Shift Assignment',
                            to: '/policies/shift-assignment',
                            route_active: 'policies-shift-assignment'
                        },
                        {
                            key: 'policies/leave-types',
                            type: 'link',
                            title: 'Leave Types',
                            to: '/policies/leave-types',
                            route_active: 'policies-leave-types',
                            path_active: '/policies/leave-types',
                        },
                        {
                            key: 'policies/leave-type-assignment',
                            type: 'link',
                            title: 'Leave Type Assignment',
                            to: '/policies/leave-type-assignment',
                            route_active: 'policies-leave-type-assignment'
                        },
                        {
                            key: 'policies/holiday',
                            type: 'link',
                            title: 'Holidays',
                            to: '/policies/holiday',
                            route_active: 'policies-holiday'
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
                            to: '/settings/salary-statement-modules',
                            route_active: 'settings-salary-statement-modules'
                        },
                        {
                            key: 'settings/formula-settings',
                            type: 'link',
                            title: 'Formula Settings',
                            //icon: 'ic:baseline-architecture',
                            to: '/settings/formula-settings',
                            route_active: 'settings-formula-settings'
                        },
                    ]
                }, {
                    key: 'payroll',
                    type: 'sub-nav',
                    title: 'Payroll',
                    path_active: '/payroll',
                    options: [
                        {
                            key: 'payroll/employee-pay-items',
                            type: 'link',
                            title: 'Employee Pay Items',
                            to: '/payroll/employee-pay-items',
                            route_active: 'payroll-employee-pay-items'
                        },
                    ]
                }, {
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
                        },
                        {
                            key: 'import/employment-profile',
                            type: 'link',
                            title: 'Employment Profile',
                            to: '/import/employment-profile',
                            route_active: 'import-employment-profile'
                        },
                        {
                            key: 'import/employee-payroll-component',
                            type: 'link',
                            title: 'Employee Payroll Component',
                            to: '/import/employee-payroll-component',
                            route_active: 'import-employee-payroll-component'
                        },
                        {
                            key: 'import/attendance',
                            type: 'link',
                            title: 'Attendance',
                            to: '/import/attendance',
                            route_active: 'import-attendance'
                        },
                        {
                            key: 'import/overtime',
                            type: 'link',
                            title: 'Overtime',
                            to: '/import/overtime',
                            route_active: 'import-overtime'
                        },
                    ],
                }] : []) as NavigationLinkInterface[],
            ],
            [SUBSCRIPTION_MODULE.INVENTORY as number]: [],
            [SUBSCRIPTION_MODULE.FINANCE_ACCOUNTING as number]: [],
        }

        let moduleNavigationLinks: NavigationLinkInterface[] = (storedAccountSubscription.value != null && typeof storedAccountSubscription.value === 'number')
            ? (moduleNavigationLinkMap[storedAccountSubscription.value] || [])
            : [];

        links = links.concat(moduleNavigationLinks);

        return links;
    });

    const adminNavigationLinks = computed<NavigationLinkInterface[]>(()=>{

        return [
            ...((userIsSuperAdmin.value || userIsAdminInAnyCompany.value) ? [{
                key: 'admin',
                type: 'sub-nav',
                drop_align: 'right',
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
                            route_active: 'admin-accounts',
                            path_active: '/admin/accounts',
                        },{
                            key: 'admin/companies',
                            type: 'link',
                            title: 'Companies',
                            //icon: 'ic:baseline-curtains-closed',
                            to: '/admin/companies',
                            route_active: 'admin-companies',
                            path_active: '/admin/companies',
                        },{
                            key: 'admin/formulas',
                            type: 'link',
                            title: 'Formulas',
                            to: '/admin/formulas',
                            route_active: 'admin-formulas',
                            path_active: '/admin/formulas',
                        },{
                            key: 'admin/jsonpresets',
                            type: 'link',
                            title: 'Json Presets',
                            to: '/admin/jsonpresets',
                            route_active: 'admin-jsonpresets',
                            path_active: '/admin/jsonpresets',
                        },
                        {
                            key: 'admin/users',
                            type: 'link',
                            title: 'Users',
                            //icon: 'ic:baseline-recent-actors',
                            to: '/admin/users',
                            route_active: 'admin-users',
                            path_active: '/admin/users',
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
                            route_active: 'admin-associated-companies',
                            path_active: '/admin/associated-companies',
                        },
                        {
                            key: 'admin/associated-users',
                            type: 'link',
                            title: 'Users',
                            //icon: 'ic:baseline-recent-actors',
                            to: '/admin/associated-users',
                            route_active: 'admin-associated-users',
                            path_active: '/admin/associated-users',
                        },
                    ]: []),
                ]
            }] : []) as NavigationLinkInterface[],
        ]
    });

    const allNavigationLinks = computed<NavigationLinkInterface[]>(()=>{

        let links: NavigationLinkInterface[] = [];

        links = links.concat(navigationLinks.value);
        links = links.concat(adminNavigationLinks.value);

        return links;
    });

    const subNavigationLinks = computed<NavigationLinkInterface[]>(()=> allNavigationLinks.value.filter(navigationLink => navigationLink.type == 'sub-nav'));
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
        adminNavigationLinks,
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