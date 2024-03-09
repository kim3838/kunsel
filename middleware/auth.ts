export default defineNuxtRouteMiddleware((to, from) => {
    const user = userState();
    const {
        setNavigationMode,
    } = useLayout();

    if(!user.value && to.path !== '/login'){
        setNavigationMode('solid');
        setLayout('landing');

        return navigateTo("/login", {replace: true});
    }
})