export default defineNuxtPlugin({
    enforce: 'pre',

    async setup(nuxtApp){
        const {user} = useAuth();

        const userAuthenticatedOrDuringClientSideRendering: Boolean = (user.value !== undefined || process.client);

        if (userAuthenticatedOrDuringClientSideRendering) return;

        //Fetch user
        const {baseURL} = useRuntimeConfig().public;

        const {data: userData} = await useFetch(baseURL + "/api/user", {
            credentials: 'include',
            headers: laraHeaders(),
            async onResponse({ request, response, options }) {}
        });

        user.value = _get(userData.value, 'values', undefined);
    },

    hooks: {
        'app:created'(vueApp){}
    },
});