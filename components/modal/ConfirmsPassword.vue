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
                {{ title }}
            </template>

            <template #content>
                {{ content }}

                <div class="tw-mt-4">
                    <Input
                        ref="passwordInput"
                        :disabled="confirmPasswordPending"
                        v-model="form.password"
                        type="password"
                        class="tw-block"
                        placeholder="Password"
                        @keyup.enter="confirmPassword"
                    />
                </div>
            </template>

            <template #footer>
                <Button @click="closeModal" :label="'Cancel'" />

                <Button
                    class="tw-ms-3"
                    :disabled="confirmPasswordPending"
                    @click="confirmPassword"
                    :label="button"/>
            </template>
        </DialogModal>
    </span>
</template>

<script setup>
import { ref, reactive, nextTick } from 'vue';

const emit = defineEmits(['confirmed']);

defineProps({
    title: {
        type: String,
        default: 'Confirm Password',
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

const confirmingPassword = ref(false);

const form = reactive({
    password: ''
});

const passwordInput = ref(null);

const startConfirmingPassword = () => {
    csrFetch('/api/confirmed-password-status', {
        method: 'GET',
    }, {
        onResponse: () => {
        },
        onSuccessResponse: (request, response, options) => {
            if(_get(response, '_data.values.confirmed', false)){
                emit('confirmed');
            } else {
                confirmingPassword.value = true;

                setTimeout(() => passwordInput.value.$refs.input.focus(), 250);
            }
        }
    });

};

const confirmPasswordPending = ref(false);
const { execute: confirmPassword} = csrFetch('/api/confirm-password', {
    method: 'POST',
    body: form,
    immediate: false,
}, {
    onSuccessResponse: (request, response, options) => {
        closeModal();
        nextTick().then(() => emit('confirmed'));
    }
});

const closeModal = () => {
    confirmingPassword.value = false;
    form.password = '';
};
</script>
