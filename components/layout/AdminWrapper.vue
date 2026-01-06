<template>
    <div
        v-if="clientReadyState"
        id="layoutScroll"
        style="clip-path: inset(0 0 0 0);"
        class="relative scroll-smooth h-screen max-h-screen overflow-y-scroll">
        <!-- Primary Navigation Menu -->
        <AdminNavigation v-model:navigation-height="topAllocation"/>
        <!-- Main Content -->
        <main ref="mainContent" class="allocate-navigation absolute">
            <slot></slot>
        </main>
        <!-- DateTime Picker -->
        <div id="datetimepicker-slot" class="font-data"></div>
        <!-- Action Modal -->
        <PromptModal />
        <!-- Footer -->
        <Footer top-rule-divider class="w-full allocate-body absolute" />

        <!-- Company Change Pending Mask -->
        <DialogModal
            :show="companyAssociationPending"
            :max-width="'410px'"
            :body-border-bottom="false"
            :closeable="false">
            <template #title>
            </template>
            <template #content>
                <div v-if="$authStore.selectedAssociatedCompany">
                    {{`Setting ${$authStore.selectedAssociatedCompany?.text}`}}
                </div>
            </template>
            <template #footer>
                <div class="flex space-x-2 justify-between">
                    <div class="space-x-2 inline-flex">
                        <div class="space-x-2 inline-flex items-center">
                            <UnorderedList :icon="'eos-icons:loading'" :size="'md'" :label="'Please wait...'"/>
                        </div>
                    </div>
                    <div class="space-x-2 inline-flex items-center"></div>
                </div>
            </template>
        </DialogModal>
    </div>
</template>

<script setup lang="ts">
const companyAssociationPending = companyAssociationPendingState();
const {$layoutStore} = useNuxtApp();
const clientReadyState = useClientReadyState();
const {activeSubNavigationLink} = useLayout();
const topAllocation = ref(0);
const topAllocationComputed = computed(() => {
    return (topAllocation.value + 'px');
});

const mainContentReference = useTemplateRef('mainContent');

const { height: mainContentReferenceHeight } = useElementSize(mainContentReference);

const footerTopAllocationComputed = computed(() => {
    return ((topAllocation.value + mainContentReferenceHeight.value) + 'px');
});

watch(clientReadyState, async (clientReady) => {
    if(clientReady){
        $layoutStore.setSubNavigationDropAlign(activeSubNavigationLink.value?.drop_align || 'left');
    }
})
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