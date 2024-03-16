<template>
    <transition name="fade">
        <div v-show="!clientReadyState" class="tw-bg-white tw-fixed tw-inset-0 tw-overflow-y-auto tw-px-0 tw-z-50">
            <div class="tw-h-full tw-flex tw-items-center tw-justify-center">
                <UnorderedList :size="'lg'" :icon="'eos-icons:loading'">Please wait...</UnorderedList>
            </div>
        </div>
    </transition>
</template>

<script setup>
const clientReadyState = useClientReadyState();
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>