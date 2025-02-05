<template>
    <transition name="fade">
        <div v-show="!clientReadyState" class="bg-white fixed inset-0 overflow-y-auto px-0 z-50">
            <div class="h-full flex items-center justify-center">
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