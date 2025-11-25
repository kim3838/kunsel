export default defineNuxtRouteMiddleware((to, from) => {
    const user = userState();
    const _debug = useNuxtApp().$debug as (key: string, payload: any) => void;
    const log = false;

    if(log){
        _debug('Middleware auth to', JSON.stringify({'name': (to.name as string).toLowerCase(), 'path': to.path}));
    }

    if(!user.value && to.path !== '/login'){

        return navigateTo("/login", {replace: true});
    }
})