export const laraHeaders = () => {
    const {frontendURL} = useRuntimeConfig().public;
    const CSRF_COOKIE = "XSRF-TOKEN";
    const CSRF_HEADER = "X-XSRF-TOKEN";
    const logEnabled = false;

    if(logEnabled){
        console.log({
            'LARA HEADERS': 'START'
        });
    }

    let headers: any = {
        referer: frontendURL,
        accept: 'application/json, text/plain, */*'
    };

    let token = useCookie(CSRF_COOKIE);

    if(logEnabled){
        console.log({
            'LARA HEADERS TOKEN': token.value
        });
    }

    if(token.value){
        headers[CSRF_HEADER] = token.value;
    }

    if(import.meta.server){
        headers = {
            ...headers,
            ...useRequestHeaders(['cookie'])
        }
    }

    if(logEnabled){
        console.log({
            'LARA HEADERS RETURN': headers
        });
    }

    return headers;
}