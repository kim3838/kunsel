export default defineNuxtRouteMiddleware((to, from) => {
    useRouteTo().value = {
        'name' : to.name.toLowerCase()
    };

    //Todo: Move all setNavigationMode and setLayout into their respective pages

    // const {
    //     setNavigationMode,
    // } = useLayout();
    //
    // if(!_includes(['index'], to.name.toLowerCase())){
    //     setNavigationMode('solid', 'GLOBAL MIDDLEWARE');
    // }

    console.log({'GLOBAL MIDDLEWARE ROUTE TO': useRouteTo().value.name});
    console.log({'GLOBAL MIDDLEWARE TO PATH': to.path});
    console.log({'GLOBAL MIDDLEWARE TO NAME': to.name.toLowerCase()});

    // switch (to.name.toLowerCase()) {
    //     case 'index':
    //         setNavigationMode('clear', 'GLOBAL MIDDLEWARE');
    //         setLayout('snap-landing', 'GLOBAL MIDDLEWARE');
    //         break;
    //     case 'login':
    //         setLayout('landing', 'GLOBAL MIDDLEWARE');
    //         break;
    //     case 'forgot-password':
    //         setLayout('landing', 'GLOBAL MIDDLEWARE');
    //         break;
    //     case 'password-reset-token':
    //         setLayout('landing', 'GLOBAL MIDDLEWARE');
    //         break;
    //     case 'two-factor-challenge':
    //         setLayout('landing', 'GLOBAL MIDDLEWARE');
    //         break;
    //     default:setLayout('default', 'GLOBAL MIDDLEWARE');
    // }
})