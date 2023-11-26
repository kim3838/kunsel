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
            method: 'GET'
        }, {
            onSuccessResponse: async (request, response, options) => {
                user.value = {
                    id: _get(response, '_data.values.id', null),
                    name: _get(response, '_data.values.name', null),
                    email: _get(response, '_data.values.email', null),
                    email_verified_at: _get(response, '_data.values.email_verified_at', null),
                };
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
    async function login(credentials: LoginCredentials) {
        if (isAuthenticated.value) return;

        const {$coreStore} = useNuxtApp();
        $coreStore.resetServiceError();
        authPending.value = true;

        await csrFetch("/sanctum/csrf-cookie");

        await csrFetch("/api/login", {
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
        });
    }

    async function twoFactorLogin(form = {}) {
        if (isAuthenticated.value) return;

        const {$coreStore} = useNuxtApp();
        $coreStore.resetServiceError();
        authPending.value = true;

        await csrFetch("/api/two-factor-login", {
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

        await csrFetch("/api/logout", {
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
        login,
        twoFactorLogin,
        authPending,
        logout
    };
}