<template>
    <div>
        <LandingWrapper>
            <div>
                <div class="mx-auto pt-4 max-w-screen-2xl ">
                    <div  v-if="false" class="mt-4 space-y-2 text-sm font-mono">
                        <pre>OFETCH PENDING: {{ofetchPending}}</pre>
                        <pre class="bg-opacity-50 bg-slate-200">OFETCH RESPONSE: <span v-text="ofetchData" /></pre>
                        <pre class="bg-opacity-50 bg-slate-200">OFETCH RESPONSE: <span v-html="ofetchData" /></pre>
                        <Input :size="'lg'" class="font-stiff" v-model="singleLineStringValue" type="text" autocomplete="off"/>
                        <TextArea :cols="140" :size="'lg'" class="font-stiff" v-model="multiLineStringValue"/>
                        <Button class="inline-block" @click="oFetchGet" :label="'OFetch Get'" />
                    </div>

                    <div v-if="false">
                        timezoneSelectionsState {{timezoneSelections}}<br>
                        common.timezoneSelections {{common.timezoneSelections}}<br>
                    </div>
                    <div class="p-4 space-y-4">
                        <div>
                            <span class="space-x-1">
                                <Label :size="'sm'" :type="'default'" :label="'No Daily Totals'" />
                                <Label :size="'sm'" :type="'success'" :label="'Tallied'" />
                                <Label :size="'sm'" :type="'danger'" :label="'Not Tallied'" />
                                <Label :size="'sm'" :type="'caution'" :label="'Caution'" />
                                <Label :size="'sm'" :type="'warning'" :label="'Warning'" />
                                <Label :size="'sm'" :type="'info'" :label="'Information'" />
                            </span>
                        </div>

                        <div>
                            <span class="space-x-1">
                                <Label :size="'md'" :type="'default'" :label="'No Daily Totals'" />
                                <Label :size="'md'" :type="'success'" :label="'Tallied'" />
                                <Label :size="'md'" :type="'danger'" :label="'Not Tallied'" />
                                <Label :size="'md'" :type="'caution'" :label="'Caution'" />
                                <Label :size="'md'" :type="'warning'" :label="'Warning'" />
                                <Label :size="'md'" :type="'info'" :label="'Information'" />
                            </span>
                        </div>

                        <div>
                            <span class="space-x-1">
                                <Label :size="'lg'" :type="'default'" :label="'No Daily Totals'" />
                                <Label :size="'lg'" :type="'success'" :label="'Tallied'" />
                                <Label :size="'lg'" :type="'danger'" :label="'Not Tallied'" />
                                <Label :size="'lg'" :type="'caution'" :label="'Caution'" />
                                <Label :size="'lg'" :type="'warning'" :label="'Warning'" />
                                <Label :size="'lg'" :type="'info'" :label="'Information'" />
                            </span>
                        </div>

                        <DataTable
                            class="mt-4"
                            :headers="dataTable1Headers"
                            :size="'lg'"
                            :rows="dataTable1Data"
                            :stripped="false"
                            selection>
                            <template v-slot:cell.category="{cell, slot, scrollReference}">
                                <MultiSelect
                                    in-horizontal-scrollable
                                    drop-shadow
                                    :scroll-reference="scrollReference"
                                    :size="slot.selectSize"
                                    :options="category"
                                    :icon="'ic:sharp-check-box-outline-blank'"/>
                            </template>
                            <template v-slot:cell.label="{cell, slot, scrollReference}">
                                <div class="flex px-[0.3rem] items-center">
                                    <Label :type="cell.label_type" shade :size="slot.labelSize" :label="cell.name" />
                                </div>
                            </template>
                        </DataTable>
                    </div>
                </div>
            </div>
        </LandingWrapper>
    </div>
</template>

<script setup lang="ts">
//@ts-nocheck
import type {CommonColorsT} from "@/stores/theme";
import type {TableHeaderT} from "@/public/js/types/data";
import dataPayload from "@/public/data/payload";
import {storeToRefs} from "pinia";

definePageMeta({middleware: 'auth'});
useLayout().setNavigationMode('solid', 'Example.vue');

const singleLineStringValue = ref('');
const multiLineStringValue = ref('');
const ofetchData = ref('');
const ofetchPending = ref(false);
const common = useCommon();
const timezoneSelections = timezoneSelectionsState();
const {$themeStore} = useNuxtApp();

const {
    common: commonColor,
} = storeToRefs($themeStore);
const typedCommonColor = commonColor as Ref<CommonColorsT>;

async function oFetchGet(){
    ofetchData.value = '';
    ofetchPending.value = true;

    await laraFetch("/api/utility/debug", {
        method: 'POST',
        params: {
            'multiLineStringValue': multiLineStringValue.value
        }
    }, {
        onRequest: () => {
            console.log("CALLBACK ON REQUEST");
        },
        onRequestError: () => {
            console.log("CALLBACK ON REQUEST ERROR");
            ofetchPending.value = false;
        },
        onResponse: (request, options, response) => {
            console.log("CALLBACK ON RESPONSE");
            ofetchPending.value = false;
            ofetchData.value = response._data?.values?.return;
        },
        onSuccessResponse: (request, response, options) => {
            console.log("CALLBACK ON SUCCESS RESPONSE");
        },
        onNotAcceptableResponse: (request, response, options) => {
            console.log("CALLBACK ON NOT ACCEPTABLE RESPONSE");
        }
    });
}

let dataTable1Headers = reactive<TableHeaderT[]>(dataPayload['prototype']['dataTables']['1']['headers'] as TableHeaderT[]);
let dataTable1Data = ref(dataPayload['prototype']['dataTables']['1']['data']);
let category = reactive(dataPayload['prototype']['category']);
</script>