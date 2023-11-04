<template>
    <div>
        <NuxtLayout :name="$coreStore.layout">
            <template #content>
                <div class="tw-mx-auto tw-pt-4 tw-max-w-screen-2xl">
                    <div>Tailwind Url: <NuxtLink class="tw-text-sky-600" :to="'_tailwind'" target="_blank">{{('http://localhost:3000' + '/_tailwind/')}}</NuxtLink></div>

                    <div class="tw-space-y-2">
                        <div v-if="true" class="tw-grid tw-gap-2 tw-grid-cols-1 sm:tw-grid-cols-2 lg:tw-grid-cols-5 xl:tw-grid-cols-6 2xl:tw-grid-cols-8">
                            <div class="tw-block neutral-border">
                                <InputLabel :size="'md'" value="Static Multi Select" />
                                <MultiSelect drop-shadow :selection-max-viewable-line="5" :size="'md'" :options="category" :icon="'ic:sharp-qr-code'"/>
                            </div>
                            <div class="tw-block neutral-border">
                                <InputLabel :size="'md'" value="Non Searchable Multi Select" />
                                <MultiSelect drop-shadow :selection-max-viewable-line="5" :searchable="false" :size="'md'" :options="category" :icon="'eos-icons:installing'"/>
                            </div>
                            <div class="tw-block neutral-border">
                                <InputLabel :size="'md'" value="Static Single Select" />
                                <SingleSelect drop-shadow :selection-max-viewable-line="4" :always-active="false" :size="'md'" :icon="'emojione-monotone:japanese-no-vacancy-button'" :options="plan"/>
                            </div>

                            <div class="tw-block neutral-border">
                                <InputLabel :size="'md'" value="Non Searchable Single Select" />
                                <SingleSelect drop-shadow :selection-max-viewable-line="4" :searchable="false" :size="'md'" :icon="'emojione-monotone:japanese-vacancy-button'" :options="plan"/>
                            </div>

                            <div class="tw-block neutral-border">
                                <InputLabel :size="'md'" value="Single Select Persist Value" />
                                <SingleSelect
                                    drop-shadow
                                    :selection-max-viewable-line="3"
                                    :size="'md'"
                                    :searchable="false"
                                    :value-persist="true"
                                    :icon="'emojione-monotone:japanese-dolls'"
                                    :label="'Select Booking'"
                                    :options="bookingType"/>
                            </div>

                            <div class="tw-block neutral-border">
                                <InputLabel :size="'md'" for="date" value="Date" />
                                <InputWithIcon
                                    :icon="'simple-icons:googlecalendar'"
                                    :size="'md'"
                                    :type="'text'"
                                    :id="'date'"
                                    v-model="formStore.filters.date"
                                    autocomplete="off"
                                    readonly
                                    :disabled="false" />
                            </div>
                            <div class="tw-block neutral-border">
                                <InputLabel for="datetime" value="DateTime" />
                                <InputWithIcon
                                    :icon="'simple-icons:googlecalendar'"
                                    :size="'md'"
                                    :type="'text'"
                                    :id="'datetime'"
                                    v-model="formStore.filters.dateTime"
                                    autocomplete="off"
                                    readonly
                                    :disabled="false" />
                            </div>

                            <div class="tw-block neutral-border">
                                <InputLabel for="month" value="Month" />
                                <InputWithIcon
                                    :icon="'simple-icons:protoncalendar'"
                                    :size="'md'"
                                    :type="'text'"
                                    :id="'month'"
                                    v-model="formStore.filters.monthLabel"
                                    autocomplete="off"
                                    readonly
                                    :disabled="false" />
                            </div>
                        </div>

                        <div v-if="true" class="tw-grid tw-gap-2 tw-grid-cols-1 sm:tw-grid-cols-2 lg:tw-grid-cols-5 xl:tw-grid-cols-6 2xl:tw-grid-cols-8">
                            <div class="tw-block neutral-border">
                                <InputLabel value="Paginated Multi Select" />
                                <MultiSelectPaginated
                                    :drop-shadow="true"
                                    :selection-max-content="true"
                                    :selected-max-viewable-line="6"
                                    :selection-max-viewable-line="10"
                                    :searchable="true"
                                    :selection-float="true"
                                    :always-active="false"
                                    :label="'Select Prototypes'"
                                    :size="'md'"
                                    :payload="multiSelectPrototypePayload"
                                    :icon="'ic:sharp-qr-code'"/>
                            </div>
                            <div class="tw-block neutral-border">
                                <InputLabel value="Paginated Single Select" />
                                <SingleSelectPaginated
                                    :value-persist="true"
                                    :drop-shadow="true"
                                    :selection-max-content="false"
                                    :selection-max-viewable-line="10"
                                    :searchable="true"
                                    :selection-float="true"
                                    :always-active="false"
                                    :label="'Select Prototype'"
                                    :size="'md'"
                                    :payload="singleSelectPrototypePayload"
                                    :icon="'emojione-monotone:japanese-no-vacancy-button'"/>
                            </div>
                        </div>

                        <div v-if="false" class="tw-grid tw-gap-2 tw-grid-cols-1 sm:tw-grid-cols-2 lg:tw-grid-cols-5 xl:tw-grid-cols-6 2xl:tw-grid-cols-8">
                            <div class="tw-flex tw-block">
                                <MultiSelect
                                    :selection-max-content="false"
                                    :selection-max-viewable-line="9"
                                    :selection-float="false"
                                    :idle-border="'red'"
                                    :active-border="'red'"
                                    :always-active="true"
                                    :searchable="false"
                                    :label="'Select Category'"
                                    :size="'lg'"
                                    :options="category"
                                    :icon="'ic:sharp-display-settings'"/>
                            </div>
                            <div class="tw-flex tw-block">
                                <MultiSelect
                                    :selection-max-content="false"
                                    :selection-max-viewable-line="3"
                                    :selection-float="false"
                                    :idle-border="'orange'"
                                    :active-border="'orange'"
                                    :always-active="true"
                                    :searchable="true"
                                    :label="'Filter Category'"
                                    :size="'lg'"
                                    :options="category"
                                    :icon="'ic:sharp-display-settings'"/>
                            </div>
                            <div class="tw-flex tw-block">
                                <MultiSelect
                                    :selection-max-content="false"
                                    :selection-max-viewable-line="3"
                                    :selection-float="false"
                                    :idle-border="'yellow'"
                                    :active-border="'yellow'"
                                    :always-active="true"
                                    :searchable="false"
                                    :selection-header="false"
                                    :size="'lg'"
                                    :options="category"
                                    :icon="'ic:sharp-display-settings'"/>
                            </div>
                            <div class="tw-flex tw-block">
                                <SingleSelect
                                    :selection-max-content="false"
                                    :selection-max-viewable-line="5"
                                    :selection-float="false"
                                    :idle-border="'green'"
                                    :active-border="'green'"
                                    :always-active="true"
                                    :searchable="false"
                                    :size="'lg'"
                                    :icon="'eos-icons:installing'"
                                    :label="'Select Plan'"
                                    :options="plan"/>
                            </div>
                            <div class="tw-flex tw-block">
                                <SingleSelect
                                    :size="'lg'"
                                    :selection-max-content="false"
                                    :selection-max-viewable-line="5"
                                    :selection-float="false"
                                    :idle-border="'blue'"
                                    :active-border="'blue'"
                                    :always-active="true"
                                    :searchable="false"
                                    :value-persist="true"
                                    :icon="'eos-icons:installing'"
                                    :label="'Select Plan'"
                                    :options="plan"/>
                            </div>
                            <div class="tw-flex tw-block">
                                <SingleSelect
                                    :size="'lg'"
                                    :selection-max-content="false"
                                    :selection-max-viewable-line="3"
                                    :selection-float="false"
                                    :idle-border="'indigo'"
                                    :active-border="'indigo'"
                                    :always-active="true"
                                    :searchable="false"
                                    :value-persist="true"
                                    :icon="'eos-icons:installing'"
                                    :label="'Select Per Page'"
                                    :options="perPage"/>
                            </div>
                        </div>

                        <div v-if="true" class="tw-grid tw-gap-2 sm:tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-4">
                            <div class="tw-block tw-col-span-1 sm:tw-col-span-3 md:tw-col-span-2 lg:tw-col-span-2 tw-p-2 neutral-border">
                                <InputLabel class="tw-mb-2" :size="'md'" value="MD Datatable" />
                                <DataTable
                                    :headers="headers_1"
                                    :size="'md'"
                                    :rows="data_1"
                                    v-model="selected_1"
                                    selection>
                                    <template v-slot:cell.name="{cell, index, slot}">
                                        <Button class="tw-w-full" :variant="'flat'" :size="slot.buttonSize" :label="`[${index}] ${cell.name}`"></Button>
                                    </template>
                                    <template v-slot:cell.category="{cell, slot, scrollReference}">
                                        <MultiSelect
                                            in-horizontal-scrollable
                                            drop-shadow
                                            :scroll-reference="scrollReference"
                                            :size="slot.selectSize"
                                            :options="category"
                                            :icon="'ic:sharp-hdr-on-select'"/>
                                    </template>
                                    <template v-slot:cell.datetime_added="{cell, slot, scrollReference}">
                                        <InputWithIcon
                                            :icon="'ion:calendar-number-sharp'"
                                            :id="`datetime_added-` + cell.id"
                                            v-model="cell.datetime_added"
                                            readonly
                                            in-cell
                                            :size="slot.inputSize"
                                            :type="'text'" />
                                    </template>
                                </DataTable>
                            </div>
                            <div class="tw-block tw-col-span-1 sm:tw-col-span-3 md:tw-col-span-2 lg:tw-col-span-2 tw-p-2 neutral-border">
                                <InputLabel class="tw-mb-2" :size="'md'" value="LG Datatable with Selection" />
                                <DataTable
                                    :headers="headers_2"
                                    :size="'lg'"
                                    :rows="data_2"
                                    v-model="selected_2"
                                    selection>
                                    <template v-slot:cell.name="{index, cell, slot}">
                                        <Input v-model="cell.name" readonly :size="slot.inputSize" type="text" />
                                    </template>
                                    <template v-slot:cell.code="{index, cell, slot}">
                                        <Input v-model="cell.code" readonly :size="slot.inputSize" type="text" />
                                    </template>
                                    <template v-slot:cell.datetime_added="{cell, slot, scrollReference}">
                                        <InputWithIcon
                                            :icon="'ion:calendar-number-sharp'"
                                            :id="`datetime_added-` + cell.id"
                                            v-model="cell.datetime_added"
                                            readonly
                                            in-cell
                                            :size="slot.inputSize"
                                            :type="'text'" />
                                    </template>
                                </DataTable>
                            </div>
                            <div class="tw-block md:tw-col-span-2 lg:tw-col-span-4 tw-p-2 neutral-border">
                                <InputLabel class="tw-mb-2" :size="'md'" value="XL Datatable with Selection and Form Foundations" />
                                <DataTable
                                    :headers="headers_3"
                                    :size="'xl'"
                                    :rows="data_3"
                                    v-model="selected_3"
                                    selection>
                                    <template v-slot:cell.tools="{cell, slot, scrollReference}">
                                        <div class="tw-h-full tw-space-x-0.5 tw-w-full tw-flex tw-items-center">
                                            <Button :size="slot.buttonSize" :icon="'emojione-monotone:envelope-with-arrow'" :label="'Slot I'"></Button>
                                            <Button :variant="'flat'" :size="slot.buttonSize" :icon="'emojione-monotone:envelope'" :label="'Slot II'"></Button>
                                            <Button :variant="'flat'" :size="slot.buttonSize" :icon="'emojione-monotone:incoming-envelope'" :label="'Slot III'"></Button>
                                            <Button :variant="'flat'" :size="slot.buttonSize" :icon="'emojione-monotone:dollar-banknote'"></Button>
                                            <Button :variant="'flat'" :size="slot.buttonSize" :icon="'emojione-monotone:spiral-calendar'"></Button>
                                        </div>
                                    </template>
                                    <template v-slot:cell.input="{cell, index, slot}">
                                        <Input :size="slot.inputSize" class="tw-w-full" placeholder="Enter Amount" type="text" autocomplete="off" />
                                    </template>
                                    <template v-slot:cell.name="{cell, index, slot}">
                                        <Input :size="slot.inputSize" class="tw-w-full" v-model="cell.name" type="text" autocomplete="off" />
                                    </template>
                                    <template v-slot:cell.code="{cell, index, slot}">
                                        <Input :size="slot.inputSize" class="tw-w-full" v-model="cell.code" type="text" autocomplete="off" />
                                    </template>
                                    <template v-slot:cell.single_paginated="{cell, slot, scrollReference}">
                                        <SingleSelectPaginated
                                            in-horizontal-scrollable
                                            :scroll-reference="scrollReference"
                                            :value-persist="true"
                                            :drop-shadow="true"
                                            :selection-max-content="true"
                                            :selection-max-viewable-line="10"
                                            :searchable="true"
                                            :selection-float="true"
                                            :always-active="false"
                                            :label="'Select Prototype'"
                                            :size="slot.selectSize"
                                            :payload="cell.single_select_prototype_payload"
                                            :icon="'emojione-monotone:japanese-no-vacancy-button'"/>
                                    </template>
                                    <template v-slot:cell.multi_paginated="{cell, slot, scrollReference}">
                                        <MultiSelectPaginated
                                            in-horizontal-scrollable
                                            :scroll-reference="scrollReference"
                                            :drop-shadow="true"
                                            :selection-max-content="true"
                                            :selected-max-viewable-line="6"
                                            :selection-max-viewable-line="10"
                                            :searchable="true"
                                            :selection-float="true"
                                            :always-active="false"
                                            :label="'Select Prototypes'"
                                            :size="slot.selectSize"
                                            :payload="cell.multi_select_prototype_payload"
                                            :icon="'ic:sharp-qr-code'"/>
                                    </template>
                                    <template v-slot:cell.single_select="{cell, slot, scrollReference}">
                                        <SingleSelect
                                            in-horizontal-scrollable
                                            drop-shadow
                                            :scroll-reference="scrollReference"
                                            :size="slot.selectSize"
                                            :icon="'emojione-monotone:kaaba'"
                                            :label="'Plan'"
                                            :options="plan" />
                                    </template>
                                    <template v-slot:cell.multi_select="{cell, slot, scrollReference}">
                                        <MultiSelect
                                            in-horizontal-scrollable
                                            drop-shadow
                                            :scroll-reference="scrollReference"
                                            :size="slot.selectSize"
                                            :options="category"
                                            :icon="'emojione-monotone:japanese-post-office'"/>
                                    </template>
                                    <template v-slot:cell.type="{cell, index, slot}">
                                        <Input :size="slot.inputSize" v-model="cell.type" type="number" autocomplete="off" />
                                    </template>
                                    <template v-slot:cell.category="{cell, index, slot}">
                                        <Input :size="slot.inputSize" v-model="cell.category" type="number" autocomplete="off" />
                                    </template>
                                    <template v-slot:cell.capacity="{cell, index, slot}">
                                        <Input :size="slot.inputSize" v-model="cell.capacity" type="number" autocomplete="off" />
                                    </template>
                                    <template v-slot:cell.datetime_added="{cell, slot, scrollReference}">
                                        <InputWithIcon
                                            :icon="'ion:calendar-number-sharp'"
                                            :id="`datetime_added-` + cell.id"
                                            v-model="cell.datetime_added"
                                            readonly
                                            in-cell
                                            :size="slot.inputSize"
                                            :type="'text'" />
                                    </template>
                                </DataTable>
                            </div>
                        </div>

                        <div v-if="true" class="tw-grid tw-gap-2 tw-grid-cols-1 sm:tw-grid-cols-2 lg:tw-grid-cols-5 xl:tw-grid-cols-6 2xl:tw-grid-cols-9">
                            <div class="tw-flex tw-items-start tw-justify-start tw-block neutral-border">
                                <Button :size="'2xs'" :icon="'ic:sharp-send-to-mobile'" :label="'XXS Button'"></Button>
                            </div>
                            <div class="tw-flex tw-items-start tw-justify-start tw-block neutral-border">
                                <Button :size="'xs'" :icon="'ic:sharp-send-to-mobile'" :label="'XS Button'"></Button>
                            </div>
                            <div class="tw-flex tw-items-start tw-justify-start tw-block neutral-border">
                                <Button :size="'sm'" :icon="'ic:sharp-send-to-mobile'" :label="'SM Authenticate'"></Button>
                            </div>
                            <div class="tw-flex tw-items-start tw-justify-start tw-block neutral-border">
                                <Button :size="'md'" :icon="'ic:sharp-send-to-mobile'" :label="'MD Authenticate'"></Button>
                            </div>
                            <div class="tw-flex tw-items-start tw-justify-start tw-block neutral-border">
                                <Button :disabled="true" :icon="'eos-icons:compass'" :label="'Disabled'"></Button>
                            </div>
                            <div class="tw-col-span-2 tw-flex tw-items-start tw-justify-start tw-block tw-w-full neutral-border">
                                <Button @click="$themeStore.setTheme('blue')" :size="'lg'" :icon="'mdi:palette-swatch-variant'" :label="'Blue Theme'"></Button>
                            </div>
                            <div class="tw-col-span-2 tw-flex tw-items-start tw-justify-start tw-block tw-w-full neutral-border">
                                <Button :size="'xl'" :icon="'eos-icons:atom-electron'" :label="'XL Authenticate'"></Button>
                            </div>
                        </div>

                        <div v-if="true" class="tw-grid tw-gap-2 tw-grid-cols-1 sm:tw-grid-cols-2 lg:tw-grid-cols-5 xl:tw-grid-cols-6 2xl:tw-grid-cols-9">
                            <div class="tw-flex tw-items-start tw-justify-start tw-block neutral-border">
                                <Button :variant="'outline'" :size="'2xs'" :icon="'ic:sharp-dashboard'" :label="'XXS Button'"></Button>
                            </div>
                            <div class="tw-flex tw-items-start tw-justify-start tw-block neutral-border">
                                <Button :variant="'outline'" :size="'xs'" :icon="'ic:sharp-dashboard'" :label="'XS Button'"></Button>
                            </div>
                            <div class="tw-flex tw-items-start tw-justify-start tw-block neutral-border">
                                <Button :variant="'outline'" :size="'sm'" :icon="'ic:sharp-dashboard'" :label="'SM Authenticate'"></Button>
                            </div>
                            <div class="tw-flex tw-items-start tw-justify-start tw-block neutral-border">
                                <Button :variant="'outline'" :size="'md'" :icon="'ic:sharp-dashboard'" :label="'MD Authenticate'"></Button>
                            </div>
                            <div class="tw-flex tw-items-start tw-justify-start tw-block neutral-border">
                                <Button :variant="'outline'" :icon="'eos-icons:compass'" :disabled="true" :label="'Disabled'"></Button>
                            </div>
                            <div class="tw-col-span-2 tw-flex tw-items-start tw-justify-start tw-block tw-w-full neutral-border">
                                <Button @click="$themeStore.setTheme('light')" :variant="'outline'" :size="'lg'" :icon="'mdi:palette-swatch-variant'" :label="'Light Theme'"></Button>
                            </div>
                            <div class="tw-col-span-2 tw-flex tw-items-start tw-justify-start tw-block tw-w-full">
                                <Button @click="$themeStore.setTheme('dark')" :variant="'outline'" :size="'xl'" :icon="'eos-icons:atom-electron'" :label="'Dark Theme'"></Button>
                            </div>
                        </div>

                        <div v-if="true" class="tw-grid tw-gap-2 tw-grid-cols-1 sm:tw-grid-cols-2 lg:tw-grid-cols-5 xl:tw-grid-cols-6 2xl:tw-grid-cols-9">
                            <div class="tw-flex tw-items-start tw-justify-start tw-block neutral-border">
                                <Button :variant="'flat'" :size="'2xs'" :icon="'ic:sharp-dashboard'" :label="'XXS Button'"></Button>
                            </div>
                            <div class="tw-flex tw-items-start tw-justify-start tw-block neutral-border">
                                <Button :variant="'flat'" :size="'xs'" :icon="'ic:sharp-dashboard'" :label="'XS Button'"></Button>
                            </div>
                            <div class="tw-flex tw-items-start tw-justify-start tw-block neutral-border">
                                <Button :variant="'flat'" :size="'sm'" :icon="'ic:sharp-dashboard'" :label="'SM Authenticate'"></Button>
                            </div>
                            <div class="tw-flex tw-items-start tw-justify-start tw-block neutral-border">
                                <Button :variant="'flat'" :size="'md'" :icon="'ic:sharp-dashboard'" :label="'MD Authenticate'"></Button>
                            </div>
                            <div class="tw-flex tw-items-start tw-justify-start tw-block neutral-border">
                                <Button :variant="'flat'" :icon="'eos-icons:compass'" :disabled="true" :label="'Disabled'"></Button>
                            </div>
                            <div class="tw-col-span-2 tw-flex tw-items-start tw-justify-start tw-block tw-w-full neutral-border">
                                <Button @click="$themeStore.setTheme('emerald')" :variant="'flat'" :size="'lg'" :icon="'mdi:palette-swatch-variant'" :label="'Emerald Theme'"></Button>
                            </div>
                            <div class="tw-col-span-2 tw-flex tw-items-start tw-justify-start tw-block tw-w-full neutral-border">
                                <Button :variant="'flat'" :size="'xl'" :icon="'eos-icons:atom-electron'" :label="'XL Authenticate'"></Button>
                            </div>
                        </div>

                        <div v-if="true" class="tw-grid tw-gap-2 tw-grid-cols-1 sm:tw-grid-cols-2 lg:tw-grid-cols-5 xl:tw-grid-cols-6 2xl:tw-grid-cols-8">
                            <div class="neutral-border">
                                <label>
                                    <Checkbox v-model="remember1" :label="' '" :size="'md'" name="remember" />
                                </label>
                            </div>
                            <div class="neutral-border">
                                <label>
                                    <Checkbox v-model="remember2" :size="'sm'" :label="'SM Checkbox'" name="remember" />
                                </label>
                            </div>
                            <div class="neutral-border">
                                <label>
                                    <Checkbox v-model="remember3" :size="'md'" :label="'MD Checkbox'" name="remember" />
                                </label>
                            </div>
                            <div class="neutral-border">
                                <label>
                                    <Checkbox v-model="remember4" :size="'lg'" :label="'LG Checkbox'" name="remember" />
                                </label>
                            </div>
                        </div>

                        <div v-if="true" class="tw-grid tw-gap-2 tw-grid-cols-1 sm:tw-grid-cols-2 lg:tw-grid-cols-5 xl:tw-grid-cols-6 2xl:tw-grid-cols-8">
                            <div class="neutral-border">
                            </div>
                            <div class="neutral-border">
                                <label v-for="category in categorySelection" :key="category">
                                    <Checkbox v-model="category.value" :label="category.text" :size="'sm'" />
                                </label>
                            </div>
                            <div class="neutral-border">
                                <label v-for="category in categorySelection" :key="category">
                                    <Checkbox v-model="category.value" :label="category.text" :size="'md'" />
                                </label>
                            </div>
                            <div class="neutral-border">
                                <label v-for="category in categorySelection" :key="category">
                                    <Checkbox v-model="category.value" :label="category.text" :size="'lg'" />
                                </label>
                            </div>
                        </div>

                        <div v-if="true" class="tw-grid tw-gap-2 tw-grid-cols-1 sm:tw-grid-cols-2 lg:tw-grid-cols-5 xl:tw-grid-cols-6 2xl:tw-grid-cols-8">
                            <div class="tw-flex tw-items-start tw-justify-start tw-block neutral-border">
                                <div>
                                    <InputLabel :size="'md'" value="SM : Gender Group" />
                                    <RadioGroup
                                        :selections="genderGroup.selection"
                                        :size="'sm'"
                                        class="neutral-border"
                                        v-model="genderGroup.selected" />
                                    <div>Selected Option: {{ genderGroup.selected }}</div>
                                </div>
                            </div>
                            <div class="tw-flex tw-items-start tw-justify-start tw-block neutral-border">
                                <div>
                                    <InputLabel :size="'md'" value="SM : Status Group" />
                                    <RadioGroup
                                        :selections="statusGroup.selection"
                                        :size="'sm'"
                                        class="neutral-border"
                                        v-model="statusGroup.selected" />
                                    <div>Selected Option: {{ statusGroup.selected }}</div>
                                </div>
                            </div>
                            <div class="tw-flex tw-items-start tw-justify-start tw-block neutral-border">
                                <div>
                                    <InputLabel :size="'md'" value="MD : Transaction Group" />
                                    <RadioGroup
                                        :selections="transactionGroup.selection"
                                        :size="'md'"
                                        class="neutral-border"
                                        v-model="transactionGroup.selected" />
                                    <div>Selected Option: {{ transactionGroup.selected }}</div>
                                </div>
                            </div>
                            <div class="tw-flex tw-items-start tw-justify-start tw-block neutral-border">
                                <div>
                                    <InputLabel :size="'md'" value="LG : Category Group" />
                                    <RadioGroup
                                        :selections="categoryGroup.selection"
                                        :size="'lg'"
                                        class="neutral-border"
                                        v-model="categoryGroup.selected" />
                                    <div>Selected Option: {{ categoryGroup.selected }}</div>
                                </div>
                            </div>
                        </div>

                        <div v-if="true" class="tw-grid tw-gap-2 tw-grid-cols-1 sm:tw-grid-cols-2 lg:tw-grid-cols-5 xl:tw-grid-cols-6 2xl:tw-grid-cols-8">
                            <div class="tw-block neutral-border">
                                <InputLabel :size="'2xs'" for="form_input_1" value="XXS Label" />
                                <Input :size="'2xs'" placeholder="Enter username" id="form_input_1" type="text" autocomplete="off" />
                            </div>
                            <div class="tw-block neutral-border">
                                <InputLabel :size="'xs'" for="form_input_2" value="XS Label" />
                                <Input :size="'xs'" placeholder="Enter username" id="form_input_2" type="text" autocomplete="off" />
                            </div>
                            <div class="tw-block neutral-border">
                                <InputLabel :size="'sm'" for="form_input_3" value="SM Label" />
                                <Input :size="'sm'" placeholder="Enter username" id="form_input_3" type="text" autocomplete="off" />
                            </div>
                            <div class="tw-block neutral-border">
                                <InputLabel :size="'md'" for="form_input_4" value="MD Label" />
                                <Input :size="'md'" placeholder="Enter username" id="form_input_4" type="text" autocomplete="off" />
                            </div>
                            <div class="tw-block neutral-border">
                                <InputLabel :size="'md'" for="form_input_5" value="MD Label" />
                                <Input :size="'md'" disabled placeholder="Disabled" id="form_input_4" type="text" autocomplete="off" />
                            </div>
                            <div class="tw-block neutral-border">
                                <InputLabel :size="'lg'" for="form_input_6" value="LG Label" />
                                <Input :size="'lg'" placeholder="Enter username" id="form_input_5" type="text" autocomplete="off" />
                            </div>
                            <div class="tw-col-span-2 tw-block neutral-border">
                                <InputLabel :size="'xl'" for="form_input_7" value="XL Label" />
                                <Input :size="'xl'" placeholder="Enter username" id="form_input_6" type="text" autocomplete="off" />
                            </div>
                        </div>
                        <div v-if="true" class="tw-grid tw-gap-2 tw-grid-cols-1 sm:tw-grid-cols-2 lg:tw-grid-cols-5 xl:tw-grid-cols-6 2xl:tw-grid-cols-8">
                            <div class="tw-block neutral-border">
                                <InputLabel :size="'2xs'" for="form_input_1" value="XXS Label" />
                                <InputWithIcon :size="'2xs'" :icon="'ic:sharp-qr-code'" placeholder="Enter username" id="form_input_1" type="text" autocomplete="off" />
                            </div>
                            <div class="tw-block neutral-border">
                                <InputLabel :size="'xs'" for="form_input_2" value="XS Label" />
                                <InputWithIcon :size="'xs'" :icon="'ic:sharp-qr-code'" placeholder="Enter username" id="form_input_2" type="text" autocomplete="off" />
                            </div>
                            <div class="tw-block neutral-border">
                                <InputLabel :size="'sm'" for="form_input_3" value="SM Label" />
                                <InputWithIcon :size="'sm'" :icon="'ic:sharp-qr-code'" placeholder="Enter username" id="form_input_3" type="text" autocomplete="off" />
                            </div>
                            <div class="tw-block neutral-border">
                                <InputLabel :size="'md'" for="form_input_4" value="MD Label" />
                                <InputWithIcon :size="'md'" :icon="'ic:sharp-qr-code'" placeholder="Enter username" id="form_input_4" type="text" autocomplete="off" />
                            </div>
                            <div class="tw-block neutral-border">
                                <InputLabel :size="'md'" for="form_input_5" value="MD Label" />
                                <InputWithIcon :size="'md'" :icon="'ic:sharp-qr-code'" disabled placeholder="Disabled" id="form_input_4" type="text" autocomplete="off" />
                            </div>
                            <div class="tw-block neutral-border">
                                <InputLabel :size="'lg'" for="form_input_6" value="LG Label" />
                                <InputWithIcon :size="'lg'" :icon="'ic:sharp-qr-code'" placeholder="Enter username" id="form_input_5" type="text" autocomplete="off" />
                            </div>
                            <div class="tw-col-span-2 tw-block neutral-border">
                                <InputLabel :size="'xl'" for="form_input_7" value="XL Label" />
                                <InputWithIcon :size="'xl'" :icon="'ic:sharp-qr-code'" placeholder="Enter username" id="form_input_6" type="text" autocomplete="off" />
                            </div>
                        </div>

                        <div v-if="true" class="tw-grid tw-gap-2 tw-grid-cols-1 sm:tw-grid-cols-2 lg:tw-grid-cols-5 xl:tw-grid-cols-6 2xl:tw-grid-cols-8">
                            <div class="tw-block neutral-border tw-col-span-2">
                                <p class="tw-text-sm tw-leading-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus nec facilisis lacus. Phasellus convallis commodo lorem. Nam vitae dignissim elit.</p>
                            </div>
                            <div class="tw-block neutral-border tw-col-span-2">
                                <p class="tw-text-base tw-leading-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus nec facilisis lacus. Phasellus convallis commodo lorem. Nam vitae dignissim elit.</p>
                            </div>
                            <div class="tw-block neutral-border tw-col-span-2">
                                <p class="tw-text-lg tw-leading-5">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus nec facilisis lacus. Phasellus convallis commodo lorem. Nam vitae dignissim elit.</p>
                            </div>
                            <div class="tw-block neutral-border tw-col-span-2">
                                <p class="tw-text-xl tw-leading-6">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus nec facilisis lacus. Phasellus convallis commodo lorem. Nam vitae dignissim elit.</p>
                            </div>
                        </div>

                        <div v-if="false" class="tw-grid tw-gap-2 tw-grid-cols-1 sm:tw-grid-cols-2 lg:tw-grid-cols-5 xl:tw-grid-cols-6 2xl:tw-grid-cols-8">
                            <div class="tw-block neutral-border tw-col-span-2">
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
                            <div class="tw-block neutral-border tw-col-span-2">
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
                            <div class="tw-block neutral-border tw-col-span-2">
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
                            <div class="tw-block neutral-border tw-col-span-2">
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
import {ref, onMounted, reactive} from 'vue';
import {storeToRefs} from 'pinia';
const {$themeStore, $formStore} = useNuxtApp();

