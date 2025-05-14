
import type {AssociatedCompanyT, SelectedCompanyT} from "@/public/js/types/association";

export const associatedCompanyState = () => {
    return useState<AssociatedCompanyT>("associated_company", () => {
        return {
            selection: [],
            selected: null,
        }
    });
};

export const useAssociation = () => {
    const user = userState();
    const associatedCompany = associatedCompanyState();

    const ssrFetchAssociatedCompanies = async() => {

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

            const {$authStore} = useNuxtApp();

            let associatedCompaniesSingleSelectPayload = $authStore.associatedCompanies.singleSelectPayload;
            let storedCompany = localStorage.getItem($authStore.SELECTED_ASSOCIATED_COMPANY_STORAGE_KEY);
            let selectedCompany: SelectedCompanyT = storedCompany ? storedCompany : associatedCompany.value.selected;

            if(_isNull(storedCompany)){
                localStorage.setItem($authStore.SELECTED_ASSOCIATED_COMPANY_STORAGE_KEY, String(associatedCompany.value.selected));
            }

            $authStore.associatedCompanies.singleSelectPayload = {
                ...associatedCompaniesSingleSelectPayload,
                data: associatedCompany.value.selection,
                selection: associatedCompany.value.selection,
                selected: selectedCompany
            };
        }
    }

    const updateStoredAssociatedCompany = (newValue: SelectedCompanyT) => {
        const {$authStore} = useNuxtApp();

        if(_isNull(newValue)){
            localStorage.removeItem($authStore.SELECTED_ASSOCIATED_COMPANY_STORAGE_KEY);
        } else {
            localStorage.setItem($authStore.SELECTED_ASSOCIATED_COMPANY_STORAGE_KEY, String(newValue));
        }
    }

    return {
        ssrFetchAssociatedCompanies,
        fetchAssociatedCompanies,
        storeAssociatedCompanies,
        updateStoredAssociatedCompany
    };
}