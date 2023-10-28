<template>
    <div>
        <NuxtLayout :name="$coreStore.layout">
            <template #content>
                <div class="tw-mx-auto tw-max-w-screen-2xl tw-flex tw-justify-center">
                    <AccentFrame class="tw-my-4">
                        <template #content>
                            <div class="tw-relative tw-py-4">
                                <form @submit.prevent="handleLogin" class="tw-w-72">
                                    <div class="tw-block">
                                        <InputLabel :size="'md'" for="email" value="Email" />
                                        <Input
                                            :disabled="authPending"
                                            :size="'md'"
                                            id="email"
                                            type="email"
                                            class="tw-w-full"
                                            ref="emailInput"
                                            v-model="email"
                                            autofocus
                                            autocomplete="off" />
                                    </div>

                                    <div class="tw-block tw-mt-4">
                                        <InputLabel :size="'md'" for="password" value="Password" />
                                        <Input
                                            :disabled="authPending"
                                            :size="'md'"
                                            id="password"
                                            type="password"
                                            class="tw-w-full"
                                            v-model="password"
                                            required
                                            autocomplete="current-password" />
                                    </div>

                                    <div v-if="$coreStore.service.error.payload && !useNuxtApp().$coreStore.service.error.prompt" class="tw-block tw-text-sm tw-text-red-400">
                                        <span>{{ $coreStore.service.error.payload.message }}</span>
                                    </div>

                                    <div v-if="!isAuthenticated" class="tw-flex tw-mt-4 tw-items-center tw-justify-between">
                                        <div class="tw-block tw-text-sm tw-underline">
                                            <NuxtLink :to="'forgot-password'">Forgot password.</NuxtLink>
                                        </div>
                                        <Button
                                            :disabled="authPending"
                                            :size="'md'"
                                            :variant="'flat'"
                                            :icon="authPending ? 'eos-icons:installing' : 'mdi:key-chain'"
                                            :label="authPending ? 'Authenticating...' : 'Authenticate'"></Button>
                                    </div>
                                </form>
                            </div>
                        </template>
                    </AccentFrame>
                </div>
            </template>
        </NuxtLayout>
    </div>
</template>

<script setup lang="ts">
import {ref, onMounted, nextTick} from 'vue';
const {$coreStore} = useNuxtApp();
const {isAuthenticated, login, authPending} = useAuth();

definePageMeta({
    layout: false,
    middleware: 'guest'
});

let emailInput = ref(null);

onMounted(async () => {
    await nextTick();
    emailInput.value.$refs.input.focus();
})

const email = ref("luxere20@gmail.com");
const password = ref("password");

function handleLogin(){
    login({
        email: email,
        password: password
    });
}
</script>

<style scoped>
.container {
    @apply tw-flex tw-justify-center tw-items-center tw-text-center tw-mx-auto;
    /*border: 1px solid silver;*/
}

.login-hero{
    background-image: url("/images/hero/667a2407-ae78-4e4d-b69e-059552bca96e.webp");
    background-repeat: no-repeat;
    background-size: cover;
}
</style>
