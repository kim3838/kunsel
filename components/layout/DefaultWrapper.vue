<template>
    <div
        v-if="clientReadyState"
        id="layoutScroll"
        class="relative scroll-smooth h-screen max-h-screen overflow-y-scroll">
        <!-- Primary Navigation Menu -->
        <DefaultNavigation v-model:navigation-height-in-pixels="topAllocation"/>
        <!-- Main Content -->
        <main class="allocate-navigation absolute">
            <slot></slot>
        </main>
        <!-- DateTime Picker -->
        <div id="datetimepicker-slot" class="font-data"></div>
        <!-- Action Modal -->
        <PromptModal />
    </div>
</template>

<script setup lang="ts">
const clientReadyState = useClientReadyState();
const topAllocation = ref('0px');
</script>
<style lang="scss" scoped>
main{
    left: 0;
    right: 0;
}
.allocate-navigation {
    padding-top: v-bind(topAllocation);
}
</style>