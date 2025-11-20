
import type {
    AssignedCompanyT,
    AssociatedCompanyT,
    SelectedAccountSubscriptionT,
    SelectedCompanyT
} from "@/public/js/types/association";
import type {
    EnumOption
} from "@/public/js/common/type";

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

export const companyAssignmentTypeIsAdminState = () => {
    return useState("company_assignment_type_is_admin", () => false);
}
export const adminInAnyCompanyState = () => {
    return useState("admin_in_any_company", () => false);
}

export const useAssociation = () => {
    const companyAssociationPending = companyAssociationPendingState();
    const user = userState();
    const companyAssignmentTypeIsAdmin = companyAssignmentTypeIsAdminState();
    const adminInAnyCompany = adminInAnyCompanyState();
    const associatedCompany = associatedCompanyState();
    const currentRouteNameIsCompanyAdminProtected = computed(() => {
        const route = useRoute();

        return _includes([
            'workforce-employees',
            'workforce-employee-groups',
            'workforce-departments',
            'workforce-designations',
            'workforce-shift-assignment',
            'workforce-attendance',
            'policies-pay-frequencies',
            'policies-payroll-components',
            'policies-shifts',
            'policies-holiday',
            'settings-salary-statement-modules',
            'settings-formula-settings',
            'import-employees',
            'import-employment-profile',
            'import-employee-payroll-component',
            'import-attendance',
        ], _toLower(String(route.name)));
    });

    const ssrFetchAssociatedCompanies = async() => {
        const {userIsSuperAdmin} = useAuth();

        await callOnce(async () => {
            let associatedCompaniesApi = userIsSuperAdmin.value ? '/api/company-selections' : '/api/associated-company-selections';
            let associatedCompaniesApiFilters = userIsSuperAdmin.value ? {} : {
                user_id: user?.value?.id,
                assignment_type: [COMPANY_ASSIGNMENT_TYPE.DEFAULT, COMPANY_ASSIGNMENT_TYPE.ADMIN],
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
            assignment_type: [COMPANY_ASSIGNMENT_TYPE.DEFAULT, COMPANY_ASSIGNMENT_TYPE.ADMIN],
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

    const ssrFetchIsAdminInAnyCompany = async() => {

        await callOnce(async () => {

            await laraSsrUseFetch('/api/is-admin-in-any-company', {
                method: 'GET',
            }, {
                onSuccessResponse: async (request, options, response) => {
                    adminInAnyCompany.value = _get(response, '_data.values.is_admin_in_any_company', false);
                }
            });
        });
    }

    const fetchIsAdminInAnyCompany = async() => {

        await laraFetch('/api/is-admin-in-any-company', {
            method: 'GET',
        }, {
            onSuccessResponse: async (request, options, response) => {
                adminInAnyCompany.value = _get(response, '_data.values.is_admin_in_any_company', false);
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

        const {sessionDomain} = useRuntimeConfig().public;
        const {$authStore} = useNuxtApp();

        if(!$authStore.selectedAssociatedCompany){
            return;
        }

        const storedAccountSubscription = useCookie<SelectedAccountSubscriptionT>($authStore.SELECTED_ACCOUNT_SUBSCRIPTION_STORAGE_KEY,{
            domain: sessionDomain,
            sameSite: 'lax',
        });

        let companySubscriptions: EnumOption[] = $authStore.selectedAssociatedCompany?.payload.account.subscriptions as EnumOption[];

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

        if(currentRouteNameIsCompanyAdminProtected.value && !(userIsSuperAdmin.value || companyAssignmentTypeIsAdmin.value)){
            navigateTo("/", {replace: true});

            if(useAuth().isAuthenticated.value){

                await useCommon().fetchOrganizationSelections();

                //Update stored account subscription
                await updateStoreAssociatedAccountSubscriptions();

                companyAssociationPending.value = false;
            }

        } else {

            if(useAuth().isAuthenticated.value){

                await useCommon().fetchOrganizationSelections();

                //Update stored account subscription before company update flag increment
                await updateStoreAssociatedAccountSubscriptions();
            }

            //Increment updatedAssociatedCompanyFlag and use it on a watcher as is the associated company updated
            $associationStore.updatedAssociatedCompanyFlag++;

            companyAssociationPending.value = false;
        }
    }

    const updateCompanyAssignmentType = (selectedCompanyValue: null | number | string = null): void => {

        const normalizedSelectedCompanyValue = selectedCompanyValue === null ? null :
            typeof selectedCompanyValue === 'string' ? Number(selectedCompanyValue) : selectedCompanyValue;

        const selectedCompany: AssignedCompanyT | undefined = associatedCompany.value.selection.find(
            company => company.value === normalizedSelectedCompanyValue
        );

        if (!selectedCompany) {
            companyAssignmentTypeIsAdmin.value = false;
            return;
        }

        companyAssignmentTypeIsAdmin.value = selectedCompany.payload?.assignment_type?.value == COMPANY_ASSIGNMENT_TYPE.ADMIN;
    }

    const resetUserAssociationStates = async() => {
        companyAssignmentTypeIsAdmin.value = false;
        adminInAnyCompany.value = false;
        associatedCompany.value = {
            selection: [],
            selected: null,
        }
    }

    return {
        ssrFetchAssociatedCompanies,
        fetchAssociatedCompanies,
        ssrFetchIsAdminInAnyCompany,
        fetchIsAdminInAnyCompany,
        storeAssociatedCompanies,
        updateStoredAssociatedCompany,
        selectedAssociatedCompanyChanged,
        selectedAssociatedAccountSubscriptionChanged,
        updateCompanyAssignmentType,
        resetUserAssociationStates
    };
}