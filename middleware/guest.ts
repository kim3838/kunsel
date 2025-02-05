export default defineNuxtRouteMiddleware((to, from) => {
    const user = userState();

    //console.log({'GUEST MIDDLEWARE TO PATH': to.path});
    //console.log({'GUEST MIDDLEWARE TO NAME': to.name.toLowerCase()});

    if(user.value && to.path !== '/'){

        return navigateTo("/", {replace: true});
    }
})