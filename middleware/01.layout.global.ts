export default defineNuxtRouteMiddleware((to, from) => {
    useRouteTo().value = {
        'name' : to.name.toLowerCase()
    };

    //console.log({'GLOBAL MIDDLEWARE TO': to.name.toLowerCase()});
})