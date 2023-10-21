<template>
    <div>
        <NuxtLayout :name="$coreStore.layout">
            <template #content>
                <div class="tw-mx-auto tw-max-w-screen-2xl tw-flex tw-justify-center">
                    <AccentFrame class="tw-my-4">
                        <template #content>
                            <div class="tw-relative tw-py-4">
                                <form @submit.prevent="execute" class="tw-w-72">
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
                                            v-model="data.password"
                                            required />
                                    </div>

                                    <div class="tw-block tw-mt-4">
                                        <InputLabel :size="'md'" for="password_confirmation" value="Confirm Password" />
                                        <Input
                                            :disabled="pending"
                                            :size="'md'"
                                            id="password_confirmation"
                                            type="password"
                                            class="tw-w-full"
                                            v-model="data.password_confirmation"
                                            required />
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
        </NuxtLayout>
    </div>
</template>
<script setup>
import {ref, reactive, onMounted, nextTick} from 'vue';
const {$coreStore} = useNuxtApp();
const route = useRoute();

if (!route.query.email) {
    navigateTo({
        path: '/',
        replace: true
    });
}

definePageMeta({
    layout: false,
    middleware: 'guest'
});

let password = ref(null);

const data = reactive({
    email: route.query.email,
    token: route.params.token,
    password: "",
    password_confirmation: "",
});

let pending = ref(false);

onMounted(async () => {
    await nextTick();
    password.value.$refs.input.focus();
});

const {execute} = csrFetch("/reset-password", {
    method: 'POST',
    body: data,
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