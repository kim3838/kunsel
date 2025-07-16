
export default defineNuxtRouteMiddleware(async (to, from) => {
    const {userIsSuperAdmin} = useAuth();

    if(!userIsSuperAdmin.value ){
        return navigateTo("/", {replace: true});
    }
})