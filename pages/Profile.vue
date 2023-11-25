<template>
    <div>
        <NuxtLayout :name="$coreStore.layout">
            <template #content>
                <div class="tw-mx-auto tw-max-w-screen-2xl">
                    <div class="tw-mx-auto tw-flex tw-flex-col tw-justify-center tw-w-fit">
                        <AccentFrame class="tw-my-4 tw-max-w-screen-sm">
                            <template #content>
                                <div class="tw-relative">
                                    <p class="tw-font-medium tw-text-lg">Profile Information</p>
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

                        <form @submit.prevent="executeUpdatePassword" class="tw-max-w-screen-sm tw-p-[1.5rem] neutral-border">
                            <p class="tw-font-medium tw-text-lg">Update Password</p>
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

                        <form @submit.prevent="executeLogoutOtherDevice" class="tw-max-w-screen-sm tw-mt-4 tw-p-[1.5rem] neutral-border">
                            <p class="tw-font-medium tw-text-lg">Browser Sessions</p>
                            <p class="tw-text-base">Manage and log out your active sessions on other browsers and devices. </p>

                            <div v-if="sessions.length > 0" class="tw-mt-5 tw-space-y-6">
                                <div v-for="(session, i) in sessions" :key="i" class="tw-flex tw-items-center">
                                    <div>
                                        <ClientOnly><Icon class="tw-h-8 tw-w-8" :name="session.agent.platform ? 'zondicons:computer-desktop' : 'material-symbols:question-mark'"></Icon></ClientOnly>
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

                        <ClientOnly>
                            <div class="tw-max-w-screen-sm tw-mt-4 tw-p-[1.5rem] neutral-border">
                                <p class="tw-font-medium tw-text-lg">Two Factor Authentication</p>
                                <p class="tw-text-base">Add additional security to your account using two factor authentication.</p>

                                <div class="tw-mt-4 tw-pt-4">
                                    <p v-if="twoFactorEnabled && twoFactorConfirmed" class="tw-font-medium tw-text-lg">You have enabled two factor authentication.</p>
                                    <p v-else-if="twoFactorEnabled && !twoFactorConfirmed" class="tw-font-medium tw-text-lg">Finish enabling two factor authentication.</p>
                                    <p v-else class="tw-font-medium tw-text-lg">You have not enabled two factor authentication. </p>

                                    <p class="tw-text-base">When two factor authentication is enabled, you will be prompted for a secure, random token during authentication. You may retrieve this token from <b>your phone's Google Authenticator application</b>.</p>

                                    <div v-if="twoFactorEnabled">
                                        <p v-if="twoFactorConfirming" class="tw-mt-4 tw-text-sm">
                                            To finish enabling two factor authentication, scan the following QR code using your phone's authenticator application or enter the setup key and provide the generated OTP code.
                                        </p>

                                        <div v-if="twoFactorConfirming">
                                            <div v-if="qrCode && !pendingTwoFactorQrCode" class="tw-mt-4 tw-p-2 tw-bg-white" v-html="qrCode" />
                                            <UnorderedList
                                                class="tw-mt-4"
                                                v-else-if="pendingTwoFactorQrCode"
                                                :icon="'eos-icons:loading'"
                                                :size="'md'"
                                                :label="'Loading QR code, please wait...'"/>

                                            <div v-if="setupKey && !pendingTwoFactorSetupKey" class="tw-mt-4 tw-font-medium">
                                                Setup Key: <span>{{setupKey}}</span>
                                            </div>
                                            <UnorderedList
                                                v-else-if="pendingTwoFactorSetupKey"
                                                :icon="'eos-icons:loading'"
                                                :size="'md'"
                                                :label="'Loading setup key, please wait...'"/>

                                            <div class="tw-mt-4 tw-grid tw-gap-2 tw-grid-cols-1 sm:tw-grid-cols-2">
                                                <div>
                                                    <InputWithIcon :icon="'mdi:key-chain'" type="text" placeholder="Confirmation Code" v-model="twoFactorConfirmationCode" />
                                                </div>
                                                <div>
                                                    <Button @click="executeConfirmTwoFactor" type="button" :disabled="confirmTwoFactorPending" :label="'Confirm'" />
                                                </div>
                                            </div>
                                        </div>

                                        <div v-if="!twoFactorConfirming">
                                            <div class="tw-mt-4 tw-text-sm">
                                                <p class="tw-font-medium">
                                                    Store these recovery codes in a secure password manager. They can be used to recover access to your account if your two factor authentication device is lost.
                                                </p>
                                            </div>

                                            <UnorderedList
                                                class="tw-mt-4"
                                                v-if="pendingTwoFactorRecoveryCodes"
                                                :icon="'eos-icons:loading'"
                                                :size="'md'"
                                                :label="'Loading recovery codes, please wait...'"/>
                                            <div class="tw-grid tw-gap-1 tw-mt-4 tw-font-mono tw-text-sm">
                                                <div v-for="code in recoveryCodes" :key="code">
                                                    {{ code }}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="tw-mt-4 tw-grid tw-gap-2 tw-grid-cols-1 sm:tw-grid-cols-2">
                                    <div>
                                        <Button :variant="'flat'" v-if="twoFactorEnabled" @click="executeDisableTwoFactor" type="button" :disabled="disableTwoFactorPending" :label="'Disable 2 Factor Authentication'" />
                                    </div>
                                    <div>
                                        <ConfirmsPassword v-if="!twoFactorEnabled" @confirmed="executeEnableTwoFactor">
                                            <Button type="button" :disabled="enableTwoFactorPending" :label="'Enable 2 Factor Authentication'" />
                                        </ConfirmsPassword>
                                    </div>
                                </div>
                            </div>
                        </ClientOnly>

                    </div>

                </div>
            </template>
        </NuxtLayout>
    </div>
