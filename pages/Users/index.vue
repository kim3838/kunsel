<template>
    <div>
        <NuxtLayout name="custom">
            <template #content>
                <div class="tw-m-1">
                    User index
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
</script>