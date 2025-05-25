
import type {FetchResponse, ResolvedFetchOptions} from "ofetch";

export type User = {
    id: number | null,
    name: string | null,
    email: string | null,
    email_verified_at: string | null,
    type: number | null,
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
    const userIsSuperAdmin = computed(() => user.value?.type == USER_TYPE.SUPERADMIN);
    const authPending = ref(false);
    const {fetchAssociatedCompanies, storeAssociatedCompanies} = useAssociation();

    const ssrFetchUser = async () => {
        await laraSsrUseFetch("/api/user", {
            method: 'GET',
        }, {
            onSuccessResponse: async (request: RequestInfo, options: ResolvedFetchOptions, response: FetchResponse<any> | undefined) => {
                const userData = _get(response, '_data.values', undefined);
                user.value = userData as User | undefined;
            }
        });
    }

    const fetchUser = async() => {
        await laraFetch("/api/user", {
            method: 'GET',
        }, {
            onSuccessResponse: async (request: RequestInfo, options: ResolvedFetchOptions, response: FetchResponse<any> | undefined) => {
                const userData = _get(response, '_data.values', undefined);
                user.value = userData as User | undefined;
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
            onSuccessResponse: async (request, options, response) => {
                let twoFactorChallenge = _get(response, '_data.values.two_factor_challenge', false);

                if(twoFactorChallenge){
                    await navigateTo({
                        path: '/two-factor-challenge',
                        replace: true
                    });
                } else {
                    await fetchUser();
                    await fetchAssociatedCompanies();
                    await storeAssociatedCompanies();
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
            onSuccessResponse: async (request, options, response) => {
                await fetchUser();
                await navigateTo({
                    path: '/',
                    replace: true
                });
            }
        });
    }

    async function destroyAuthentication() {
        if (!isAuthenticated.value) return;

        const {$coreStore} = useNuxtApp();
        $coreStore.resetServiceError();

        await laraFetch("/api/logout", {
            method: 'POST'
        },{
            onSuccessResponse: (request, options, response) => {
                logout();
                navigateTo("/login", {replace: true});
            }
        });
    }

    async function logout(){
        useAuthStore().resetAssociatedCompanies()
        user.value = undefined;
    }

    return {
        user,
        isAuthenticated,
        userIsSuperAdmin,
        fetchUser,
        ssrFetchUser,
        login,
        twoFactorLogin,
        authPending,
        destroyAuthentication,
        logout
    };
}