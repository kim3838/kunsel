export const laraHeaders = () => {
    const {frontendURL} = useRuntimeConfig().public;
    const CSRF_COOKIE = "XSRF-TOKEN";
    const CSRF_HEADER = "X-XSRF-TOKEN";

    let headers: any = {
        referer: frontendURL,
        accept: 'application/json, text/plain, */*'
    };

    let token = useCookie(CSRF_COOKIE, {
        secure: true,
        sameSite: 'lax'
    });

    if(token.value){
        headers[CSRF_HEADER] = token.value;
    }

    if(process.server){
        headers = {
            ...headers,
            ...useRequestHeaders(['cookie'])
        }
    }

    return headers;
}