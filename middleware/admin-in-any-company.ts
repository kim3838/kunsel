export default defineNuxtRouteMiddleware(async (to, from) => {
    const {userIsSuperAdmin} = useAuth();
    const adminInAnyCompany = adminInAnyCompanyState();

    if(!userIsSuperAdmin.value){
        if(import.meta.server){
            await useAssociation().ssrFetchIsAdminInAnyCompany();
        } else if(import.meta.client){
            await useAssociation().fetchIsAdminInAnyCompany();
        }
    }

    if(!(userIsSuperAdmin.value || adminInAnyCompany.value)){
        return navigateTo("/", {replace: true});
    }
})