import {storeToRefs} from "pinia";
import type {NavigationLinkInterface} from "@/public/js/types/layout";
import type {SelectedAccountSubscriptionT} from "@/public/js/types/association";
import type {StringEnumInterface} from "@/public/js/common/type";

export const useLayout = () => {
    const nuxtApp = useNuxtApp();
    const isRoutePathActive = nuxtApp.$isRoutePathActive as (path: string | undefined) => boolean;
    const stringEnumerableValue = nuxtApp.$stringEnumerableValue as (enumerable: StringEnumInterface, value: number) => string;
    const {isAuthenticated, userIsSuperAdmin, destroyAuthentication} = useAuth();
    const userIsAdminOfSelectedCompany = userIsAdminOfSelectedCompanyState();
    const userIsEmployeeOfSelectedCompany = userIsEmployeeOfSelectedCompanyState();
    const userIsAdminInAnyCompany = userIsAdminInAnyCompanyState();
    const {screenWidthBreakpoint, width: screenWidth, height: screenHeight } = useScreen();
    const $themeStore = useThemeStore();
    const {tint: tintColor, body: bodyColor} = storeToRefs($themeStore);
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
                    to: '/account-settings',
                },
                {
                    key: 'logout',
                    type: 'action',
                    title: 'Logout',
                    callback: () => {
                        destroyAuthentication();
                    },
                },
            ]);

        } else {
            links.unshift({
                key: 'login',
                type: 'link',
                title: 'Password login',
                to: '/login',
            });
        }

        if(false && process.env.NODE_ENV === 'development'){

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
                key: 'home',
                type: 'link',
                title: 'Home',
                to: '/',
                route_active: 'index'
            }] : [
                {
                    key: 'features',
                    type: 'link',
                    title: 'Features',
                    to: '/features',
                    route_active: 'features',
                    path_active: '/features',
                },
                {
                    key: 'wtc-calculator',
                    type: 'link',
                    title: 'Compensation tax calculator',
                    to: '/compensation-tax-calculator',
                    route_active: 'compensation-tax-calculator',
                    path_active: '/compensation-tax-calculator',
                },
                {
                    key: 'forgot-password',
                    type: 'link',
                    title: 'Forgot password',
                    to: '/forgot-password',
                    route_active: 'forgot-password',
                    path_active: '/forgot-password',
                },
            ]) as NavigationLinkInterface[],
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
            ...(!isAuthenticated.value ? [
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

        const employeePortalRouteSlug = stringEnumerableValue(SUBSCRIPTION_MODULE_ROUTE_NAME, SUBSCRIPTION_MODULE.EMPLOYEE_PORTAL as number);
        const hrPayrollRouteSlug = stringEnumerableValue(SUBSCRIPTION_MODULE_ROUTE_NAME, SUBSCRIPTION_MODULE.HR_PAYROLL as number);

        let moduleNavigationLinkMap = {
            [SUBSCRIPTION_MODULE.EMPLOYEE_PORTAL as number]: [
                ...((isAuthenticated.value && userIsEmployeeOfSelectedCompany.value) ? [{
                    key: `${employeePortalRouteSlug}-attendance`,
                    type: 'link',
                    title: 'Attendance',
                    to: `/${employeePortalRouteSlug}/attendance`,
                    route_active: `${employeePortalRouteSlug}-attendance`
                },{
                    key: `${employeePortalRouteSlug}-overtime`,
                    type: 'link',
                    title: 'Overtime',
                    to: `/${employeePortalRouteSlug}/overtime`,
                    route_active: `${employeePortalRouteSlug}-overtime`
                },{
                    key: `${employeePortalRouteSlug}-leave`,
                    type: 'sub-nav',
                    title: 'Leave',
                    path_active: `/${employeePortalRouteSlug}/leave`,
                    options: [
                        {
                            key: `${employeePortalRouteSlug}-leave-leaves`,
                            type: 'link',
                            title: 'Leaves',
                            to: `/${employeePortalRouteSlug}/leave/leaves`,
                            route_active: `${employeePortalRouteSlug}-leave-leaves`
                        },
                        {
                            key: `${employeePortalRouteSlug}-leave-balance-adjustments`,
                            type: 'link',
                            title: 'Balance adjustments',
                            to: `/${employeePortalRouteSlug}/leave/balance-adjustments`,
                            route_active: `${employeePortalRouteSlug}-leave-balance-adjustments`
                        },
                    ]
                },{
                    key: `${employeePortalRouteSlug}-file-request`,
                    type: 'sub-nav',
                    title: 'File Request',
                    path_active: `/${employeePortalRouteSlug}/file-request`,
                    options: [
                        {
                            key: `${employeePortalRouteSlug}-file-request-overtime`,
                            type: 'link',
                            title: 'Overtime',
                            to: `/${employeePortalRouteSlug}/file-request/overtime`,
                            route_active: `${employeePortalRouteSlug}-file-request-overtime`
                        },
                        {
                            key: `${employeePortalRouteSlug}-file-request-leave`,
                            type: 'link',
                            title: 'Leave',
                            to: `/${employeePortalRouteSlug}/file-request/leave`,
                            route_active: `${employeePortalRouteSlug}-file-request-leave`
                        },
                    ]
                },{
                    key: `${employeePortalRouteSlug}/salary-statements`,
                    type: 'link',
                    title: 'Salary Statements',
                    to: `/${employeePortalRouteSlug}/salary-statements`,
                    route_active: `${employeePortalRouteSlug}-salary-statements`
                },{
                    key: `${employeePortalRouteSlug}/payroll-dtr`,
                    type: 'link',
                    title: 'Payroll DTR',
                    to: `/${employeePortalRouteSlug}/payroll-dtr`,
                    route_active: `${employeePortalRouteSlug}-payroll-dtr`
                },] : []) as NavigationLinkInterface[],
            ],
            [SUBSCRIPTION_MODULE.HR_PAYROLL as number]: [
                ...((isAuthenticated.value && (userIsSuperAdmin.value || userIsAdminOfSelectedCompany.value)) ? [{
                    key: `${hrPayrollRouteSlug}-workforce`,
                    type: 'sub-nav',
                    title: 'Workforce',
                    path_active: `/${hrPayrollRouteSlug}/workforce`,
                    options:[
                        {
                            key: `${hrPayrollRouteSlug}-workforce-employees`,
                            type: 'link',
                            title: 'Employees',
                            to: `/${hrPayrollRouteSlug}/workforce/employees`,
                            route_active: `${hrPayrollRouteSlug}-workforce-employees`
                        },
                        {
                            key: `${hrPayrollRouteSlug}-workforce-employee-groups`,
                            type: 'link',
                            title: 'Employee Groups',
                            to: `/${hrPayrollRouteSlug}/workforce/employee-groups`,
                            route_active: `${hrPayrollRouteSlug}-workforce-employee-groups`
                        },
                        {
                            key: `${hrPayrollRouteSlug}-workforce-employment-profiles`,
                            type: 'link',
                            title: 'Employment Profiles',
                            to: `/${hrPayrollRouteSlug}/workforce/employment-profiles`,
                            route_active: `${hrPayrollRouteSlug}-workforce-employment-profiles`
                        },
                        {
                            key: `${hrPayrollRouteSlug}-workforce-identifications`,
                            type: 'link',
                            title: 'Identifications',
                            to: `/${hrPayrollRouteSlug}/workforce/identifications`,
                            route_active: `${hrPayrollRouteSlug}-workforce-identifications`
                        },
                        {
                            key: `${hrPayrollRouteSlug}-workforce-departments`,
                            type: 'link',
                            title: 'Departments',
                            to: `/${hrPayrollRouteSlug}/workforce/departments`,
                            route_active: `${hrPayrollRouteSlug}-workforce-departments`
                        },
                        {
                            key: `${hrPayrollRouteSlug}-workforce-designations`,
                            type: 'link',
                            title: 'Designations',
                            to: `/${hrPayrollRouteSlug}/workforce/designations`,
                            route_active: `${hrPayrollRouteSlug}-workforce-designations`
                        },
                        {
                            key: `${hrPayrollRouteSlug}-workforce-attendance`,
                            type: 'link',
                            title: 'Attendance',
                            to: `/${hrPayrollRouteSlug}/workforce/attendance`,
                            route_active: `${hrPayrollRouteSlug}-workforce-attendance`
                        },
                        {
                            key: `${hrPayrollRouteSlug}-workforce-overtime`,
                            type: 'link',
                            title: 'Overtime',
                            to: `/${hrPayrollRouteSlug}/workforce/overtime`,
                            route_active: `${hrPayrollRouteSlug}-workforce-overtime`
                        },
                        {
                            key: `${hrPayrollRouteSlug}-workforce-leave`,
                            type: 'link',
                            title: 'Leave',
                            to: `/${hrPayrollRouteSlug}/workforce/leave`,
                            route_active: `${hrPayrollRouteSlug}-workforce-leave`
                        },
                    ]
                },{
                    key: `${hrPayrollRouteSlug}-policies`,
                    type: 'sub-nav',
                    title: 'Policies',
                    path_active: `/${hrPayrollRouteSlug}/policies`,
                    options:[
                        {
                            key: `${hrPayrollRouteSlug}-policies-shifts`,
                            type: 'link',
                            title: 'Shifts',
                            to: `/${hrPayrollRouteSlug}/policies/shifts`,
                            route_active: `${hrPayrollRouteSlug}-policies-shifts`
                        },
                        {
                            key: `${hrPayrollRouteSlug}-policies-shift-assignment`,
                            type: 'link',
                            title: 'Shift Assignment',
                            to: `/${hrPayrollRouteSlug}/policies/shift-assignment`,
                            route_active: `${hrPayrollRouteSlug}-policies-shift-assignment`
                        },
                        {
                            key: `${hrPayrollRouteSlug}-policies-leave-types`,
                            type: 'link',
                            title: 'Leave Types',
                            to: `/${hrPayrollRouteSlug}/policies/leave-types`,
                            route_active: `${hrPayrollRouteSlug}-policies-leave-types`
                        },
                        {
                            key: `${hrPayrollRouteSlug}-policies-leave-type-assignment`,
                            type: 'link',
                            title: 'Leave Type Assignment',
                            to: `/${hrPayrollRouteSlug}/policies/leave-type-assignment`,
                            route_active: `${hrPayrollRouteSlug}-policies-leave-type-assignment`
                        },
                        {
                            key: `${hrPayrollRouteSlug}-policies-leave-balance-adjustment`,
                            type: 'link',
                            title: 'Leave Balance Adjustment',
                            to: `/${hrPayrollRouteSlug}/policies/leave-balance-adjustment`,
                            route_active: `${hrPayrollRouteSlug}-policies-leave-balance-adjustment`
                        },
                        {
                            key: `${hrPayrollRouteSlug}-policies-holiday`,
                            type: 'link',
                            title: 'Holidays',
                            to: `/${hrPayrollRouteSlug}/policies/holiday`,
                            route_active: `${hrPayrollRouteSlug}-policies-holiday`
                        },
                    ]
                }, {
                    key: `${hrPayrollRouteSlug}-payroll`,
                    type: 'sub-nav',
                    title: 'Payroll',
                    path_active: `/${hrPayrollRouteSlug}/payroll`,
                    options: [
                        {
                            key: `${hrPayrollRouteSlug}-payroll-formulas`,
                            type: 'link',
                            title: 'Formulas',
                            to: `/${hrPayrollRouteSlug}/payroll/formulas`,
                            route_active: `${hrPayrollRouteSlug}-payroll-formulas`
                        },
                        {
                            key: `${hrPayrollRouteSlug}-payroll-salary-statement-modules`,
                            type: 'link',
                            title: 'Salary Statement Modules',
                            to: `/${hrPayrollRouteSlug}/payroll/salary-statement-modules`,
                            route_active: `${hrPayrollRouteSlug}-payroll-salary-statement-modules`
                        },
                        {
                            key: `${hrPayrollRouteSlug}-payroll-components`,
                            type: 'link',
                            title: 'Components',
                            to: `/${hrPayrollRouteSlug}/payroll/components`,
                            route_active: `${hrPayrollRouteSlug}-payroll-components`
                        },
                        {
                            key: `${hrPayrollRouteSlug}-payroll-employee-pay-items`,
                            type: 'link',
                            title: 'Employee Pay Items',
                            to: `/${hrPayrollRouteSlug}/payroll/employee-pay-items`,
                            route_active: `${hrPayrollRouteSlug}-payroll-employee-pay-items`
                        },
                        {
                            key: `${hrPayrollRouteSlug}-payroll-frequency-settings`,
                            type: 'link',
                            title: 'Frequency Settings',
                            to: `/${hrPayrollRouteSlug}/payroll/frequency-settings`,
                            route_active: `${hrPayrollRouteSlug}-payroll-frequency-settings`
                        },
                        {
                            key: `${hrPayrollRouteSlug}-external-tax-history`,
                            type: 'link',
                            title: 'External Tax History',
                            to: `/${hrPayrollRouteSlug}/payroll/external-tax-history`,
                            route_active: `${hrPayrollRouteSlug}-payroll-external-tax-history`
                        },
                        {
                            key: `${hrPayrollRouteSlug}-payroll-generate`,
                            type: 'link',
                            title: 'Generate',
                            to: `/${hrPayrollRouteSlug}/payroll/generate`,
                            route_active: `${hrPayrollRouteSlug}-payroll-generate`
                        },
                        {
                            key: `${hrPayrollRouteSlug}-payroll-history`,
                            type: 'link',
                            title: 'History',
                            to: `/${hrPayrollRouteSlug}/payroll/history`,
                            route_active: `${hrPayrollRouteSlug}-payroll-history`
                        },
                        {
                            key: `${hrPayrollRouteSlug}-payroll-salary-statements`,
                            type: 'link',
                            title: 'Salary Statements',
                            to: `/${hrPayrollRouteSlug}/payroll/salary-statements`,
                            route_active: `${hrPayrollRouteSlug}-payroll-salary-statements`
                        },
                        {
                            key: `${hrPayrollRouteSlug}-payroll-per-day-statement-totals`,
                            type: 'link',
                            title: 'Per day Statement Totals',
                            to: `/${hrPayrollRouteSlug}/payroll/per-day-statement-totals`,
                            route_active: `${hrPayrollRouteSlug}-payroll-per-day-statement-totals`
                        },
                    ]
                }, {
                    key: `${hrPayrollRouteSlug}-request-approval`,
                    type: 'sub-nav',
                    title: 'Request & Approval',
                    path_active: `/${hrPayrollRouteSlug}/request-approval`,
                    options: [
                        {
                            key: `${hrPayrollRouteSlug}-request-approval-setting`,
                            type: 'link',
                            title: 'Approval Setting',
                            to: `/${hrPayrollRouteSlug}/request-approval/setting`,
                            route_active: `${hrPayrollRouteSlug}-request-approval-setting`
                        },
                        {
                            key: `${hrPayrollRouteSlug}-request-approval-approvals`,
                            type: 'link',
                            title: 'Approvals',
                            to: `/${hrPayrollRouteSlug}/request-approval/approvals`,
                            route_active: `${hrPayrollRouteSlug}-request-approval-approvals`
                        },
                        {
                            key: `${hrPayrollRouteSlug}-request-approval-attendance-adjustment-request`,
                            type: 'link',
                            title: 'Attendance Adjustment Request',
                            to: `/${hrPayrollRouteSlug}/request-approval/attendance-adjustment-request`,
                            route_active: `${hrPayrollRouteSlug}-request-approval-attendance-adjustment-request`
                        },
                        {
                            key: `${hrPayrollRouteSlug}-request-approval-overtime-request`,
                            type: 'link',
                            title: 'Overtime Request',
                            to: `/${hrPayrollRouteSlug}/request-approval/overtime-request`,
                            route_active: `${hrPayrollRouteSlug}-request-approval-overtime-request`
                        },
                        {
                            key: `${hrPayrollRouteSlug}-request-approval-leave-request`,
                            type: 'link',
                            title: 'Leave Request',
                            to: `/${hrPayrollRouteSlug}/request-approval/leave-request`,
                            route_active: `${hrPayrollRouteSlug}-request-approval-leave-request`
                        },
                        {
                            key: `${hrPayrollRouteSlug}-request-approval-payroll-request`,
                            type: 'link',
                            title: 'Payroll Request',
                            to: `/${hrPayrollRouteSlug}/request-approval/payroll-request`,
                            route_active: `${hrPayrollRouteSlug}-request-approval-payroll-request`
                        },
                    ],
                },{
                    key: `${hrPayrollRouteSlug}-reports`,
                    type: 'sub-nav',
                    title: 'Reports',
                    path_active: `/${hrPayrollRouteSlug}/reports`,
                    options: [
                        {
                            key: `${hrPayrollRouteSlug}-reports-leave-balance`,
                            type: 'link',
                            title: 'Leave Balance',
                            to: `/${hrPayrollRouteSlug}/reports/leave-balance`,
                            route_active: `${hrPayrollRouteSlug}-reports-leave-balance`
                        },
                        {
                            key: `${hrPayrollRouteSlug}-reports-contributions`,
                            type: 'link',
                            title: 'Contributions',
                            to: `/${hrPayrollRouteSlug}/reports/contributions`,
                            route_active: `${hrPayrollRouteSlug}-reports-contributions`
                        },
                        {
                            key: `${hrPayrollRouteSlug}-reports-taxes`,
                            type: 'link',
                            title: 'Taxes',
                            to: `/${hrPayrollRouteSlug}/reports/taxes`,
                            route_active: `${hrPayrollRouteSlug}-reports-taxes`
                        },
                    ],
                }, {
                    key: `${hrPayrollRouteSlug}-import`,
                    type: 'sub-nav',
                    title: 'Import',
                    path_active: `/${hrPayrollRouteSlug}/import`,
                    options: [
                        {
                            key: `${hrPayrollRouteSlug}-import-employees`,
                            type: 'link',
                            title: 'Employees',
                            to: `/${hrPayrollRouteSlug}/import/employees`,
                            route_active: `${hrPayrollRouteSlug}-import-employees`
                        },
                        {
                            key: `${hrPayrollRouteSlug}-import-employment-profile`,
                            type: 'link',
                            title: 'Employment Profile',
                            to: `/${hrPayrollRouteSlug}/import/employment-profile`,
                            route_active: `${hrPayrollRouteSlug}-import-employment-profile`
                        },
                        {
                            key: `${hrPayrollRouteSlug}-import-identification`,
                            type: 'link',
                            title: 'Identification',
                            to: `/${hrPayrollRouteSlug}/import/identification`,
                            route_active: `${hrPayrollRouteSlug}-import-identification`
                        },
                        {
                            key: `${hrPayrollRouteSlug}-import-employee-pay-items`,
                            type: 'link',
                            title: 'Employee Pay Items',
                            to: `/${hrPayrollRouteSlug}/import/employee-pay-items`,
                            route_active: `${hrPayrollRouteSlug}-import-employee-pay-items`
                        },
                        {
                            key: `${hrPayrollRouteSlug}-import-attendance`,
                            type: 'link',
                            title: 'Attendance',
                            to: `/${hrPayrollRouteSlug}/import/attendance`,
                            route_active: `${hrPayrollRouteSlug}-import-attendance`
                        },
                        {
                            key: `${hrPayrollRouteSlug}-import-overtime`,
                            type: 'link',
                            title: 'Overtime',
                            to: `/${hrPayrollRouteSlug}/import/overtime`,
                            route_active: `${hrPayrollRouteSlug}-import-overtime`
                        },
                    ],
                }] : []) as NavigationLinkInterface[],
            ],
            [SUBSCRIPTION_MODULE.INVENTORY as number]: [
                ...((isAuthenticated.value && (userIsSuperAdmin.value || userIsAdminOfSelectedCompany.value)) ? [] : []) as NavigationLinkInterface[],
            ],
            [SUBSCRIPTION_MODULE.FINANCE_ACCOUNTING as number]: [
                ...((isAuthenticated.value && (userIsSuperAdmin.value || userIsAdminOfSelectedCompany.value)) ? [] : []) as NavigationLinkInterface[],
            ],
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
                options: [
                    ...(userIsSuperAdmin.value ? [
                        {
                            key: 'admin/accounts',
                            type: 'link',
                            title: 'Accounts',
                            to: '/admin/accounts',
                            route_active: 'admin-accounts',
                            path_active: '/admin/accounts',
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
                        },{
                            key: 'admin/users',
                            type: 'link',
                            title: 'Users',
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
                            to: '/admin/associated-accounts',
                            route_active: 'admin-associated-accounts'
                        },{
                            key: 'admin/associated-users',
                            type: 'link',
                            title: 'Users',
                            to: '/admin/associated-users',
                            route_active: 'admin-associated-users',
                            path_active: '/admin/associated-users',
                        },{
                            key: 'admin/associated-companies',
                            type: 'link',
                            title: 'Companies',
                            to: '/admin/associated-companies',
                            route_active: 'admin-associated-companies',
                            path_active: '/admin/associated-companies',
                        },
                    ]: []),
                    ...(userIsSuperAdmin.value ? [
                        {
                            key: 'admin/companies',
                            type: 'link',
                            title: 'Companies',
                            to: '/admin/companies',
                            route_active: 'admin-companies',
                            path_active: '/admin/companies',
                        },
                    ]: []),{
                        key: 'admin/roles',
                        type: 'link',
                        title: 'Roles',
                        to: '/admin/roles',
                        route_active: 'admin-roles',
                        path_active: '/admin/roles',
                    },
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

        return tintColor.value;
    });
    const navigationHeightInPixels = computed(() => {
        return (navigationHeight.value + 'px');
    });
    const navigationHeaderSize = computed(() => {
        let size = 'sm'

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

        if (screenWidth.value >= screenWidthBreakpoint['zero']) {
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