<template>
    <div>
        <NuxtLayout name="custom">
            <template #content>
                <div class="tw-m-1">
                    <div v-if="$authStore.isLoggedIn" class="tw-justify-end">
                        <Button :disabled="pending" @click="handleLogout" :size="'md'"><span class="tw-font-semibold">Logout</span></Button>
                    </div>
                    <table class="tw-mt-1 tw-border-collapse tw-tw-border tw-border-neutral-300">
                        <tbody>
                            <tr><td class="tw-border tw-border-neutral-300">Id</td><td class="tw-border tw-border-neutral-300">{{$authStore.user?.id}}</td></tr>
                            <tr><td class="tw-border tw-border-neutral-300">Name</td><td class="tw-border tw-border-neutral-300">{{$authStore.user?.name}}</td></tr>
                            <tr><td class="tw-border tw-border-neutral-300">Email</td><td class="tw-border tw-border-neutral-300">{{$authStore.user?.email}}</td></tr>
                            <tr><td class="tw-border tw-border-neutral-300">Email Verified at</td><td class="tw-border tw-border-neutral-300">{{$moment($authStore.user?.email_verified_at).format('YYYY-MM-DD HH:mm:ss')}}</td></tr>
                        </tbody>
                    </table>
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

const pending = ref(false);

function handleLogout(){
    pending.value = true;

    $authStore.logout({
        onResponse() {
            pending.value = false;
        }
    });
}
</script>