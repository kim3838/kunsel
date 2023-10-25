
export default defineNuxtRouteMiddleware((to, from) => {
    const { $authStore } = useNuxtApp();

    if($authStore.user.email_verified_at == null && to.path !== '/verify'){
        return navigateTo("/verify", {replace: true});
    }
})