export default defineNuxtRouteMiddleware(async (to, from) => {
    const {userIsSuperAdmin} = useAuth();
    const userIsAdminInAnyCompany = userIsAdminInAnyCompanyState();
    const {ssrFetchUserIsAdminInAnyCompany, fetchUserIsAdminInAnyCompany} = useAssociation();

    if(!userIsSuperAdmin.value){
        if(import.meta.server){
            await ssrFetchUserIsAdminInAnyCompany();
        } else if(import.meta.client){
            await fetchUserIsAdminInAnyCompany();
        }
    }

    if(!(userIsSuperAdmin.value || userIsAdminInAnyCompany.value)){
        return navigateTo("/", {replace: true});
    }
})