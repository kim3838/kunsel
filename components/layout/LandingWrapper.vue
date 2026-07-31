<template>
    <div
        id="layoutScroll"
        style="clip-path: inset(0 0 0 0);"
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
        <Footer top-rule-divider landing-links/>
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