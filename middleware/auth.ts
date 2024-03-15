export default defineNuxtRouteMiddleware((to, from) => {
    const user = userState();
    const {
        setNavigationMode,
    } = useLayout();

    if(!user.value && to.path !== '/login'){
        setNavigationMode('solid');
        setLayout('snap-landing');

        return navigateTo("/login", {replace: true});
    }
})