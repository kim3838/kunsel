<template>
    <span>
        <span @click="startConfirmingPassword">
            <slot />
        </span>

        <DialogModal
            :max-width="'lg'"
            :show="confirmingPassword"
            :closeable="false"
            @close="closeModal">
            <template #title>
                {{ (confirmingPasswordPending && confirmingPassword ? titlePending : title) }}
            </template>

            <template #content>
                {{ (confirmingPasswordPending && confirmingPassword ? '' : content) }}

                <div class="tw-mt-4">
                    <Input
                        v-if="!confirmingPasswordPending"
                        ref="passwordInput"
                        :disabled="confirmPasswordPending"
                        v-model="form.password"
                        :type="'password'"
                        class="tw-block"
                        :placeholder="'Password'"
                        @keyup.enter="confirmPassword"
                    />
                </div>
            </template>

            <template #footer>
                <div class="tw-flex tw-space-x-2 tw-justify-end">
                    <UnorderedList
                        v-if="confirmingPasswordPending && confirmingPassword"
                        :icon="'eos-icons:loading'"
                        :size="'md'"
                        :label="'Please wait...'"/>
                    <Button
                        v-show="!confirmingPasswordPending"
                        :disabled="confirmPasswordPending"
                        @click="closeModal" :label="'Cancel'" />

                    <Button
                        v-show="!confirmingPasswordPending"
                        :disabled="confirmPasswordPending"
                        @click="confirmPassword"
                        :label="button"/>
                </div>
            </template>
        </DialogModal>
    </span>
</template>

<script setup>
const emit = defineEmits(['confirmed']);

defineProps({
    title: {
        type: String,
        default: 'Confirm Password',
    },
    titlePending: {
        type: String,
        default: 'Confirming Password',
    },
    content: {
        type: String,
        default: 'For your security, please confirm your password to continue.',
    },
    button: {
        type: String,
        default: 'Confirm',
    },
});



const form = reactive({
    password: ''
});

const passwordInput = ref(null);
const confirmingPassword = ref(false);

const confirmingPasswordPending = ref(false);
const startConfirmingPassword = async () => {
    confirmingPassword.value = true;
    confirmingPasswordPending.value = true;

    await laraFetch('/api/confirmed-password-status', {
        method: 'GET',
    }, {
        onRequestError: () => {
            confirmingPasswordPending.value = false;
        },
        onResponse: () => {
            confirmingPasswordPending.value = false;
        },
        onSuccessResponse: (request, response, options) => {
            if(_get(response, '_data.values.confirmed', false)){
                confirmingPassword.value = false;
                emit('confirmed');
            } else {
                passwordInput.value.$refs.input.focus()
            }
        }
    });
};

const confirmPasswordPending = ref(false);
const confirmPassword = async () => {
    confirmPasswordPending.value = true;

    await laraFetch('/api/confirm-password', {
        method: 'POST',
        body: form,
    }, {
        onRequestError: () => {
            confirmPasswordPending.value = false;
        },
        onResponse: () => {
            confirmPasswordPending.value = false;
        },
        onSuccessResponse: (request, response, options) => {
            closeModal();
            nextTick().then(() => emit('confirmed'));
        }
    });
}

const closeModal = () => {
    confirmingPassword.value = false;
    form.password = '';
};
</script>
