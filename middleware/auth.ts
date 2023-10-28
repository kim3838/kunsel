export default defineNuxtRouteMiddleware((to, from) => {
    const user = userState();

    if(!user.value && to.path !== '/login'){
        return navigateTo("/login", {replace: true});
    }
})