export default defineNuxtRouteMiddleware((to, from) => {
    const user = userState();

    //console.log({'GUEST MIDDLEWARE USEROUTE TO': useRouteTo().value.name});

    //console.log({'GUEST MIDDLEWARE TO PATH': to.path});
    //console.log({'GUEST MIDDLEWARE TO NAME': to.name.toLowerCase()});

    if(user.value && to.path !== '/'){

        useRouteTo().value = {
            'name' : 'index'
        };

        return navigateTo("/", {replace: true});
    }
})