<template>
    <div>
        <LandingWrapper>
            <div class="mx-auto pt-4 max-w-screen-2xl scaffold-border-left-bottom-right">
                <div class="flex justify-center">
                    <AccentFrame class="my-4">
                        <template #content>
                            <div class="relative py-4">
                                <label class="text-lg font-medium font-header">Password Login</label>
                                <form @submit.prevent="handleLogin" class="mt-4 w-80">
                                    <div class="block">
                                        <InputLabel :size="'md'" for="identifier" value="Username or Email" />
                                        <Input
                                            :disabled="authPending"
                                            :size="'lg'"
                                            id="identifier"
                                            class="w-full"
                                            ref="identifierInput"
                                            v-model="identifier"
                                            autocomplete="off" />
                                    </div>

                                    <div class="block mt-4">
                                        <InputLabel :size="'md'" for="password" value="Password" />
                                        <Input
                                            :disabled="authPending"
                                            :size="'lg'"
                                            id="password"
                                            :type="'password'"
                                            class="w-full tracking-widest"
                                            v-model="password"
                                            required
                                            autocomplete="current-password" />
                                    </div>

                                    <div class="block mt-4">
                                        <label class="flex items-center">
                                            <Checkbox
                                                :disabled="authPending"
                                                name="remember"
                                                v-model="remember"
                                                :size="'md'"
                                                :label="'Remember me'" />
                                        </label>
                                    </div>

                                    <div v-if="$coreStore.service.error.payload && !$coreStore.service.error.prompt" class="block text-sm text-red-500">
                                        <span>{{ $coreStore.service.error.payload.message }}</span>
                                    </div>

                                    <div v-if="!isAuthenticated" class="flex mt-4 items-center justify-between">
                                        <div class="block text-sm self-end">
                                            <NuxtLink class="hover:underline" :to="'forgot-password'">Forgot password.</NuxtLink>
                                        </div>
                                        <div class="flex-grow-[0.5]">
                                            <Button
                                                :justify-content="'center'"
                                                :disabled="authPending"
                                                :size="'md'"
                                                :icon="authPending ? 'eos-icons:installing' : 'mdi:key-chain'"
                                                :label="authPending ? 'Logging in...' : 'Login'"></Button>
                                        </div>
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
definePageMeta({middleware: 'guest'});
useLayout().setNavigationMode('solid', 'Login.vue');
const clientReadyState = useClientReadyState();
const {$coreStore} = useNuxtApp();
const runtimeConfig = useRuntimeConfig();
const {isAuthenticated, login, authPending} = useAuth();
const presetUsername = process.env.NODE_ENV === 'development' ? runtimeConfig.public.devUsername : '';
const presetPassword = process.env.NODE_ENV === 'development' ? runtimeConfig.public.devUserPassword : '';
let identifierInput = ref(null);

//On navigate, focus on identifier input
if(clientReadyState.value){
    onMounted(async () => {
        await nextTick(()=>{
            if(identifierInput.value){
                //@ts-ignore
                identifierInput.value.$refs.input.focus();
            }
        });
    })
}

//On page load, focus on identifier input
watch(clientReadyState, async (clientReady) => {

    if(clientReady){
        await nextTick(() => {
            if(identifierInput.value){
                //@ts-ignore
                identifierInput.value.$refs.input.focus();
            }
        });
    }
});

const identifier = ref(presetUsername);
const password = ref(presetPassword);
const remember = ref(false);

function handleLogin(){
    login({
        identifier: identifier.value,
        password: password.value,
        remember: remember.value
    });
}
</script>

<style scoped>
.container {
    @apply flex justify-center items-center text-center mx-auto;
}
</style>
