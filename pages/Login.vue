<template>
    <div>
        <NuxtLayout :name="$coreStore.layout">
            <template #content>
                <div class="tw-mx-auto tw-max-w-screen-2xl tw-flex tw-justify-center tw-border tw-border-green-200">

                    <div class="tw-border tw-border-red-200">
                        <form @submit.prevent="handleLogin" class="tw-w-72">
                            <div class="tw-block">
                                <InputLabel :size="'sm'" for="email" value="Email" />
                                <Input :disabled="pending" :size="'sm'" id="email" type="email" class="tw-w-full" ref="emailInput" v-model="email" autofocus autocomplete="off" />
                                <sup>{{email}}</sup>
                            </div>

                            <div class="tw-block tw-mt-4">
                                <InputLabel :size="'md'" for="password" value="Password" />
                                <Input :disabled="pending" :size="'md'" id="password" type="password" class="tw-w-full" v-model="password" required autocomplete="current-password" />
                                <sup>{{password}}</sup>
                            </div>

                            <div class="tw-block tw-mt-4">
                                <label class="tw-flex tw-items-center">
                                    <Checkbox :disabled="pending" name="remember" v-model="remember" :size="'md'" :label="'Remember me'" />
                                </label>
                                <label>
                                    <sup>{{remember}}</sup>
                                </label>
                            </div>

                            <div v-if="$coreStore.service.error.payload && !useNuxtApp().$coreStore.service.error.prompt" class="tw-block tw-text-sm tw-text-red-600">
                                <span>{{ $coreStore.service.error.payload.message }}</span>
                            </div>

                            <div v-if="!$authStore.isLoggedIn" class="tw-flex tw-items-center tw-justify-end">
                                <Button :disabled="pending" :variant="'flat'" :icon="pending ? 'eos-icons:installing' : 'mdi:key-chain'" :size="'md'" :label="pending ? 'Authenticating...' : 'Authenticate'"></Button>
                            </div>
                        </form>
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
        remember: remember
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
</style>
