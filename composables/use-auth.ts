import {UseFetchOptions} from "nuxt/app";

export type User = {
    id: number | null,
    name: string | null,
    email: string | null,
    email_verified_at: string | null,
};

type LoginCredentials = {
    email: string,
    password: string,
    remember: boolean
};

export const userState = () => {
    return useState<User | undefined | null>("user", () => undefined);
};

export const useAuth = () => {
    const user = userState();
    const isAuthenticated = computed(() => !!user.value);
    const authPending = ref(false);

    async function fetchUser() {
        await ssrFetch("/api/user", {
            method: 'GET',
            onResponse({request, response, options}) {
                console.log({'SSR FETCH USER RESPONSE' : response._data.code});

                if(response._data.code == 200){
                    user.value = {
                        id: _get(response, '_data.values.id', null),
                        name: _get(response, '_data.values.name', null),
                        email: _get(response, '_data.values.email', null),
                        email_verified_at: _get(response, '_data.values.email_verified_at', null),
                    };
                }
            }
        });
    }

    /*
    * options: UseFetchOptions can consist of
    *
    * -Fetch options https://nuxt.com/docs/api/composables/use-fetch
    * -interceptors https://github.com/unjs/ofetch
    *   * May override onRequestError or onResponse
    **/
    async function login(credentials: LoginCredentials, options: UseFetchOptions = {}) {
        if (isAuthenticated.value) return;

        const {$coreStore} = useNuxtApp();
        $coreStore.resetServiceError();
        authPending.value = true;

        await ssrFetch("/sanctum/csrf-cookie");

        await ssrFetch("/login", {
            method: 'POST',
            body: credentials,
            onRequestError({ request, options, error }) {
                authPending.value = false;

                $coreStore.setServiceError({
                    prompt: true,
                    icon: 'ic:sharp-error-outline',
                    title: 'Request failed',
                    payload: {message: error.message}
                });
            },
            async onResponse({request, response, options}) {
                authPending.value = false;

                if (response?._data?.code >= 500 && response?._data?.code < 600) {
                    $coreStore.setServiceError({
                        prompt: true,
                        icon: 'ic:sharp-error-outline',
                        title: 'Authentication failed',
                        payload: response._data
                    });
                } else if(response?._data?.code >= 401 && response?._data?.code < 499){
                    $coreStore.setServiceError({
                        prompt: true,
                        icon: 'ic:sharp-error-outline',
                        title: 'Authentication failed',
                        payload: response._data
                    });
                } else {
                    await fetchUser();
                    await navigateTo({
                        path: '/',
                        replace: true
                    });
                }
            },
            ...options
        });
    }

    async function logout(options: UseFetchOptions = {}) {
        if (!isAuthenticated.value) return;

        const {$coreStore} = useNuxtApp();
        $coreStore.resetServiceError();

        await ssrFetch("/sanctum/csrf-cookie");

        const logout = await ssrFetch("/logout", {
            method: 'POST',
            ...options
        });

        if (logout.status._value == 'success') {
            user.value = null;
            navigateTo("/login", {replace: true});
        }

        if (logout.status._value == 'error') {
            $coreStore.setServiceError({
                prompt: true,
                icon: 'ic:sharp-lens-blur',
                title: 'Logout failed',
                payload: logout.error.value.data
            });
        }
    }

    return {
        user,
        isAuthenticated,
        fetchUser,
        login,
        authPending,
        logout
    };
}