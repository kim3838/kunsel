export default defineNuxtPlugin(async (nuxtApp) => {
    const {$authStore} = useNuxtApp();

    if (!$authStore.isAuthenticated) {
        await $authStore.fetchUser();
    }
});