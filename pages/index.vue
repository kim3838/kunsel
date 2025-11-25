<template>
    <div>
        <DefaultWrapper>
            <div class="mx-auto max-w-screen-2xl">

            </div>
        </DefaultWrapper>
    </div>
</template>

<script setup lang="ts">
definePageMeta({middleware: 'auth'});
useLayout().setNavigationMode('solid');
</script>

<style scoped>

</style>