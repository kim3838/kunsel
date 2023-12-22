<template>
    <div>
        <NuxtLayout :name="$layoutStore.layout">
            <template #content>
                <div class="tw-mx-auto tw-max-w-screen-2xl tw-flex tw-justify-center">
                    <AccentFrame class="tw-my-4">
                        <template #content>
                            <div class="tw-relative tw-py-4">
                                <form @submit.prevent="execute" class="tw-w-72">
                                    <p class="tw-font-semibold tw-text-lg">
                                        Verify your email.
                                    </p>
                                    <br>
                                    <p class="tw-text-base">
                                        Please click the verification button sent to your email address.
                                    </p>
                                    <br>
                                    <p class="tw-text-sm">
                                        Use the button below to resend the verification.
                                        Dont forget to check your email spam category.
                                    </p>

                                    <div class="tw-flex tw-mt-4 tw-items-center tw-justify-end">
                                        <Button
                                            :disabled="pending"
                                            :size="'md'"
                                            :variant="'flat'"
                                            :icon="pending ? 'eos-icons:installing' : 'ic:round-mail-outline'"
                                            :label="pending ? 'Requesting...' : 'Send Email Verification'"></Button>
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
const {$coreStore, $layoutStore} = useNuxtApp();

$layoutStore.setNavigationMode('solid');

definePageMeta({
    layout: false,
    middleware: [
        'auth',
        'not-verified'
    ]
});

let pending = ref(false);

const {execute} = csrFetch("/api/email/verification-notification", {
    method: 'POST',
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
            title: 'Email Verification',
            message: _get(response, '_data.message', ''),
            action: {
                label: 'Close'
            }
        });
    }
});
</script>