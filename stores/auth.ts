import {defineStore} from 'pinia'
import {UseFetchOptions} from "nuxt/app";

type User = {
    id: number | null,
    name: string | null,
    email: string | null,
    email_verified_at: string | null,
};

type Credentials = {
    email: string,
    password: string,
    remember: boolean
};

export const useAuthStore = defineStore('auth', () => {
    const user = ref<User>({
        id: null,
        name: null,
        email: null,
        email_verified_at: null,
    });
    const isAuthenticated = computed(() => (user.value?.id != null));
    let authPending = ref(false);

    async function logout(options: UseFetchOptions = {}) {
        if (!isAuthenticated.value) return;

        const {$coreStore} = useNuxtApp();
        $coreStore.resetServiceError();

        const logout = await ssrFetch("/logout", {
            method: 'POST',
            ...options
        });

        if (logout.status._value == 'success') {
            user.value = {
                id: null,
                name: null,
                email: null,
                email_verified_at: null,
            };
            navigateTo("/login");
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

    async function fetchUser() {
        const {data, status} = await ssrFetch("/api/user", {
            method: 'GET',
            onResponse({request, response, options}) {
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
    async function login(credentials: Credentials, options: UseFetchOptions = {}) {
        if (isAuthenticated.value) return;

        const {$coreStore} = useNuxtApp();
        $coreStore.resetServiceError();
        authPending.value = true;

        if (!useCookie('XSRF-TOKEN').value) {
            await ssrFetch("/sanctum/csrf-cookie");
        }

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

    return {user, login, isAuthenticated, authPending, fetchUser, logout};
});