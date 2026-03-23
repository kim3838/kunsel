export default defineNuxtPlugin({
    enforce: 'pre',

    async setup(nuxtApp){
        const {user, ssrFetchUser} = useAuth();

        console.log('AUTH PLUGIN SETUP');

        console.log({
            'Check user': user.value
        });

        const userAuthenticatedOrDuringClientSideRendering: Boolean = (user.value !== undefined || import.meta.client);

        console.log({
            'Is client side': userAuthenticatedOrDuringClientSideRendering
        });

        if (userAuthenticatedOrDuringClientSideRendering) return;

        console.log({
            'Ssr fetch user': 'start'
        });

        //Fetch user on undefined user and server side rendering
        await ssrFetchUser();
    },

    hooks: {
        'app:created'(vueApp){}
    },
});