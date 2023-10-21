<template>
    <div>
        <NuxtLayout :name="$coreStore.layout">
            <template #content>
                <div class="tw-mx-auto tw-max-w-screen-2xl tw-flex tw-justify-center">
                    <AccentFrame class="tw-my-4">
                        <template #content>
                            <div class="tw-relative tw-py-4">
                                <form @submit.prevent="execute" class="tw-w-72">
                                    <p class="tw-text-base">
                                        Forgot your password? No problem. Just let us know your email address and we will email you a password reset link that will allow you to choose a new one.
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
            </template>
        </NuxtLayout>
    </div>
</template>
<script setup>
import {ref, computed, onMounted, nextTick} from 'vue';
const {$coreStore, $authStore} = useNuxtApp();

definePageMeta({
    layout: false,
    middleware: 'guest'
});

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

const {execute} = csrFetch("/forgot-password", {
    method: 'POST',
    body: bodyComputed,
    immediate: false,
    onRequest(){
        pending.value = true;
        $coreStore.resetServiceError();
    },
    onRequestError({ request, options, error }) {
        pending.value = false;

        $coreStore.setServiceError({
            prompt: true,
            icon: 'ic:sharp-error-outline',
            title: 'Request failed',
            payload: {message: error.message}
        });
    },
    onResponse({request, response, options}) {
        pending.value = false;

        if (response._data.code >= 500 && response._data.code < 600) {
            $coreStore.setServiceError({
                prompt: true,
                icon: 'ic:sharp-error-outline',
                title: 'Something Went Wrong',
                payload: response._data
            });
        } else if(response?._data?.code >= 401 && response?._data?.code < 499){
            $coreStore.setServiceError({
                prompt: true,
                icon: 'ic:sharp-error-outline',
                title: 'Request failed',
                payload: response._data
            });
        } else {
            $coreStore.setPrompt({
                icon: 'ic:outline-mark-email-read',
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
    }
});
</script>