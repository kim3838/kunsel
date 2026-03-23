export const laraHeaders = () => {
    const {frontendURL} = useRuntimeConfig().public;
    const CSRF_COOKIE = "XSRF-TOKEN";
    const CSRF_HEADER = "X-XSRF-TOKEN";

    console.log({
        'Lara headers': 'start'
    });

    let headers: any = {
        referer: frontendURL,
        accept: 'application/json, text/plain, */*'
    };

    let token = useCookie(CSRF_COOKIE);

    console.log({
        'Lara headers token': token.value
    });

    if(token.value){
        headers[CSRF_HEADER] = token.value;
    }

    if(import.meta.server){
        headers = {
            ...headers,
            ...useRequestHeaders(['cookie'])
        }
    }

    console.log({
        'Lara headers return': headers
    });

    return headers;
}