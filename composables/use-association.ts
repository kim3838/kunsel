
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

export const useAssociation = () => {
    const user = userState();
    const companyAssignmentTypeIsAdmin = companyAssignmentTypeIsAdminState();
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

        await callOnce(async () => {
            await laraSsrUseFetch("/api/associated-companies", {
                method: 'GET',
                params: {filters: {user_id: user?.value?.id}}
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

        await laraFetch("/api/associated-companies", {
            method: 'GET',
            params: {filters: {user_id: user?.value?.id}}
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

    const storeAssociatedCompanies = async() => {

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

            $authStore.associatedCompanies.singleSelectPayload = {
                ...associatedCompaniesSingleSelectPayload,
                data: associatedCompany.value.selection,
                selection: associatedCompany.value.selection,
                selected: storedCompany.value
            };

            updateCompanyAssignmentType(storedCompany.value);
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

        updateCompanyAssignmentType(newValue);

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
            return;
        }

        companyAssignmentTypeIsAdmin.value = selectedCompany.payload.assignment_type.value == COMPANY_ASSIGNMENT_TYPE.ADMIN;
    }

    return {
        ssrFetchAssociatedCompanies,
        fetchAssociatedCompanies,
        storeAssociatedCompanies,
        updateStoredAssociatedCompany,
        updateCompanyAssignmentType
    };
}