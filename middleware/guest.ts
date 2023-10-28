export default defineNuxtRouteMiddleware((to, from) => {
    const user = userState();

    if(user.value && to.path !== '/'){
        return navigateTo("/", {replace: true});
    }
})