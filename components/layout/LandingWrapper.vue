<template>
    <div
        v-if="clientReadyState"
        id="layoutScroll"
        class="tw-relative tw-scroll-smooth tw-h-screen tw-max-h-screen tw-overflow-auto tw-snap-none">
        <!-- Primary Navigation Menu -->
        <LandingNavigation v-model:navigation-height-in-pixels="topAllocation" />
        <!-- Main Content -->
        <main class="allocate-navigation">
            <slot></slot>
        </main>
        <!-- DateTime Picker -->
        <div id="datetimepicker-slot" class="tw-font-data"></div>
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