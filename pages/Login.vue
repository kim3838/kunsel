<template>
    <div>
        <LandingWrapper>
            <div class="mx-auto pt-4">

                <div class="min-h-120 flex flex-row items-center justify-center lg:px-10 gap-20">

                    <AccentFrame class="h-[360px] max-w-min mx-auto lg:mx-0 ">
                        <template #content>
                            <div class="relative py-4">

                                <h1 class="font-header text-lg font-medium">Password login</h1>

                                <form @submit.prevent="handleLogin" class="mt-4 w-80">
                                    <div class="block">
                                        <InputLabel :size="'md'" for="identifier" value="Username or Email" />
                                        <Input
                                            :disabled="authPending"
                                            :size="'md'"
                                            id="identifier"
                                            class="w-full"
                                            ref="identifierInput"
                                            v-model="identifier" />
                                    </div>

                                    <div class="block mt-4">
                                        <InputLabel :size="'md'" for="password" value="Password" />
                                        <Input
                                            :disabled="authPending"
                                            :size="'md'"
                                            id="password"
                                            :type="'password'"
                                            class="w-full tracking-widest"
                                            v-model="password"
                                            required />
                                    </div>

                                    <div v-if="false" class="block mt-4">
                                        <label class="flex items-center">
                                            <Checkbox
                                                :disabled="authPending"
                                                name="remember"
                                                v-model="remember"
                                                :size="'md'"
                                                :label="'Remember me'" />
                                        </label>
                                    </div>

                                    <div v-if="$coreStore.hasNonPromptableServicePayloadMessage" class="block">
                                        <Label invert :size="'sm'" :type="'danger'" :label="$coreStore.servicePayloadMessage" />
                                    </div>

                                    <div class="flex mt-4 items-center justify-between">
                                        <div class="block text-sm self-end">
                                            <NuxtLink class="hover:underline" :to="'forgot-password'">Forgot password.</NuxtLink>
                                        </div>
                                        <div>
                                            <Button
                                                :justify-content="'center'"
                                                :variant="'default'"
                                                :disabled="authPending || isAuthenticated"
                                                :size="'md'"
                                                :icon="authPending ? 'eos-icons:loading' : ''"
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
import {storeToRefs} from "pinia";
const {$themeStore} = useNuxtApp();
const config = useRuntimeConfig()

useHead({titleTemplate: (titleChunk) => {return `${titleChunk} - Login`}});
useSeoMeta({
    description: `Securely access your account dashboard. Manage your workforce, review finances, and check business operations in real-time.`,
    robots: 'noindex, nofollow'
});
definePageMeta({middleware: 'guest'});
useLayout().setNavigationMode('solid');

const {
    hexAlpha,
    lining: liningColor,
    thread: threadColor,
    neutral: neutralColor,
    tint: tintColor,
} = storeToRefs($themeStore);

const clientReadyState = useClientReadyState();
const {$coreStore} = useNuxtApp();
const runtimeConfig = useRuntimeConfig();
const {isAuthenticated, login, authPending} = useAuth();
const presetUsername = process.env.NODE_ENV === 'development' ? runtimeConfig.public.devUsername : '';
const presetPassword = process.env.NODE_ENV === 'development' ? runtimeConfig.public.devUserPassword : '';
let identifierInput = ref(null);

$coreStore.resetServiceError();

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

.hero-bg {
    background-blend-mode: multiply;
    background-repeat: no-repeat;
    background-position: 50%;
    background-size: cover;
    background-image: url(/images/bg/background.webp);
    background-color: rgb(55 65 81/0.6);
}
</style>
