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
                                        <InputWithIcon :icon="'ic:sharp-person-pin'" v-model="$authStore.user.name" />
                                    </div>
                                    <div>
                                        <InputLabel :size="'sm'" value="Email" />
                                        <InputWithIcon :icon="'ic:round-mail-outline'" v-model="$authStore.user.email" />
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
import {ref} from "vue";

definePageMeta({
    layout: false,
    middleware: 'auth'
});

const { $moment, $authStore } = useNuxtApp();

</script>