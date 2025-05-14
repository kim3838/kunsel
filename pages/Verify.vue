<template>
    <div>
        <DefaultWrapper>
            <div class="mx-auto px-4 max-w-screen-2xl flex justify-center">
                <AccentFrame class="my-4">
                    <template #content>
                        <div class="relative py-4">
                            <form @submit.prevent="execute" class="w-80">
                                <div class="text-lg font-medium mb-4">
                                    Verify your email.
                                </div>

                                <p class="text-base">
                                    Please click the verification button sent to your email address.
                                </p>
                                <p class="text-sm mt-4">
                                    Use the button below to resend the verification.
                                    Dont forget to check your email spam category.
                                </p>

                                <div class="flex mt-4 items-center justify-end">
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
const {$promptStore} = useNuxtApp();
definePageMeta({middleware: ['auth', 'not-verified']});
useLayout().setNavigationMode('solid', 'Verify.vue');
let pending = ref(false);

const execute = async () => {
    pending.value = true;

    await laraFetch("/api/email/verification-notification", {
        method: 'POST',
    }, {
        onRequestError: () => {
            pending.value = false;
        },
        onResponse: () => {
            pending.value = false;
        },
        onSuccessResponse: (request, options, response) => {
            $promptStore.setPrompt({
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