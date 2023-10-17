<template>
    <div>
        <NuxtLayout :name="$coreStore.layout">
            <template #content>
                <div class="tw-mx-auto tw-max-w-screen-2xl tw-flex tw-justify-center">
                    <AccentFrame class="tw-my-4">
                        <template #content>
                            <div class="tw-relative">
                                <form @submit.prevent="handleLogin" class="tw-w-72">
                                    <div class="tw-block">
                                        <InputLabel :size="'sm'" for="email" value="Email" />
                                        <Input
                                            :disabled="pending"
                                            :size="'md'"
                                            id="email"
                                            type="email"
                                            class="tw-w-full"
                                            ref="emailInput"
                                            v-model="email"
                                            autofocus
                                            autocomplete="off" />
                                        <sup>{{email}}</sup>
                                    </div>

                                    <div class="tw-block tw-mt-4">
                                        <InputLabel :size="'md'" for="password" value="Password" />
                                        <Input
                                            :disabled="pending"
                                            :size="'md'"
                                            id="password"
                                            type="password"
                                            class="tw-w-full"
                                            v-model="password"
                                            required
                                            autocomplete="current-password" />
                                        <sup>{{password}}</sup>
                                    </div>

                                    <div class="tw-block tw-mt-4">
                                        <label class="tw-flex tw-items-center">
                                            <Checkbox
                                                :disabled="pending"
                                                name="remember"
                                                v-model="remember"
                                                :size="'md'"
                                                :label="'Remember me'" />
                                        </label>
                                        <label>
                                            <sup>{{remember}}</sup>
                                        </label>
                                    </div>

                                    <div v-if="$coreStore.service.error.payload && !useNuxtApp().$coreStore.service.error.prompt" class="tw-block tw-text-sm tw-text-red-600">
                                        <span>{{ $coreStore.service.error.payload.message }}</span>
                                    </div>

                                    <div v-if="!$authStore.isLoggedIn" class="tw-flex tw-items-center tw-justify-end">
                                        <Button
                                            :disabled="pending"
                                            :size="'md'"
                                            :variant="'flat'"
                                            :icon="pending ? 'eos-icons:installing' : 'mdi:key-chain'"
                                            :label="pending ? 'Authenticating...' : 'Authenticate'"></Button>
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

<script setup lang="ts">
import {ref, onMounted, nextTick} from 'vue';
import {storeToRefs} from 'pinia';
const {$coreStore, $authStore} = useNuxtApp();

definePageMeta({
    layout: false,
    middleware: 'guest'
});

const {
    authPending: pending
} = storeToRefs($authStore);

let emailInput = ref(null);

onMounted(async () => {
    await nextTick();
    emailInput.value.$refs.input.focus();
})

const email = ref("kimdeguzman20@yahoo.com1");
const password = ref("password");
const remember = ref(true);

function handleLogin(){
    $authStore.login({
        email: email,
        password: password,
        remember: remember
    });
}
</script>

<style scoped>
.container {
    @apply tw-flex tw-justify-center tw-items-center tw-text-center tw-mx-auto;
    /*border: 1px solid silver;*/
}

.login-hero{
    background-image: url("/images/hero/667a2407-ae78-4e4d-b69e-059552bca96e.webp");
    background-repeat: no-repeat;
    background-size: cover;
}
</style>
