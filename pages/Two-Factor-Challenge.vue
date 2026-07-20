<template>
    <div>
        <LandingWrapper>
            <div class="mx-auto pt-4 max-w-screen-2xl">
                <div class="min-h-120 flex flex-row items-center justify-center lg:px-10 gap-20">

                    <AccentFrame class="max-w-min mx-auto lg:mx-0 ">
                        <template #content>
                            <div class="relative py-4">

                                <div class="font-header text-lg font-medium">Two Factor Auth Challenge</div>

                                <form @submit.prevent="handleLogin" class="mt-4 w-80">
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
                                            :size="'md'"
                                            id="code"
                                            type="text"
                                            v-model="code"
                                            class="w-full"
                                            ref="codeInput"
                                            inputmode="numeric"
                                            :placeholder="recovery ? 'Recovery code' : 'Authentication code'" />
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
                                            :override="{font_family_class: `font-serif`}"
                                            :icon="authPending ? 'eos-icons:loading' : ''"
                                            :label="authPending ? 'Logging in...' : 'Login'"></Button>
                                    </div>
                                </form>
                            </div>
                        </template>
                    </AccentFrame>
                </div>
            </div>
        </LandingWrapper>
    </div>
</template>

<script setup lang="ts">
useHead({titleTemplate: (titleChunk) => {return `Two Factor Challenge`}});
definePageMeta({middleware: 'guest'});
useLayout().setNavigationMode('solid');
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
