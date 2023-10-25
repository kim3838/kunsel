<template>
    <div>
        <NuxtLayout :name="$coreStore.layout">
            <template #content>
                <div class="tw-mx-auto tw-max-w-screen-2xl tw-flex tw-justify-center">
                    <AccentFrame class="tw-my-4 tw-w-max">
                        <template #content>
                            <div class="tw-relative">
                                <p class="tw-font-semibold tw-text-lg">Profile Information</p>
                                <div class="tw-mt-2 tw-grid tw-gap-2 tw-grid-cols-2">
                                    <div>
                                        <InputLabel :size="'sm'" value="Username" />
                                        <InputWithIcon :icon="'ic:sharp-person-pin'" v-model="user.name" readonly />
                                    </div>
                                    <div>
                                        <InputLabel :size="'sm'" value="Email" />
                                        <InputWithIcon :icon="'ic:round-mail-outline'" v-model="user.email" readonly />
                                    </div>
                                    <div>
                                        <InputWithIcon
                                            :icon="user.email_verified_at ? 'ic:sharp-verified-user' : 'mdi:security-close'"
                                            :placeholder="user.email_verified_at ? 'Email Verified' : 'Email Not Verified'"
                                            readonly />
                                    </div>
                                </div>
                            </div>
                        </template>
                    </AccentFrame>
                </div>
            </template>
        </NuxtLayout>
    </div>
</template>

<style>

</style>

<script setup lang="ts">
import {storeToRefs} from 'pinia';
const {$authStore} = useNuxtApp();

definePageMeta({
    layout: false,
    middleware: 'auth'
});

const {
    user: user
} = storeToRefs($authStore);
</script>