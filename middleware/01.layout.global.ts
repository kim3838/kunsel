export default defineNuxtRouteMiddleware((to, from) => {
    useRouteTo().value = {
        'name' : _lowerCase(to.name)
    };

    const {
        setNavigationMode,
    } = useLayout();

    if(!_includes(['index'],_lowerCase(to.name))){
        setNavigationMode('solid');
    }

    switch (_lowerCase(to.name)) {
        case 'index':
            setNavigationMode('clear');
            setLayout('snap-landing');
            break;
        case 'login':
            setLayout('landing');
            break;
        default:setLayout('default');
    }
})