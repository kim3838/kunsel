export default defineNuxtPlugin({
    enforce: 'pre',

    async setup(nuxtApp){
        const {user, ssrFetchUser} = useAuth();

        const userAuthenticatedOrDuringClientSideRendering: Boolean = (user.value !== undefined || process.client);

        if (userAuthenticatedOrDuringClientSideRendering) return;

        //Fetch user on undefined user and server side rendering
        await ssrFetchUser();
    },

    hooks: {
        'app:created'(vueApp){}
    },
});