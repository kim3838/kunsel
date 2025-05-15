<template>
    <span>
        <span @click="startConfirmingPassword">
            <slot />
        </span>

        <DialogModal
            :show="confirmingPassword"
            :closeable="false"
            @close="closeModal">
            <template #title>
                {{ (confirmingPasswordPending && confirmingPassword ? titlePending : title) }}
            </template>

            <template #content>
                {{ (confirmingPasswordPending && confirmingPassword ? '' : content) }}

                <div class="mt-4">
                    <Input
                        v-if="!confirmingPasswordPending"
                        ref="passwordInput"
                        :disabled="confirmPasswordPending"
                        v-model="form.password"
                        :type="'password'"
                        class="block"
                        :placeholder="'Password'"
                        @keyup.enter="confirmPassword"
                    />
                </div>
            </template>

            <template #footer>
                <div class="flex space-x-2 justify-between">
                    <div class="space-x-2 inline-flex">
                        <div class="space-x-2 inline-flex items-center">
                            <UnorderedList
                                v-if="(confirmingPasswordPending && confirmingPassword) || confirmPasswordPending"
                                :icon="'eos-icons:loading'"
                                :size="'md'"
                                :label="'Please wait...'"/>
                        </div>
                    </div>
                    <div class="space-x-2 inline-flex items-center">
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
        onSuccessResponse: (request, options, response) => {
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
        onSuccessResponse: (request, options, response) => {
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
