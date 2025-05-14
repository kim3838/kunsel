<template>
    <div>
        <LandingWrapper>
            <div class="mx-auto px-4 max-w-screen-2xl flex justify-center">
                <AccentFrame class="my-4">
                    <template #content>
                        <div class="relative py-4">
                            <form @submit.prevent="handleResetPassword" class="w-80">
                                <div class="block mt-4">
                                    <InputWithIcon
                                        :icon="'ic:round-mail-outline'"
                                        readonly
                                        :size="'lg'"
                                        id="email"
                                        :type="'email'"
                                        class="w-full"
                                        v-model="data.email"
                                        autofocus
                                        autocomplete="off" />
                                </div>

                                <div class="block mt-4">
                                    <InputLabel :size="'md'" for="password" value="Password" />
                                    <Input
                                        ref="password"
                                        :disabled="pending"
                                        :size="'lg'"
                                        id="password"
                                        :type="'password'"
                                        class="w-full"
                                        v-model="data.password" />
                                </div>

                                <div class="block mt-4">
                                    <InputLabel :size="'md'" for="password_confirmation" value="Confirm Password" />
                                    <Input
                                        :disabled="pending"
                                        :size="'lg'"
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
                                        :icon="pending ? 'eos-icons:installing' : 'mdi:key-chain'"
                                        :label="pending ? 'Please wait...' : 'Reset Password'"></Button>
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
useLayout().setNavigationMode('solid', 'Password-Reset[token].vue');
const clientReadyState = useClientReadyState();
const {$promptStore} = useNuxtApp();

//Todo: Query email check on route could also use bootRedirectRule
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
    password: "password",
    password_confirmation: "password",
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