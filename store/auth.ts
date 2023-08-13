
import { defineStore } from 'pinia'
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

    async function logout(options: UseFetchOptions<T> = {}){
        const { $coreStore } = useNuxtApp();
        $coreStore.resetServiceError();

        const logout = await useApiFetch("/logout", {
            method: 'POST',
            ...options
        });

        if(logout.status._value == 'success'){
            user.value = null;
            navigateTo("/login");
        }

        if(logout.status._value == 'error'){
            $coreStore.setServiceError({
                prompt: true,
                icon: 'ic:sharp-lens-blur',
                title: 'Logout failed',
                payload: logout.error.value.data
            });
        }
    }

    async function fetchUser(){
        const { data, status } = await useApiFetch("/api/user", {
            method: 'GET'
        });

        if(status._value == 'success'){
            user.value = data.value.values as User;
        }
    }

    async function login(credentials: Credentials, options: UseFetchOptions<T> = {}) {
        const { $coreStore } = useNuxtApp();
        $coreStore.resetServiceError();

        if(!useCookie('XSRF-TOKEN').value){
            await useApiFetch("/sanctum/csrf-cookie");
        }

        const login = await useApiFetch("/login", {
            method: 'POST',
            body: credentials,
            ...options
        });

        if(login.status._value == 'success'){
            await fetchUser();
            navigateTo("/profile", {replace: true});
        }

        if(login.status._value == 'error'){
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