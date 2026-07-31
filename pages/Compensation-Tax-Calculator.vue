<template>
    <div>
        <LandingWrapper>
            <div class="mx-auto pt-4 max-w-screen-2xl space-y-12">

                <section class="mt-16 text-center">
                    <h1 class="text-2xl font-semibold font-header">
                        Compensation Tax Calculator
                    </h1>

                    <h2 class="text-xl font-header subtitle-color">Built-in 2026 TRAIN Law brackets and government contribution rules.</h2>
                    <h2 class="text-xl font-header subtitle-color">Estimate your monthly net salary and government deductions instantly.</h2>

                </section>

                <div class="flex flex-row items-center justify-center lg:px-10">

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
                                        class="h-full w-full bg-cover bg-center bg-no-repeat grayscale opacity-20"
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

                                    <div class="text-base font-medium">Compensation tax (WTC) calculator</div>

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
                                                    :variant="'flat'"
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

                <div class="neutral-border-bottom"></div>
            </div>
        </LandingWrapper>
    </div>
</template>

<script setup lang="ts">
import {storeToRefs} from "pinia";
import type {TableHeaderT} from "@/public/js/types/data";
const {$themeStore} = useNuxtApp();
const config = useRuntimeConfig()
const route = useRoute()

useHead({titleTemplate: (titleChunk) => {return `${titleChunk} - Compensation Tax Calculator`}});
useSeoMeta({
    description: `Estimate gross-to-net pay, employee benefits packages, and company tax liabilities instantly. Ensure automated payroll compliance. Try our free calculator.`,
    canonical: `${config.public.siteUrl}${route.path}`,

    ogTitle: `Free Corporate Compensation & Tax Calculator | ${config.public.siteName}`,
    ogDescription: `Estimate gross-to-net pay, employee benefits packages, and company tax liabilities instantly. Ensure automated payroll compliance.`,
    ogType: 'website',
    ogUrl: `${config.public.siteUrl}${route.path}`,

    twitterTitle: `Corporate Compensation & Tax Calculator`,
    twitterDescription: `Estimate gross-to-net pay, employee benefits packages, and company tax liabilities instantly.`,

    robots: 'index, follow'
})
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
