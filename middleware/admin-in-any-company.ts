export default defineNuxtRouteMiddleware(async (to, from) => {
    const debugEnabled = false;
    const {userIsSuperAdmin} = useAuth();
    const userIsAdminInAnyCompany = userIsAdminInAnyCompanyState();
    const {ssrFetchUserIsAdminInAnyCompany, fetchUserIsAdminInAnyCompany} = useAssociation();

    if(!userIsSuperAdmin.value){
        if(import.meta.server){
            if(debugEnabled){console.log('SSR MIDDLE');}

            await ssrFetchUserIsAdminInAnyCompany();
        } else if(import.meta.client){
            await fetchUserIsAdminInAnyCompany();
        }
    }

    if(!(userIsSuperAdmin.value || userIsAdminInAnyCompany.value)){
        return navigateTo("/", {replace: true});
    }
})