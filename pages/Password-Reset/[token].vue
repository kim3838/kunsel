<template>
    <div class="tw-mx-auto tw-px-4 tw-max-w-screen-2xl tw-flex tw-justify-center">
        <div class="tw-hidden sm:tw-block tw-px-4 tw-py-8 tw-h-96 tw-w-96">
            <div class="tw-w-full tw-h-full tw-bg-contain tw-bg-center tw-bg-no-repeat" :style="{'background-image': 'url(/deco/undraw/undraw_access_denied_re_awnf.svg)'}"></div>
        </div>
        <AccentFrame class="tw-my-4">
            <template #content>
                <div class="tw-relative tw-py-4">
                    <form @submit.prevent="handleResetPassword" class="tw-w-72">
                        <div class="tw-block tw-mt-4">
                            <InputWithIcon
                                :icon="'ic:round-mail-outline'"
                                readonly
                                :size="'md'"
                                id="email"
                                type="email"
                                class="tw-w-full"
                                v-model="data.email"
                                autofocus
                                autocomplete="off" />
                        </div>

                        <div class="tw-block tw-mt-4">
                            <InputLabel :size="'md'" for="password" value="Password" />
                            <Input
                                ref="password"
                                :disabled="pending"
                                :size="'md'"
                                id="password"
                                type="password"
                                class="tw-w-full"
                                v-model="data.password" />
                        </div>

                        <div class="tw-block tw-mt-4">
                            <InputLabel :size="'md'" for="password_confirmation" value="Confirm Password" />
                            <Input
                                :disabled="pending"
                                :size="'md'"
                                id="password_confirmation"
                                type="password"
                                class="tw-w-full"
                                v-model="data.password_confirmation" />
                        </div>

                        <div class="tw-flex tw-mt-4 tw-items-center tw-justify-end">
                            <Button
                                :disabled="pending"
                                :size="'md'"
                                :variant="'flat'"
                                :icon="pending ? 'eos-icons:installing' : 'mdi:key-chain'"
                                :label="pending ? 'Please wait...' : 'Reset Password'"></Button>
                        </div>
                    </form>
                </div>
            </template>
        </AccentFrame>
    </div>
</template>

<script setup>
const {$coreStore} = useNuxtApp();
const route = useRoute();

if (!route.query.email) {
    navigateTo({
        path: '/',
        replace: true
    });
}

definePageMeta({
    middleware: 'guest'
});

let password = ref(null);

const data = reactive({
    email: route.query.email,
    token: route.params.token,
    password: "",
    password_confirmation: "",
});

onMounted(async () => {
    await nextTick();
    password.value.$refs.input.focus();
});

async function handleResetPassword() {
    pending.value = true;
    await executeResetPassword();
}

const pending = ref(false);
const {execute: executeResetPassword} = csrFetch("/reset-password", {
    method: 'POST',
    body: data,
    immediate: false
}, {
    onRequest: () => {
        pending.value = true;
    },
    onRequestError: () => {
        pending.value = false;
    },
    onResponse: () => {
        pending.value = false;
    },
    onSuccessResponse: (request, response, options) => {
        $coreStore.setPrompt({
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
</script>