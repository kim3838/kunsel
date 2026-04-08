import type {SelectedCompanyT} from "@/public/js/types/association";

export default defineNuxtRouteMiddleware(async (to, from) => {
    const debugEnabled = true;
    const {$authStore} = useNuxtApp();
    const {userIsSuperAdmin} = useAuth();
    const userIsEmployeeOfSelectedCompany = userIsEmployeeOfSelectedCompanyState();
    const {ssrFetchAssociatedCompanies,fetchAssociatedCompanies,storeAssociatedCompanies,updateCompanyAssignmentType} = useAssociation();

    if(!userIsSuperAdmin.value){
        if(import.meta.server){
            if(debugEnabled){console.log('SSR MIDDLE');}

            await ssrFetchAssociatedCompanies();
        } else if(import.meta.client){
            await fetchAssociatedCompanies();
            await storeAssociatedCompanies();
        }

        const storedCompany = useCookie<SelectedCompanyT>($authStore.SELECTED_ASSOCIATED_COMPANY_STORAGE_KEY);
        updateCompanyAssignmentType(storedCompany.value);
    }

    if(!userIsEmployeeOfSelectedCompany.value){
        return navigateTo("/", {replace: true});
    }
})