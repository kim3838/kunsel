
export default defineNuxtRouteMiddleware((to, from) => {
    const { $authStore } = useNuxtApp();

    if($authStore.isAuthenticated && to.path !== '/'){
        return navigateTo("/", {replace: true});
    }
})