<template>
    <div>
        <NuxtLayout name="custom">
            <template #content>

                <div id="lab" class="tw-m-2 tw-p-2 tw-border tw-border-light">
                    <div class="moody-card tw-max-w-[950px] tw-w-[950px]">
                        <div class="moody-card-frame"></div>
                        <div class="tw-relative tw-border tw-border-light tw-border-b-0 tw-p-3 tw-flex tw-justify-center tw-items-center">
                            <span >
                                Lab
                            </span>
                        </div>
                        <div class="tw-relative tw-border tw-border-light tw-p-7">
                            <div v-if="true" class="tw-grid tw-gap-2 tw-grid-cols-5 tw-mb-2">
                                <div v-if="true" class="tw-block">
                                    <InputLabel :size="'md'" value="Static Multi Select" />
                                    <MultiSelect :size="'md'" :options="category" :icon="'ic:sharp-hdr-on-select'"/>
                                </div>
                                <div v-if="true" class="tw-block">
                                    <InputLabel :size="'md'" value="MD Static Single Select" />
                                    <SingleSelect :size="'md'" :icon="'ic:sharp-hdr-on-select'" :label="'Plan'" :options="plan"/>
                                </div>
                                <div v-if="true" class="tw-block">
                                    <InputLabel :size="'sm'" value="SM Static Single Select" />
                                    <SingleSelect :size="'sm'" :icon="'ic:sharp-assignment'" :options="plan"/>
                                </div>
                                <div v-if="true" class="tw-block">
                                    <InputLabel :size="'xs'" value="XS Static Single Select" />
                                    <SingleSelect :size="'xs'" :icon="'ic:sharp-assignment'" :options="plan"/>
                                </div>
                                <div v-if="true" class="tw-block">
                                    <InputLabel :size="'2xs'" value="2XS Static Single Select" />
                                    <SingleSelect :size="'2xs'" :icon="'ic:sharp-assignment'" :options="plan"/>
                                </div>
                            </div>
                            <div v-if="true" class="tw-grid tw-gap-2 tw-grid-cols-10 tw-mb-2">
                                <div class="tw-block">
                                    <InputLabel :size="'md'" value="_" class="tw-text-transparent"/>
                                    <Button @click="data = original" :size="'sm'" :label="'Original'"></Button>
                                </div>
                                <div class="tw-block">
                                    <InputLabel :size="'md'" value="_" class="tw-text-transparent"/>
                                    <Button @click="data = replace" :size="'xs'" :label="'Replace'"></Button>
                                </div>
                            </div>
                            <PageInformation v-if="true" :pagination="pagination" :no-record-label="'No Expense Found'"/>
                            <Pagination
                                v-if="true"
                                :size="'xl'"
                                :pagination="pagination"
                            />
                            <div class="tw-border tw-w-[700px] tw-border-red-400">
                                <DataTable
                                    v-if="true"
                                    :headers="headers"
                                    :size="'xl'"
                                    :rows="data"
                                    :no-data-label="'No Data Found'"
                                    v-model="selected"
                                    selection>
                                    <template v-slot:cell.tools="{cell, slot}">
                                        <div class="tw-h-full tw-w-full tw-flex tw-items-center">
                                            <Button :variant="'outline'" :size="slot.buttonSize" :icon="'ic:sharp-send-to-mobile'" :label="'Slot Button'"></Button>
                                        </div>
                                    </template>
                                    <template v-slot:cell.input="{cell, slot}">
                                        <Input :id="`datetimesample-` + cell.id" v-model="datetimeFrom" readonly :size="slot.inputSize" class="tw-w-full" type="text" />
                                    </template>
                                    <template v-slot:cell.select="{cell, slot, scrollReference}">
                                        <SingleSelect
                                            in-data-table
                                            :scroll-reference="scrollReference"
                                            :size="slot.selectSize"
                                            :icon="'ic:sharp-local-florist'"
                                            :label="'Plan'"
                                            :options="plan" />
                                    </template>
                                    <template v-slot:cell.name="{index, cell}">
                                        <span>{{`[${index}] ${cell.name}`}}</span>
                                    </template>
                                    <template v-slot:cell.code="{index, cell}">
                                        <span class="tw-font-mono">{{cell.code}}</span>
                                    </template>
                                    <template v-slot:cell.category="{cell, slot, scrollReference}">
                                        <SingleSelect
                                            in-data-table
                                            :scroll-reference="scrollReference"
                                            :size="slot.selectSize"
                                            :icon="'ic:sharp-local-florist'"
                                            :label="'Plan'"
                                            :options="plan" />
                                    </template>
                                </DataTable>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </NuxtLayout>
    </div>
