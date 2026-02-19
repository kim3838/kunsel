<template>
    <transition name="fade">
        <div v-show="!clientReadyState" :class="[backgroundClass]" class="fixed inset-0 overflow-y-auto px-0 z-50">
            <div class="h-full flex items-center justify-center">
                <UnorderedList class="font-[Geist]" :size="'md'" :icon="'eos-icons:loading'">Please wait...</UnorderedList>
            </div>
        </div>
    </transition>
</template>

<script setup>
const clientReadyState = useClientReadyState();
const themeType = themeTypeState();

const lightTheme = computed(() => {
    return themeType.value === 'light';
});

const backgroundClass = computed(() => {
    return lightTheme.value ? 'light-background' : 'dark-background';
})
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

.light-background{
    background-color: #fdfdfd;
}

.dark-background{
    background-color: #555756;
}
</style>