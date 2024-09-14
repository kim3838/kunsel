<template>
    <div>
        <DefaultWrapper>
            <div class="tw-mx-auto tw-pt-4 tw-max-w-screen-2xl">
                Example page
            </div>
        </DefaultWrapper>
    </div>
</template>

<script setup lang="ts">
definePageMeta({middleware: 'auth'});
useLayout().setNavigationMode('solid', 'Example.vue');
</script>