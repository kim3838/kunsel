<template>
    <div>
        <NuxtLayout name="custom">
            <template #content>
                <TextSample></TextSample>
            </template>
        </NuxtLayout>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    layout: false,
});
</script>