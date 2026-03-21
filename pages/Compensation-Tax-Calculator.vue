<template>
    <div>
        <LandingWrapper>
            <div class="mx-auto pt-4 max-w-screen-2xl">
                <div class="min-h-120 flex flex-row items-center justify-center lg:px-10 gap-20">

                    <div class="w-[620px] h-[360px] mx-auto lg:mx-0">
                        <HexagonFrame
                            :content-background="tintColor"
                            :frame-border-primary-color="threadColor"
                            :direction="'ltr'"
                            :theme="'light'"
                            :head-percentage="20"
                            :top-right="65"
                            :bottom-left="45"
                            :opaque="true"
                            :header-fade="true"
                            :header-fade-color="'rgba(1,1,1,0.1)'">
                            <template #header>
                                <div class="h-full w-[20%]">
                                    <div
                                        class="h-full w-full bg-cover bg-center bg-no-repeat grayscale opacity-50"
                                        :style="{'background':'url(/images/deco/fluid-gold-top.webp)'}"
                                    />
                                </div>
                                <div class="h-full w-[80%]">
                                    <div
                                        class="h-full w-full bg-cover bg-center bg-no-repeat grayscale opacity-15"
                                        :style="{'background':'url(/images/deco/fluid-gold-top.webp)'}"
                                    />
                                </div>
                            </template>
                            <template v-slot:body="{frameBorderColor}">
                                <div class="w-[80%] h-full relative pt-10 px-2 overflow-hidden flex flex-col">
                                    <div class="text-lg font-medium font-header">Compensation tax (WTC) calculator</div>

                                    <form @submit.prevent="calculateTax" class="mt-4">
                                        <div class="block">
                                            <InputLabel :size="'sm'" value="Monthly salary"/>
                                            <Input v-model="monthlySalary" high-light-all-text-on-focus :size="'md'" :min="0" :type="'number'" type-strict />
                                        </div>

                                        <DataTable
                                            :landscape="true"
                                            :headers="contributionHeaders"
                                            :size="'md'"
                                            :show-no-data="false"
                                            :rows="contributionData">
                                        </DataTable>

                                        <DataTable
                                            :landscape="true"
                                            :headers="taxableHeaders"
                                            :size="'md'"
                                            :show-no-data="false"
                                            :rows="taxableData">
                                        </DataTable>

                                        <div class="flex mt-4 items-center justify-between">
                                            <div class="flex-grow-[0.2]">
                                                <Button
                                                    :justify-content="'center'"
                                                    :disabled="calculateTaxPending"
                                                    :variant="'outline'"
                                                    :size="'md'"
                                                    :label="calculateTaxPending ? 'Please wait...' : 'Calculate Tax'"></Button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </template>
                        </HexagonFrame>
                    </div>

                </div>
            </div>
        </LandingWrapper>
    </div>
</template>

<script setup lang="ts">
import {storeToRefs} from "pinia";
import type {TableHeaderT} from "@/public/js/types/data";
const {$themeStore} = useNuxtApp();

useHead({titleTemplate: (titleChunk) => {return `${titleChunk} - WTC Calculator`}});
definePageMeta({middleware: 'guest'});
useLayout().setNavigationMode('solid');

const {
    hexAlpha,
    lining: liningColor,
    thread: threadColor,
    neutral: neutralColor,
    tint: tintColor,
} = storeToRefs($themeStore);

const monthlySalary = ref(0);

const contributionHeaders = reactive<TableHeaderT[]>([
    { text: 'SSS contribution', value: 'sss'},
    { text: 'Philhealth (PHIC)', value: 'philhealth'},
    { text: 'Pag-IBIG (HDMF)', value: 'pag_ibig'},
]);
const contributionData = ref([]);

const taxableHeaders = reactive<TableHeaderT[]>([
    { text: 'Taxable', value: 'taxable'},
    { text: 'Compensation tax (WTC)', value: 'withholding_tax'},
    { text: 'Net', value: 'net'},
]);
const taxableData = ref([]);


const calculateTaxPending = ref(false);
const calculateTax = async() =>{

    if(import.meta.server){
        return;
    }

    calculateTaxPending.value = true;

    await laraFetch(`/api/monthly-salary-calculate-tax`, {
        method: 'POST',
        body: {
            monthly_salary: monthlySalary.value
        }
    }, {
        onRequestError: () => {
            calculateTaxPending.value = false;
        },
        onResponse: () => {
            calculateTaxPending.value = false;
        },
        onSuccessResponse: async (request, options, response) => {

            let result = _get(response, '_data.values.result', {});

            //@ts-ignore
            contributionData.value = [result.contributions];
            //@ts-ignore
            taxableData.value = [result.taxable];
        }
    }, true);
}
</script>

<style scoped>

</style>
