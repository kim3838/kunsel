
export default defineNuxtRouteMiddleware((to, from) => {
    const { $authStore } = useNuxtApp();

    if($authStore.isLoggedIn){
        return navigateTo("/", {replace: true});
    }
})