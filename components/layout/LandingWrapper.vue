<template>
    <div
        v-if="clientReadyState"
        id="layoutScroll"
        class="relative scroll-smooth h-screen max-h-screen overflow-y-scroll snap-none">
        <!-- Primary Navigation Menu -->
        <LandingNavigation v-model:navigation-height-in-pixels="topAllocation" />
        <!-- Main Content -->
        <main class="allocate-navigation">
            <slot></slot>
        </main>
        <!-- DateTime Picker -->
        <div id="datetimepicker-slot" class="font-data"></div>
        <!-- Action Modal -->
        <PromptModal />
        <!-- Footer -->
        <LandingFooter/>
    </div>
</template>

<script setup lang="ts">
const clientReadyState = useClientReadyState();
const topAllocation = ref('0px');
</script>
<style scoped>
.allocate-navigation {
    padding-top: v-bind(topAllocation);
}
</style>