<template>
    <div>

        <div class="lining-shadow rounded-sm grow tint-background">

            <div class="rounded-t-sm px-4 py-2 flex flex-row items-center justify-between">
                <div class="flex flex-row items-center gap-2">

                    <div class="font-header text-lg line-clamp-1">Leave Today</div>

                    <div class="text-base font-narrow-thin">
                        ({{todayLeaves.length}})
                    </div>
                </div>

                <UnorderedList
                    v-if="!leaveTodayAndUpcomingPending && leaveTodayAndUpcomingSuccessful && todayLeaves.length > 0"
                    class="cursor-pointer subtitle-color text-right"
                    @click="toggleShowLeaveToday"
                    :icon="showLeaveToday ? 'ic:outline-keyboard-arrow-left' : 'ic:outline-keyboard-arrow-down'"
                    :label="'on leave today'"
                    :size="'sm'"/>
            </div>

            <div class="grid p-4">

                <Label v-if="!leaveTodayAndUpcomingSuccessful" invert :size="'md'" :type="'danger'" :label="leaveTodayAndUpcomingMessage" />

                <DataTable
                    v-if="leaveTodayAndUpcomingSuccessful"
                    :headers="leavesHeaders"
                    :size="'md'"
                    landscape
                    :rows="todayLeaves">
                    <template v-slot:cell.employee_number="{cell,slot}">
                        <div class="p-[3px]">{{cell.employee.number}}</div>
                    </template>
                    <template v-slot:cell.employee_full_name="{cell,slot}">
                        <div class="p-[3px]" :title="cell.employee.full_name">{{wordClamp(cell.employee.full_name, 20)}}</div>
                    </template>
                    <template v-slot:cell.date="{cell,slot}">
                        <div class="p-[3px]">{{cell.date_readable}}</div>
                    </template>
                    <template v-slot:cell.type="{cell,slot}">
                        <div class="p-[3px]">{{cell.leave_type?.type?.text}}</div>
                    </template>
                </DataTable>
            </div>
        </div>

        <div class="lining-shadow rounded-sm grow tint-background">

            <div class="rounded-t-sm px-4 py-2 flex flex-row items-center justify-between">
                <div class="flex flex-row items-center gap-2">

                    <div class="font-header text-lg line-clamp-1">Upcoming leaves</div>

                    <div class="text-base font-narrow-thin">
                        ({{upcomingLeaves.length}})
                    </div>
                </div>

                <UnorderedList
                    v-if="!leaveTodayAndUpcomingPending && leaveTodayAndUpcomingSuccessful && upcomingLeaves.length > 0"
                    class="cursor-pointer subtitle-color text-right"
                    @click="toggleShowUpcomingLeaves"
                    :icon="showUpcomingLeaves ? 'ic:outline-keyboard-arrow-left' : 'ic:outline-keyboard-arrow-down'"
                    :label="'upcoming leaves'"
                    :size="'sm'"/>
            </div>

            <div class="grid p-4">

                <Label v-if="!leaveTodayAndUpcomingSuccessful" invert :size="'md'" :type="'danger'" :label="leaveTodayAndUpcomingMessage" />

                <DataTable
                    v-if="leaveTodayAndUpcomingSuccessful"
                    :headers="leavesHeaders"
                    :size="'md'"
                    landscape
                    :rows="upcomingLeaves">
                    <template v-slot:cell.employee_number="{cell,slot}">
                        <div class="p-[3px]">{{cell.employee.number}}</div>
                    </template>
                    <template v-slot:cell.employee_full_name="{cell,slot}">
                        <div class="p-[3px]" :title="cell.employee.full_name">{{wordClamp(cell.employee.full_name, 20)}}</div>
                    </template>
                    <template v-slot:cell.date="{cell,slot}">
                        <div class="p-[3px]">{{cell.date_readable}}</div>
                    </template>
                    <template v-slot:cell.type="{cell,slot}">
                        <div class="p-[3px]">{{cell.leave_type?.type?.text}}</div>
                    </template>
                </DataTable>
            </div>
        </div>

    </div>
</template>

<script setup lang="ts">
import {storeToRefs} from "pinia";
import type {TableHeaderT} from "@/public/js/types/data";

const {isAuthenticated} = useAuth();
const nuxtApp = useNuxtApp();
const wordClamp = nuxtApp.$wordClamp as (text: string, length: number) => string;
const {
    updatedAssociatedCompanyFlag,
} = storeToRefs(nuxtApp.$associationStore);
const {
    selectedAssociatedCompanyAccountId,
    selectedAssociatedCompanyId,
} = storeToRefs(nuxtApp.$authStore);

watch(updatedAssociatedCompanyFlag, (newValue) => {
    if(isAuthenticated.value && selectedAssociatedCompanyId.value){
        leaveTodayAndUpcomingExecute()
    }
});

const leaveTodayAndUpcomingPending = ref(false);
const leaveTodayAndUpcomingSuccessful = ref(false);
const leaveTodayAndUpcomingMessage = ref('');

const leavesHeaders = reactive<TableHeaderT[]>([
    { text: '#', value: 'row_number'},
    { text: 'Date', value: 'date', minWidth: '27px'},
    { text: '', value: 'week_day_name', minWidth: '27px'},

    { text: '#', value: 'employee_number', alignData: 'left'},
    { text: 'Name', value: 'employee_full_name', alignData: 'left', minWidth: '27px'},

    { text: 'Type', value: 'type', minWidth: '27px'},

]);

const todayLeaves = ref([]);
const showLeaveToday = ref(false);
const toggleShowLeaveToday = () => {
    showLeaveToday.value = !showLeaveToday.value;
}

const upcomingLeaves = ref([]);
const showUpcomingLeaves = ref(false);
const toggleShowUpcomingLeaves = () => {
    showUpcomingLeaves.value = !showUpcomingLeaves.value;
}

const leaveTodayAndUpcomingExecute = async() =>{

    if(import.meta.server || !selectedAssociatedCompanyId.value){
        return;
    }

    leaveTodayAndUpcomingPending.value = true;

    await laraFetch(`/api/leave-today-and-upcoming`, {
        method: 'GET',
        params: {
            account_id: selectedAssociatedCompanyAccountId.value,
            company_id: selectedAssociatedCompanyId.value,
            filters: {
                company_id: selectedAssociatedCompanyId.value,
                date_from: nuxtApp.$moment().format("YYYY-MM-DD"),
                date_to: nuxtApp.$moment().format("YYYY-MM-DD"),
            }
        }
    }, {
        onRequestError: () => {
            leaveTodayAndUpcomingPending.value = false;
        },
        onResponse: (request, options, response) => {
            leaveTodayAndUpcomingPending.value = false;
            leaveTodayAndUpcomingSuccessful.value = _get(response, '_data.successful', false);
            leaveTodayAndUpcomingMessage.value = _get(response, '_data.message', '');
        },
        onSuccessResponse: async (request, options, response) => {
            todayLeaves.value = _get(response, '_data.values.today_leaves', []);
            upcomingLeaves.value = _get(response, '_data.values.upcoming_leaves', []);
        }
    }, false);
}
leaveTodayAndUpcomingExecute();
</script>

<style scoped>

</style>