<template>
    <div>
        <NuxtLayout :name="$coreStore.layout">
            <template #content>
                <div class="tw-mx-auto tw-max-w-screen-2xl tw-flex tw-justify-center">
                    <AccentFrame class="tw-my-4">
                        <template #content>
                            <div class="tw-relative tw-py-4">
                                <form @submit.prevent="handleLogin" class="tw-w-72">
                                    <div class="tw-block tw-font-medium tw-text-lg">
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
                                            :label="authPending ? 'Please wait...' : 'Login'"></Button>
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
import {computed, ref, onMounted, nextTick} from 'vue';

const {$coreStore} = useNuxtApp();
const {twoFactorLogin, isAuthenticated, authPending} = useAuth();

definePageMeta({
    layout: false,
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
