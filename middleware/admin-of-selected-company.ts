import type {SelectedCompanyT} from "public/js/types/association";

export default defineNuxtRouteMiddleware(async (to, from) => {
    const {$authStore} = useNuxtApp();
    const {userIsSuperAdmin} = useAuth();
    const companyAssignmentTypeIsAdmin = companyAssignmentTypeIsAdminState();
    const {ssrFetchAssociatedCompanies,fetchAssociatedCompanies,storeAssociatedCompanies,updateCompanyAssignmentType} = useAssociation();

    if(!userIsSuperAdmin.value){
        if(import.meta.server){
            await ssrFetchAssociatedCompanies();
        } else if(import.meta.client){
            await fetchAssociatedCompanies();
            await storeAssociatedCompanies();
        }
    }

    const storedCompany = useCookie<SelectedCompanyT>($authStore.SELECTED_ASSOCIATED_COMPANY_STORAGE_KEY);
    updateCompanyAssignmentType(storedCompany.value);

    if(!(userIsSuperAdmin.value || companyAssignmentTypeIsAdmin.value)){
        return navigateTo("/", {replace: true});
    }
})