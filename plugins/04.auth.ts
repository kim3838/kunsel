export default defineNuxtPlugin({
    enforce: 'pre',

    async setup(nuxtApp){
        const {user, ssrFetchUser} = useAuth();
        const logEnabled = false;

        if(logEnabled){
            console.log({
                '04.AUTH PLUGIN': 'START'
            });
        }

        if(logEnabled){
            console.log({
                'CHECK USER': user.value
            });
        }

        const userAuthenticatedOrDuringClientSideRendering: Boolean = (user.value !== undefined || import.meta.client);

        if(logEnabled){
            console.log({
                'IS CLIENT SIDE': userAuthenticatedOrDuringClientSideRendering
            });
        }

        if (userAuthenticatedOrDuringClientSideRendering) return;

        if(logEnabled){
            console.log({
                'SSR FETCH USER': 'PRE-START'
            });
        }

        //Fetch user on undefined user and server side rendering
        await ssrFetchUser();
    },

    hooks: {
        'app:created'(vueApp){}
    },
});