</template>

<style>

</style>

<script setup lang="ts">
import {computed, ref, reactive, watch} from 'vue';

const {$coreStore} = useNuxtApp();

definePageMeta({
    layout: false,
    middleware: 'auth'
});

const user = ref({
    id: null,
    name: null,
    email: null,
    email_verified_at: null,
    two_factor_enabled: false,
    two_factor_confirmed: false,
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
}, {
    onSuccessResponse: (request, response, options) => {
        let two_factor_enabled = _get(response, '_data.values.two_factor_enabled', null)
        let two_factor_confirmed = _get(response, '_data.values.two_factor_confirmed', null)

        user.value = {
            id: _get(response, '_data.values.id', null),
            name: _get(response, '_data.values.name', null),
            email: _get(response, '_data.values.email', null),
            email_verified_at: _get(response, '_data.values.email_verified_at', null),
            two_factor_enabled: two_factor_enabled,
            two_factor_confirmed: two_factor_confirmed,
        };
    }
});

let updatePasswordPending = ref(false);
const {execute: executeUpdatePassword} = csrFetch("/api/update-password", {
    method: 'POST',
    body: updatePasswordDataComputed,
    immediate: false,
}, {
    onRequest: () => {
        updatePasswordPending.value = true;
    },
    onRequestError: () => {
        updatePasswordPending.value = false;
    },
    onResponse: () => {
        updatePasswordPending.value = false;
    },
    onSuccessResponse: (request, response, options) => {
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
});

let confirmPassword = ref('');
let logoutOtherDevicePending = ref(false);
const {execute: executeLogoutOtherDevice} = csrFetch("/api/logout-other-device", {
    method: 'POST',
    body: {password: confirmPassword},
    immediate: false,
}, {
    onRequest: () => {
        logoutOtherDevicePending.value = true;
    },
    onRequestError: () => {
        logoutOtherDevicePending.value = false;
    },
    onResponse: () => {
        logoutOtherDevicePending.value = false;
    },
    onSuccessResponse: (request, response, options) => {
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
});

let sessions = ref([]);
csrFetch("/api/sessions", {
    method: 'GET'
}, {
    onSuccessResponse: (request, response, options) => {
        sessions.value = _get(response, '_data.values', []);
    }
});

const twoFactorEnabled = computed(() => user.value.two_factor_enabled);
const twoFactorConfirmed = computed(() => user.value.two_factor_confirmed);
const twoFactorConfirming = ref(false);
const setupKey = ref(null);
const qrCode = ref(null);
const recoveryCodes = ref([]);
const twoFactorConfirmationCode = ref('');

csrFetch("/api/user", {
    method: 'GET',
}, {
    onSuccessResponse: (request, response, options) => {
        let two_factor_enabled = _get(response, '_data.values.two_factor_enabled', null)
        let two_factor_confirmed = _get(response, '_data.values.two_factor_confirmed', null)

        if(two_factor_enabled && !two_factor_confirmed){
            twoFactorConfirming.value = true;
            executeTwoFactorSetupKey();
            executeTwoFactorQrCode();
            executeTwoFactorRecoveryCodes();
        }

        if(two_factor_enabled && two_factor_confirmed){
            executeTwoFactorRecoveryCodes();
        }
    }
});

const enableTwoFactorPending = ref(false);
const {execute: executeEnableTwoFactor} = csrFetch("/api/two-factor-authentication", {
    method: 'POST',
    immediate: false,
}, {
    onRequest: () => {
        enableTwoFactorPending.value = true;
    },
    onRequestError: () => {
        enableTwoFactorPending.value = false;
    },
    onResponse: () => {
        enableTwoFactorPending.value = false;
    },
    onSuccessResponse: (request, response, options) => {
        user.value.two_factor_enabled = true;
        twoFactorConfirming.value = true;
        executeTwoFactorSetupKey();
        executeTwoFactorQrCode();
        executeTwoFactorRecoveryCodes();
    }
});

const {pending:pendingTwoFactorSetupKey, execute: executeTwoFactorSetupKey} = csrFetch("/api/two-factor-secret-key", {
    method: 'GET',
    immediate: false,
}, {
    onSuccessResponse: (request, response, options) => {
        setupKey.value = _get(response, '_data.values.secret_key', null);
    }
});
const {pending:pendingTwoFactorQrCode, execute: executeTwoFactorQrCode} = csrFetch("/api/two-factor-qr-code", {
    method: 'GET',
    immediate: false,
}, {
    onSuccessResponse: (request, response, options) => {
        qrCode.value = _get(response, '_data.values.svg', null);
    }
});
const {pending:pendingTwoFactorRecoveryCodes, execute: executeTwoFactorRecoveryCodes} = csrFetch("/api/two-factor-recovery-codes", {
    method: 'GET',
    immediate: false,
}, {
    onSuccessResponse: (request, response, options) => {
        recoveryCodes.value = _get(response, '_data.values.recovery_codes', []);
    }
});

const confirmTwoFactorPending = ref(false);
const {execute: executeConfirmTwoFactor} = csrFetch("/api/confirmed-two-factor-authentication", {
    method: 'POST',
    body: {
        'code': twoFactorConfirmationCode
    },
    immediate: false,
}, {
    onRequest: () => {
        confirmTwoFactorPending.value = true;
    },
    onRequestError: () => {
        confirmTwoFactorPending.value = false;
    },
    onResponse: () => {
        confirmTwoFactorPending.value = false;
    },
    onSuccessResponse: (request, response, options) => {
        twoFactorConfirming.value = false;
        user.value.two_factor_confirmed = true;
        setupKey.value = null;
        qrCode.value = null;

        $coreStore.setPrompt({
            icon: 'ic:outline-mark-email-read',
            title: 'Two-Factor Confirmed',
            message: _get(response, '_data.message', ''),
            action: {
                label: 'Close'
            }
        });
    }
});

const disableTwoFactorPending = ref(false);
const {execute: executeDisableTwoFactor} = csrFetch("/api/two-factor-authentication", {
    method: 'DELETE',
    immediate: false,
}, {
    onRequest: () => {
        disableTwoFactorPending.value = true;
    },
    onRequestError: () => {
        disableTwoFactorPending.value = false;
    },
    onResponse: () => {
        disableTwoFactorPending.value = false;
    },
    onSuccessResponse: (request, response, options) => {
        user.value.two_factor_enabled = false;
        user.value.two_factor_confirmed = false;
        twoFactorConfirming.value = false;
    }
});
</script>