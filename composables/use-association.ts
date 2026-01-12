
import type {
    AssignedAccountSubscriptionT,
    AssignedCompanyT,
    AssociatedCompanyT,
    SelectedAccountSubscriptionT,
    SelectedCompanyT
} from "@/public/js/types/association";
import type {
    EnumOption, StringEnumInterface
} from "@/public/js/common/type";
import type {
    EmployeeT
} from "@/public/js/types/employee";

export const companyAssociationPendingState = () => {
    return useState("company_association_pending", () => false);
}

export const associatedCompanyState = () => {
    return useState<AssociatedCompanyT>("associated_company", () => {
        return {
            selection: [],
            selected: null,
        }
    });
};

export const userIsAdminOfSelectedCompanyState = () => {
    return useState("user_is_admin_of_selected_company", () => false);
}
export const userIsEmployeeOfSelectedCompanyState = () => {
    return useState("user_is_employee_of_selected_company", () => false);
}
export const userIsAdminInAnyCompanyState = () => {
    return useState("user_is_admin_in_any_company", () => false);
}
export const userCompanyEmployeeState = () => {
    return useState<EmployeeT | null>("user_company_employee", () => null);
}

export const useAssociation = () => {

    const nuxtApp = useNuxtApp();
    const stringEnumerableValue = nuxtApp.$stringEnumerableValue as (enumerable: StringEnumInterface, value: number) => string;
    const user = userState();

    const companyAssociationPending = companyAssociationPendingState();
    const userIsAdminOfSelectedCompany = userIsAdminOfSelectedCompanyState();
    const userIsEmployeeOfSelectedCompany = userIsEmployeeOfSelectedCompanyState();
    const userCompanyEmployee = userCompanyEmployeeState();
    const userIsAdminInAnyCompany = userIsAdminInAnyCompanyState();
    const associatedCompany = associatedCompanyState();
    const currentRouteNameIsCompanyAdminProtected = computed(() => {
        const route = useRoute();
        const hrPayrollRouteSlug = stringEnumerableValue(SUBSCRIPTION_MODULE_ROUTE_NAME, SUBSCRIPTION_MODULE.HR_PAYROLL as number);

        return _includes([
            `${hrPayrollRouteSlug}-workforce-employees`,
            `${hrPayrollRouteSlug}-workforce-employee-groups`,
            `${hrPayrollRouteSlug}-workforce-employment-profiles`,
            `${hrPayrollRouteSlug}-workforce-departments`,
            `${hrPayrollRouteSlug}-workforce-designations`,
            `${hrPayrollRouteSlug}-workforce-attendance`,
            `${hrPayrollRouteSlug}-workforce-overtime`,
            `${hrPayrollRouteSlug}-workforce-leave`,
            `${hrPayrollRouteSlug}-policies-shifts`,
            `${hrPayrollRouteSlug}-policies-shift-assignment`,
            `${hrPayrollRouteSlug}-policies-leave-types`,
            `${hrPayrollRouteSlug}-policies-leave-type-assignment`,
            `${hrPayrollRouteSlug}-policies-holiday`,
            `${hrPayrollRouteSlug}-payroll-formulas`,
            `${hrPayrollRouteSlug}-payroll-salary-statement-modules`,
            `${hrPayrollRouteSlug}-payroll-payroll-components`,
            `${hrPayrollRouteSlug}-payroll-employee-pay-items`,
            `${hrPayrollRouteSlug}-payroll-payroll-frequencies`,
            `${hrPayrollRouteSlug}-reports-leave-balance-map`,
            `${hrPayrollRouteSlug}-import-employees`,
            `${hrPayrollRouteSlug}-import-employment-profile`,
            `${hrPayrollRouteSlug}-import-employee-payroll-component`,
            `${hrPayrollRouteSlug}-import-attendance`,
            `${hrPayrollRouteSlug}-import-overtime`,
        ], _toLower(String(route.name)));
    });
    const currentRouteNameIsEmployeeProtected = computed(() => {
        const route = useRoute();
        const employeePortalRouteSlug = stringEnumerableValue(SUBSCRIPTION_MODULE_ROUTE_NAME, SUBSCRIPTION_MODULE.EMPLOYEE_PORTAL as number);

        return _includes([
            `${employeePortalRouteSlug}-attendance`
        ], _toLower(String(route.name)));
    });
    const employeeSelfServicesSubscriptions = computed(() => {
        return [
            SUBSCRIPTION_MODULE.EMPLOYEE_PORTAL
        ];
    })

    const ssrFetchAssociatedCompanies = async() => {
        const {userIsSuperAdmin} = useAuth();

        await callOnce(async () => {
            let associatedCompaniesApi = userIsSuperAdmin.value ? '/api/company-selections' : '/api/associated-company-selections';
            let associatedCompaniesApiFilters = userIsSuperAdmin.value ? {} : {
                user_id: user?.value?.id,
                assignment_types: [COMPANY_ASSIGNMENT_TYPE.DEFAULT, COMPANY_ASSIGNMENT_TYPE.ADMIN],
            };

            await laraSsrUseFetch(associatedCompaniesApi, {
                method: 'GET',
                params: {
                    filters: associatedCompaniesApiFilters
                }
            }, {
                onSuccessResponse: async (request, options, response) => {
                    let selection = _get(response, '_data.values.selection', []);
                    let selected = _get(response, '_data.values.selected', null);

                    associatedCompany.value = {
                        ...associatedCompany.value,
                        selection: selection,
                        selected: selected
                    }
                }
            });
        })
    }

    const fetchAssociatedCompanies = async() => {
        const {userIsSuperAdmin} = useAuth();

        let associatedCompaniesApi = userIsSuperAdmin.value ? '/api/company-selections' : '/api/associated-company-selections';
        let associatedCompaniesApiFilters = userIsSuperAdmin.value ? {} : {
            user_id: user?.value?.id,
            assignment_types: [COMPANY_ASSIGNMENT_TYPE.DEFAULT, COMPANY_ASSIGNMENT_TYPE.ADMIN],
        };

        await laraFetch(associatedCompaniesApi, {
            method: 'GET',
            params: {
                filters: associatedCompaniesApiFilters
            }
        }, {
            onSuccessResponse: async (request, options, response) => {
                let selection = _get(response, '_data.values.selection', []);
                let selected = _get(response, '_data.values.selected', null);

                associatedCompany.value = {
                    ...associatedCompany.value,
                    selection: selection,
                    selected: selected
                }
            }
        }, false);
    }

    const ssrFetchUserIsAdminInAnyCompany = async() => {

        await callOnce(async () => {

            await laraSsrUseFetch('/api/user-is-admin-in-any-company', {
                method: 'GET',
            }, {
                onSuccessResponse: async (request, options, response) => {
                    userIsAdminInAnyCompany.value = _get(response, '_data.values.user_is_admin_in_any_company', false);
                }
            });
        });
    }

    const fetchUserIsAdminInAnyCompany = async() => {

        await laraFetch('/api/user-is-admin-in-any-company', {
            method: 'GET',
        }, {
            onSuccessResponse: async (request, options, response) => {
                userIsAdminInAnyCompany.value = _get(response, '_data.values.user_is_admin_in_any_company', false);
            }
        }, false);
    }

    const storeAssociatedCompanies = async() => {
        const {userIsSuperAdmin} = useAuth();

        if(useAuth().isAuthenticated.value){

            const {sessionDomain} = useRuntimeConfig().public;
            const {$authStore} = useNuxtApp();

            const storedCompany = useCookie<SelectedCompanyT>($authStore.SELECTED_ASSOCIATED_COMPANY_STORAGE_KEY,{
                domain: sessionDomain,
                sameSite: 'lax',
            });

            if(storedCompany.value == undefined){

                storedCompany.value = associatedCompany.value.selected;
            }

            const storedCompanyIdExistsOnSelection = _some(associatedCompany.value.selection, company => company.value == storedCompany.value);

            if(!storedCompanyIdExistsOnSelection){
                storedCompany.value = associatedCompany.value.selected;
            }

            $authStore.associatedCompanies.singleSelectPayload = {
                ...$authStore.associatedCompanies.singleSelectPayload,
                selection: associatedCompany.value.selection,
                selected: storedCompany.value
            };

            if(!userIsSuperAdmin.value){
                updateCompanyAssignmentType(storedCompany.value);
            }

            //Store company's account subscriptions
            await updateStoreAssociatedAccountSubscriptions();
        }
    }

    const selectedAssociatedCompanyChanged = async (newValue: SelectedCompanyT) => {
        companyAssociationPending.value = true;
        await updateStoredAssociatedCompany(newValue);
    };

    const updateStoreAssociatedAccountSubscriptions = async() => {

        const {userIsSuperAdmin} = useAuth();
        const {sessionDomain} = useRuntimeConfig().public;
        const {$authStore} = useNuxtApp();

        if(!$authStore.selectedAssociatedCompany){
            return;
        }

        const storedAccountSubscription = useCookie<SelectedAccountSubscriptionT>($authStore.SELECTED_ACCOUNT_SUBSCRIPTION_STORAGE_KEY,{
            domain: sessionDomain,
            sameSite: 'lax',
        });

        let companySubscriptions: AssignedAccountSubscriptionT[] = $authStore.selectedAssociatedCompany?.payload.account.subscriptions as AssignedAccountSubscriptionT[];

        // Subscription options

        //If user is employee and not an admin, show only employee self-services options
        if(!userIsAdminOfSelectedCompany.value && userIsEmployeeOfSelectedCompany.value){
            companySubscriptions = companySubscriptions.filter((subscription: EnumOption) => {
                return employeeSelfServicesSubscriptions.value.includes(subscription.value as number)
            })
        }

        //If superadmin or (admin and not an employee), filter out employee self-services options
        if(userIsSuperAdmin.value || (userIsAdminOfSelectedCompany.value && !userIsEmployeeOfSelectedCompany.value)){
            companySubscriptions = companySubscriptions.filter((subscription: EnumOption) => {
                return !employeeSelfServicesSubscriptions.value.includes(subscription.value as number)
            })
        }

        //If not superadmin and (not admin and not an employee), filter out all options
        if(!userIsSuperAdmin.value && (!userIsAdminOfSelectedCompany.value && !userIsEmployeeOfSelectedCompany.value)){
            companySubscriptions = [];
        }

        if(storedAccountSubscription.value == undefined && _first(companySubscriptions)){

            storedAccountSubscription.value = _first(companySubscriptions)?.value as number;
        }

        //Check if the stored selected account subscription is one from the selection
        const storedAccountSubscriptionExistsOnSelection = _some(companySubscriptions, subscription => subscription.value == storedAccountSubscription.value);

        if(!storedAccountSubscriptionExistsOnSelection){

            //If selection has at least 1 options, set the first one as selected
            if(_first(companySubscriptions)){
                storedAccountSubscription.value = _first(companySubscriptions)?.value as number;
            } else {
                storedAccountSubscription.value = null;
            }
        }

        $authStore.accountSubscriptions.singleSelectPayload = {
            ...$authStore.accountSubscriptions.singleSelectPayload,
            selection: companySubscriptions,
            selected: storedAccountSubscription.value
        };
    }

    const selectedAssociatedAccountSubscriptionChanged = async (newValue: SelectedAccountSubscriptionT) => {

        const {sessionDomain} = useRuntimeConfig().public;
        const {$authStore, $associationStore} = useNuxtApp();

        const storedAccountSubscription = useCookie<SelectedAccountSubscriptionT>($authStore.SELECTED_ACCOUNT_SUBSCRIPTION_STORAGE_KEY,{
            domain: sessionDomain,
            sameSite: 'lax',
        });

        storedAccountSubscription.value = newValue;

        $associationStore.associatedAccountSubscriptionSelectionKey++;
        $associationStore.updatedAssociatedAccountSubscriptionFlag++;
    };

    const updateStoredAssociatedCompany = async (newValue: SelectedCompanyT) => {
        const {sessionDomain} = useRuntimeConfig().public;
        const {$authStore, $associationStore} = useNuxtApp();
        const {userIsSuperAdmin} = useAuth();

        const storedCompany = useCookie<SelectedCompanyT>($authStore.SELECTED_ASSOCIATED_COMPANY_STORAGE_KEY,{
            domain: sessionDomain,
            sameSite: 'lax',
        });

        storedCompany.value = newValue;

        if(!userIsSuperAdmin.value){
            updateCompanyAssignmentType(newValue);
        }

        const routeIsAdminProtectedAndUserIsNotAdmin = currentRouteNameIsCompanyAdminProtected.value && !(userIsSuperAdmin.value || userIsAdminOfSelectedCompany.value);
        const routeIsEmployeeProtectedAndUserIsNotEmployee = currentRouteNameIsEmployeeProtected.value && !userIsEmployeeOfSelectedCompany.value;

        //If the navigating user does not have the right on the current protected route while changing company,
        //redirect to dashboard
        if(
            routeIsAdminProtectedAndUserIsNotAdmin
            || routeIsEmployeeProtectedAndUserIsNotEmployee
        ){
            navigateTo("/", {replace: true});

            if(useAuth().isAuthenticated.value){

                await useCommon().fetchOrganizationSelections();

                //Update stored account subscription
                await updateStoreAssociatedAccountSubscriptions();

                companyAssociationPending.value = false;
            }

            return;
        }

        //If the navigating user has the right on the current protected route while changing company,
        //do not redirect and increment the company update flag
        if(useAuth().isAuthenticated.value){

            await useCommon().fetchOrganizationSelections();

            //Update stored account subscription before company update flag increment
            await updateStoreAssociatedAccountSubscriptions();
        }

        //Increment updatedAssociatedCompanyFlag and use it on a watcher as is the associated company updated
        $associationStore.updatedAssociatedCompanyFlag++;

        companyAssociationPending.value = false;
    }

    const updateCompanyAssignmentType = (selectedCompanyValue: null | number | string = null): void => {

        const normalizedSelectedCompanyValue = selectedCompanyValue === null ? null :
            typeof selectedCompanyValue === 'string' ? Number(selectedCompanyValue) : selectedCompanyValue;

        const selectedCompany: AssignedCompanyT | undefined = associatedCompany.value.selection.find(
            company => company.value === normalizedSelectedCompanyValue
        );

        if (!selectedCompany) {
            userIsAdminOfSelectedCompany.value = false;
            userIsEmployeeOfSelectedCompany.value = false;
            userCompanyEmployee.value = null;
            return;
        }

        userIsAdminOfSelectedCompany.value = selectedCompany.payload?.assignment_type?.value == COMPANY_ASSIGNMENT_TYPE.ADMIN;
        userIsEmployeeOfSelectedCompany.value = selectedCompany.payload?.is_employee || false;
        if(userIsEmployeeOfSelectedCompany.value){
            userCompanyEmployee.value = selectedCompany.payload?.employee;
        }
    }

    const resetUserAssociationStates = async() => {
        userIsAdminOfSelectedCompany.value = false;
        userIsEmployeeOfSelectedCompany.value = false;
        userCompanyEmployee.value = null;
        userIsAdminInAnyCompany.value = false;
        associatedCompany.value = {
            selection: [],
            selected: null,
        }
    }

    return {
        ssrFetchAssociatedCompanies,
        fetchAssociatedCompanies,
        ssrFetchUserIsAdminInAnyCompany,
        fetchUserIsAdminInAnyCompany,
        storeAssociatedCompanies,
        updateStoredAssociatedCompany,
        selectedAssociatedCompanyChanged,
        selectedAssociatedAccountSubscriptionChanged,
        updateCompanyAssignmentType,
        resetUserAssociationStates
    };
}