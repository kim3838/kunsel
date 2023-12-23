<template>
    <div>
        <NuxtLayout name="landing">
            <template #content>
                <div class="tw-mx-auto tw-max-w-screen-2xl tw-flex tw-justify-center">
                    <AccentFrame class="tw-my-4">
                        <template #content>
                            <div class="tw-relative tw-py-4">
                                <form @submit.prevent="handleLogin" class="tw-w-72">
                                    <div class="tw-block">
                                        <InputLabel :size="'md'" for="identifier" value="Username or Email" />
                                        <Input
                                            :disabled="authPending"
                                            :size="'md'"
                                            id="identifier"
                                            type="text"
                                            class="tw-w-full"
                                            ref="identifierInput"
                                            v-model="identifier"
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

                                    <div class="tw-block tw-mt-4">
                                        <label class="tw-flex tw-items-center">
                                            <Checkbox
                                                :disabled="authPending"
                                                name="remember"
                                                v-model="remember"
                                                :size="'md'"
                                                :label="'Remember me'" />
                                        </label>
                                    </div>

                                    <div v-if="$coreStore.service.error.payload && !useNuxtApp().$coreStore.service.error.prompt" class="tw-block tw-text-sm tw-text-red-400">
                                        <span>{{ $coreStore.service.error.payload.message }}</span>
                                    </div>

                                    <div v-if="!isAuthenticated" class="tw-flex tw-mt-4 tw-items-center tw-justify-between">
                                        <div class="tw-block tw-text-sm tw-self-end">
                                            <NuxtLink class="hover:tw-underline" :to="'forgot-password'">Forgot password.</NuxtLink>
                                        </div>
                                        <Button
                                            :disabled="authPending"
                                            :size="'md'"
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
const {$coreStore, $layoutStore} = useNuxtApp();
const {isAuthenticated, login, authPending} = useAuth();

$layoutStore.setNavigationMode('solid');

definePageMeta({
    layout: false,
    middleware: 'guest'
});

let identifierInput = ref(null);

onMounted(async () => {
    await nextTick();
    identifierInput.value.$refs.input.focus();
})

const identifier = ref("kim.123");
const password = ref("password");
const remember = ref(false);

function handleLogin(){
    login({
        identifier: identifier,
        password: password,
        remember: remember
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
