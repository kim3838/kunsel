<template>
    <div>
        <LandingWrapper>
            <div class="mx-auto pt-4 max-w-screen-2xl">
                <div class="flex justify-center">
                    <AccentFrame class="my-4">
                        <template #content>
                            <div class="relative py-4">
                                <form @submit.prevent="execute" class="w-80">
                                    <ThemeHeader class="mb-4 text-xl">Verify your email</ThemeHeader>

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
                                            :label="pending ? 'Requesting...' : 'Send email verification'"></Button>
                                    </div>
                                </form>
                            </div>
                        </template>
                    </AccentFrame>
                </div>
            </div>
        </LandingWrapper>
    </div>
</template>

<script setup>
const {$promptStore} = useNuxtApp();
useHead({titleTemplate: (titleChunk) => {return `Verify Email`}});
definePageMeta({middleware: ['auth', 'not-verified']});
useLayout().setNavigationMode('solid');

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