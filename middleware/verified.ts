export default defineNuxtRouteMiddleware((to, from) => {
    const user = userState();

    const shouldVerify = !(user?.value?.email_verified_at);

    if(shouldVerify && to.path !== '/verify'){
        return navigateTo("/verify", {replace: true});
    }
})