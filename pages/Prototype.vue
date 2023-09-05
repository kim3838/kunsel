<template>
    <div>
        <NuxtLayout name="custom">
            <template #content>
                <div class="tw-m-2 tw-p-2 tw-border tw-border-light">

                    <div>Tailwind Url: <NuxtLink class="tw-text-sky-600" :to="'_tailwind'" target="_blank">{{('http://localhost:3000' + '/_tailwind/')}}</NuxtLink></div>

                    <div class="tw-space-y-2">
                        <div class="tw-grid tw-gap-2 tw-grid-cols-1 sm:tw-grid-cols-2 lg:tw-grid-cols-5 xl:tw-grid-cols-6 2xl:tw-grid-cols-8">
                            <div class="tw-block tw-border tw-border-neutral-200">
                                <InputLabel :size="'md'" value="Static Multi Select" />
                                <MultiSelect :size="'md'" :options="category" :icon="'ic:sharp-hdr-on-select'"/>
                            </div>
                            <div class="tw-block tw-border tw-border-neutral-200">
                                <InputLabel :size="'md'" value="Static Single Select" />
                                <SingleSelect :size="'md'" :icon="'ic:sharp-rsvp'" :options="plan"/>
                            </div>

                            <div class="tw-block tw-border tw-border-neutral-200">
                                <InputLabel :size="'md'" for="date" value="Date" />
                                <Input
                                    :size="'md'"
                                    class="tw-w-full"
                                    type="text"
                                    id="date"
                                    v-model="formStore.filters.date"
                                    autocomplete="off"
                                    readonly
                                    :disabled="false" />
                            </div>
                            <div class="tw-block tw-border tw-border-neutral-200">
                                <InputLabel for="datetime" value="DateTime" />
                                <Input
                                    :size="'md'"
                                    class="tw-w-full"
                                    type="text"
                                    id="datetime"
                                    v-model="formStore.filters.dateTime"
                                    autocomplete="off"
                                    readonly
                                    :disabled="false" />
                            </div>

                            <div class="tw-block tw-border tw-border-neutral-200">
                                <InputLabel for="month" value="Month" />
                                <Input
                                    :size="'md'"
                                    class="tw-w-full"
                                    type="text"
                                    id="month"
                                    v-model="formStore.filters.monthLabel"
                                    autocomplete="off"
                                    readonly
                                    :disabled="false" />
                            </div>
                        </div>

                        <div class="tw-grid tw-gap-2 tw-grid-cols-1 lg:tw-grid-cols-2 xl:tw-grid-cols-3">
                            <div class="tw-block tw-p-2 tw-border tw-border-neutral-200">
                                <InputLabel class="tw-mb-2" :size="'md'" value="SM Datatable" />
                                <DataTable
                                    :headers="headers_1"
                                    :size="'sm'"
                                    :rows="data_1">
                                    <template v-slot:cell.name="{index, cell}">
                                        <span>{{`[${index}] ${cell.name}`}}</span>
                                    </template>
                                </DataTable>
                            </div>
                            <div class="tw-block tw-p-2 tw-border tw-border-neutral-200">
                                <InputLabel class="tw-mb-2" :size="'md'" value="MD Datatable with Selection" />
                                <DataTable
                                    :headers="headers_2"
                                    :size="'md'"
                                    :rows="data_1"
                                    v-model="selected_1"
                                    selection>
                                    <template v-slot:cell.name="{index, cell}">
                                        <span>{{`[${index}] ${cell.name}`}}</span>
                                    </template>
                                    <template v-slot:cell.code="{index, cell}">
                                        <span class="tw-font-mono">{{cell.code}}</span>
                                    </template>
                                </DataTable>
                            </div>
                            <div class="tw-block tw-p-2 tw-border tw-border-neutral-200">
                                <InputLabel class="tw-mb-2" :size="'md'" value="XL Datatable with Selection and Form Foundations" />
                                <DataTable
                                    :headers="headers_3"
                                    :size="'xl'"
                                    :rows="data_1"
                                    v-model="selected_2"
                                    selection>
                                    <template v-slot:cell.tools="{cell, slot}">
                                        <div class="tw-h-full tw-w-full tw-flex tw-items-center">
                                            <Button :size="slot.buttonSize" :icon="'ic:sharp-all-inbox'" :label="'Slot Button'"></Button>
                                        </div>
                                    </template>
                                    <template v-slot:cell.input="{cell, slot}">
                                        <Input :size="slot.inputSize" class="tw-w-full" placeholder="Enter Amount" type="text" autocomplete="off" />
                                    </template>
                                    <template v-slot:cell.name="{index, cell}">
                                        <span>{{`[${index}] ${cell.name}`}}</span>
                                    </template>
                                    <template v-slot:cell.code="{index, cell}">
                                        <span class="tw-font-mono">{{cell.code}}</span>
                                    </template>
                                </DataTable>
                            </div>
                        </div>

                        <div class="tw-grid tw-gap-2 tw-grid-cols-1 sm:tw-grid-cols-2 lg:tw-grid-cols-5 xl:tw-grid-cols-6 2xl:tw-grid-cols-8">
                            <div class="tw-flex tw-items-start tw-justify-start tw-block tw-border tw-border-neutral-200">
                                <Button :size="'2xs'" :icon="'ic:sharp-send-to-mobile'" :label="'XXS Button'"></Button>
                            </div>
                            <div class="tw-flex tw-items-start tw-justify-start tw-block tw-border tw-border-neutral-200">
                                <Button :size="'xs'" :icon="'ic:sharp-send-to-mobile'" :label="'XS Button'"></Button>
                            </div>
                            <div class="tw-flex tw-items-start tw-justify-start tw-block tw-border tw-border-neutral-200">
                                <Button :size="'sm'" :icon="'ic:sharp-send-to-mobile'" :label="'SM Authenticate'"></Button>
                            </div>
                            <div class="tw-flex tw-items-start tw-justify-start tw-block tw-border tw-border-neutral-200">
                                <Button :size="'md'" :icon="'ic:sharp-send-to-mobile'" :label="'MD Authenticate'"></Button>
                            </div>
                            <div class="tw-flex tw-items-start tw-justify-start tw-block tw-border tw-border-neutral-200">
                                <Button :disabled="true" :label="'DEFAULT Disabled'"></Button>
                            </div>
                            <div class="tw-flex tw-items-start tw-justify-start tw-block tw-w-full tw-border tw-border-neutral-200">
                                <Button :size="'lg'" :icon="'ic:sharp-send-to-mobile'" :label="'LG SKIP'"></Button>
                            </div>
                            <div class="tw-col-span-2 tw-flex tw-items-start tw-justify-start tw-block tw-w-full tw-border tw-border-neutral-200">
                                <Button :size="'xl'" :icon="'ic:sharp-send-to-mobile'" :label="'XL Authenticate'"></Button>
                            </div>
                        </div>

                        <div class="tw-grid tw-gap-2 tw-grid-cols-1 sm:tw-grid-cols-2 lg:tw-grid-cols-5 xl:tw-grid-cols-6 2xl:tw-grid-cols-8">
                            <div class="tw-flex tw-items-start tw-justify-start tw-block tw-border tw-border-neutral-200">
                                <Button :variant="'outline'" :size="'2xs'" :icon="'ic:sharp-dashboard'" :label="'XXS Button'"></Button>
                            </div>
                            <div class="tw-flex tw-items-start tw-justify-start tw-block tw-border tw-border-neutral-200">
                                <Button :variant="'outline'" :size="'xs'" :icon="'ic:sharp-dashboard'" :label="'XS Button'"></Button>
                            </div>
                            <div class="tw-flex tw-items-start tw-justify-start tw-block tw-border tw-border-neutral-200">
                                <Button :variant="'outline'" :size="'sm'" :icon="'ic:sharp-dashboard'" :label="'SM Authenticate'"></Button>
                            </div>
                            <div class="tw-flex tw-items-start tw-justify-start tw-block tw-border tw-border-neutral-200">
                                <Button :variant="'outline'" :size="'md'" :icon="'ic:sharp-dashboard'" :label="'MD Authenticate'"></Button>
                            </div>
                            <div class="tw-flex tw-items-start tw-justify-start tw-block tw-border tw-border-neutral-200">
                                <Button :variant="'outline'" :disabled="true" :label="'DEFAULT Disabled'"></Button>
                            </div>
                            <div class="tw-flex tw-items-start tw-justify-start tw-block tw-w-full tw-border tw-border-neutral-200">
                                <Button :variant="'outline'" :size="'lg'" :icon="'ic:sharp-dashboard'" :label="'LG SKIP'"></Button>
                            </div>
                            <div class="tw-col-span-2 tw-flex tw-items-start tw-justify-start tw-block tw-w-full tw-border tw-border-neutral-200">
                                <Button :variant="'outline'" :size="'xl'" :icon="'ic:sharp-dashboard'" :label="'XL Authenticate'"></Button>
                            </div>
                        </div>

                        <div class="tw-grid tw-gap-2 tw-grid-cols-1 sm:tw-grid-cols-2 lg:tw-grid-cols-5 xl:tw-grid-cols-6 2xl:tw-grid-cols-8">
                            <div class="tw-border tw-border-neutral-200">
                                <label>
                                    <Checkbox v-model="remember1" :label="' '" :size="'md'" name="remember" />
                                </label>
                            </div>
                            <div class="tw-border tw-border-neutral-200">
                                <label>
                                    <Checkbox v-model="remember2" :size="'sm'" :label="'SM Checkbox'" name="remember" />
                                </label>
                            </div>
                            <div class="tw-border tw-border-neutral-200">
                                <label>
                                    <Checkbox v-model="remember3" :size="'md'" :label="'MD Checkbox'" name="remember" />
                                </label>
                            </div>
                            <div class="tw-border tw-border-neutral-200">
                                <label>
                                    <Checkbox v-model="remember4" :size="'lg'" :label="'LG Checkbox'" name="remember" />
                                </label>
                            </div>
                        </div>

                        <div class="tw-grid tw-gap-2 tw-grid-cols-1 sm:tw-grid-cols-2 lg:tw-grid-cols-5 xl:tw-grid-cols-6 2xl:tw-grid-cols-8">
                            <div class="tw-flex tw-items-start tw-justify-start tw-block tw-border tw-border-neutral-200">
                                <div>
                                    <InputLabel :size="'md'" value="SM : Gender Group" />
                                    <RadioGroup
                                        :selections="genderGroup.selection"
                                        :size="'sm'"
                                        class="tw-border tw-border-neutral-200"
                                        v-model="genderGroup.selected" />
                                    <div>Selected Option: {{ genderGroup.selected }}</div>
                                </div>
                            </div>
                            <div class="tw-flex tw-items-start tw-justify-start tw-block tw-border tw-border-neutral-200">
                                <div>
                                    <InputLabel :size="'md'" value="SM : Status Group" />
                                    <RadioGroup
                                        :selections="statusGroup.selection"
                                        :size="'sm'"
                                        class="tw-border tw-border-neutral-200"
                                        v-model="statusGroup.selected" />
                                    <div>Selected Option: {{ statusGroup.selected }}</div>
                                </div>
                            </div>
                            <div class="tw-flex tw-items-start tw-justify-start tw-block tw-border tw-border-neutral-200">
                                <div>
                                    <InputLabel :size="'md'" value="MD : Transaction Group" />
                                    <RadioGroup
                                        :selections="transactionGroup.selection"
                                        :size="'md'"
                                        class="tw-border tw-border-neutral-200"
                                        v-model="transactionGroup.selected" />
                                    <div>Selected Option: {{ transactionGroup.selected }}</div>
                                </div>
                            </div>
                            <div class="tw-flex tw-items-start tw-justify-start tw-block tw-border tw-border-neutral-200">
                                <div>
                                    <InputLabel :size="'md'" value="LG : Category Group" />
                                    <RadioGroup
                                        :selections="categoryGroup.selection"
                                        :size="'lg'"
                                        class="tw-border tw-border-neutral-200"
                                        v-model="categoryGroup.selected" />
                                    <div>Selected Option: {{ categoryGroup.selected }}</div>
                                </div>
                            </div>
                        </div>

                        <div class="tw-grid tw-gap-2 tw-grid-cols-1 sm:tw-grid-cols-2 lg:tw-grid-cols-5 xl:tw-grid-cols-6 2xl:tw-grid-cols-8">
                            <div class="tw-block tw-border tw-border-neutral-200">
                                <InputLabel :size="'2xs'" for="form_input_1" value="XXS Label" />
                                <Input :size="'2xs'" class="tw-w-full" placeholder="Enter username" id="form_input_1" type="text" autocomplete="off" />
                            </div>
                            <div class="tw-block tw-border tw-border-neutral-200">
                                <InputLabel :size="'xs'" for="form_input_2" value="XS Label" />
                                <Input :size="'xs'" class="tw-w-full" placeholder="Enter username" id="form_input_2" type="text" autocomplete="off" />
                            </div>
                            <div class="tw-block tw-border tw-border-neutral-200">
                                <InputLabel :size="'sm'" for="form_input_3" value="SM Label" />
                                <Input :size="'sm'" class="tw-w-full" placeholder="Enter username" id="form_input_3" type="text" autocomplete="off" />
                            </div>
                            <div class="tw-block tw-border tw-border-neutral-200">
                                <InputLabel :size="'md'" for="form_input_4" value="MD Label" />
                                <Input :size="'md'" class="tw-w-full" placeholder="Enter username" id="form_input_4" type="text" autocomplete="off" />
                            </div>
                            <div class="tw-block tw-border tw-border-neutral-200">
                                <InputLabel :size="'lg'" for="form_input_5" value="LG Label" />
                                <Input :size="'lg'" class="tw-w-full" placeholder="Enter username" id="form_input_5" type="text" autocomplete="off" />
                            </div>
                            <div class="tw-col-span-2 tw-block tw-border tw-border-neutral-200">
                                <InputLabel :size="'xl'" for="form_input_6" value="XL Label" />
                                <Input :size="'xl'" class="tw-w-full" placeholder="Enter username" id="form_input_6" type="text" autocomplete="off" />
                            </div>
                        </div>

                        <div v-if="false" class="tw-grid tw-gap-2 tw-grid-cols-1 sm:tw-grid-cols-2 lg:tw-grid-cols-5 xl:tw-grid-cols-6 2xl:tw-grid-cols-8">
                            <div class="tw-block tw-border tw-border-neutral-200 tw-col-span-2">
                                <p class="tw-text-sm tw-leading-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus nec facilisis lacus. Phasellus convallis commodo lorem. Nam vitae dignissim elit.</p>
                            </div>
                            <div class="tw-block tw-border tw-border-neutral-200 tw-col-span-2">
                                <p class="tw-text-base tw-leading-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus nec facilisis lacus. Phasellus convallis commodo lorem. Nam vitae dignissim elit.</p>
                            </div>
                            <div class="tw-block tw-border tw-border-neutral-200 tw-col-span-2">
                                <p class="tw-text-lg tw-leading-5">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus nec facilisis lacus. Phasellus convallis commodo lorem. Nam vitae dignissim elit.</p>
                            </div>
                            <div class="tw-block tw-border tw-border-neutral-200 tw-col-span-2">
                                <p class="tw-text-xl tw-leading-6">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus nec facilisis lacus. Phasellus convallis commodo lorem. Nam vitae dignissim elit.</p>
                            </div>
                        </div>

                        <div v-if="false" class="tw-grid tw-gap-2 tw-grid-cols-1 sm:tw-grid-cols-2 lg:tw-grid-cols-5 xl:tw-grid-cols-6 2xl:tw-grid-cols-8">
                            <div class="tw-block tw-border tw-border-neutral-200 tw-col-span-2">
                                <p class="tw-text-sm tw-font-thin tw-leading-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus nec facilisis lacus. Phasellus convallis commodo lorem. Nam vitae dignissim elit.</p>
                                <p class="tw-text-sm tw-font-extralight tw-leading-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus nec facilisis lacus. Phasellus convallis commodo lorem. Nam vitae dignissim elit.</p>
                                <p class="tw-text-sm tw-font-light tw-leading-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus nec facilisis lacus. Phasellus convallis commodo lorem. Nam vitae dignissim elit.</p>
                                <p class="tw-text-sm tw-font-normal tw-leading-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus nec facilisis lacus. Phasellus convallis commodo lorem. Nam vitae dignissim elit.</p>
                                <p class="tw-text-sm tw-font-medium tw-leading-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus nec facilisis lacus. Phasellus convallis commodo lorem. Nam vitae dignissim elit.</p>
                                <p class="tw-text-sm tw-font-semibold tw-leading-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus nec facilisis lacus. Phasellus convallis commodo lorem. Nam vitae dignissim elit.</p>
                                <p class="tw-text-sm tw-font-bold tw-leading-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus nec facilisis lacus. Phasellus convallis commodo lorem. Nam vitae dignissim elit.</p>
                                <p class="tw-text-sm tw-font-extrabold tw-leading-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus nec facilisis lacus. Phasellus convallis commodo lorem. Nam vitae dignissim elit.</p>
                                <p class="tw-text-sm tw-font-black tw-leading-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus nec facilisis lacus. Phasellus convallis commodo lorem. Nam vitae dignissim elit.</p>
                            </div>
                            <div class="tw-block tw-border tw-border-neutral-200 tw-col-span-2">
                                <p class="tw-text-base tw-font-thin tw-leading-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus nec facilisis lacus. Phasellus convallis commodo lorem. Nam vitae dignissim elit.</p>
                                <p class="tw-text-base tw-font-extralight tw-leading-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus nec facilisis lacus. Phasellus convallis commodo lorem. Nam vitae dignissim elit.</p>
                                <p class="tw-text-base tw-font-light tw-leading-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus nec facilisis lacus. Phasellus convallis commodo lorem. Nam vitae dignissim elit.</p>
                                <p class="tw-text-base tw-font-normal tw-leading-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus nec facilisis lacus. Phasellus convallis commodo lorem. Nam vitae dignissim elit.</p>
                                <p class="tw-text-base tw-font-medium tw-leading-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus nec facilisis lacus. Phasellus convallis commodo lorem. Nam vitae dignissim elit.</p>
                                <p class="tw-text-base tw-font-semibold tw-leading-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus nec facilisis lacus. Phasellus convallis commodo lorem. Nam vitae dignissim elit.</p>
                                <p class="tw-text-base tw-font-bold tw-leading-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus nec facilisis lacus. Phasellus convallis commodo lorem. Nam vitae dignissim elit.</p>
                                <p class="tw-text-base tw-font-extrabold tw-leading-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus nec facilisis lacus. Phasellus convallis commodo lorem. Nam vitae dignissim elit.</p>
                                <p class="tw-text-base tw-font-black tw-leading-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus nec facilisis lacus. Phasellus convallis commodo lorem. Nam vitae dignissim elit.</p>
                            </div>
                            <div class="tw-block tw-border tw-border-neutral-200 tw-col-span-2">
                                <p class="tw-text-lg tw-font-thin tw-leading-5">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus nec facilisis lacus. Phasellus convallis commodo lorem. Nam vitae dignissim elit.</p>
                                <p class="tw-text-lg tw-font-extralight tw-leading-5">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus nec facilisis lacus. Phasellus convallis commodo lorem. Nam vitae dignissim elit.</p>
                                <p class="tw-text-lg tw-font-light tw-leading-5">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus nec facilisis lacus. Phasellus convallis commodo lorem. Nam vitae dignissim elit.</p>
                                <p class="tw-text-lg tw-font-normal tw-leading-5">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus nec facilisis lacus. Phasellus convallis commodo lorem. Nam vitae dignissim elit.</p>
                                <p class="tw-text-lg tw-font-medium tw-leading-5">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus nec facilisis lacus. Phasellus convallis commodo lorem. Nam vitae dignissim elit.</p>
                                <p class="tw-text-lg tw-font-semibold tw-leading-5">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus nec facilisis lacus. Phasellus convallis commodo lorem. Nam vitae dignissim elit.</p>
                                <p class="tw-text-lg tw-font-bold tw-leading-5">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus nec facilisis lacus. Phasellus convallis commodo lorem. Nam vitae dignissim elit.</p>
                                <p class="tw-text-lg tw-font-extrabold tw-leading-5">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus nec facilisis lacus. Phasellus convallis commodo lorem. Nam vitae dignissim elit.</p>
                                <p class="tw-text-lg tw-font-black tw-leading-5">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus nec facilisis lacus. Phasellus convallis commodo lorem. Nam vitae dignissim elit.</p>
                            </div>
                            <div class="tw-block tw-border tw-border-neutral-200 tw-col-span-2">
                                <p class="tw-text-xl tw-font-extralight tw-leading-6">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus nec facilisis lacus. Phasellus convallis commodo lorem. Nam vitae dignissim elit.</p>
                                <p class="tw-text-xl tw-font-light tw-leading-6">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus nec facilisis lacus. Phasellus convallis commodo lorem. Nam vitae dignissim elit.</p>
                                <p class="tw-text-xl tw-font-normal tw-leading-6">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus nec facilisis lacus. Phasellus convallis commodo lorem. Nam vitae dignissim elit.</p>
                                <p class="tw-text-xl tw-font-medium tw-leading-6">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus nec facilisis lacus. Phasellus convallis commodo lorem. Nam vitae dignissim elit.</p>
                                <p class="tw-text-xl tw-font-semibold tw-leading-6">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus nec facilisis lacus. Phasellus convallis commodo lorem. Nam vitae dignissim elit.</p>
                                <p class="tw-text-xl tw-font-bold tw-leading-6">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus nec facilisis lacus. Phasellus convallis commodo lorem. Nam vitae dignissim elit.</p>
                                <p class="tw-text-xl tw-font-extrabold tw-leading-6">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus nec facilisis lacus. Phasellus convallis commodo lorem. Nam vitae dignissim elit.</p>
                                <p class="tw-text-xl tw-font-black tw-leading-6">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus nec facilisis lacus. Phasellus convallis commodo lorem. Nam vitae dignissim elit.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </NuxtLayout>
    </div>
