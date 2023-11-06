<template>
    <div>
        <NuxtLayout :name="$coreStore.layout">
            <template #content>
                <div class="tw-mx-auto tw-max-w-screen-2xl">
                    <div class="tw-mx-auto tw-flex tw-flex-col tw-justify-center tw-w-max">
                        <AccentFrame class="tw-my-4 tw-w-max">
                            <template #content>
                                <div class="tw-relative">
                                    <p class="tw-font-semibold tw-text-lg">Profile Information</p>
                                    <div class="tw-mt-2 tw-grid tw-gap-2 tw-grid-cols-2">
                                        <div>
                                            <InputLabel :size="'sm'" value="Username" />
                                            <InputWithIcon :icon="'ic:sharp-person-pin'" v-model="user.name" readonly />
                                        </div>
                                        <div>
                                            <InputLabel :size="'sm'" value="Email" />
                                            <InputWithIcon :icon="'ic:round-mail-outline'" v-model="user.email" readonly />
                                        </div>
                                        <div>
                                            <InputWithIcon
                                                :icon="user?.email_verified_at ? 'ic:sharp-verified-user' : 'mdi:security-close'"
                                                :placeholder="user?.email_verified_at ? 'Email Verified' : 'Email Not Verified'"
                                                readonly />
                                        </div>
                                    </div>
                                </div>
                            </template>
                        </AccentFrame>

                        <form @submit.prevent="executeUpdatePassword" class="tw-mt-4 tw-p-[1.5rem] neutral-border tw-w-max">
                            <p class="tw-font-semibold tw-text-lg">Update Password</p>

                            <div class="tw-mt-2 tw-grid tw-gap-2 tw-grid-cols-2">
                                <div class="tw-col-span-2">
                                    <InputLabel :size="'sm'" value="Current Password" />
                                    <InputWithIcon :disabled="updatePasswordPending" :icon="'mdi:key-chain'" type="password" placeholder="Enter current password" v-model="updatePassword.currentPassword" required />
                                </div>
                                <div>
                                    <InputLabel :size="'sm'" value="New Password" />
                                    <InputWithIcon :disabled="updatePasswordPending" :icon="'ph:password-fill'" type="password" placeholder="Enter new password" v-model="updatePassword.newPassword" required />
                                </div>
                                <div>
                                    <InputLabel :size="'sm'" value="Confirm New Password" />
                                    <InputWithIcon :disabled="updatePasswordPending" :icon="'ph:password-fill'" type="password" placeholder="Re-enter new password" v-model="updatePassword.confirmNewPassword" required />
                                </div>
                                <div></div>
                                <div>
                                    <Button :disabled="updatePasswordPending" :size="'sm'" :variant="'flat'" :label="'Update Password'" />
                                </div>
                            </div>
                        </form>

                        <form @submit.prevent="executeLogoutOtherDevice" class="tw-mt-4 tw-p-[1.5rem] neutral-border tw-w-max">
                            <p class="tw-font-semibold tw-text-lg">Logout other Devices</p>

                            <div class="tw-mt-2 tw-grid tw-gap-2 tw-grid-cols-2">
                                <div>
                                    <InputWithIcon :disabled="logoutOtherDevicePending" :icon="'mdi:key-chain'" type="password" placeholder="Enter password" v-model="confirmPassword" required />
                                </div>
                                <div>
                                    <Button :disabled="logoutOtherDevicePending" :variant="'flat'" :label="'Logout Other Device'" />
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
</script>