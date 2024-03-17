<template>
    <div class="tw-mx-auto tw-px-4 tw-max-w-screen-2xl tw-flex tw-justify-center">
        <div class="tw-hidden sm:tw-block tw-px-4 tw-py-8 tw-h-96 tw-w-96">
            <div class="tw-w-full tw-h-full tw-bg-contain tw-bg-center tw-bg-no-repeat" :style="{'background-image': 'url(/deco/undraw/undraw_two_factor_authentication_namy.svg)'}"></div>
        </div>
        <AccentFrame class="tw-my-4">
            <template #content>
                <div class="tw-relative tw-py-4">
                    <form @submit.prevent="handleLogin" class="tw-w-72">
                        <div class="tw-block tw-text-lg tw-font-semibold tw-mb-4">
                            Enter your code
                        </div>
                        <template v-if="! recovery">
                            Please confirm access to your account by entering the authentication code provided by your authenticator application.
                        </template>

                        <template v-else>
                            Please confirm access to your account by entering one of your emergency recovery codes.
                        </template>

                        <div class="tw-block tw-mt-4">
                            <InputLabel :size="'md'" for="code" :value="recovery ? 'Enter Recovery Code' : 'Enter Authentication Code'" />
                            <Input
                                :disabled="authPending"
                                :size="'md'"
                                id="code"
                                type="text"
                                v-model="code"
                                class="tw-w-full"
                                ref="codeInput"
                                inputmode="numeric"
                                :placeholder="recovery ? 'Recovery code' : 'Authentication code'"
                                autocomplete="off" />
                        </div>

                        <div v-if="$coreStore.service.error.payload && !useNuxtApp().$coreStore.service.error.prompt" class="tw-block tw-text-sm tw-text-red-400">
                            <span>{{ $coreStore.service.error.payload.message }}</span>
                        </div>

                        <div v-if="!isAuthenticated" class="tw-flex tw-mt-4 tw-items-center tw-justify-between">
                            <div class="tw-block tw-text-sm tw-self-end">
                                <NuxtLink @click.prevent="toggleRecovery" class="hover:tw-underline tw-cursor-pointer">
                                    {{!recovery ? 'Use a recovery code' : 'Use an authentication code'}}
                                </NuxtLink>
                            </div>
                            <Button
                                :disabled="authPending"
                                :size="'md'"
                                :icon="authPending ? 'eos-icons:installing' : 'mdi:key-chain'"
                                :label="authPending ? 'Logging in...' : 'Login'"></Button>
                        </div>
                    </form>
                </div>
            </template>
        </AccentFrame>
    </div>
</template>

<script setup lang="ts">
const {$coreStore} = useNuxtApp();
const {twoFactorLogin, isAuthenticated, authPending} = useAuth();

definePageMeta({
    middleware: 'guest'
});

const recovery = ref(false);
const codeInput = ref(null);
const code = ref("");
const twoFactorLoginComputed = computed(() => {
    return {
        [recovery.value ? 'recovery_code' : 'code']: code.value
    }
});

onMounted(async () => {
    await nextTick();
    codeInput.value.$refs.input.focus();
});

const toggleRecovery = async () => {
    recovery.value ^= true;

    await nextTick();

    code.value = '';
};

function handleLogin(){
    twoFactorLogin(twoFactorLoginComputed);
}
</script>