definePageMeta({
    layout: false,
});

const {
    neutral: neutralColor
} = storeToRefs($themeStore);

let formStore = $formStore;
let remember1 = ref(null);
let remember2 = ref(true);
let remember3 = ref(1);
let remember4 = ref('1');
let categorySelection = reactive([
    {text : 'Charms', value: true},
    {text : 'Bracelets', value: true},
    {text : 'Brooches and Pins', value: false},
    {text : 'Necklaces', value: true},
    {text : 'Earrings', value: false},
    {text : 'Rings', value: true},
    {text : 'Polyester', value: true},
]);
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
        {text : 'Brooches\nand\nPins', value: 2},
        {text : 'Necklaces', value: 3},
        {text : 'Earrings', value: 4},
        {text : 'Rings', value: 5},
        {text : 'Polyester', value: 6},
    ],
    selection: [
        {text : 'Charms', value: 0},
        {text : 'Bracelets', value: 1},
        {text : 'Brooches\nand\nPins', value: 2},
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
        {text : 'Evaluator', value: 4},
    ],
    selection: [
        {text : 'Free', value: 0},
        {text : 'Individual', value: 1},
        {text : 'Standard Corporate', value: 2},
        {text : 'Custom Corporate', value: 3},
        {text : 'Evaluator', value: 4},
    ],
    selected: null
});
let perPage = reactive({
    search: '',
    data: [
        {text : '10 per page', value: 10},
        {text : '25 per page', value: 25},
        {text : '100 per page', value: 100},
    ],
    selection: [
        {text : '10 per page', value: 10},
        {text : '25 per page', value: 25},
        {text : '100 per page', value: 100},
    ],
    selected: 10
});
let bookingType = reactive({
    search: '',
    data: [
        {text : 'Individual', value: 1},
        {text : 'Spouse/Co-Owner', value: 2},
        {text : 'Corporation/Partnership', value: 3}
    ],
    selection: [
        {text : 'Individual', value: 1},
        {text : 'Spouse/Co-Owner', value: 2},
        {text : 'Corporation/Partnership', value: 3}
    ],
    selected: 1
});
let multiSelectPrototypePayload = reactive({
    fetch: {
        url: '/api/selections/prototype',
        filters: {
            search: {
                keyword: '',
                callback: 1
            }
        }
    },
    selected: [1992,1263]
});
let singleSelectPrototypePayload = reactive({
    fetch: {
        url: '/api/selections/prototype',
        filters: {
            search: {
                keyword: '',
                callback: 1
            }
        }
    },
    selected: null,
});

