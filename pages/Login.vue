<template>
    <div>
        <LandingWrapper>
            <div class="tw-mx-auto tw-pt-4 tw-max-w-screen-2xl">
                <div class="tw-flex tw-justify-center">
                    <AccentFrame class="tw-my-4">
                        <template #content>
                            <div class="tw-relative tw-py-4">
                                <label class="tw-text-xl">Password Login</label>
                                <form @submit.prevent="handleLogin" class="tw-mt-4 tw-w-80">
                                    <div class="tw-block">
                                        <InputLabel :size="'md'" for="identifier" value="Username or Email" />
                                        <Input
                                            :disabled="authPending"
                                            :size="'lg'"
                                            id="identifier"
                                            type="text"
                                            class="tw-w-full"
                                            ref="identifierInput"
                                            v-model="identifier"
                                            autocomplete="off" />
                                    </div>

                                    <div class="tw-block tw-mt-4">
                                        <InputLabel :size="'md'" for="password" value="Password" />
                                        <Input
                                            :disabled="authPending"
                                            :size="'lg'"
                                            id="password"
                                            type="password"
                                            class="tw-w-full tw-tracking-widest"
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
                                                :size="'lg'"
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
                                            :size="'lg'"
                                            :icon="authPending ? 'eos-icons:installing' : 'mdi:key-chain'"
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
definePageMeta({middleware: 'guest'});
useLayout().setNavigationMode('solid', 'Login.vue');
const clientReadyState = useClientReadyState();
const {$coreStore} = useNuxtApp();
const {isAuthenticated, login, authPending} = useAuth();
const {screens, width: screenWidth, } = useScreen();

let identifierInput = ref(null);

//On navigate, focus on identifier input
if(clientReadyState.value){
    onMounted(async () => {
        await nextTick(()=>{
            if(identifierInput.value){
                identifierInput.value.$refs.input.focus();
            }
        });
    })
}

//On page load, focus on identifier input
watch(clientReadyState, async (clientReady) => {
    console.log({'Login.vue Watch clientReadyState':clientReady});
    if(clientReady){
        await nextTick(() => {
            if(identifierInput.value){
                identifierInput.value.$refs.input.focus();
            }
        });
    }
});

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
}
</style>
