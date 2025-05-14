<template>
    <div>
        <LandingWrapper>
            <div class="mx-auto px-4 max-w-screen-2xl flex justify-center">
                <div class="hidden sm:block px-4 py-8 h-96 w-96">
                    <div class="w-full h-full bg-contain bg-center bg-no-repeat" :style="{'background-image': 'url(/deco/undraw/undraw_two_factor_authentication_namy.svg)'}"></div>
                </div>
                <AccentFrame class="my-4">
                    <template #content>
                        <div class="relative py-4">
                            <form @submit.prevent="handleLogin" class="w-80">
                                <div class="block text-lg font-medium mb-4">
                                    Enter your code
                                </div>
                                <template v-if="! recovery">
                                    Please confirm access to your account by entering the authentication code provided by your authenticator application.
                                </template>

                                <template v-else>
                                    Please confirm access to your account by entering one of your emergency recovery codes.
                                </template>

                                <div class="block mt-4">
                                    <InputLabel :size="'md'" for="code" :value="recovery ? 'Enter Recovery Code' : 'Enter Authentication Code'" />
                                    <Input
                                        :disabled="authPending"
                                        :size="'lg'"
                                        id="code"
                                        type="text"
                                        v-model="code"
                                        class="w-full"
                                        ref="codeInput"
                                        inputmode="numeric"
                                        :placeholder="recovery ? 'Recovery code' : 'Authentication code'"
                                        autocomplete="off" />
                                </div>

                                <div v-if="$coreStore.service.error.payload && !useNuxtApp().$coreStore.service.error.prompt" class="block text-sm text-red-400">
                                    <span>{{ $coreStore.service.error.payload.message }}</span>
                                </div>

                                <div v-if="!isAuthenticated" class="flex mt-4 items-center justify-between">
                                    <div class="block text-sm self-end">
                                        <NuxtLink @click.prevent="toggleRecovery" class="hover:underline cursor-pointer">
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
        </LandingWrapper>
    </div>
</template>

<script setup lang="ts">
definePageMeta({middleware: 'guest'});
useLayout().setNavigationMode('solid', 'Two-Factor-Challenge.vue');
const clientReadyState = useClientReadyState();
const {$coreStore} = useNuxtApp();
const {twoFactorLogin, isAuthenticated, authPending} = useAuth();

const recovery = ref(false);
const codeInput = ref(null);
const code = ref("");
const twoFactorLoginComputed = computed(() => {
    return {
        [recovery.value ? 'recovery_code' : 'code']: code.value
    }
});

//On navigate, focus on identifier input
if(clientReadyState.value){
    onMounted(async () => {
        await nextTick(()=>{
            if(codeInput.value){
                //@ts-ignore
                codeInput.value.$refs.input.focus();
            }
        });
    })
}

//On page load, focus on code input
watch(clientReadyState, async (clientReady) => {
    if(clientReady){
        await nextTick(() => {
            if(codeInput.value){
                //@ts-ignore
                codeInput.value.$refs.input.focus();
            }
        });
    }
});

const toggleRecovery = async () => {
    recovery.value = !recovery.value;

    await nextTick();

    code.value = '';
};

function handleLogin(){
    twoFactorLogin(twoFactorLoginComputed.value);
}
</script>
