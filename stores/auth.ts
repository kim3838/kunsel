
import {defineStore} from 'pinia'
import type {
    SelectedCompanyT,
    StoreAssociatedCompanyT,
    AssignedCompanyT,
    StoreAccountSubscriptionT,
    SelectedAccountSubscriptionT,
    AssignedAccountSubscriptionT
} from "@/public/js/types/association";

export const useAuthStore = defineStore('auth', () => {

    const SELECTED_ASSOCIATED_COMPANY_STORAGE_KEY = 'pc';
    const SELECTED_ACCOUNT_SUBSCRIPTION_STORAGE_KEY = 'pas';

    const associatedCompanies = ref<{
        singleSelectPayload: StoreAssociatedCompanyT;
    }>({
        singleSelectPayload: {
            search: '',
            selection: [],
            selected: null
        }
    });

    const selectedAssociatedCompanyId = computed(() => {
        return associatedCompanies.value.singleSelectPayload.selected;
    });

    const selectedAssociatedCompany = computed<AssignedCompanyT | undefined>(() => {
        return associatedCompanies.value.singleSelectPayload.selection.find(
            company => company.value == selectedAssociatedCompanyId.value
        );
    });

    const selectedAssociatedCompanyAccountId = computed<number | undefined>(() => {
        return selectedAssociatedCompany.value?.payload.account.id;
    });

    const accountSubscriptions = ref<{
        singleSelectPayload: StoreAccountSubscriptionT;
    }>({
        singleSelectPayload: {
            search: '',
            selection: [],
            selected: null
        }
    });

    const selectedAccountSubscriptionValue = computed(() => {
        return accountSubscriptions.value.singleSelectPayload.selected;
    });

    const selectedAccountSubscription = computed<AssignedAccountSubscriptionT | undefined>(() => {
        return accountSubscriptions.value.singleSelectPayload.selection.find(
            subscription => subscription.value == selectedAccountSubscriptionValue.value
        );
    });

    function resetAssociatedCompanies() {
        const {sessionDomain} = useRuntimeConfig().public;
        const storedCompany = useCookie<SelectedCompanyT>(SELECTED_ASSOCIATED_COMPANY_STORAGE_KEY,{
            domain: sessionDomain,
            sameSite: 'lax',
        });
        storedCompany.value = null;
        const storedAccountSubscription = useCookie<SelectedAccountSubscriptionT>(SELECTED_ACCOUNT_SUBSCRIPTION_STORAGE_KEY,{
            domain: sessionDomain,
            sameSite: 'lax',
        });
        storedAccountSubscription.value = null;

        let defaultSelectionPayload = {
            singleSelectPayload: {
                search: '',
                selection: [],
                selected: null
            }
        };

        associatedCompanies.value = {...defaultSelectionPayload};
        accountSubscriptions.value = {...defaultSelectionPayload};
    }

    return {
        SELECTED_ASSOCIATED_COMPANY_STORAGE_KEY,
        SELECTED_ACCOUNT_SUBSCRIPTION_STORAGE_KEY,

        associatedCompanies,
        selectedAssociatedCompanyId,
        selectedAssociatedCompany,
        selectedAssociatedCompanyAccountId,
        resetAssociatedCompanies,

        accountSubscriptions,
        selectedAccountSubscriptionValue,
        selectedAccountSubscription,
    }
})