</template>

<script setup lang="ts">

import { ref } from 'vue';

definePageMeta({
    layout: false,
});

const { $formStore} = useNuxtApp();
let formStore = $formStore;
let remember1 = ref(null);
let remember2 = ref(null);
let remember3 = ref(null);
let remember4 = ref(null);
let statusGroup = ref({
    selection: [
        {text : 'For Approval', value: 0},
        {text : 'Approved', value: 1},
        {text : 'Processing', value: 2},
        {text : 'Rejected', value: 3},
        {text : 'Complete', value: 4},
    ],
    selected: 3
});
let transactionGroup = ref({
    selection: [
        {text : 'Cash', value: 0},
        {text : 'Pre Paid', value: 1},
        {text : 'Post Paid', value: 2},
        {text : 'Card', value: 3},
        {text : 'Debit', value: 4},
    ],
    selected: 3
});
let genderGroup = ref({
    selection: [
        {text : 'Male', value: 0},
        {text : 'Female', value: 1},
    ],
    selected: 1
});
let categoryGroup = ref({
    selection: [
        {text : 'Charms', value: 0},
        {text : 'Bracelets', value: 1},
        {text : 'Brooches and Pins', value: 2},
        {text : 'Necklaces', value: 3},
        {text : 'Earrings', value: 4},
        {text : 'Rings', value: 5},
        {text : 'Polyester', value: 6},
    ],
    selected: 3
});
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
        {text : 'Standard Corporate', value: 2},
        {text : 'Custom Corporate', value: 3},
        {text : 'Evaluator', value: 4}
    ],
    selection: [
        {text : 'Free', value: 0},
        {text : 'Individual', value: 1},
        {text : 'Standard Corporate', value: 2},
        {text : 'Custom Corporate', value: 3},
        {text : 'Evaluator', value: 4}
    ],
    selected: null
});

