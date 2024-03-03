export default defineNuxtRouteMiddleware((to, from) => {
    useRouteTo().value = {
        'name' : _lowerCase(to.name)
    };

    if(_includes(['index','login'],_lowerCase(to.name))){
        setLayout('landing');
    } else {
        setLayout('default');
    }

    if(_includes(['index'],_lowerCase(to.name))){
        setNavigationMode('clear');
    } else {
        setNavigationMode('solid');
    }
})