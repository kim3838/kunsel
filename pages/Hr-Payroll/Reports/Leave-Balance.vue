<template>
    <div>
        <DefaultWrapper>
            <div class="mx-auto max-w-screen-2xl">

                <div class="space-y-2 p-[20px]">

                    <BreadCrumbs prefix-company :size="`sm`" />

                    <div class="flex flex-row">
                        <RadioGroup
                            class="flex-none scaffold-border px-2"
                            :selections="leaveBalanceTabs"
                            :size="'md'"
                            :orientation="leaveBalanceTabRadioGroupOrientation"
                            :radio-key="`leave_balance_tab`"
                            v-model="leaveBalanceTab" />
                    </div>
                </div>

                <div v-if="leaveBalanceTab == LEAVE_BALANCE_TAB.PERIOD_SERIES">
                    <Suspense>
                        <LeaveBalancePeriodSeries/>

                        <template #fallback>
                            <div class="px-[20px]">
                                <UnorderedList
                                    :icon="'eos-icons:loading'"
                                    :size="'md'"
                                    :label="'Loading period series...'"/>
                            </div>
                        </template>
                    </Suspense>
                </div>

                <div v-if="leaveBalanceTab == LEAVE_BALANCE_TAB.BALANCE_BY_TYPE">
                    <Suspense>
                        <LeaveBalanceByType/>

                        <template #fallback>
                            <div class="px-[20px]">
                                <UnorderedList
                                    :icon="'eos-icons:loading'"
                                    :size="'md'"
                                    :label="'Loading balance by type...'"/>
                            </div>
                        </template>
                    </Suspense>
                </div>
            </div>
        </DefaultWrapper>
    </div>
</template>

<script setup lang="ts">
import type {StringEnumInterface} from "@/public/js/common/type";

useHead({titleTemplate: (titleChunk) => {return `Leave Balance`}});
definePageMeta({middleware: ['auth', 'admin-of-selected-company']});
useLayout().setNavigationMode('solid');

const nuxtApp = useNuxtApp();
const $enumerableOption = nuxtApp.$enumerableOption as (enumerable: StringEnumInterface, value: number) => {
    text: string,
    value: number
};
const {screenWidthBreakpoint, width: screenWidth} = useScreen();

const leaveBalanceTab = ref(LEAVE_BALANCE_TAB.PERIOD_SERIES);
const leaveBalanceTabs = reactive([
    $enumerableOption(LEAVE_BALANCE_TAB_NAME, LEAVE_BALANCE_TAB.PERIOD_SERIES as number),
    $enumerableOption(LEAVE_BALANCE_TAB_NAME, LEAVE_BALANCE_TAB.BALANCE_BY_TYPE as number),
]);

const leaveBalanceTabRadioGroupOrientation = computed(() => {
    return screenWidth.value >= screenWidthBreakpoint['md'] ? 'horizontal' : 'vertical';
})
</script>

<style scoped>

</style>