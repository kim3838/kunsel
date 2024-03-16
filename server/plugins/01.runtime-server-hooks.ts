
/*
* Nitro App Hooks (runtime, server-side)
* https://nuxt.com/docs/api/advanced/hooks#nitro-app-hooks-runtime-server-side
*/
export default defineNitroPlugin((nitroApp) => {

    //Called before constructing the HTML.
    nitroApp.hooks.hook('render:html', (html, { event }) => {
        //console.log({'RUNTIME SERVER HOOK': 'render:html'});
    });

    //Called before sending the response.
    nitroApp.hooks.hook('render:response', (response, { event }) => {
        //console.log({'RUNTIME SERVER HOOK': 'render:response'});
    });
})