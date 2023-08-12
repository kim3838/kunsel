
export default defineNuxtPlugin(async (nuxtApp) => {
    const { $authStore } = useNuxtApp();

    if(!$authStore.isLoggedIn){
        await $authStore.fetchUser();
    }
});