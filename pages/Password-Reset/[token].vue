<template>
    <div>
        <LandingWrapper>
            <div class="mx-auto pt-4 max-w-screen-2xl">
                <div class="min-h-120 flex flex-row items-center justify-center lg:px-10 gap-20">

                    <AccentFrame class="h-[360px] max-w-min mx-auto lg:mx-0 ">
                        <template #content>
                            <div class="relative py-4">
                                <div class="text-lg font-medium font-header">Reset password</div>
                                <form @submit.prevent="handleResetPassword" class="mt-4 w-80">
                                    <div class="block">
                                        <InputWithIcon
                                            :icon="'ic:round-mail-outline'"
                                            readonly
                                            disabled
                                            :size="'md'"
                                            id="email"
                                            :type="'email'"
                                            class="w-full"
                                            v-model="data.email"
                                            autofocus />
                                    </div>

                                    <div class="block mt-4">
                                        <InputLabel :size="'md'" for="password" value="Password" />
                                        <Input
                                            ref="password"
                                            :disabled="pending"
                                            :size="'md'"
                                            id="password"
                                            :type="'password'"
                                            class="w-full"
                                            v-model="data.password" />
                                    </div>

                                    <div class="block mt-4">
                                        <InputLabel :size="'md'" for="password_confirmation" value="Confirm Password" />
                                        <Input
                                            :disabled="pending"
                                            :size="'md'"
                                            id="password_confirmation"
                                            :type="'password'"
                                            class="w-full"
                                            v-model="data.password_confirmation" />
                                    </div>

                                    <div class="flex mt-4 items-center justify-end">
                                        <Button
                                            :disabled="pending"
                                            :size="'md'"
                                            :variant="'default'"
                                            :icon="pending ? 'eos-icons:installing' : ''"
                                            :label="pending ? 'Please wait...' : 'Reset Password'"></Button>
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
useHead({titleTemplate: (titleChunk) => {return `Password Reset`}});
definePageMeta({middleware: 'guest'});
useLayout().setNavigationMode('solid');
const clientReadyState = useClientReadyState();
const {$promptStore} = useNuxtApp();

const route = useRoute();
if (!route.query.email) {
    navigateTo({
        path: '/',
        replace: true
    });
}

let password = ref(null);

const data = reactive({
    email: route.query.email as string,
    token: route.params.token as string,
    password: "",
    password_confirmation: "",
});

//On navigate, focus on identifier input
if(clientReadyState.value){
    onMounted(async () => {
        await nextTick(()=>{
            if(password.value){
                //@ts-ignore
                password.value.$refs.input.focus();
            }
        });
    })
}

//On page load, focus on password input
watch(clientReadyState, async (clientReady) => {
    if(clientReady){
        await nextTick(() => {
            if(password.value){
                //@ts-ignore
                password.value.$refs.input.focus();
            }
        });
    }
});

async function handleResetPassword() {
    pending.value = true;
    await executeResetPassword();
}

const pending = ref(false);
const executeResetPassword = async () => {
    pending.value = true;

    await laraFetch("/reset-password", {
        method: 'POST',
        body: data
    }, {
        onRequestError: () => {
            pending.value = false;
        },
        onResponse: () => {
            pending.value = false;
        },
        onSuccessResponse: (request, options, response) => {
            $promptStore.setPrompt({
                icon: 'mdi:key-chain',
                title: 'Password Reset',
                message: _get(response, '_data.message', ''),
                action: {
                    callback: ()=>{
                        navigateTo({
                            path: '/login',
                            replace: true
                        });
                    },
                    label: 'Close'
                }
            });
        }
    });
}
</script>