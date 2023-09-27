<template>
    <div>
        <NuxtLayout :name="$coreStore.layout">
            <template #content>
                <TextSample></TextSample>
            </template>
        </NuxtLayout>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    layout: false,
    middleware: 'guest'
});
</script>