let selected_1 = ref([1001,1002]);
let selected_2 = ref([1001,1002]);
let selected_3 = ref([1001,1002]);
let headers_1 = reactive([
    { text: 'ID', value: 'id'},
    { text: 'NAME', value: 'name'},
    { text: 'CATEGORY', alignData: 'right', value: 'category', width: '140px'},
    { text: 'DATE ADDED', alignData: 'right', value: 'datetime_added', width: '145px'},
    { text: 'DATE CREATED', alignData: 'right', value: 'created_at'},
    { text: 'DATE UPDATED', alignData: 'right', value: 'updated_at'},
]);
let headers_2 = reactive([
    { text: 'ID', value: 'id'},
    { text: 'NAME', value: 'name'},
    { text: 'CODE', alignHeader: 'center', value: 'code'},
    { text: 'DATE ADDED', alignData: 'right', value: 'datetime_added'},
    { text: 'CATEGORY', alignData: 'right', value: 'category'},
    { text: 'CAPACITY', alignData: 'left', value: 'capacity'},
    { text: 'TYPE', value: 'type'}
]);
let headers_3 = reactive([
    { text: '#', value: 'row_number'},
    { text: 'TOOLS', value: 'tools'},
    { text: 'ID', value: 'id'},
    { text: 'NAME', value: 'name', width: '120px'},
    { text: 'CODE', alignHeader: 'center', value: 'code', width: '100px'},
    { text: 'SINGLE PAGINATED', value: 'single_paginated', width: '170px'},
    { text: 'MULTI PAGINATED', value: 'multi_paginated', width: '170px'},
    { text: 'SINGLE SELECT', value: 'single_select', width: '170px'},
    { text: 'MULTI SELECT', value: 'multi_select', width: '170px'},
    { text: 'TYPE', value: 'type'},
    { text: 'CATEGORY', alignData: 'right', value: 'category'},
    { text: 'CAPACITY', alignData: 'left', value: 'capacity'},
    { text: 'DATE ADDED', alignData: 'right', value: 'datetime_added', width: '170px'},
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
]);

