export default defineNuxtRouteMiddleware((to, from) => {
    useRouteTo().value = {
        'name' : to.name.toLowerCase()
    };

    // console.log({'GLOBAL MIDDLEWARE USEROUTE TO': useRouteTo().value.name});
    // console.log({'GLOBAL MIDDLEWARE TO PATH': to.path});
    // console.log({'GLOBAL MIDDLEWARE TO REDIRECTED FROM': to.redirectedFrom?.name});
    // console.log({'GLOBAL MIDDLEWARE TO NAME': to.name.toLowerCase()});
})