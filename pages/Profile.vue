<template>
    <div>
        <NuxtLayout name="custom">
            <template #content>
                <div v-if="$authStore.isLoggedIn" class="tw-justify-end">
                    <Button :disabled="pending" @click="handleLogout" :size="'md'"><span class="tw-font-semibold">Logout</span></Button>
                </div>

                {{$authStore.user}}
            </template>
        </NuxtLayout>
    </div>
</template>

<script setup lang="ts">
import {ref} from "vue";

definePageMeta({
    layout: false,
    middleware: 'auth'
});

const { $authStore } = useNuxtApp();

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