let selected_1 = ref([1001,1002]);
let selected_2 = ref([1001,1002]);
let headers_1 = reactive([
    { text: 'ID', value: 'id'},
    { text: 'NAME', value: 'name'},
    { text: 'CATEGORY', alignData: 'right', value: 'category'},
    { text: 'DATE ADDED', alignData: 'right', value: 'datetime_added'},
    { text: 'DATE CREATED', alignData: 'right', value: 'created_at'},
    { text: 'DATE UPDATED', alignData: 'right', value: 'updated_at'},
]);
let headers_2 = reactive([
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
let headers_3 = reactive([
    { text: 'TOOLS', value: 'tools'},
    { text: 'INPUT', value: 'input', width: '120px'},
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
let data_1 = ref([
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

dateTimePicker([
    {
        id: 'datetime',
        type: 'datetime',
        selectedCallback: (payload) => {
            formStore.setFormFilterValue({
                key: 'dateTime',
                value: payload.value
            });
        }
    }, {
        id: 'date',
        type: 'date',
        selectedCallback: (payload) => {
            formStore.setFormFilterValue({
                key: 'date',
                value: payload.value
            });
        }
    }, {
        id: 'month',
        type: 'month',
        selectedCallback: (payload) => {
            formStore.setFormFilterValue({
                key: 'monthValue',
                value: payload.value
            });

            formStore.setFormFilterValue({
                key: 'monthLabel',
                value: payload.label
            });
        }
    }
]);
</script>