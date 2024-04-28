export default defineNuxtRouteMiddleware((to, from) => {
    const user = userState();

    console.log({'GUEST MIDDLEWARE USEROUTE TO': useRouteTo().value.name});

    console.log({'AUTH MIDDLEWARE TO PATH': to.path});
    console.log({'AUTH MIDDLEWARE TO NAME': to.name.toLowerCase()});

    if(!user.value && to.path !== '/login'){
        useRouteTo().value = {
            'name' : 'login'
        };

        return navigateTo("/login", {replace: true});
    }
})