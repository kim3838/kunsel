
export default defineNuxtRouteMiddleware((to, from) => {
    const { $authStore } = useNuxtApp();

    if($authStore.isLoggedIn && to.path !== '/'){
        return navigateTo("/", {replace: true});
    }
})