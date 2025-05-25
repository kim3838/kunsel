
import {defineStore} from 'pinia'
import type {SelectedCompanyT, StoreAssociatedCompanyT} from "@/public/js/types/association";

export const useAuthStore = defineStore('auth', () => {

    const SELECTED_ASSOCIATED_COMPANY_STORAGE_KEY = 'persist_company';

    const associatedCompanies = ref<{
        singleSelectPayload: StoreAssociatedCompanyT;
    }>({
        singleSelectPayload: {
            search: '',
            data: [],
            selection: [],
            selected: null
        }
    });

    const selectedAssociatedCompany = computed(() => {
        return associatedCompanies.value.singleSelectPayload.selected;
    })

    function resetAssociatedCompanies() {
        const storedCompany = useCookie<SelectedCompanyT>(SELECTED_ASSOCIATED_COMPANY_STORAGE_KEY);
        storedCompany.value = null;

        associatedCompanies.value = {
            singleSelectPayload: {
                search: '',
                data: [],
                selection: [],
                selected: null
            }
        }
    }

    return {
        SELECTED_ASSOCIATED_COMPANY_STORAGE_KEY,
        associatedCompanies,
        resetAssociatedCompanies,
        selectedAssociatedCompany
    }
})