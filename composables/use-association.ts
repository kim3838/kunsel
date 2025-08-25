
import type {AssignedCompanyT, AssociatedCompanyT, SelectedCompanyT} from "@/public/js/types/association";

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
    const user = userState();
    const companyAssignmentTypeIsAdmin = companyAssignmentTypeIsAdminState();
    const adminInAnyCompany = adminInAnyCompanyState();
    const associatedCompany = associatedCompanyState();
    const currentRouteNameIsCompanyAdminProtected = computed(() => {
        const route = useRoute();

        return _includes([
            'settings-compensations',
            'settings-deductions',
            'settings-incometaxes',
            'settings-payperiodsettings',
            'settings-salarystatementmodules',
            'settings-formulasettings',
            'workforce-employees',
            'workforce-departments',
            'workforce-designations',
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

            let associatedCompaniesSingleSelectPayload = $authStore.associatedCompanies.singleSelectPayload;

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
                ...associatedCompaniesSingleSelectPayload,
                selection: associatedCompany.value.selection,
                selected: storedCompany.value
            };

            if(!userIsSuperAdmin.value){
                updateCompanyAssignmentType(storedCompany.value);
            }
        }
    }

    const updateStoredAssociatedCompany = (newValue: SelectedCompanyT) => {
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
        } else {

            //Increment updatedAssociatedCompanyFlag and use it on a watcher as is the associated company updated
            $associationStore.updatedAssociatedCompanyFlag++;
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
    }

    return {
        ssrFetchAssociatedCompanies,
        fetchAssociatedCompanies,
        ssrFetchIsAdminInAnyCompany,
        fetchIsAdminInAnyCompany,
        storeAssociatedCompanies,
        updateStoredAssociatedCompany,
        updateCompanyAssignmentType,
        resetUserAssociationStates
    };
}