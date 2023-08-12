
import { defineStore } from 'pinia'

type User = {
    id: number,
    name: string,
    email: string
};

type Credentials = {
    email: string,
    password: string
};

export const useAuthStore = defineStore('auth', () => {
    const user = ref<User | null>(null);
    const isLoggedIn = computed(() => !!user.value);

    async function logout(){
        const { $coreStore } = useNuxtApp();
        const { error, status } = await useApiFetch("/logout", {
            method: 'POST'
        });

        if(status._value == 'success'){
            user.value = null;
            navigateTo("/login");
        }

        if(status._value == 'error'){
            $coreStore.setServiceError({
                prompt: true,
                icon: 'ic:sharp-lens-blur',
                title: 'Logout failed',
                payload: error.value.data
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

    async function login(credentials: Credentials) {
        const { $coreStore } = useNuxtApp();
        $coreStore.resetServiceError();

        if(!useCookie('XSRF-TOKEN').value){
            await useApiFetch("/sanctum/csrf-cookie");
        }

        const login = await useApiFetch("/login", {
            method: 'POST',
            body: credentials
        });

        if(login.status._value == 'success'){
            await fetchUser();
        }

        if(login.status._value == 'error'){
            console.log({
                auth_error: login.error.value.data
            });

            $coreStore.setServiceError({
                prompt: true,
                icon: 'ic:sharp-error-outline',
                title: 'Authentication failed',
                payload: login.error.value.data
            });
        }

        return login;
    }

    return {user, login, isLoggedIn, fetchUser, logout};
});