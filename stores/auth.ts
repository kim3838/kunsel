import {defineStore} from 'pinia'
import {UseFetchOptions} from "nuxt/app";

type User = {
    id: number,
    name: string,
    email: string,
    email_verified_at: string,
};

type Credentials = {
    email: string,
    password: string
};

export const useAuthStore = defineStore('auth', () => {
    const user = ref<User | null>(null);
    const isLoggedIn = computed(() => !!user.value);

    async function logout(options: UseFetchOptions = {}) {
        const {$coreStore} = useNuxtApp();
        $coreStore.resetServiceError();

        const logout = await ssrFetch("/logout", {
            method: 'POST',
            ...options
        });

        if (logout.status._value == 'success') {
            user.value = null;
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
                    user.value = response._data.values;
                }
            }
        });
    }

    async function login(credentials: Credentials, options: UseFetchOptions = {}) {
        const {$coreStore} = useNuxtApp();
        $coreStore.resetServiceError();

        if (!useCookie('XSRF-TOKEN').value) {
            await ssrFetch("/sanctum/csrf-cookie");
        }

        const login = await ssrFetch("/login", {
            method: 'POST',
            body: credentials,
            ...options
        });

        if (login.status._value == 'success') {
            await fetchUser();
            navigateTo("/profile", {replace: true});
        }

        if (login.status._value == 'error') {
            $coreStore.setServiceError({
                prompt: true,
                icon: 'ic:sharp-error-outline',
                title: 'Authentication failed',
                payload: login.error.value.data
            });
        }
    }

    return {user, login, isLoggedIn, fetchUser, logout};
});