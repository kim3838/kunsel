import type {SelectedCompanyT} from "public/js/types/association";

export default defineNuxtRouteMiddleware(async (to, from) => {
    const {$authStore} = useNuxtApp();
    const {userIsSuperAdmin} = useAuth();
    const companyAssignmentTypeIsAdmin = companyAssignmentTypeIsAdminState();
    const {updateCompanyAssignmentType} = useAssociation();

    await useAppBootstrap().ssrBoot();

    const storedCompany = useCookie<SelectedCompanyT>($authStore.SELECTED_ASSOCIATED_COMPANY_STORAGE_KEY);
    updateCompanyAssignmentType(storedCompany.value);

    if(!(userIsSuperAdmin.value || companyAssignmentTypeIsAdmin.value)){
        return navigateTo("/", {replace: true});
    }
})