<template>
    <div>
        <NuxtLayout name="custom">
            <template #content>
                <div class="tw-m-2 tw-p-2 tw-border tw-border-light">
                    <div class="tw-flex tw-items-center tw-justify-center">
                        <div class="moody-card tw-p-6">
                            <div class="moody-card-frame"></div>
                            <div class="tw-relative">
                                <TextSample></TextSample>
                            </div>
                        </div>

                        <div class="tw-flex tw-h-full tw-items-center tw-border-neutral-200 tw-border">
                            <form @submit.prevent="handleLogin" class="tw-w-72">
                                <div class="tw-block">
                                    <FormInputLabel :size="'sm'" for="email" value="Email" />
                                    <FormInput :disabled="pending" :size="'sm'" id="email" type="email" class="tw-w-full" ref="emailInput" v-model="email" autofocus autocomplete="off" />
                                    <sup>{{email}}</sup>
                                </div>

                                <div class="tw-block tw-mt-4">
                                    <FormInputLabel :size="'md'" for="password" value="Password" />
                                    <FormInput :disabled="pending" :size="'md'" id="password" type="password" class="tw-w-full" v-model="password" required autocomplete="current-password" />
                                    <sup>{{password}}</sup>
                                </div>

                                <div class="tw-block tw-mt-4">
                                    <label class="tw-flex tw-items-center">
                                        <FormCheckbox :disabled="pending" name="remember" v-model="remember" :size="'md'" :label="'Remember me'" />
                                    </label>
                                    <label>
                                        <sup>{{remember}}</sup>
                                    </label>
                                </div>

                                <div v-if="$coreStore.service.error.payload && !useNuxtApp().$coreStore.service.error.prompt" class="tw-block tw-text-sm tw-text-red-600">
                                    <span>{{ $coreStore.service.error.payload.message }}</span>
                                </div>

                                <div v-if="pending" class="tw-text-sm">Authenticating...</div>

                                <div v-if="!$authStore.isLoggedIn" class="tw-flex tw-items-center tw-justify-end">
                                    <Button :disabled="pending" :size="'md'"><span class="tw-font-semibold">Authenticate</span></Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </template>
        </NuxtLayout>
    </div>
</template>

<script setup lang="ts">

definePageMeta({
    layout: false,
    middleware: 'guest'
});

const { $coreStore, $authStore } = useNuxtApp();
import { ref, onMounted, nextTick } from 'vue';

let emailInput = ref(null);

onMounted(async () => {
    await nextTick();
    emailInput.value.$refs.input.focus();
})

const email = ref("berenice.jerde@example.com1");
const password = ref("password");
const remember = ref(true);
const pending = ref(false);

function handleLogin(){
    pending.value = true;

    $authStore.login({
        email: email,
        password: password,
    }, {
        onResponse() {
            pending.value = false;
        }
    });
}
</script>

<style scoped>
.container {
    @apply tw-flex tw-justify-center tw-items-center tw-text-center tw-mx-auto;
    /*border: 1px solid silver;*/
}

.moody-card{
    border: 1px solid silver;
    position: relative;
    margin: 24px;
}

.moody-card-frame{
    box-sizing: border-box;
    display: block;
    content: none;
}

.moody-card-frame:before{
    position: absolute;
    content: "";
    top: -8px;
    left: -9px;
    right: 7px;
    bottom: 7px;
    border: 1px solid silver;
    display: block;
}

.moody-card-frame:after{
    position: absolute;
    content: "";
    top: 7px;
    left: 7px;
    right: -9px;
    bottom: -8px;
    border: 1px solid silver;
    display: block;
}
</style>
