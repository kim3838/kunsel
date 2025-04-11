export type User = {
    id: number | null,
    name: string | null,
    email: string | null,
    email_verified_at: string | null,
    two_factor_enabled: boolean | null,
    two_factor_confirmed: boolean | null,
};

type LoginCredentials = {
    identifier: string,
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

    const ssrFetchUser = async () => {
        const {baseURL} = useRuntimeConfig().public;
        const {data: userData} = await useFetch(baseURL + "/api/user", {
            credentials: 'include',
            headers: laraHeaders()
        });

        user.value = _get(userData.value, 'values', undefined);
    }

    const fetchUser = async() => {
        await laraFetch("/api/user", {
            method: 'GET',
        }, {
            onSuccessResponse: async (request, response, options) => {
                user.value = {
                    id: _get(response, '_data.values.id', null),
                    name: _get(response, '_data.values.name', null),
                    email: _get(response, '_data.values.email', null),
                    email_verified_at: _get(response, '_data.values.email_verified_at', null),
                    two_factor_enabled: _get(response, '_data.values.two_factor_enabled', null),
                    two_factor_confirmed: _get(response, '_data.values.two_factor_confirmed', null),
                };
            }
        }, false);
    }

    /*
    * options: UseFetchOptions can consist of
    *
    * -Fetch options https://nuxt.com/docs/api/composables/use-fetch
    * -interceptors https://github.com/unjs/ofetch
    *   * May override onRequestError or onResponse
    **/
    async function login(credentials: LoginCredentials) {
        if (isAuthenticated.value) return;

        const {$coreStore} = useNuxtApp();
        $coreStore.resetServiceError();
        authPending.value = true;

        await laraFetch("/api/login", {
            method: 'POST',
            body: credentials
        }, {
            onRequest: () => {
                authPending.value = true;
            },
            onRequestError: () => {
                authPending.value = false;
            },
            onResponse: () => {
                authPending.value = false;
            },
            onSuccessResponse: async (request, response, options) => {
                let twoFactorChallenge = _get(response, '_data.values.two_factor_challenge', false);

                if(twoFactorChallenge){
                    await navigateTo({
                        path: '/two-factor-challenge',
                        replace: true
                    });
                } else {
                    await fetchUser();
                    await navigateTo({
                        path: '/',
                        replace: true
                    });
                }
            }
        }, false);
    }

    async function twoFactorLogin(form = {}) {
        if (isAuthenticated.value) return;

        const {$coreStore} = useNuxtApp();
        $coreStore.resetServiceError();
        authPending.value = true;

        await laraFetch("/api/two-factor-login", {
            method: 'POST',
            body: form
        }, {
            onRequest: () => {
                authPending.value = true;
            },
            onRequestError: () => {
                authPending.value = false;
            },
            onResponse: () => {
                authPending.value = false;
            },
            onNotAcceptableResponse: async() => {
                showError({
                    statusCode: 404,
                    statusMessage: "Challenged user not found."
                });
            },
            onSuccessResponse: async (request, response, options) => {
                await fetchUser();
                await navigateTo({
                    path: '/',
                    replace: true
                });
            }
        });
    }

    async function logout() {
        if (!isAuthenticated.value) return;

        const {$coreStore} = useNuxtApp();
        $coreStore.resetServiceError();

        await laraFetch("/api/logout", {
            method: 'POST'
        },{
            onSuccessResponse: (request, response, options) => {
                user.value = undefined;
                navigateTo("/login", {replace: true});
            }
        });
    }

    return {
        user,
        isAuthenticated,
        fetchUser,
        ssrFetchUser,
        login,
        twoFactorLogin,
        authPending,
        logout
    };
}