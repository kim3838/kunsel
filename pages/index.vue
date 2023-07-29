<template>
    <div>
        <NuxtLayout name="custom">
            <TextSample></TextSample>

            <div class="tw-block">
                <FormInputLabel :height="'md'" for="email" value="Email" />
                <FormInput :height="'md'" id="email" type="email" class="tw-w-full" autofocus autocomplete="off" />
            </div>
        </NuxtLayout>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    layout: false,
});
</script>