<template>
    <div>
        <LandingWrapper>
            <div class="tw-mx-auto tw-px-4 tw-max-w-screen-2xl tw-flex tw-justify-center">
                <AccentFrame class="tw-my-4">
                    <template #content>
                        <div class="tw-relative tw-py-4">
                            <form @submit.prevent="handleForgotPassword" class="tw-w-72">
                                <p class="tw-font-semibold tw-text-lg tw-mb-4">
                                    Forgot your password? No problem.
                                </p>
                                <p class="tw-text-base">
                                    Just let us know your email address and we will email you a password reset link that will allow you to choose a new one.
                                </p>

                                <div class="tw-block tw-mt-4">
                                    <InputWithIcon
                                        :icon="'ic:round-mail-outline'"
                                        :disabled="pending"
                                        :size="'md'"
                                        id="email"
                                        type="email"
                                        class="tw-w-full"
                                        ref="emailInput"
                                        v-model="email"
                                        autofocus
                                        autocomplete="off" />
                                </div>

                                <div class="tw-flex tw-mt-4 tw-items-center tw-justify-end">
                                    <Button
                                        :disabled="pending"
                                        :size="'md'"
                                        :variant="'flat'"
                                        :icon="pending ? 'eos-icons:installing' : 'ic:round-mail-outline'"
                                        :label="pending ? 'Requesting...' : 'Email Password Reset Link'"></Button>
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
useLayout().setNavigationMode('solid', 'Forgot-Password.vue');
const {$coreStore} = useNuxtApp();

let emailInput = ref(null);
let pending = ref(false);
let email = ref("luxere20@gmail.com1");

onMounted(async () => {
    await nextTick();
    emailInput.value.$refs.input.focus();
});

let bodyComputed = computed(() => {
    return {
        email: email.value
    };
});

async function handleForgotPassword(){
    pending.value = true;
    await executeForgotPassword();
}

const {execute: executeForgotPassword} = csrFetch("/forgot-password", {
    method: 'POST',
    body: bodyComputed,
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
            icon: 'ic:outline-mark-email-read',
            title: 'Password Reset',
            message: _get(response, '_data.message', ''),
            action: {
                callback: () => {
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