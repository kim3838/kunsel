<template>
    <div>
        <NuxtLayout :name="$coreStore.layout">
            <template #content>
                <div class="tw-mx-auto tw-max-w-screen-2xl">
                    <div class="tw-mx-auto tw-flex tw-flex-col tw-justify-center tw-w-fit">
                        <AccentFrame class="tw-my-4 tw-max-w-screen-md">
                            <template #content>
                                <div class="tw-relative">
                                    <p class="tw-font-semibold tw-text-lg">Profile Information</p>
                                    <div class="tw-mt-4 tw-grid tw-gap-2 tw-grid-cols-1 sm:tw-grid-cols-2">
                                        <div>
                                            <InputLabel :size="'sm'" value="Username" />
                                            <InputWithIcon class="tw-w-full" :icon="'ic:sharp-person-pin'" v-model="user.name" readonly />
                                        </div>
                                        <div>
                                            <InputLabel :size="'sm'" value="Email" />
                                            <InputWithIcon class="tw-w-full" :icon="'ic:round-mail-outline'" v-model="user.email" readonly />
                                        </div>
                                        <div>
                                            <InputWithIcon
                                                class="tw-w-full"
                                                :icon="user?.email_verified_at ? 'ic:sharp-verified-user' : 'mdi:security-close'"
                                                :placeholder="user?.email_verified_at ? 'Email Verified' : 'Email Not Verified'"
                                                readonly />
                                        </div>
                                    </div>
                                </div>
                            </template>
                        </AccentFrame>

                        <form @submit.prevent="executeUpdatePassword" class="tw-max-w-screen-md tw-p-[1.5rem] neutral-border">
                            <p class="tw-font-semibold tw-text-lg">Update Password</p>
                            <p class="tw-text-base">Ensure your account is using a long, random password to stay secure.</p>

                            <div class="tw-mt-4 tw-grid tw-gap-2 tw-grid-cols-1 sm:tw-grid-cols-2">
                                <div class="tw-col-span-1 sm:tw-col-span-2">
                                    <InputLabel :size="'sm'" value="Current Password" />
                                    <InputWithIcon class="tw-w-full" :disabled="updatePasswordPending" :icon="'mdi:key-chain'" type="password" placeholder="Enter current password" v-model="updatePassword.currentPassword" required />
                                </div>
                                <div>
                                    <InputLabel :size="'sm'" value="New Password" />
                                    <InputWithIcon class="tw-w-full" :disabled="updatePasswordPending" :icon="'ph:password-fill'" type="password" placeholder="Enter new password" v-model="updatePassword.newPassword" required />
                                </div>
                                <div>
                                    <InputLabel :size="'sm'" value="Confirm New Password" />
                                    <InputWithIcon class="tw-w-full" :disabled="updatePasswordPending" :icon="'ph:password-fill'" type="password" placeholder="Re-enter new password" v-model="updatePassword.confirmNewPassword" required />
                                </div>
                                <div></div>
                                <div>
                                    <Button :disabled="updatePasswordPending" :label="'Update Password'" />
                                </div>
                            </div>
                        </form>

                        <form @submit.prevent="executeLogoutOtherDevice" class="tw-max-w-screen-md tw-mt-4 tw-p-[1.5rem] neutral-border">
                            <p class="tw-font-semibold tw-text-lg">Browser Sessions </p>
                            <p class="tw-text-base">Manage and log out your active sessions on other browsers and devices. </p>

                            <div v-if="sessions.length > 0" class="tw-mt-5 tw-space-y-6">
                                <div v-for="(session, i) in sessions" :key="i" class="tw-flex tw-items-center">
                                    <div>
                                        <Icon class="tw-h-8 tw-w-8" :name="session.agent.platform ? 'zondicons:computer-desktop' : 'material-symbols:question-mark'"></Icon>
                                    </div>

                                    <div class="tw-ms-3">
                                        <div class="tw-text-sm">
                                            {{ session.agent.platform ? session.agent.platform : 'Unknown' }} - {{ session.agent.browser ? session.agent.browser : 'Unknown' }}
                                        </div>

                                        <div>
                                            <div class="tw-text-sm">
                                                <span>{{ session.ip_address }}</span>&nbsp;-&nbsp;
                                                <span v-if="session.is_current_device" class="tw-text-green-500 tw-font-semibold">This device</span>
                                                <span v-else>Last active {{ session.last_active }}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="tw-mt-4 tw-grid tw-gap-2 tw-grid-cols-1 sm:tw-grid-cols-2">
                                <div>
                                    <InputWithIcon :disabled="logoutOtherDevicePending" :icon="'mdi:key-chain'" type="password" placeholder="Enter password" v-model="confirmPassword" required />
                                </div>
                                <div>
                                    <Button :disabled="logoutOtherDevicePending" :label="'Log Out Other Devices'" />
                                </div>
                            </div>
                        </form>

                    </div>

                </div>
            </template>
        </NuxtLayout>
    </div>
