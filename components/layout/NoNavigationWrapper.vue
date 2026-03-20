<template>
    <div
        v-if="clientReadyState"
        id="layoutScroll"
        style="clip-path: inset(0 0 0 0);"
        class="relative scroll-smooth h-screen max-h-screen overflow-y-scroll snap-none">
        <!-- Main Content -->
        <main class="allocate-navigation">
            <slot></slot>
        </main>
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