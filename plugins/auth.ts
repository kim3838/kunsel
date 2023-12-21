export default defineNuxtPlugin({
    enforce: 'pre',

    async setup(nuxtApp){
        const {user, fetchUser} = useAuth();

        if (user.value !== undefined || process.client) return;

        await fetchUser();
    },

    hooks: {
        'app:created'(vueApp){}
    },
});