let data_2 = ref([
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
]);

let data_3 = ref([
    {
        "row_number": '#1',
        "id": 418,
        "name": "VFSNL4 FL2 7C",
        "code": "PRT1915550179",
        "type": 3,
        "category": null,
        "capacity": 19,
        "single_select_prototype_payload": {
            fetch: {
                url: '/api/selections/prototype',
                filters: {
                    search: {
                        keyword: '',
                        callback: 1
                    }
                }
            },
            selected: null,
        },
        "multi_select_prototype_payload": {
            fetch: {
                url: '/api/selections/prototype',
                filters: {
                    search: {
                        keyword: '',
                        callback: 1
                    }
                }
            },
            selected: []
        },
        "datetime_added": "2023-08-22 17:44:03",
        "created_at": "2023-08-22 17:44:03",
        "updated_at": "2023-08-22 17:44:03"
    },
    {
        "row_number": '#2',
        "id": 478,
        "name": "RC0 868Q6 GZI",
        "code": "PRT4902978961",
        "type": 2,
        "category": 68,
        "capacity": 15,
        "single_select_prototype_payload": {
            fetch: {
                url: '/api/selections/prototype',
                filters: {
                    search: {
                        keyword: '',
                        callback: 1
                    }
                }
            },
            selected: null,
        },
        "multi_select_prototype_payload": {
            fetch: {
                url: '/api/selections/prototype',
                filters: {
                    search: {
                        keyword: '',
                        callback: 1
                    }
                }
            },
            selected: []
        },
        "datetime_added": "2023-08-22 17:44:03",
        "created_at": "2023-08-22 17:44:03",
        "updated_at": "2023-08-22 17:44:03"
    },
    {
        "row_number": '#3',
        "id": 552,
        "name": "9Q8 YEESZ DKF",
        "code": "PRT3932126979",
        "type": 1,
        "category": 4,
        "capacity": 15,
        "single_select_prototype_payload": {
            fetch: {
                url: '/api/selections/prototype',
                filters: {
                    search: {
                        keyword: '',
                        callback: 1
                    }
                }
            },
            selected: null,
        },
        "multi_select_prototype_payload": {
            fetch: {
                url: '/api/selections/prototype',
                filters: {
                    search: {
                        keyword: '',
                        callback: 1
                    }
                }
            },
            selected: []
        },
        "datetime_added": "2023-08-22 17:44:03",
        "created_at": "2023-08-22 17:44:03",
        "updated_at": "2023-08-22 17:44:03"
    },
    {
        "row_number": '#4',
        "id": 702,
        "name": "45EE9R TES VK",
        "code": "PRT2563775044",
        "type": 5,
        "category": 79,
        "capacity": 35,
        "single_select_prototype_payload": {
            fetch: {
                url: '/api/selections/prototype',
                filters: {
                    search: {
                        keyword: '',
                        callback: 1
                    }
                }
            },
            selected: null,
        },
        "multi_select_prototype_payload": {
            fetch: {
                url: '/api/selections/prototype',
                filters: {
                    search: {
                        keyword: '',
                        callback: 1
                    }
                }
            },
            selected: []
        },
        "datetime_added": "2023-08-22 17:44:03",
        "created_at": "2023-08-22 17:44:03",
        "updated_at": "2023-08-22 17:44:03"
    }
]);

let data_1_DateTimePickers = data_1.value.map(record => {
    return {
        id: `datetime_added-` + record.id,
        type: 'datetime',
        selectedCallback: (payload) => {
            record.datetime_added = payload.value;
        }
    }
});

let data_2_DateTimePickers = data_2.value.map(record => {
    return {
        id: `datetime_added-` + record.id,
        type: 'datetime',
        selectedCallback: (payload) => {
            record.datetime_added = payload.value;
        }
    }
});

let data_3_DateTimePickers = data_3.value.map(record => {
    return {
        id: `datetime_added-` + record.id,
        type: 'datetime',
        selectedCallback: (payload) => {
            record.datetime_added = payload.value;
        }
    }
});

let dateTimePickers = ref([
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

dateTimePickers.value = dateTimePickers.value
    .concat(data_1_DateTimePickers)
    .concat(data_2_DateTimePickers)
    .concat(data_3_DateTimePickers);

const {render} = dateTimePicker();

onMounted(async () => {
    render(dateTimePickers.value);
});
</script>