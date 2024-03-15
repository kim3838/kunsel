export default defineNuxtRouteMiddleware((to, from) => {
    useRouteTo().value = {
        'name' : _lowerCase(to.name)
    };

    const {
        setNavigationMode,
    } = useLayout();

    if(_includes(['index'],_lowerCase(to.name))){
        setNavigationMode('clear');
    } else {
        setNavigationMode('solid');
    }

    if(_includes(['index','login'],_lowerCase(to.name))){
        setLayout('snap-landing');
    } else {
        setLayout('default');
    }
})