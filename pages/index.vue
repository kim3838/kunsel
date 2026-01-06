<template>
    <div>
        <DefaultWrapper>
            <div class="mx-auto max-w-screen-2xl p-[20px]">

            </div>
        </DefaultWrapper>
    </div>
</template>

<script setup lang="ts">
useHead({titleTemplate: (titleChunk) => {return `${titleChunk} - Home`}});
definePageMeta({middleware: 'auth'});
useLayout().setNavigationMode('solid');
</script>

<style scoped>

</style>