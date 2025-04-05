<template>
    <div>
        <DefaultWrapper>
            <div class="mx-auto max-w-screen-2xl">
                <div class="mx-auto flex flex-col justify-center w-fit">

                    <div class="max-w-screen-sm mt-4 font-header">
                        <p class="font-medium text-xl">Account Settings</p>
                    </div>

                    <div class="my-4 max-w-screen-sm p-[1.5rem] neutral-border tint-background">
                        <div class="relative">
                            <p class="font-medium text-lg font-header">Profile Information</p>
                            <div class="mt-4 grid gap-2 grid-cols-1 sm:grid-cols-2">
                                <div>
                                    <InputLabel :size="'md'" value="Username" />
                                    <InputWithIcon :size="'md'" class="w-full" :icon="'ic:sharp-person-pin'" v-model="userName" readonly />
                                </div>
                                <div>
                                    <InputLabel :size="'md'" value="Email" />
                                    <InputWithIcon :size="'md'" class="w-full" :icon="'ic:round-mail-outline'" v-model="userEmail" readonly />
                                </div>
                                <div>
                                    <InputWithIcon
                                        :size="'md'"
                                        class="w-full"
                                        :icon="user?.email_verified_at ? 'ic:sharp-verified-user' : 'mdi:security-close'"
                                        :placeholder="user?.email_verified_at ? 'Email Verified' : 'Email Not Verified'"
                                        readonly />
                                </div>
                            </div>
                        </div>
                    </div>

                    <form @submit.prevent="executeUpdatePassword" class="max-w-screen-sm p-[1.5rem] neutral-border tint-background">
                        <p class="font-medium text-lg font-header">Update Password</p>
                        <p class="mt-4 text-base">Ensure your account is using a long, random password to stay secure.</p>

                        <div class="mt-4 grid gap-2 grid-cols-1 sm:grid-cols-2">
                            <div class="col-span-1 sm:col-span-2">
                                <InputLabel :size="'md'" value="Current Password" />
                                <InputWithIcon :size="'md'" class="w-full" :disabled="updatePasswordPending" :icon="'mdi:key-chain'" :type="'password'" placeholder="Enter current password" v-model="updatePassword.currentPassword" required />
                            </div>
                            <div>
                                <InputLabel :size="'md'" value="New Password" />
                                <InputWithIcon :size="'md'" class="w-full" :disabled="updatePasswordPending" :icon="'ph:password-fill'" :type="'password'" placeholder="Enter new password" v-model="updatePassword.newPassword" required />
                            </div>
                            <div>
                                <InputLabel :size="'md'" value="Confirm New Password" />
                                <InputWithIcon :size="'md'" class="w-full" :disabled="updatePasswordPending" :icon="'ph:password-fill'" :type="'password'" placeholder="Re-enter new password" v-model="updatePassword.confirmNewPassword" required />
                            </div>
                            <div></div>
                            <div>
                                <Button class="w-min" :disabled="updatePasswordPending" :label="'Update Password'" />
                            </div>
                        </div>
                    </form>

                    <form @submit.prevent="executeLogoutOtherDevice" class="max-w-screen-sm mt-4 p-[1.5rem] neutral-border tint-background">
                        <p class="font-medium text-lg font-header">Browser Sessions</p>
                        <p class="mt-4 text-base">Manage and log out your active sessions on other browsers and devices. </p>

                        <div v-if="!pendingBrowserSessions && browserSessions.length > 0" class="mt-5 space-y-6">
                            <div v-for="(session, i) in browserSessions" :key="i" class="flex items-center">
                                <div>
                                    <ClientOnly><Icon class="h-8 w-8" :name="session.agent.platform ? 'zondicons:computer-desktop' : 'material-symbols:question-mark'"></Icon></ClientOnly>
                                </div>

                                <div class="ms-3">
                                    <div class="text-sm">
                                        {{ session.agent.platform ? session.agent.platform : 'Unknown' }} - {{ session.agent.browser ? session.agent.browser : 'Unknown' }}
                                    </div>

                                    <div>
                                        <div class="text-sm">
                                            <span>{{ session.ip_address }}</span>&nbsp;-&nbsp;
                                            <span v-if="session.is_current_device" class="text-green-500 font-semibold">This device</span>
                                            <span v-else>Last active {{ session.last_active }}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <UnorderedList
                            v-else-if="pendingBrowserSessions"
                            class="mt-4"
                            :icon="'eos-icons:loading'"
                            :size="'md'"
                            :label="'Loading browser sessions, please wait...'"/>

                        <div class="mt-4 grid gap-2 grid-cols-1 sm:grid-cols-2">
                            <div>
                                <InputWithIcon :disabled="logoutOtherDevicePending" :icon="'mdi:key-chain'" :type="'password'" placeholder="Enter password" v-model="confirmPassword" required />
                            </div>
                            <div>
                                <Button class="w-min" :disabled="logoutOtherDevicePending" :label="'Log Out Other Devices'" />
                            </div>
                        </div>
                    </form>

                    <div class="max-w-screen-sm mt-4 p-[1.5rem] neutral-border tint-background">
                        <p class="font-medium text-lg font-header">Two Factor Authentication</p>
                        <p class="mt-4 text-base">Add additional security to your account using two factor authentication.</p>

                        <div class="mt-4 pt-4">
                            <p v-if="twoFactorEnabled && twoFactorConfirmed" class="font-medium text-lg font-header">You have enabled two factor authentication.</p>
                            <p v-else-if="twoFactorEnabled && !twoFactorConfirmed" class="font-medium text-lg font-header">Finish enabling two factor authentication.</p>
                            <p v-else class="font-medium text-lg font-header">You have not enabled two factor authentication. </p>

                            <p class="mt-4 text-base">When two factor authentication is enabled, you will be prompted for a secure, random token during authentication. You may retrieve this token from <b>your phone's Google Authenticator application</b>.</p>

                            <div v-if="twoFactorEnabled">
                                <p v-if="twoFactorConfirming" class="mt-4 text-sm">
                                    To finish enabling two factor authentication, scan the following QR code using your phone's authenticator application or enter the setup key and provide the generated OTP code.
                                </p>

                                <div v-if="twoFactorConfirming">
                                    <div v-if="qrCode && !pendingTwoFactorQrCode" class="mt-4 p-2 bg-white" v-html="qrCode" />
                                    <UnorderedList
                                        class="mt-4"
                                        v-else-if="pendingTwoFactorQrCode"
                                        :icon="'eos-icons:loading'"
                                        :size="'md'"
                                        :label="'Loading QR code, please wait...'"/>

                                    <div v-if="setupKey && !pendingTwoFactorSetupKey" class="mt-4 font-medium">
                                        Setup Key: <span class="font-mono">{{setupKey}}</span>
                                    </div>
                                    <UnorderedList
                                        v-else-if="pendingTwoFactorSetupKey"
                                        :icon="'eos-icons:loading'"
                                        :size="'md'"
                                        :label="'Loading setup key, please wait...'"/>

                                    <div class="mt-4 grid gap-2 grid-cols-1 sm:grid-cols-2">
                                        <div>
                                            <InputWithIcon :disabled="confirmTwoFactorPending || disableTwoFactorPending" @keyup.enter="executeConfirmTwoFactor" :icon="'mdi:key-chain'" placeholder="Confirmation Code" v-model="twoFactorConfirmationCode" />
                                        </div>
                                        <div>
                                            <Button class="w-min" @click="executeConfirmTwoFactor" type="button" :disabled="confirmTwoFactorPending || disableTwoFactorPending" :label="'Confirm'" />
                                        </div>
                                    </div>
                                </div>

                                <div v-if="!twoFactorConfirming">
                                    <div v-if="recoveryCodes.length" class="mt-4 text-sm">
                                        <p class="font-normal text-base">
                                            Store these recovery codes somewhere safe. They can be used to recover access to your account if your two factor authentication device is lost.
                                        </p>
                                    </div>

                                    <UnorderedList
                                        class="mt-4"
                                        v-if="pendingTwoFactorRecoveryCodes"
                                        :icon="'eos-icons:loading'"
                                        :size="'md'"
                                        :label="'Loading recovery codes, please wait...'"/>
                                    <div class="grid gap-1 mt-4 font-mono text-sm">
                                        <div v-for="code in recoveryCodes" :key="code">
                                            {{ code }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="mt-4 grid gap-2 grid-cols-1 sm:grid-cols-2">
                            <div v-if="twoFactorEnabled && twoFactorConfirmed">
                                <ConfirmsPassword v-if="!recoveryCodes.length" @confirmed="executeTwoFactorRecoveryCodes">
                                    <Button class="w-min" :variant="'flat'" @click="" type="button" :disabled="pendingTwoFactorRecoveryCodes" :label="'Show Recovery Codes'" />
                                </ConfirmsPassword>
                            </div>
                            <div v-if="twoFactorEnabled && twoFactorConfirmed"></div>
                            <div>
                                <ConfirmsPassword v-if="twoFactorEnabled" @confirmed="executeDisableTwoFactor">
                                    <Button class="w-min" :variant="'flat'" type="button" :disabled="confirmTwoFactorPending || disableTwoFactorPending" :label="'Disable 2 Factor Authentication'" />
                                </ConfirmsPassword>
                            </div>
                            <div>
                                <ConfirmsPassword v-if="!twoFactorEnabled" @confirmed="executeEnableTwoFactor">
                                    <Button class="w-min" type="button" :disabled="enableTwoFactorPending" :label="'Enable 2 Factor Authentication'" />
                                </ConfirmsPassword>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DefaultWrapper>
    </div>
</template>

<script setup lang="ts">
definePageMeta({middleware: 'auth'});
useLayout().setNavigationMode('solid', 'Profile.vue');

//Hit server with ssr
await laraUseFetch("/api/utility/hit", {lazy: false});

const {$promptStore} = useNuxtApp();
const runtimeConfig = useRuntimeConfig();

const presetPassword = process.env.NODE_ENV === 'development' ? runtimeConfig.public.devUserPassword : '';

const user = userState();
const userName = computed(() => _get(user.value, 'name', null));
const userEmail = computed(() => _get(user.value, 'email', null));
const twoFactorEnabled = computed(() => _get(user.value, 'two_factor_enabled', null));
const twoFactorConfirmed = computed(() => _get(user.value, 'two_factor_confirmed', null));
const twoFactorConfirming = ref(false);
const pendingBrowserSessions = ref(false);
const browserSessions = ref([]);
const setupKey = ref(null);
const qrCode = ref(null);
const recoveryCodes = ref([]);
const twoFactorConfirmationCode = ref('');

if(twoFactorEnabled.value && !twoFactorConfirmed.value){
    twoFactorConfirming.value = true;
}

let updatePassword = reactive({
    currentPassword: presetPassword,
    newPassword: presetPassword,
    confirmNewPassword: presetPassword,
});

let updatePasswordDataComputed = computed(() => {
    return {
        current_password: updatePassword.currentPassword,
        new_password: updatePassword.newPassword,
        new_password_confirmation: updatePassword.confirmNewPassword,
    }
});

const updatePasswordPending = ref(false);
const executeUpdatePassword = async () => {
    updatePasswordPending.value = true;

    await laraFetch("/api/update-password", {
        method: 'POST',
        body: updatePasswordDataComputed.value,
    }, {
        onRequestError: () => {
            updatePasswordPending.value = false;
        },
        onResponse: () => {
            updatePasswordPending.value = false;
        },
        onSuccessResponse: (request, response, options) => {
            $promptStore.setPrompt({
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
}

const confirmPassword = ref(presetPassword);
const logoutOtherDevicePending = ref(false);
const executeLogoutOtherDevice = async () => {
    logoutOtherDevicePending.value = true;

    await laraFetch("/api/logout-other-device", {
        method: 'POST',
        body: {password: confirmPassword.value},
    }, {
        onRequestError: () => {
            logoutOtherDevicePending.value = false;
        },
        onResponse: () => {
            logoutOtherDevicePending.value = false;
        },
        onSuccessResponse: (request, response, options) => {
            $promptStore.setPrompt({
                icon: 'mdi:key-chain',
                title: 'Logout other device',
                message: _get(response, '_data.message', ''),
                action: {
                    callback: async () => {
                        confirmPassword.value = '';
                        pendingBrowserSessions.value = true;

                        await laraFetch("/api/sessions", {
                            method: 'GET',
                        }, {
                            onRequestError: () => {
                                pendingBrowserSessions.value = false;
                            },
                            onResponse: () => {
                                pendingBrowserSessions.value = false;
                            },
                            onSuccessResponse: (request, response, options) => {
                                browserSessions.value = _get(response, "_data.values", []);
                            }
                        });
                    },
                    label: 'Close'
                }
            });
        }
    });
}

const enableTwoFactorPending = ref(false);
const executeEnableTwoFactor = async () => {
    enableTwoFactorPending.value = true;

    await laraFetch("/api/two-factor-authentication", {
        method: 'POST',
    }, {
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
}

const pendingTwoFactorSetupKey = ref(false);
const executeTwoFactorSetupKey = async () => {
    pendingTwoFactorSetupKey.value = true;

    await laraFetch("/api/two-factor-secret-key", {
        method: 'GET',
    }, {
        onRequestError: () => {
            pendingTwoFactorSetupKey.value = false;
        },
        onResponse: () => {
            pendingTwoFactorSetupKey.value = false;
        },
        onSuccessResponse: (request, response, options) => {
            setupKey.value = _get(response, '_data.values.secret_key', null);
        }
    });
}

const pendingTwoFactorQrCode = ref(false);
const executeTwoFactorQrCode = async () => {
    pendingTwoFactorQrCode.value = true;

    await laraFetch("/api/two-factor-qr-code", {
        method: 'GET',
    }, {
        onRequestError: () => {
            pendingTwoFactorQrCode.value = false;
        },
        onResponse: () => {
            pendingTwoFactorQrCode.value = false;
        },
        onSuccessResponse: (request, response, options) => {
            qrCode.value = _get(response, '_data.values.svg', null);
        }
    });
}

onNuxtReady(async () => {
    pendingBrowserSessions.value = true;

    await laraFetch("/api/sessions", {
        method: 'GET',
    }, {
        onRequestError: () => {
            pendingBrowserSessions.value = false;
        },
        onResponse: () => {
            pendingBrowserSessions.value = false;
        },
        onSuccessResponse: (request, response, options) => {
            browserSessions.value = _get(response, "_data.values", []);
        }
    });

    if(twoFactorConfirming.value){
        executeTwoFactorSetupKey();
        executeTwoFactorQrCode();
    }
});

const pendingTwoFactorRecoveryCodes = ref(false);
const executeTwoFactorRecoveryCodes = async () => {
    pendingTwoFactorRecoveryCodes.value = true;

    await laraFetch("/api/two-factor-recovery-codes", {
        method: 'GET',
    }, {
        onRequestError: () => {
            pendingTwoFactorRecoveryCodes.value = false;
        },
        onResponse: () => {
            pendingTwoFactorRecoveryCodes.value = false;
        },
        onSuccessResponse: (request, response, options) => {
            recoveryCodes.value = _get(response, '_data.values.recovery_codes', []);
        }
    });
}


const confirmTwoFactorPending = ref(false);
const executeConfirmTwoFactor = async () => {
    confirmTwoFactorPending.value = true;

    await laraFetch("/api/confirmed-two-factor-authentication", {
        method: 'POST',
        body: {
            'code': twoFactorConfirmationCode.value
        }
    }, {
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
            executeTwoFactorRecoveryCodes();
            $promptStore.setPrompt({
                icon: 'tabler:auth-2fa',
                title: 'Two-Factor Confirmed',
                message: _get(response, '_data.message', ''),
                action: {
                    label: 'Okay'
                }
            });
        }
    });
}

const disableTwoFactorPending = ref(false);
const executeDisableTwoFactor = async () => {
    disableTwoFactorPending.value = true;

    await laraFetch("/api/two-factor-authentication", {
        method: 'DELETE',
    }, {
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
}
</script>