</template>

<script setup lang="ts">

import {ref} from "vue";
const {$moment} = useNuxtApp();

definePageMeta({
    layout: false,
    middleware: 'guest'
});

let selected = ref([1002,2002,67,88]);
let datetimeFrom = ref($moment().startOf('day').format('YYYY-MM-DD HH:mm:ss'));
let category = reactive({
    search: '',
    data: [
        {text : 'Charms', value: 0},
        {text : 'Bracelets', value: 1},
        {text : 'Brooches and Pins', value: 2},
        {text : 'Necklaces', value: 3},
        {text : 'Earrings', value: 4},
        {text : 'Rings', value: 5},
        {text : 'Polyester', value: 6},
    ],
    selection: [
        {text : 'Charms', value: 0},
        {text : 'Bracelets', value: 1},
        {text : 'Brooches and Pins', value: 2},
        {text : 'Necklaces', value: 3},
        {text : 'Earrings', value: 4},
        {text : 'Rings', value: 5},
        {text : 'Polyester', value: 6},
    ],
    selected: []
});
let plan = reactive({
    search: '',
    data: [
        {text : 'Free', value: 0},
        {text : 'Individual', value: 1},
        {text : 'Individual', value: 1},
        {text : 'Individual', value: 1},
        {text : 'Standard Corporate', value: 2},
        {text : 'Standard Corporate', value: 2},
        {text : 'Standard Corporate', value: 2},
        {text : 'Standard Corporate', value: 2},
        {text : 'Standard Corporate', value: 2},
        {text : 'Standard Corporate', value: 2},
        {text : 'Standard Corporate', value: 2},
        {text : 'Standard Corporate', value: 2},
        {text : 'Standard Corporate', value: 2},
        {text : 'Custom Corporate, Custom Corporate, Custom Corporate', value: 3},
        {text : 'Evaluator', value: 4}
    ],
    selection: [
        {text : 'Free', value: 0},
        {text : 'Individual', value: 1},
        {text : 'Individual', value: 1},
        {text : 'Individual', value: 1},
        {text : 'Standard Corporate', value: 2},
        {text : 'Standard Corporate', value: 2},
        {text : 'Standard Corporate', value: 2},
        {text : 'Standard Corporate', value: 2},
        {text : 'Standard Corporate', value: 2},
        {text : 'Standard Corporate', value: 2},
        {text : 'Standard Corporate', value: 2},
        {text : 'Standard Corporate', value: 2},
        {text : 'Standard Corporate', value: 2},
        {text : 'Custom Corporate, Custom Corporate, Custom Corporate', value: 3},
        {text : 'Evaluator', value: 4}
    ],
    selected: null
});
let headers = reactive([
    { text: 'TOOLS', value: 'tools'},
    { text: 'INPUT', value: 'input', width: '170px'},
    { text: 'SELECT', value: 'select', width: '200px'},
    { text: 'ID', value: 'id'},
    { text: 'NAME', value: 'name'},
    { text: 'CODE', alignHeader: 'center', value: 'code'},
    { text: 'TYPE', value: 'type'},
    { text: 'CATEGORY', alignData: 'right', value: 'category', width: '200px'},
    { text: 'CAPACITY', alignData: 'left', value: 'capacity'},
    { text: 'DATE ADDED', alignData: 'right', value: 'datetime_added'},
    { text: 'DATE CREATED', alignData: 'right', value: 'created_at'},
    { text: 'DATE UPDATED', alignData: 'right', value: 'updated_at'},
]);
let data = ref([
    {
        "id": 45,
        "name": "GSX 8ZJC5 37V",
        "code": "PRT0451171313",
        "type": 1,
        "category": null,
        "capacity": 33,
        "datetime_added": "2023-08-22 17:44:03",
        "created_at": "2023-08-22 17:44:03",
        "updated_at": "2023-08-22 17:44:03"
    },
    {
        "id": 67,
        "name": "CP1 HN3 DX4K2",
        "code": "PRT9284750057",
        "type": 1,
        "category": 114,
        "capacity": 23,
        "datetime_added": "2023-08-22 17:44:03",
        "created_at": "2023-08-22 17:44:03",
        "updated_at": "2023-08-22 17:44:03"
    },
    {
        "id": 88,
        "name": "XIM 9QY QY125",
        "code": "PRT9249091497",
        "type": 5,
        "category": null,
        "capacity": 22,
        "datetime_added": "2023-08-22 17:44:03",
        "created_at": "2023-08-22 17:44:03",
        "updated_at": "2023-08-22 17:44:03"
    },
    {
        "id": 246,
        "name": "IB8 EAW DML6X",
        "code": "PRT3041670860",
        "type": 4,
        "category": 89,
        "capacity": 26,
        "datetime_added": "2023-08-22 17:44:03",
        "created_at": "2023-08-22 17:44:03",
        "updated_at": "2023-08-22 17:44:03"
    },
    {
        "id": 273,
        "name": "72WKAM 11B T5",
        "code": "PRT9023387510",
        "type": 1,
        "category": null,
        "capacity": 3,
        "datetime_added": "2023-08-22 17:44:03",
        "created_at": "2023-08-22 17:44:03",
        "updated_at": "2023-08-22 17:44:03"
    },
    {
        "id": 384,
        "name": "PM2 V8W ZCAGR",
        "code": "PRT0920672517",
        "type": 5,
        "category": null,
        "capacity": 8,
        "datetime_added": "2023-08-22 17:44:03",
        "created_at": "2023-08-22 17:44:03",
        "updated_at": "2023-08-22 17:44:03"
    },
    {
        "id": 418,
        "name": "VFSNL4 FL2 7C",
        "code": "PRT1915550179",
        "type": 3,
        "category": null,
        "capacity": 19,
        "datetime_added": "2023-08-22 17:44:03",
        "created_at": "2023-08-22 17:44:03",
        "updated_at": "2023-08-22 17:44:03"
    },
    {
        "id": 478,
        "name": "RC0 868Q6 GZI",
        "code": "PRT4902978961",
        "type": 2,
        "category": 68,
        "capacity": 15,
        "datetime_added": "2023-08-22 17:44:03",
        "created_at": "2023-08-22 17:44:03",
        "updated_at": "2023-08-22 17:44:03"
    },
    {
        "id": 552,
        "name": "9Q8 YEESZ DKF",
        "code": "PRT3932126979",
        "type": 1,
        "category": 4,
        "capacity": 15,
        "datetime_added": "2023-08-22 17:44:03",
        "created_at": "2023-08-22 17:44:03",
        "updated_at": "2023-08-22 17:44:03"
    },
    {
        "id": 702,
        "name": "45EE9R TES VK",
        "code": "PRT2563775044",
        "type": 5,
        "category": 79,
        "capacity": 35,
        "datetime_added": "2023-08-22 17:44:03",
        "created_at": "2023-08-22 17:44:03",
        "updated_at": "2023-08-22 17:44:03"
    }
]);
let original = ref([
    {
        "id": 45,
        "name": "GSX 8ZJC5 37V",
        "code": "PRT0451171313",
        "type": 1,
        "category": null,
        "capacity": 33,
        "datetime_added": "2023-08-22 17:44:03",
        "created_at": "2023-08-22 17:44:03",
        "updated_at": "2023-08-22 17:44:03"
    },
    {
        "id": 67,
        "name": "CP1 HN3 DX4K2",
        "code": "PRT9284750057",
        "type": 1,
        "category": 114,
        "capacity": 23,
        "datetime_added": "2023-08-22 17:44:03",
        "created_at": "2023-08-22 17:44:03",
        "updated_at": "2023-08-22 17:44:03"
    },
    {
        "id": 88,
        "name": "XIM 9QY QY125",
        "code": "PRT9249091497",
        "type": 5,
        "category": null,
        "capacity": 22,
        "datetime_added": "2023-08-22 17:44:03",
        "created_at": "2023-08-22 17:44:03",
        "updated_at": "2023-08-22 17:44:03"
    },
    {
        "id": 246,
        "name": "IB8 EAW DML6X",
        "code": "PRT3041670860",
        "type": 4,
        "category": 89,
        "capacity": 26,
        "datetime_added": "2023-08-22 17:44:03",
        "created_at": "2023-08-22 17:44:03",
        "updated_at": "2023-08-22 17:44:03"
    },
    {
        "id": 273,
        "name": "72WKAM 11B T5",
        "code": "PRT9023387510",
        "type": 1,
        "category": null,
        "capacity": 3,
        "datetime_added": "2023-08-22 17:44:03",
        "created_at": "2023-08-22 17:44:03",
        "updated_at": "2023-08-22 17:44:03"
    },
    {
        "id": 384,
        "name": "PM2 V8W ZCAGR",
        "code": "PRT0920672517",
        "type": 5,
        "category": null,
        "capacity": 8,
        "datetime_added": "2023-08-22 17:44:03",
        "created_at": "2023-08-22 17:44:03",
        "updated_at": "2023-08-22 17:44:03"
    },
    {
        "id": 418,
        "name": "VFSNL4 FL2 7C",
        "code": "PRT1915550179",
        "type": 3,
        "category": null,
        "capacity": 19,
        "datetime_added": "2023-08-22 17:44:03",
        "created_at": "2023-08-22 17:44:03",
        "updated_at": "2023-08-22 17:44:03"
    },
    {
        "id": 478,
        "name": "RC0 868Q6 GZI",
        "code": "PRT4902978961",
        "type": 2,
        "category": 68,
        "capacity": 15,
        "datetime_added": "2023-08-22 17:44:03",
        "created_at": "2023-08-22 17:44:03",
        "updated_at": "2023-08-22 17:44:03"
    },
    {
        "id": 552,
        "name": "9Q8 YEESZ DKF",
        "code": "PRT3932126979",
        "type": 1,
        "category": 4,
        "capacity": 15,
        "datetime_added": "2023-08-22 17:44:03",
        "created_at": "2023-08-22 17:44:03",
        "updated_at": "2023-08-22 17:44:03"
    },
    {
        "id": 702,
        "name": "45EE9R TES VK",
        "code": "PRT2563775044",
        "type": 5,
        "category": 79,
        "capacity": 35,
        "datetime_added": "2023-08-22 17:44:03",
        "created_at": "2023-08-22 17:44:03",
        "updated_at": "2023-08-22 17:44:03"
    }
]);
let replace = ref([
    {
        "id": 1001,
        "name": "GSX 8ZJC5 37V",
        "code": "PRT0451171313",
        "type": 1,
        "category": null,
        "capacity": 33,
        "datetime_added": "2023-08-22 17:44:03",
        "created_at": "2023-08-22 17:44:03",
        "updated_at": "2023-08-22 17:44:03"
    },
    {
        "id": 1002,
        "name": "CP1 HN3 DX4K2",
        "code": "PRT9284750057",
        "type": 1,
        "category": 114,
        "capacity": 23,
        "datetime_added": "2023-08-22 17:44:03",
        "created_at": "2023-08-22 17:44:03",
        "updated_at": "2023-08-22 17:44:03"
    },
]);
let pagination = ref({
    "total": 48,
    "count": 10,
    "per_page": 10,
    "current_page": 1,
    "total_pages": 5,
    "links": {
        "next": "/?page=2"
    }
});
dateTimePicker([
    {
        id: 'datetimesample-45',
        type: 'datetime',
        selectedCallback: (payload) => {
            datetimeFrom.value = payload.value;
        }
    },
    {
        id: 'datetimesample-273',
        type: 'datetime',
        selectedCallback: (payload) => {
            datetimeFrom.value = payload.value;
        }
    },
    {
        id: 'datetimesample-702',
        type: 'datetime',
        selectedCallback: (payload) => {
            datetimeFrom.value = payload.value;
        }
    }
]);
</script>

<style scoped>
    #lab{
        height: calc(100vh - calc(41px) - calc(1rem));
    }

    .moody-card{
        border: 1px solid silver;
        position: relative;
        margin: 24px;
    }

    .moody-card-frame{
        box-sizing: border-box;
        display: block;
        content: none;
    }

    .moody-card-frame:before{
        position: absolute;
        content: "";
        top: -8px;
        left: -9px;
        right: 7px;
        bottom: 7px;
        border: 1px solid silver;
        display: block;
    }

    .moody-card-frame:after{
        position: absolute;
        content: "";
        top: 7px;
        left: 7px;
        right: -9px;
        bottom: -8px;
        border: 1px solid silver;
        display: block;
    }
</style>