<template>
    <div>
        <NuxtLayout name="custom">
            <template #content>
                <div id="lab" class="tw-m-2 tw-p-2 tw-border tw-border-light tw-flex tw-justify-center tw-items-center">
                    <div class="moody-card tw-max-w-[800px] tw-w-[800px]">
                        <div class="moody-card-frame"></div>
                        <div class="tw-relative tw-border tw-border-light tw-border-b-0 tw-p-3 tw-flex tw-justify-center tw-items-center">
                            <span >
                                DataTable
                            </span>
                        </div>
                        <div class="tw-relative tw-border tw-border-light tw-p-7">
                            <DataTable
                                :headers="headers"
                                :rows="data">
                                <template v-slot:cell.name="{index, cell}">
                                    <span>{{`Name: [${index}] ${cell.name}`}}</span>
                                </template>
                                <template v-slot:cell.code="{index, cell}">
                                    <span class="tw-font-mono">{{`Code: [${index}] ${cell.code}`}}</span>
                                </template>
                                <template v-slot:cell.category="{index, cell}">
                                    <span class="tw-font-mono">{{cell.category}}</span>
                                </template>
                            </DataTable>
                        </div>
                    </div>
                </div>
            </template>
        </NuxtLayout>
    </div>
</template>

<script setup lang="ts">

import {ref} from "vue";

definePageMeta({
    layout: false,
    middleware: 'guest'
});

let headers = ref([
    { text: 'ID', value: 'id'},
    { text: 'NAME', value: 'name'},
    { text: 'CODE', alignHeader: 'center', value: 'code'},
    { text: 'TYPE', value: 'type'},
    { text: 'CATEGORY', alignData: 'right', value: 'category'},
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