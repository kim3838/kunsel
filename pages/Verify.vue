<template>
    <div>
        <DefaultWrapper>
            <div class="tw-mx-auto tw-px-4 tw-max-w-screen-2xl tw-flex tw-justify-center">
                <AccentFrame class="tw-my-4">
                    <template #content>
                        <div class="tw-relative tw-py-4">
                            <form @submit.prevent="execute" class="tw-w-80">
                                <p class="tw-text-lg tw-font-semibold tw-mb-4">
                                    Verify your email.
                                </p>

                                <p class="tw-text-base">
                                    Please click the verification button sent to your email address.
                                </p>
                                <p class="tw-text-sm tw-mt-4">
                                    Use the button below to resend the verification.
                                    Dont forget to check your email spam category.
                                </p>

                                <div class="tw-flex tw-mt-4 tw-items-center tw-justify-end">
                                    <Button
                                        :disabled="pending"
                                        :size="'md'"
                                        :variant="'default'"
                                        :icon="pending ? 'eos-icons:installing' : 'ic:round-mail-outline'"
                                        :label="pending ? 'Requesting...' : 'Send Email Verification'"></Button>
                                </div>
                            </form>
                        </div>
                    </template>
                </AccentFrame>
            </div>
        </DefaultWrapper>
    </div>
</template>

<script setup>
const {$coreStore} = useNuxtApp();
definePageMeta({middleware: ['auth', 'not-verified']});
useLayout().setNavigationMode('solid', 'Verify.vue');
let pending = ref(false);

const execute = async () => {
    pending.value = true;

    await csrFetch("/api/email/verification-notification", {
        method: 'POST',
    }, {
        onRequestError: () => {
            pending.value = false;
        },
        onResponse: () => {
            pending.value = false;
        },
        onSuccessResponse: (request, response, options) => {
            $coreStore.setPrompt({
                icon: 'ic:outline-mark-email-read',
                title: 'Email Verification',
                message: _get(response, '_data.message', ''),
                action: {
                    label: 'Close'
                }
            });
        }
    });
}
</script>