</template>

<style>

</style>

<script setup lang="ts">
import {ref, reactive, watch} from 'vue';
const {$coreStore} = useNuxtApp();

definePageMeta({
    layout: false,
    middleware: 'auth'
});

let user = reactive({
    id: null,
    name: null,
    email: null,
    email_verified_at: null,
});

let updatePassword = reactive({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
});

let updatePasswordDataComputed = computed(() => {
    return {
        current_password: updatePassword.currentPassword,
        new_password: updatePassword.newPassword,
        new_password_confirmation: updatePassword.confirmNewPassword,
    }
});

await ssrFetch("/api/user", {
    method: 'GET',
    onResponse({request, response, options}) {

        if(response._data.code == 200){
            user = {
                id: _get(response, '_data.values.id', null),
                name: _get(response, '_data.values.name', null),
                email: _get(response, '_data.values.email', null),
                email_verified_at: _get(response, '_data.values.email_verified_at', null),
            };
        }
    }
});

let updatePasswordPending = ref(false);
const {execute: executeUpdatePassword} = csrFetch("/update-password", {
    method: 'POST',
    body: updatePasswordDataComputed,
    immediate: false,
    onRequest(){
        updatePasswordPending.value = true;
        $coreStore.resetServiceError();
    },
    onRequestError({ request, options, error }) {
        updatePasswordPending.value = false;

        $coreStore.setServiceError({
            prompt: true,
            icon: 'ic:sharp-error-outline',
            title: 'Request failed',
            payload: {message: error.message}
        });
    },
    onResponse({request, response, options}) {
        updatePasswordPending.value = false;

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
                icon: 'mdi:key-chain',
                title: 'Update Password',
                message: _get(response, '_data.message', ''),
                action: {
                    callback: () => {
                        updatePassword.currentPassword = '';
                        updatePassword.newPassword = '';
                        updatePassword.confirmNewPassword = '';
                    },
                    label: 'Close'
                }
            });
        }
    }
});

let confirmPassword = ref('');
let logoutOtherDevicePending = ref(false);
const {execute: executeLogoutOtherDevice} = csrFetch("/api/logout-other-device", {
    method: 'POST',
    body: {password: confirmPassword},
    immediate: false,
    onRequest(){
        logoutOtherDevicePending.value = true;
        $coreStore.resetServiceError();
    },
    onRequestError({ request, options, error }) {
        logoutOtherDevicePending.value = false;

        $coreStore.setServiceError({
            prompt: true,
            icon: 'ic:sharp-error-outline',
            title: 'Request failed',
            payload: {message: error.message}
        });
    },
    onResponse({request, response, options}) {
        logoutOtherDevicePending.value = false;

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
                icon: 'mdi:key-chain',
                title: 'Logout other device',
                message: _get(response, '_data.message', ''),
                action: {
                    callback: () => {
                        confirmPassword.value = '';
                    },
                    label: 'Close'
                }
            });
        }
    }
});

let sessions = ref([]);
await ssrFetch("/api/sessions", {
    method: 'GET',
    onResponse({request, response, options}) {
        sessions.value = _get(response, '_data.values', []);
    }
});
</script>