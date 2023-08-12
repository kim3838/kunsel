
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
            const { data, pending, refresh, error, status } = await useApiFetch("/api/user");

            user.value = data.value.values as User;
        }

        if(login.status._value == 'error'){
            console.log({
                auth_error: login.error.value.data
            });

            $coreStore.setServiceError({
                prompt: true,
                title: 'Authentication failed',
                payload: login.error.value.data
            });
        }

        return login;
    }

    return {user, login};
});