
export default defineNuxtRouteMiddleware((to, from) => {
    const { $authStore } = useNuxtApp();

    if(!$authStore.isAuthenticated && to.path !== '/login'){
        return navigateTo("/login", {replace: true});
    }
})