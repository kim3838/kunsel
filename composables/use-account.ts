export const useAccount = () => {
    const createAccountCookie = () => {
        const {$authStore} = useNuxtApp();
        const {sessionDomain} = useRuntimeConfig().public;

        return useCookie<number>($authStore.SELECTED_ASSOCIATED_ACCOUNT_STORAGE_KEY, {
            domain: sessionDomain,
            sameSite: 'lax',
        });
    };

    const storePersistAccount = (value: number) => {
        const storedAccount = createAccountCookie();

        if ((!Number.isNaN(value) && typeof value === 'number') && storedAccount.value !== value) {
            storedAccount.value = value;
        }
    };

    const persistAccount = computed(() => {
        const storedAccount = createAccountCookie();
        return storedAccount.value;
    });

    return {
        storePersistAccount,
        persistAccount
    };
};