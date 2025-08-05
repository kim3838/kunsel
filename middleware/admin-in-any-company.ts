export default defineNuxtRouteMiddleware(async (to, from) => {
    const {userIsSuperAdmin} = useAuth();
    const adminInAnyCompany = adminInAnyCompanyState();
    const {ssrFetchIsAdminInAnyCompany, fetchIsAdminInAnyCompany} = useAssociation();

    if(!userIsSuperAdmin.value){
        if(import.meta.server){
            await ssrFetchIsAdminInAnyCompany();
        } else if(import.meta.client){
            await fetchIsAdminInAnyCompany();
        }
    }

    if(!(userIsSuperAdmin.value || adminInAnyCompany.value)){
        return navigateTo("/", {replace: true});
    }
})