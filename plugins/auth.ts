//import { userState } from "~/composables/use-auth";

export default defineNuxtPlugin({
    enforce: 'pre',

    async setup(nuxtApp){
        const {user, fetchUser} = useAuth();

        console.log({'SETUP user' : user.value});

        if (user.value !== undefined) return;
        console.log('SETUP fetchUser');
        await fetchUser();
    },

    hooks: {

    },
});