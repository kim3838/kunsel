export default defineNuxtRouteMiddleware((to, from) => {
    useRouteTo().value = {
        'name' : to.name.toLowerCase()
    };

    const {
        setNavigationMode,
    } = useLayout();

    if(!_includes(['index'], to.name.toLowerCase())){
        setNavigationMode('solid');
    }

    switch (to.name.toLowerCase()) {
        case 'index':
            setNavigationMode('clear');
            setLayout('snap-landing');
            break;
        case 'login':
            setLayout('landing');
            break;
        case 'forgot-password':
            setLayout('landing');
            break;
        case 'two-factor-challenge':
            setLayout('landing');
            break;
        default:setLayout('default');
    }
})