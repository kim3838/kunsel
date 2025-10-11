<template>
    <div
        v-if="clientReadyState"
        id="layoutScroll"
        style="clip-path: inset(0 0 0 0);"
        class="relative scroll-smooth h-screen max-h-screen overflow-y-scroll">
        <!-- Primary Navigation Menu -->
        <DefaultNavigation v-model:navigation-height="topAllocation"/>
        <!-- Main Content -->
        <main ref="mainContent" class="allocate-navigation absolute">
            <slot></slot>
        </main>
        <!-- DateTime Picker -->
        <div id="datetimepicker-slot" class="font-data"></div>
        <!-- Action Modal -->
        <PromptModal />
        <!-- Footer -->
        <Footer top-rule-divider breadcrumbs-prefix-company class="w-full allocate-body absolute" />
    </div>
</template>

<script setup lang="ts">
const clientReadyState = useClientReadyState();
const topAllocation = ref(0);
const topAllocationComputed = computed(() => {
    return (topAllocation.value + 'px');
});

const mainContentReference = useTemplateRef('mainContent');

const { height: mainContentReferenceHeight } = useElementSize(mainContentReference);

const footerTopAllocationComputed = computed(() => {
    return ((topAllocation.value + mainContentReferenceHeight.value) + 'px');
});
</script>
<style lang="scss" scoped>
main{
    left: 0;
    right: 0;
}
.allocate-navigation {
    padding-top: v-bind(topAllocationComputed);
}
.allocate-body {
    margin-top: v-bind(footerTopAllocationComputed);
}
</style>