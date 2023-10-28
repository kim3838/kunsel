import {defineStore} from 'pinia'

type User = {
    id: number | null,
    name: string | null,
    email: string | null,
    email_verified_at: string | null,
};

export const useAuthStore = defineStore('auth', () => {
    const user = ref<User>({
        id: null,
        name: null,
        email: null,
        email_verified_at: null,
    });

    const isAuthenticated = computed(() => (user.value?.id != null));

    function setUser(payload){
        user.value = {
            id: _get(payload, 'id', null),
            name: _get(payload, 'name', null),
            email: _get(payload, 'email', null),
            email_verified_at: _get(payload, 'email_verified_at', null),
        };
    }

    return {user, isAuthenticated, setUser};
});