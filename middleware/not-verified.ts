export default defineNuxtRouteMiddleware((to, from) => {
    const user = userState();

    if(user?.value?.email_verified_at && to.path !== '/'){
        return navigateTo("/", {replace: true});
    }
})