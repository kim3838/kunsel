<template>
    <div>
        <DefaultWrapper>
            <div class="tw-mx-auto tw-pt-4 tw-max-w-screen-2xl">
                <div>Tailwind Url: <a class="tw-text-sky-600" href="_tailwind" target="_blank">{{('http://localhost:3000' + '/_tailwind/')}}</a></div>

                <div class="tw-space-y-2">
                    <!-- Static Single, MultiSelect and DateTime, Date, and Month Picker -->
                    <div v-if="true" class="tw-grid tw-gap-2 tw-grid-cols-1 sm:tw-grid-cols-2 lg:tw-grid-cols-5 xl:tw-grid-cols-6 2xl:tw-grid-cols-8">
                        <div class="tw-block neutral-border">
                            <InputLabel :size="'sm'" value="Static Multi Select" />
                            <MultiSelect drop-shadow :selection-max-viewable-line="5" :size="'md'" :options="category" :icon="'ic:sharp-qr-code'"/>
                        </div>
                        <div class="tw-block neutral-border">
                            <InputLabel :size="'sm'" value="Non Searchable Multi Select" />
                            <MultiSelect drop-shadow :selection-max-viewable-line="5" :searchable="false" :size="'md'" :options="category" :icon="'eos-icons:installing'"/>
                        </div>
                        <div class="tw-block neutral-border">
                            <InputLabel :size="'sm'" value="Static Single Select" />
                            <SingleSelect drop-shadow :selection-max-viewable-line="4" :always-active="false" :size="'md'" :icon="'emojione-monotone:japanese-no-vacancy-button'" :options="plan"/>
                        </div>

                        <div class="tw-block neutral-border">
                            <InputLabel :size="'sm'" value="Non Searchable Single Select" />
                            <SingleSelect drop-shadow :selection-max-viewable-line="4" :searchable="false" :size="'md'" :icon="'emojione-monotone:japanese-vacancy-button'" :options="plan"/>
                        </div>

                        <div class="tw-block neutral-border">
                            <InputLabel :size="'sm'" value="Single Select Persist Value" />
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
                            <InputLabel :size="'sm'" for="date" value="Date" />
                            <InputWithIcon
                                :icon="'simple-icons:googlecalendar'"
                                :size="'md'"
                                :id="'date'"
                                v-model="formStore.filters.date"
                                autocomplete="off"
                                readonly
                                :disabled="false" />
                        </div>
                        <div class="tw-block neutral-border">
                            <InputLabel :size="'sm'" for="datetime" value="DateTime" />
                            <InputWithIcon
                                :icon="'simple-icons:googlecalendar'"
                                :size="'md'"
                                :id="'datetime'"
                                v-model="formStore.filters.dateTime"
                                autocomplete="off"
                                readonly
                                :disabled="false" />
                        </div>

                        <div class="tw-block neutral-border">
                            <InputLabel :size="'sm'" for="month" value="Month" />
                            <InputWithIcon
                                :icon="'simple-icons:protoncalendar'"
                                :size="'md'"
                                :id="'month'"
                                v-model="formStore.filters.monthLabel"
                                autocomplete="off"
                                readonly
                                :disabled="false" />
                        </div>
                    </div>

                    <!-- Paginated Single and MultiSelect -->
                    <div v-if="true" class="tw-grid tw-gap-2 tw-grid-cols-1 sm:tw-grid-cols-2 lg:tw-grid-cols-5 xl:tw-grid-cols-6 2xl:tw-grid-cols-8">
                        <div class="tw-block neutral-border">
                            <InputLabel :size="'sm'" value="Paginated Multi Select" />
                            <MultiSelectPaginated
                                :drop-shadow="true"
                                :selection-max-content="true"
                                :selected-max-viewable-line="6"
                                :selection-max-viewable-line="8"
                                :searchable="true"
                                :selection-float="true"
                                :always-active="false"
                                :label="'Select Prototypes'"
                                :size="'md'"
                                :payload="multiSelectPrototypePayload"
                                :icon="'ic:sharp-qr-code'"/>
                        </div>
                        <div class="tw-block neutral-border">
                            <InputLabel :size="'sm'" value="Paginated Single Select" />
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

                    <!-- Static Single and MultiSelect with more Custom Configurations -->
                    <div v-if="false" class="tw-grid tw-gap-2 tw-grid-cols-1 sm:tw-grid-cols-2 lg:tw-grid-cols-5 xl:tw-grid-cols-6 2xl:tw-grid-cols-8">
                        <div class="tw-flex tw-block">
                            <MultiSelect
                                :selection-max-content="false"
                                :selection-max-viewable-line="6"
                                :selection-float="false"
                                :idle-border="'red'"
                                :active-border="'red'"
                                :always-active="true"
                                :searchable="false"
                                :label="'Select Category'"
                                :size="'sm'"
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
                                :size="'md'"
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
                                :searchable="true"
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

                    <!-- Datatables -->
                    <div v-if="true" class="tw-grid tw-gap-2 sm:tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-4">
                        <div class="tw-block tw-col-span-1 sm:tw-col-span-3 md:tw-col-span-2 lg:tw-col-span-2 tw-p-2 neutral-border">
                            <InputLabel class="tw-mb-2" :size="'md'" value="MD Datatable" />
                            <DataTable
                                :headers="dataTable1Headers"
                                :size="'md'"
                                :rows="dataTable1Data"
                                v-model="dataTable1Selected"
                                selection>
                                <template v-slot:cell.name="{cell, index, slot}">
                                    <div class="tw-h-full tw-w-full tw-flex tw-items-center">
                                        <Button class="tw-w-full" :variant="'outline'" :icon="'ic:sharp-check-box-outline-blank'" :size="slot.buttonSize" :label="`[${index}] ${cell.name}`"></Button>
                                    </div>
                                </template>
                                <template v-slot:cell.category="{cell, slot, scrollReference}">
                                    <MultiSelect
                                        in-horizontal-scrollable
                                        drop-shadow
                                        :scroll-reference="scrollReference"
                                        :size="slot.selectSize"
                                        :options="category"
                                        :icon="'ic:sharp-check-box-outline-blank'"/>
                                </template>
                                <template v-slot:cell.datetime_added="{cell, slot, scrollReference}">
                                    <InputWithIcon
                                        :icon="'ion:calendar-number-sharp'"
                                        :id="`datetime_added-` + cell.id"
                                        v-model="cell.datetime_added"
                                        readonly
                                        in-cell
                                        :size="slot.inputSize" />
                                </template>
                            </DataTable>
                        </div>
                        <div class="tw-block tw-col-span-1 sm:tw-col-span-3 md:tw-col-span-2 lg:tw-col-span-2 tw-p-2 neutral-border">
                            <InputLabel class="tw-mb-2" :size="'md'" value="LG Datatable with Selection" />
                            <DataTable
                                :headers="dataTable2Headers"
                                :size="'lg'"
                                :rows="dataTable2Data"
                                v-model="dataTable2Selected"
                                selection>
                                <template v-slot:cell.name="{cell, index, slot}">
                                    <div class="tw-h-full tw-w-full tw-flex tw-items-center">
                                        <Button class="tw-w-full" :variant="'default'" :icon="'ic:sharp-check-box-outline-blank'" :size="slot.buttonSize" :label="`${cell.name}`"></Button>
                                    </div>
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
                                        :size="slot.inputSize" />
                                </template>
                            </DataTable>
                        </div>
                        <div class="tw-block md:tw-col-span-2 lg:tw-col-span-4 tw-p-2 neutral-border">
                            <InputLabel class="tw-mb-2" :size="'md'" value="XL Datatable with Selection and Form Foundations" />
                            <DataTable
                                :headers="dataTable3Headers"
                                :size="'xl'"
                                :rows="dataTable3Data"
                                v-model="dataTable3Selected"
                                selection>
                                <template v-slot:cell.tools="{cell, slot, scrollReference}">
                                    <div class="tw-h-full tw-space-x-0.5 tw-w-full tw-flex tw-items-center">
                                        <Button :size="slot.buttonSize" :icon="'ic:sharp-check-box-outline-blank'" :label="'Slot I'"></Button>
                                        <Button :variant="'flat'" :size="slot.buttonSize" :icon="'ic:sharp-check-box-outline-blank'" :label="'Slot II'"></Button>
                                        <Button :variant="'flat'" :size="slot.buttonSize" :icon="'ic:sharp-check-box-outline-blank'" :label="'Slot III'"></Button>
                                        <Button :variant="'flat'" :size="slot.buttonSize" :icon="'ic:sharp-check-box-outline-blank'"></Button>
                                        <Button :variant="'flat'" :size="slot.buttonSize" :icon="'ic:sharp-check-box-outline-blank'"></Button>
                                    </div>
                                </template>
                                <template v-slot:cell.input="{cell, index, slot}">
                                    <Input :size="slot.inputSize" class="tw-w-full" placeholder="Enter Amount" type="text" autocomplete="off" />
                                </template>
                                <template v-slot:cell.name="{cell, index, slot}">
                                    <div class="tw-h-full tw-w-full tw-flex tw-items-center">
                                        <Button class="tw-w-full" :variant="'flat'" :icon="'ic:sharp-check-box-outline-blank'" :size="slot.buttonSize" :label="`${cell.name}`"></Button>
                                    </div>
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
                                        :icon="'ic:sharp-check-box-outline-blank'"/>
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
                                        :icon="'ic:sharp-check-box-outline-blank'"/>
                                </template>
                                <template v-slot:cell.single_select="{cell, slot, scrollReference}">
                                    <SingleSelect
                                        in-horizontal-scrollable
                                        drop-shadow
                                        :scroll-reference="scrollReference"
                                        :size="slot.selectSize"
                                        :icon="'ic:sharp-check-box-outline-blank'"
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
                                        :icon="'ic:sharp-check-box-outline-blank'"/>
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
                                        :size="slot.inputSize" />
                                </template>
                            </DataTable>
                        </div>
                    </div>

                    <!-- Lara Fetch Group -->
                    <div v-if="true">
                        <div class="tw-block tw-p-2 neutral-border">
                            <InputLabel class="tw-mb-2" :size="'md'" value="Lara Fetch Group" />
                            <div class="tw-grid tw-gap-1 tw-grid-cols-1 sm:tw-grid-cols-2 md:tw-grid-cols-2 lg:tw-grid-cols-3">
                                <div class="neutral-border tw-p-1">
                                    <pre>OFETCH PENDING: {{ofetchPending}}</pre>
                                    <pre>OFETCH DATA: {{ofetchData}}</pre>
                                    <Button class="tw-inline-block" @click="oFetchPost" :label="'OFetch Post'" />
                                </div>
                                <div class="neutral-border tw-p-1">
                                    <pre>OFETCH NO ERROR PROMPT PENDING: {{ofetchNoPromptPending}}</pre>
                                    <pre>OFETCH NO ERROR PROMPT DATA: {{ofetchNoPromptData}}</pre>
                                    <Button class="tw-inline-block" @click="oFetchNoPromptPost" :label="'OFetch NO PROMPT Post'" />
                                </div>
                                <div class="neutral-border tw-p-1">
                                    <pre>USEFETCH LAZY FETCH PENDING: {{useFetchPending}}</pre>
                                    <pre>USEFETCH LAZY FETCH DATA: {{!useFetchPending ? useFetchData : null}}</pre>
                                    <Button class="tw-w-min" @click="useFetchPost" :label="'useFetch Post'" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Tab Indexed Group -->
                    <div v-if="false">
                        <div class="tw-block tw-p-2 neutral-border">
                            <InputLabel class="tw-mb-2" :size="'md'" value="Tab Group" />
                            <div class="tw-grid tw-gap-1 tw-grid-cols-1 sm:tw-grid-cols-2 md:tw-grid-cols-3 lg:tw-grid-cols-5">
                                <div>
                                    <Input :tabindex="1" :size="tabGroup.size" :placeholder="'Enter value'" type="text" autocomplete="off" />
                                </div>
                                <div>
                                    <MultiSelectPaginated
                                        :tabindex="2"
                                        :drop-shadow="true"
                                        :selection-max-content="false"
                                        :selected-max-viewable-line="6"
                                        :selection-max-viewable-line="10"
                                        :searchable="false"
                                        :selection-float="true"
                                        :always-active="false"
                                        :label="'Select Prototypes'"
                                        :size="tabGroup.size"
                                        :payload="multiSelectPrototypePayload"
                                        :icon="tabGroup.icon"/>
                                </div>
                                <div>
                                    <InputWithIcon :tabindex="4" :size="tabGroup.size" :icon="tabGroup.icon" :placeholder="'Enter value'" autocomplete="off" />
                                </div>
                                <div>
                                    <MultiSelect
                                        :tabindex="5"
                                        drop-shadow
                                        :searchable="false"
                                        :selection-float="true"
                                        :always-active="false"
                                        :selection-max-viewable-line="5"
                                        :size="tabGroup.size"
                                        :options="category"
                                        :icon="tabGroup.icon"/>
                                </div>
                                <div>
                                    <InputWithIcon :tabindex="7" :size="tabGroup.size" :icon="tabGroup.icon" :placeholder="'Enter value'" autocomplete="off" />
                                </div>
                                <div>
                                    <Input :tabindex="8" :size="tabGroup.size" :placeholder="'Enter value'" type="text" autocomplete="off" />
                                </div>
                                <div>
                                    <SingleSelectPaginated
                                        :tabindex="9"
                                        :value-persist="true"
                                        :drop-shadow="true"
                                        :selection-max-content="true"
                                        :selection-max-viewable-line="10"
                                        :searchable="false"
                                        :selection-float="true"
                                        :always-active="false"
                                        :label="'Select Prototype'"
                                        :size="tabGroup.size"
                                        :payload="singleSelectPrototypePayload"
                                        :icon="tabGroup.icon"/>
                                </div>
                                <div>
                                    <InputWithIcon :tabindex="11" :size="tabGroup.size" :icon="tabGroup.icon" :placeholder="'Enter value'" autocomplete="off" />
                                </div>
                                <div>
                                    <SingleSelect
                                        :tabindex="12"
                                        :value-persist="true"
                                        :drop-shadow="true"
                                        :selection-max-content="true"
                                        :searchable="false"
                                        :selection-float="true"
                                        :always-active="false"
                                        :size="tabGroup.size"
                                        :selection-max-viewable-line="8"
                                        :icon="tabGroup.icon"
                                        :options="singleSelectPrototype"/>
                                </div>
                                <div>
                                    <InputWithIcon :tabindex="14" :size="tabGroup.size" :icon="tabGroup.icon" :placeholder="'Enter value'" autocomplete="off" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Button and Input Grid Spacing Alignments -->
                    <div v-if="false">
                        <div class="tw-block tw-p-2 neutral-border">
                            <InputLabel class="tw-mb-2" :size="'md'" value="Spacing Alignment Grid" />
                            <div class="tw-grid tw-gap-1 tw-grid-cols-7">
                                <div v-if="true" class="tw-relative">
                                    <div v-if="true" class="tw-absolute tw-w-[0.2px] tw-top-0 tw-bottom-0 tw-bg-slate-400 tw-z-50 tw-ml-[0.35rem]"></div>
                                    <div v-if="true" class="tw-absolute tw-w-[0.2px] tw-top-0 tw-bottom-0 tw-bg-slate-400 tw-z-50 tw-ml-[1.1rem]"></div>

                                    <div class="tw-space-y-1">
                                        <MultiSelectPaginated
                                            :glint="true"
                                            :drop-shadow="true"
                                            :selection-max-content="false"
                                            :selected-max-viewable-line="6"
                                            :selection-max-viewable-line="10"
                                            :searchable="false"
                                            :selection-float="true"
                                            :always-active="false"
                                            :label="'Select Prototypes'"
                                            :size="'2xs'"
                                            :payload="multiSelectPrototypePayload"
                                            :icon="tabGroup.icon"/>
                                        <InputWithIcon :glint="false" :size="'2xs'" :icon="tabGroup.icon" :placeholder="'Enter value'" autocomplete="off" />
                                        <MultiSelect
                                            :glint="true"
                                            drop-shadow
                                            :searchable="false"
                                            :selection-float="true"
                                            :always-active="false"
                                            :selection-max-viewable-line="5"
                                            :size="'2xs'"
                                            :options="category"
                                            :icon="tabGroup.icon"/>
                                        <SingleSelectPaginated
                                            :glint="true"
                                            :value-persist="true"
                                            :drop-shadow="true"
                                            :selection-max-content="true"
                                            :selection-max-viewable-line="10"
                                            :searchable="false"
                                            :selection-float="true"
                                            :always-active="false"
                                            :label="'Select Prototype'"
                                            :size="'2xs'"
                                            :payload="singleSelectPrototypePayload"
                                            :icon="tabGroup.icon"/>
                                        <SingleSelect
                                            :glint="true"
                                            :value-persist="true"
                                            :drop-shadow="true"
                                            :selection-max-content="true"
                                            :searchable="false"
                                            :selection-float="true"
                                            :always-active="false"
                                            :size="'2xs'"
                                            :selection-max-viewable-line="8"
                                            :icon="tabGroup.icon"
                                            :options="singleSelectPrototype"/>

                                        <!-- Input -->
                                        <Input :glint="false" :placeholder="'Enter value'" :size="'2xs'" type="text" autocomplete="off" />

                                        <!-- Input with icon -->
                                        <InputWithIcon
                                            :glint="false"
                                            :size="'2xs'"
                                            :icon="tabGroup.icon"
                                            :placeholder="'Enter value'"
                                            autocomplete="off" />

                                        <!-- Button with icon, label -->
                                        <Button :glint="true" class="tw-w-full" :size="'2xs'" :icon="tabGroup.icon" :variant="'default'" :label="'Button'" />
                                        <Button :glint="true" class="tw-w-3/4"  :size="'2xs'" :icon="tabGroup.icon" :variant="'flat'" :label="'Button'" />
                                        <Button :glint="true" class="tw-w-1/2"  :size="'2xs'" :icon="tabGroup.icon" :variant="'outline'" :label="'Button'" />

                                        <!-- Button with icon, no label -->
                                        <Button :glint="true" class="tw-w-full" :size="'2xs'" :icon="tabGroup.icon" :variant="'default'" :label="''" />
                                        <Button :glint="true" class="tw-w-3/4"  :size="'2xs'" :icon="tabGroup.icon" :variant="'flat'" :label="''" />
                                        <Button :glint="true" class="tw-w-1/2"  :size="'2xs'" :icon="tabGroup.icon" :variant="'outline'" :label="''" />

                                        <!-- Button with icon, no label, minimum width -->
                                        <div class="tw-w-min"><Button :glint="true" :size="'2xs'" :icon="tabGroup.icon" :variant="'default'" :label="''" /></div>
                                        <div class="tw-w-min"><Button :glint="true" :size="'2xs'" :icon="tabGroup.icon" :variant="'outline'" :label="''" /></div>
                                        <div class="tw-w-min"><Button :glint="true" :size="'2xs'" :icon="tabGroup.icon" :variant="'flat'" :label="''" /></div>
                                    </div>
                                </div>

                                <div v-if="true" class="tw-relative">
                                    <div v-if="true" class="tw-absolute tw-w-[0.2px] tw-top-0 tw-bottom-0 tw-bg-slate-400 tw-z-50 tw-ml-[0.40rem]"></div>
                                    <div v-if="true" class="tw-absolute tw-w-[0.2px] tw-top-0 tw-bottom-0 tw-bg-slate-400 tw-z-50 tw-ml-[1.35rem]"></div>

                                    <div class="tw-space-y-1">
                                        <MultiSelectPaginated
                                            :glint="true"
                                            :drop-shadow="true"
                                            :selection-max-content="false"
                                            :selected-max-viewable-line="6"
                                            :selection-max-viewable-line="10"
                                            :searchable="false"
                                            :selection-float="true"
                                            :always-active="false"
                                            :label="'Select Prototypes'"
                                            :size="'xs'"
                                            :payload="multiSelectPrototypePayload"
                                            :icon="tabGroup.icon"/>
                                        <InputWithIcon :glint="false" :size="'xs'" :icon="tabGroup.icon" :placeholder="'Enter value'" autocomplete="off" />
                                        <MultiSelect
                                            :glint="true"
                                            drop-shadow
                                            :searchable="false"
                                            :selection-float="true"
                                            :always-active="false"
                                            :selection-max-viewable-line="5"
                                            :size="'xs'"
                                            :options="category"
                                            :icon="tabGroup.icon"/>
                                        <SingleSelectPaginated
                                            :glint="true"
                                            :value-persist="true"
                                            :drop-shadow="true"
                                            :selection-max-content="true"
                                            :selection-max-viewable-line="10"
                                            :searchable="false"
                                            :selection-float="true"
                                            :always-active="false"
                                            :label="'Select Prototype'"
                                            :size="'xs'"
                                            :payload="singleSelectPrototypePayload"
                                            :icon="tabGroup.icon"/>
                                        <SingleSelect
                                            :glint="true"
                                            :value-persist="true"
                                            :drop-shadow="true"
                                            :selection-max-content="true"
                                            :searchable="false"
                                            :selection-float="true"
                                            :always-active="false"
                                            :size="'xs'"
                                            :selection-max-viewable-line="8"
                                            :icon="tabGroup.icon"
                                            :options="singleSelectPrototype"/>

                                        <!-- Input -->
                                        <Input :glint="false" :placeholder="'Enter value'" :size="'xs'" type="text" autocomplete="off" />

                                        <!-- Input with icon -->
                                        <InputWithIcon
                                            :glint="false"
                                            :size="'xs'"
                                            :icon="tabGroup.icon"
                                            :placeholder="'Enter value'"
                                            autocomplete="off" />

                                        <!-- Button with icon, label -->
                                        <Button :glint="true" class="tw-w-full" :size="'xs'" :icon="tabGroup.icon" :variant="'default'" :label="'Button'" />
                                        <Button :glint="true" class="tw-w-3/4"  :size="'xs'" :icon="tabGroup.icon" :variant="'flat'" :label="'Button'" />
                                        <Button :glint="true" class="tw-w-1/2"  :size="'xs'" :icon="tabGroup.icon" :variant="'outline'" :label="'Button'" />

                                        <!-- Button with icon, no label -->
                                        <Button :glint="true" class="tw-w-full" :size="'xs'" :icon="tabGroup.icon" :variant="'default'" :label="''" />
                                        <Button :glint="true" class="tw-w-3/4"  :size="'xs'" :icon="tabGroup.icon" :variant="'flat'" :label="''" />
                                        <Button :glint="true" class="tw-w-1/2"  :size="'xs'" :icon="tabGroup.icon" :variant="'outline'" :label="''" />

                                        <!-- Button with icon, no label, minimum width -->
                                        <div class="tw-w-min"><Button :glint="true" :size="'xs'" :icon="tabGroup.icon" :variant="'default'" :label="''" /></div>
                                        <div class="tw-w-min"><Button :glint="true" :size="'xs'" :icon="tabGroup.icon" :variant="'outline'" :label="''" /></div>
                                        <div class="tw-w-min"><Button :glint="true" :size="'xs'" :icon="tabGroup.icon" :variant="'flat'" :label="''" /></div>
                                    </div>
                                </div>

                                <div v-if="true" class="tw-relative">
                                    <div v-if="true" class="tw-absolute tw-w-[0.2px] tw-top-0 tw-bottom-0 tw-bg-slate-400 tw-z-50 tw-ml-[0.65rem]"></div>
                                    <div v-if="true" class="tw-absolute tw-w-[0.2px] tw-top-0 tw-bottom-0 tw-bg-slate-400 tw-z-50 tw-ml-[1.6rem]"></div>

                                    <div class="tw-space-y-1">
                                        <MultiSelectPaginated
                                            :glint="true"
                                            :drop-shadow="true"
                                            :selection-max-content="false"
                                            :selected-max-viewable-line="6"
                                            :selection-max-viewable-line="10"
                                            :searchable="false"
                                            :selection-float="true"
                                            :always-active="false"
                                            :label="'Select Prototypes'"
                                            :size="'sm'"
                                            :payload="multiSelectPrototypePayload"
                                            :icon="tabGroup.icon"/>

                                        <InputWithIcon :glint="true" :size="'sm'" :icon="tabGroup.icon" :placeholder="'Enter value'" autocomplete="off" />
                                        <MultiSelect
                                            :glint="true"
                                            drop-shadow
                                            :searchable="false"
                                            :selection-float="true"
                                            :always-active="false"
                                            :selection-max-viewable-line="5"
                                            :size="'sm'"
                                            :options="category"
                                            :icon="tabGroup.icon"/>
                                        <SingleSelectPaginated
                                            :glint="true"
                                            :value-persist="true"
                                            :drop-shadow="true"
                                            :selection-max-content="true"
                                            :selection-max-viewable-line="10"
                                            :searchable="false"
                                            :selection-float="true"
                                            :always-active="false"
                                            :label="'Select Prototype'"
                                            :size="'sm'"
                                            :payload="singleSelectPrototypePayload"
                                            :icon="tabGroup.icon"/>
                                        <SingleSelect
                                            :glint="true"
                                            :value-persist="true"
                                            :drop-shadow="true"
                                            :selection-max-content="true"
                                            :searchable="false"
                                            :selection-float="true"
                                            :always-active="false"
                                            :size="'sm'"
                                            :selection-max-viewable-line="8"
                                            :icon="tabGroup.icon"
                                            :options="singleSelectPrototype"/>

                                        <!-- Input -->
                                        <Input :glint="true" :placeholder="'Enter value'" :size="'sm'" type="text" autocomplete="off" />

                                        <!-- Input with icon -->
                                        <InputWithIcon
                                            :glint="true"
                                            :size="'sm'"
                                            :icon="tabGroup.icon"
                                            :placeholder="'Enter value'"
                                            autocomplete="off" />

                                        <!-- Button with icon, label -->
                                        <Button :glint="true" class="tw-w-full" :size="'sm'" :icon="tabGroup.icon" :variant="'default'" :label="'Button'" />
                                        <Button :glint="true" class="tw-w-3/4"  :size="'sm'" :icon="tabGroup.icon" :variant="'flat'" :label="'Button'" />
                                        <Button :glint="true" class="tw-w-1/2"  :size="'sm'" :icon="tabGroup.icon" :variant="'outline'" :label="'Button'" />

                                        <!-- Button with icon, no label -->
                                        <Button :glint="true" class="tw-w-full" :size="'sm'" :icon="tabGroup.icon" :variant="'default'" :label="''" />
                                        <Button :glint="true" class="tw-w-3/4"  :size="'sm'" :icon="tabGroup.icon" :variant="'flat'" :label="''" />
                                        <Button :glint="true" class="tw-w-1/2"  :size="'sm'" :icon="tabGroup.icon" :variant="'outline'" :label="''" />

                                        <!-- Button with icon, no label, minimum width -->
                                        <div class="tw-w-min"><Button :glint="true" :size="'sm'" :icon="tabGroup.icon" :variant="'default'" :label="''" /></div>
                                        <div class="tw-w-min"><Button :glint="true" :size="'sm'" :icon="tabGroup.icon" :variant="'outline'" :label="''" /></div>
                                        <div class="tw-w-min"><Button :glint="true" :size="'sm'" :icon="tabGroup.icon" :variant="'flat'" :label="''" /></div>
                                    </div>
                                </div>

                                <div v-if="true" class="tw-relative">
                                    <div v-if="true" class="tw-absolute tw-w-[0.2px] tw-top-0 tw-bottom-0 tw-bg-slate-400 tw-z-50 tw-ml-[0.65rem]"></div>
                                    <div v-if="true" class="tw-absolute tw-w-[0.2px] tw-top-0 tw-bottom-0 tw-bg-slate-400 tw-z-50 tw-ml-[1.6rem]"></div>

                                    <div class="tw-space-y-1">
                                        <!-- Selects -->
                                        <MultiSelectPaginated
                                            :glint="true"
                                            :drop-shadow="true"
                                            :selection-max-content="false"
                                            :selected-max-viewable-line="6"
                                            :selection-max-viewable-line="10"
                                            :searchable="false"
                                            :selection-float="true"
                                            :always-active="false"
                                            :label="'Select Prototypes'"
                                            :size="'md'"
                                            :payload="multiSelectPrototypePayload"
                                            :icon="tabGroup.icon"/>
                                        <InputWithIcon :glint="true" :size="'md'" :icon="tabGroup.icon" :placeholder="'Enter value'" autocomplete="off" />
                                        <MultiSelect
                                            :glint="true"
                                            drop-shadow
                                            :searchable="false"
                                            :selection-float="true"
                                            :always-active="false"
                                            :selection-max-viewable-line="5"
                                            :size="'md'"
                                            :options="category"
                                            :icon="tabGroup.icon"/>
                                        <SingleSelectPaginated
                                            :glint="true"
                                            :value-persist="true"
                                            :drop-shadow="true"
                                            :selection-max-content="true"
                                            :selection-max-viewable-line="10"
                                            :searchable="false"
                                            :selection-float="true"
                                            :always-active="false"
                                            :label="'Select Prototype'"
                                            :size="'md'"
                                            :payload="singleSelectPrototypePayload"
                                            :icon="tabGroup.icon"/>
                                        <SingleSelect
                                            :glint="true"
                                            :value-persist="true"
                                            :drop-shadow="true"
                                            :selection-max-content="true"
                                            :searchable="false"
                                            :selection-float="true"
                                            :always-active="false"
                                            :size="'md'"
                                            :selection-max-viewable-line="8"
                                            :icon="tabGroup.icon"
                                            :options="singleSelectPrototype"/>

                                        <!-- Input -->
                                        <Input :glint="true" :placeholder="'Enter value'" :size="'md'" type="text" autocomplete="off" />

                                        <!-- Input with icon -->
                                        <InputWithIcon
                                            :glint="true"
                                            :size="'md'"
                                            :icon="tabGroup.icon"
                                            :placeholder="'Enter value'"
                                            autocomplete="off" />

                                        <!-- Button with icon, label -->
                                        <Button :glint="true" class="tw-w-full" :size="'md'" :icon="tabGroup.icon" :variant="'default'" :label="'Button'" />
                                        <Button :glint="true" class="tw-w-3/4"  :size="'md'" :icon="tabGroup.icon" :variant="'flat'" :label="'Button'" />
                                        <Button :glint="true" class="tw-w-1/2"  :size="'md'" :icon="tabGroup.icon" :variant="'outline'" :label="'Button'" />

                                        <!-- Button with icon, no label -->
                                        <Button :glint="true" class="tw-w-full" :size="'md'" :icon="tabGroup.icon" :variant="'default'" :label="''" />
                                        <Button :glint="true" class="tw-w-3/4"  :size="'md'" :icon="tabGroup.icon" :variant="'flat'" :label="''" />
                                        <Button :glint="true" class="tw-w-1/2"  :size="'md'" :icon="tabGroup.icon" :variant="'outline'" :label="''" />

                                        <!-- Button with icon, no label, minimum width -->
                                        <div class="tw-w-min"><Button :glint="true" :size="'md'" :icon="tabGroup.icon" :variant="'default'" :label="''" /></div>
                                        <div class="tw-w-min"><Button :glint="true" :size="'md'" :icon="tabGroup.icon" :variant="'outline'" :label="''" /></div>
                                        <div class="tw-w-min"><Button :glint="true" :size="'md'" :icon="tabGroup.icon" :variant="'flat'" :label="''" /></div>
                                    </div>
                                </div>

                                <div v-if="true" class="tw-relative">
                                    <div v-if="true" class="tw-absolute tw-w-[0.2px] tw-top-0 tw-bottom-0 tw-bg-slate-400 tw-z-50 tw-ml-[0.95rem]"></div>
                                    <div v-if="true" class="tw-absolute tw-w-[0.2px] tw-top-0 tw-bottom-0 tw-bg-slate-400 tw-z-50 tw-ml-[2.59rem]"></div>

                                    <div class="tw-space-y-1">
                                        <MultiSelectPaginated
                                            :glint="true"
                                            :drop-shadow="true"
                                            :selection-max-content="false"
                                            :selected-max-viewable-line="6"
                                            :selection-max-viewable-line="10"
                                            :searchable="false"
                                            :selection-float="true"
                                            :always-active="false"
                                            :label="'Select Prototypes'"
                                            :size="'lg'"
                                            :payload="multiSelectPrototypePayload"
                                            :icon="tabGroup.icon"/>
                                        <InputWithIcon :glint="true" :size="'lg'" :icon="tabGroup.icon" :placeholder="'Enter value'" autocomplete="off" />
                                        <MultiSelect
                                            :glint="true"
                                            drop-shadow
                                            :searchable="false"
                                            :selection-float="true"
                                            :always-active="false"
                                            :selection-max-viewable-line="5"
                                            :size="'lg'"
                                            :options="category"
                                            :icon="tabGroup.icon"/>
                                        <SingleSelectPaginated
                                            :glint="true"
                                            :value-persist="true"
                                            :drop-shadow="true"
                                            :selection-max-content="true"
                                            :selection-max-viewable-line="10"
                                            :searchable="false"
                                            :selection-float="true"
                                            :always-active="false"
                                            :label="'Select Prototype'"
                                            :size="'lg'"
                                            :payload="singleSelectPrototypePayload"
                                            :icon="tabGroup.icon"/>
                                        <SingleSelect
                                            :glint="true"
                                            :value-persist="true"
                                            :drop-shadow="true"
                                            :selection-max-content="true"
                                            :searchable="false"
                                            :selection-float="true"
                                            :always-active="false"
                                            :size="'lg'"
                                            :selection-max-viewable-line="8"
                                            :icon="tabGroup.icon"
                                            :options="singleSelectPrototype"/>

                                        <!-- Input -->
                                        <Input :glint="true" :placeholder="'Enter value'" :size="'lg'" type="text" autocomplete="off" />

                                        <!-- Input with icon -->
                                        <InputWithIcon
                                            :glint="true"
                                            :size="'lg'"
                                            :icon="tabGroup.icon"
                                            :placeholder="'Enter value'"
                                            autocomplete="off" />

                                        <!-- Button with icon, label -->
                                        <Button :glint="true" class="tw-w-full" :size="'lg'" :icon="tabGroup.icon" :variant="'default'" :label="'Button'" />
                                        <Button :glint="true" class="tw-w-3/4"  :size="'lg'" :icon="tabGroup.icon" :variant="'flat'" :label="'Button'" />
                                        <Button :glint="true" class="tw-w-1/2"  :size="'lg'" :icon="tabGroup.icon" :variant="'outline'" :label="'Button'" />

                                        <!-- Button with icon, no label -->
                                        <Button :glint="true" class="tw-w-full" :size="'lg'" :icon="tabGroup.icon" :variant="'default'" :label="''" />
                                        <Button :glint="true" class="tw-w-3/4"  :size="'lg'" :icon="tabGroup.icon" :variant="'flat'" :label="''" />
                                        <Button :glint="true" class="tw-w-1/2"  :size="'lg'" :icon="tabGroup.icon" :variant="'outline'" :label="''" />

                                        <!-- Button with icon, no label, minimum width -->
                                        <div class="tw-w-min"><Button :glint="true" :size="'lg'" :icon="tabGroup.icon" :variant="'default'" :label="''" /></div>
                                        <div class="tw-w-min"><Button :glint="true" :size="'lg'" :icon="tabGroup.icon" :variant="'outline'" :label="''" /></div>
                                        <div class="tw-w-min"><Button :glint="true" :size="'lg'" :icon="tabGroup.icon" :variant="'flat'" :label="''" /></div>
                                    </div>
                                </div>

                                <div v-if="true" class="tw-relative">
                                    <div v-if="true" class="tw-absolute tw-w-[0.2px] tw-top-0 tw-bottom-0 tw-bg-slate-400 tw-z-50 tw-ml-[0.95rem]"></div>
                                    <div v-if="true" class="tw-absolute tw-w-[0.2px] tw-top-0 tw-bottom-0 tw-bg-slate-400 tw-z-50 tw-ml-[2.72rem]"></div>

                                    <div class="tw-space-y-1">
                                        <!-- Input -->
                                        <Input :glint="true" :placeholder="'Enter value'" :size="'xl'" type="text" autocomplete="off" />

                                        <!-- Input with icon -->
                                        <InputWithIcon
                                            :glint="true"
                                            :size="'xl'"
                                            :icon="tabGroup.icon"
                                            :placeholder="'Enter value'"
                                            autocomplete="off" />

                                        <!-- Button with icon, label -->
                                        <Button :glint="true" class="tw-w-full" :size="'xl'" :icon="tabGroup.icon" :variant="'default'" :label="'Button'" />
                                        <Button :glint="true" class="tw-w-3/4"  :size="'xl'" :icon="tabGroup.icon" :variant="'flat'" :label="'Button'" />
                                        <Button :glint="true" class="tw-w-1/2"  :size="'xl'" :icon="tabGroup.icon" :variant="'outline'" :label="'Button'" />

                                        <!-- Button with icon, no label -->
                                        <Button :glint="true" class="tw-w-full" :size="'xl'" :icon="tabGroup.icon" :variant="'default'" :label="''" />
                                        <Button :glint="true" class="tw-w-3/4"  :size="'xl'" :icon="tabGroup.icon" :variant="'flat'" :label="''" />
                                        <Button :glint="true" class="tw-w-1/2"  :size="'xl'" :icon="tabGroup.icon" :variant="'outline'" :label="''" />

                                        <!-- Button with icon, no label, minimum width -->
                                        <div class="tw-w-min"><Button :glint="true" :size="'xl'" :icon="tabGroup.icon" :variant="'default'" :label="''" /></div>
                                        <div class="tw-w-min"><Button :glint="true" :size="'xl'" :icon="tabGroup.icon" :variant="'outline'" :label="''" /></div>
                                        <div class="tw-w-min"><Button :glint="true" :size="'xl'" :icon="tabGroup.icon" :variant="'flat'" :label="''" /></div>
                                    </div>
                                </div>

                                <div v-if="true" class="tw-relative">
                                    <div v-if="true" class="tw-absolute tw-w-[0.2px] tw-top-0 tw-bottom-0 tw-bg-slate-400 tw-z-50 tw-ml-[1.3rem]"></div>
                                    <div v-if="true" class="tw-absolute tw-w-[0.2px] tw-top-0 tw-bottom-0 tw-bg-slate-400 tw-z-50 tw-ml-[3.7rem]"></div>

                                    <div class="tw-space-y-1">
                                        <!-- Input -->
                                        <Input :glint="true" :placeholder="'Enter value'" :size="'2xl'" type="text" autocomplete="off" />

                                        <!-- Input with icon -->
                                        <InputWithIcon
                                            :glint="true"
                                            :size="'2xl'"
                                            :icon="tabGroup.icon"
                                            :placeholder="'Enter value'"
                                            autocomplete="off" />

                                        <!-- Button with icon, label -->
                                        <Button :glint="true" class="tw-w-full" :size="'2xl'" :icon="tabGroup.icon" :variant="'default'" :label="'Button'" />
                                        <Button :glint="true" class="tw-w-3/4"  :size="'2xl'" :icon="tabGroup.icon" :variant="'flat'" :label="'Button'" />
                                        <Button :glint="true" class="tw-w-1/2"  :size="'2xl'" :icon="tabGroup.icon" :variant="'outline'" :label="'Button'" />

                                        <!-- Button with icon, no label -->
                                        <Button :glint="true" class="tw-w-full" :size="'2xl'" :icon="tabGroup.icon" :variant="'default'" :label="''" />
                                        <Button :glint="true" class="tw-w-3/4"  :size="'2xl'" :icon="tabGroup.icon" :variant="'flat'" :label="''" />
                                        <Button :glint="true" class="tw-w-1/2"  :size="'2xl'" :icon="tabGroup.icon" :variant="'outline'" :label="''" />

                                        <!-- Button with icon, no label, minimum width -->
                                        <div class="tw-w-min"><Button :glint="true" :size="'2xl'" :icon="tabGroup.icon" :variant="'default'" :label="''" /></div>
                                        <div class="tw-w-min"><Button :glint="true" :size="'2xl'" :icon="tabGroup.icon" :variant="'outline'" :label="''" /></div>
                                        <div class="tw-w-min"><Button :glint="true" :size="'2xl'" :icon="tabGroup.icon" :variant="'flat'" :label="''" /></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Button and Input Horizontal Alignment -->
                    <div v-if="false">
                        <div class="tw-my-4 tw-flex tw-justify-center tw-space-x-1.5">
                            <Button :size="tabGroup.size" :icon="tabGroup.icon" :label="'Default'" />
                            <Button :size="tabGroup.size" :icon="tabGroup.icon" :variant="'outline'" :label="'Outline'" />
                            <Button :size="tabGroup.size" :icon="tabGroup.icon" :variant="'flat'" :label="'Flat'" />
                            <Button :size="tabGroup.size" :icon="tabGroup.icon" :variant="'flat'" disabled :label="'Flat'" />
                            <InputWithIcon ref="inputValue" :size="tabGroup.size" :icon="tabGroup.icon" :placeholder="'Enter value'" autocomplete="off" />
                        </div>
                    </div>

                    <!-- Default Button -->
                    <div v-if="true" class="tw-grid tw-gap-2 tw-grid-cols-3 sm:tw-grid-cols-4 lg:tw-grid-cols-6 xl:tw-grid-cols-12 2xl:tw-grid-cols-12">
                        <div class="tw-flex tw-items-start tw-justify-start tw-block neutral-border">
                            <Button :size="'2xs'" :icon="'ic:sharp-send-to-mobile'" :label="'XXS Button'"></Button>
                        </div>
                        <div class="tw-flex tw-items-start tw-justify-start tw-block neutral-border">
                            <Button :size="'xs'" :icon="'ic:sharp-send-to-mobile'" :label="'XS Button'"></Button>
                        </div>
                        <div class="tw-col-span-2 tw-flex tw-items-start tw-justify-start tw-block neutral-border">
                            <Button :size="'sm'" :icon="'ic:sharp-send-to-mobile'" @click="showPrompt" :label="'SM Show Prompt'"></Button>
                        </div>
                        <div class="tw-col-span-2 tw-flex tw-items-start tw-justify-start tw-block neutral-border">
                            <Button :size="'md'" :icon="'ic:sharp-send-to-mobile'" @click="showServiceError" :label="'MD Show Service Error'"></Button>
                        </div>
                        <div class="tw-flex tw-items-start tw-justify-start tw-block neutral-border">
                            <Button :disabled="true" :icon="'eos-icons:compass'" :label="'Disabled'"></Button>
                        </div>
                        <div class="tw-col-span-2 tw-flex tw-items-start tw-justify-start tw-block tw-w-full neutral-border">
                            <Button @click="$themeStore.setTheme('blue')" :size="'lg'" :icon="'mdi:palette-swatch-variant'" :label="'Blue Theme'"></Button>
                        </div>
                        <div class="tw-col-span-3 tw-flex tw-items-start tw-justify-start tw-block tw-w-full neutral-border">
                            <Button @click="$themeStore.setTheme('tulip')" :size="'xl'" :icon="'eos-icons:atom-electron'" :label="'Tulip Theme'"></Button>
                        </div>
                    </div>

                    <!-- Outline Button -->
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

                    <!-- Flat Button -->
                    <div v-if="false" class="tw-grid tw-gap-2 tw-grid-cols-1 sm:tw-grid-cols-2 lg:tw-grid-cols-5 xl:tw-grid-cols-6 2xl:tw-grid-cols-9">
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
                            <Button :variant="'flat'" :flat-border-color="threadColor.value" :size="'md'" :icon="'ic:sharp-dashboard'" :label="'MD Authenticate'"></Button>
                        </div>
                        <div class="tw-flex tw-items-start tw-justify-start tw-block neutral-border">
                            <Button :variant="'flat'" :flat-border-color="liningColor.value" :icon="'eos-icons:compass'" :label="'Disabled'"></Button>
                        </div>
                        <div class="tw-col-span-2 tw-flex tw-items-start tw-justify-start tw-block tw-w-full neutral-border">
                            <Button @click="$themeStore.setTheme('emerald')" :variant="'flat'" :size="'lg'" :icon="'mdi:palette-swatch-variant'" :disabled="true" :label="'Emerald Theme'"></Button>
                        </div>
                        <div class="tw-col-span-2 tw-flex tw-items-start tw-justify-start tw-block tw-w-full neutral-border">
                            <Button :variant="'flat'" :size="'xl'" :icon="'eos-icons:atom-electron'" :label="'XL Authenticate'"></Button>
                        </div>
                    </div>

                    <!-- Hero Plate -->
                    <div v-if="false" class=" tw-p-2 neutral-border">
                        <InputLabel class="tw-mb-2" :size="'md'" value="Hero Plate" />
                        <div class="tw-gap-2 tw-flex tw-items-start tw-justify-start tw-flex-wrap">
                            <div >
                                <div>
                                    <HeroPlate :size="'sm'" :bookmark="'FOR YOU'" :label="'B760M-MEOW'"/>
                                </div>
                                <div>
                                    <HeroPlate :size="'md'" :bookmark="'FOR YOU'" :label="'B760M-MEOW'"/>
                                </div>
                                <div>
                                    <HeroPlate :size="'lg'" :bookmark="'FOR YOU'" :label="'B760M-MEOW'"/>
                                </div>
                            </div>

                            <div>
                                <div>
                                    <HeroPlate :size="'sm'" :bookmark="'NEW ARRIVAL'" :theme="'gold'" :label="'COLORFIRE Meow Series'"/>
                                </div>
                                <div>
                                    <HeroPlate :size="'md'" :bookmark="'NEW ARRIVAL'" :theme="'gold'" :label="'COLORFIRE Meow Series'"/>
                                </div>
                                <div>
                                    <HeroPlate :size="'lg'" :bookmark="'NEW ARRIVAL'" :theme="'gold'" :label="'COLORFIRE Meow Series'"/>
                                </div>
                            </div>

                            <div>
                                <div>
                                    <HeroPlate :size="'sm'" :bookmark="'TRENDING'" :theme="'strawberry'" :label="'RTX 4060 MEOW-ORG'"/>
                                </div>
                                <div>
                                    <HeroPlate :size="'md'" :bookmark="'TRENDING'" :theme="'strawberry'" :label="'RTX 4060 MEOW-ORG'"/>
                                </div>
                                <div>
                                    <HeroPlate :size="'lg'" :bookmark="'TRENDING'" :theme="'strawberry'" :label="'RTX 4060 MEOW-ORG'"/>
                                </div>
                            </div>

                            <div>
                                <div>
                                    <HeroPlate :size="'sm'" :bookmark="'PC CASE'" :theme="'tulip'" :label="'Segotep Memphis-S'"/>
                                </div>
                                <div>
                                    <HeroPlate :size="'md'" :bookmark="'PC CASE'" :theme="'tulip'" :label="'Segotep Memphis-S'"/>
                                </div>
                                <div>
                                    <HeroPlate :size="'lg'" :bookmark="'PC CASE'" :theme="'tulip'" :label="'Segotep Memphis-S'"/>
                                </div>
                            </div>

                            <div>
                                <div>
                                    <HeroPlate :size="'sm'" :bookmark="'PC CASE'" :theme="'emerald'" :label="'Segotep Memphis-S'"/>
                                </div>
                                <div>
                                    <HeroPlate :size="'md'" :bookmark="'PC CASE'" :theme="'emerald'" :label="'Segotep Memphis-S'"/>
                                </div>
                                <div>
                                    <HeroPlate :size="'lg'" :bookmark="'PC CASE'" :theme="'emerald'" :label="'Segotep Memphis-S'"/>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Accordion -->
                    <div v-if="false" class="tw-grid tw-gap-2 tw-grid-cols-1 sm:tw-grid-cols-1 lg:tw-grid-cols-3 xl:tw-grid-cols-3 2xl:tw-grid-cols-3">
                        <div>
                            <InputLabel :size="'md'" value="MD : Accordion Single Expand" />
                            <Accordion :size="'md'" :single-expand="true" v-model:payload="accordionSingleExpand" />
                        </div>
                        <div>
                            <InputLabel :size="'md'" value="MD : Accordion Multi Expand" />
                            <Accordion :size="'md'" class="tw-space-y-4" v-model:payload="accordionMultiExpand" />
                        </div>
                        <div>
                            <InputLabel :size="'md'" value="LG : Accordion Multi Expand" />
                            <Accordion :size="'lg'" class="tw-space-y-4" v-model:payload="accordionMultiExpand" />
                        </div>
                    </div>

                    <!-- Checkbox -->
                    <div v-if="false" class="tw-grid tw-gap-2 tw-grid-cols-1 sm:tw-grid-cols-2 lg:tw-grid-cols-5 xl:tw-grid-cols-6 2xl:tw-grid-cols-8">
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

                    <!-- Checkbox Group -->
                    <div v-if="false" class="tw-grid tw-gap-2 tw-grid-cols-1 sm:tw-grid-cols-2 lg:tw-grid-cols-5 xl:tw-grid-cols-6 2xl:tw-grid-cols-8">
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

                    <!-- Radio Group -->
                    <div v-if="false" class="tw-grid tw-gap-2 tw-grid-cols-1 sm:tw-grid-cols-2 lg:tw-grid-cols-5 xl:tw-grid-cols-6 2xl:tw-grid-cols-8">
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

                    <!-- Default Input -->
                    <div v-if="false" class="tw-grid tw-gap-2 tw-grid-cols-1 sm:tw-grid-cols-2 lg:tw-grid-cols-5 xl:tw-grid-cols-6 2xl:tw-grid-cols-8">
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

                    <!-- Input with Icon -->
                    <div v-if="false" class="tw-grid tw-gap-2 tw-grid-cols-1 sm:tw-grid-cols-2 lg:tw-grid-cols-5 xl:tw-grid-cols-6 2xl:tw-grid-cols-8">
                        <div class="tw-block neutral-border">
                            <InputLabel :size="'2xs'" for="form_input_1" value="XXS Label" />
                            <InputWithIcon :size="'2xs'" :icon="'ic:sharp-qr-code'" placeholder="Enter username" id="form_input_1" autocomplete="off" />
                        </div>
                        <div class="tw-block neutral-border">
                            <InputLabel :size="'xs'" for="form_input_2" value="XS Label" />
                            <InputWithIcon :size="'xs'" :icon="'ic:sharp-qr-code'" placeholder="Enter username" id="form_input_2" autocomplete="off" />
                        </div>
                        <div class="tw-block neutral-border">
                            <InputLabel :size="'sm'" for="form_input_3" value="SM Label" />
                            <InputWithIcon :size="'sm'" :icon="'ic:sharp-qr-code'" placeholder="Enter username" id="form_input_3" autocomplete="off" />
                        </div>
                        <div class="tw-block neutral-border">
                            <InputLabel :size="'md'" for="form_input_4" value="MD Label" />
                            <InputWithIcon :size="'md'" :icon="'ic:sharp-qr-code'" placeholder="Enter username" id="form_input_4" autocomplete="off" />
                        </div>
                        <div class="tw-block neutral-border">
                            <InputLabel :size="'md'" for="form_input_5" value="MD Label" />
                            <InputWithIcon :size="'md'" :icon="'ic:sharp-qr-code'" disabled placeholder="Disabled" id="form_input_4" autocomplete="off" />
                        </div>
                        <div class="tw-block neutral-border">
                            <InputLabel :size="'lg'" for="form_input_6" value="LG Label" />
                            <InputWithIcon :size="'lg'" :icon="'ic:sharp-qr-code'" placeholder="Enter username" id="form_input_5" autocomplete="off" />
                        </div>
                        <div class="tw-col-span-2 tw-block neutral-border">
                            <InputLabel :size="'xl'" for="form_input_7" value="XL Label" />
                            <InputWithIcon :size="'xl'" :icon="'ic:sharp-qr-code'" placeholder="Enter username" id="form_input_6" autocomplete="off" />
                        </div>
                    </div>

                    <!-- Typography -->
                    <div v-if="false" class="tw-grid tw-gap-2 tw-grid-cols-1 sm:tw-grid-cols-2 lg:tw-grid-cols-5 xl:tw-grid-cols-6 2xl:tw-grid-cols-8">
                        <div class="tw-block neutral-border tw-col-span-2">
                            <p class="tw-text-sm tw-leading-4">0123456789 (){}[] +-*/= .,;:!? #&$%@|^#[ |||> |= ~@/\\/* Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus nec facilisis lacus. Phasellus convallis commodo lorem. Nam vitae dignissim elit.</p>
                        </div>
                        <div class="tw-block neutral-border tw-col-span-2">
                            <p class="tw-text-base tw-leading-4">0123456789 (){}[] +-*/= .,;:!? #&$%@|^#[ |||> |= ~@/\\/* Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus nec facilisis lacus. Phasellus convallis commodo lorem. Nam vitae dignissim elit.</p>
                        </div>
                        <div class="tw-block neutral-border tw-col-span-2">
                            <p class="tw-text-lg tw-leading-5">0123456789 (){}[] +-*/= .,;:!? #&$%@|^#[ |||> |= ~@/\\/* Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus nec facilisis lacus. Phasellus convallis commodo lorem. Nam vitae dignissim elit.</p>
                        </div>
                        <div class="tw-block neutral-border tw-col-span-2">
                            <p class="tw-text-xl tw-leading-6">0123456789 (){}[] +-*/= .,;:!? #&$%@|^#[ |||> |= ~@/\\/* Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus nec facilisis lacus. Phasellus convallis commodo lorem. Nam vitae dignissim elit.</p>
                        </div>
                    </div>

                    <!-- Font Weights -->
                    <div v-if="false" class="tw-grid tw-gap-2 tw-grid-cols-1 sm:tw-grid-cols-2 lg:tw-grid-cols-5 xl:tw-grid-cols-6 2xl:tw-grid-cols-8">
                        <div class="tw-block neutral-border tw-col-span-2">
                            <p class="tw-text-sm tw-font-thin tw-leading-4">Thin: 0123456789 (){}[] +-*/= .,;:!? #&$%@|^#[ |||> |= ~@/\\/* Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus nec facilisis lacus. Phasellus convallis commodo lorem. Nam vitae dignissim elit.</p>
                            <br><p class="tw-text-sm tw-font-extralight tw-leading-4">Extra Light: 0123456789 (){}[] +-*/= .,;:!? #&$%@|^#[ |||> |= ~@/\\/* Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus nec facilisis lacus. Phasellus convallis commodo lorem. Nam vitae dignissim elit.</p>
                            <br><p class="tw-text-sm tw-font-light tw-leading-4">Light: 0123456789 (){}[] +-*/= .,;:!? #&$%@|^#[ |||> |= ~@/\\/* Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus nec facilisis lacus. Phasellus convallis commodo lorem. Nam vitae dignissim elit.</p>
                            <br><p class="tw-text-sm tw-font-normal tw-leading-4">Normal: 0123456789 (){}[] +-*/= .,;:!? #&$%@|^#[ |||> |= ~@/\\/* Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus nec facilisis lacus. Phasellus convallis commodo lorem. Nam vitae dignissim elit.</p>
                            <br><p class="tw-text-sm tw-font-medium tw-leading-4">Medium: 0123456789 (){}[] +-*/= .,;:!? #&$%@|^#[ |||> |= ~@/\\/* Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus nec facilisis lacus. Phasellus convallis commodo lorem. Nam vitae dignissim elit.</p>
                            <br><p class="tw-text-sm tw-font-semibold tw-leading-4">Semibold: 0123456789 (){}[] +-*/= .,;:!? #&$%@|^#[ |||> |= ~@/\\/* Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus nec facilisis lacus. Phasellus convallis commodo lorem. Nam vitae dignissim elit.</p>
                            <br><p class="tw-text-sm tw-font-bold tw-leading-4">Bold: 0123456789 (){}[] +-*/= .,;:!? #&$%@|^#[ |||> |= ~@/\\/* Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus nec facilisis lacus. Phasellus convallis commodo lorem. Nam vitae dignissim elit.</p>
                            <br><p class="tw-text-sm tw-font-extrabold tw-leading-4">Extra Bold: 0123456789 (){}[] +-*/= .,;:!? #&$%@|^#[ |||> |= ~@/\\/* Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus nec facilisis lacus. Phasellus convallis commodo lorem. Nam vitae dignissim elit.</p>
                            <br><p class="tw-text-sm tw-font-black tw-leading-4">Black: 0123456789 (){}[] +-*/= .,;:!? #&$%@|^#[ |||> |= ~@/\\/* Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus nec facilisis lacus. Phasellus convallis commodo lorem. Nam vitae dignissim elit.</p>
                        </div>
                        <div class="tw-block neutral-border tw-col-span-2">
                            <p class="tw-text-base tw-font-thin tw-leading-4">Thin: 0123456789 (){}[] +-*/= .,;:!? #&$%@|^#[ |||> |= ~@/\\/* Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus nec facilisis lacus. Phasellus convallis commodo lorem. Nam vitae dignissim elit.</p>
                            <br><p class="tw-text-base tw-font-extralight tw-leading-4">Extra Light: 0123456789 (){}[] +-*/= .,;:!? #&$%@|^#[ |||> |= ~@/\\/* Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus nec facilisis lacus. Phasellus convallis commodo lorem. Nam vitae dignissim elit.</p>
                            <br><p class="tw-text-base tw-font-light tw-leading-4">Light: 0123456789 (){}[] +-*/= .,;:!? #&$%@|^#[ |||> |= ~@/\\/* Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus nec facilisis lacus. Phasellus convallis commodo lorem. Nam vitae dignissim elit.</p>
                            <br><p class="tw-text-base tw-font-normal tw-leading-4">Normal: 0123456789 (){}[] +-*/= .,;:!? #&$%@|^#[ |||> |= ~@/\\/* Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus nec facilisis lacus. Phasellus convallis commodo lorem. Nam vitae dignissim elit.</p>
                            <br><p class="tw-text-base tw-font-medium tw-leading-4">Medium: 0123456789 (){}[] +-*/= .,;:!? #&$%@|^#[ |||> |= ~@/\\/* Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus nec facilisis lacus. Phasellus convallis commodo lorem. Nam vitae dignissim elit.</p>
                            <br><p class="tw-text-base tw-font-semibold tw-leading-4">Semibold: 0123456789 (){}[] +-*/= .,;:!? #&$%@|^#[ |||> |= ~@/\\/* Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus nec facilisis lacus. Phasellus convallis commodo lorem. Nam vitae dignissim elit.</p>
                            <br><p class="tw-text-base tw-font-bold tw-leading-4">Bold: 0123456789 (){}[] +-*/= .,;:!? #&$%@|^#[ |||> |= ~@/\\/* Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus nec facilisis lacus. Phasellus convallis commodo lorem. Nam vitae dignissim elit.</p>
                            <br><p class="tw-text-base tw-font-extrabold tw-leading-4">Extra Bold: 0123456789 (){}[] +-*/= .,;:!? #&$%@|^#[ |||> |= ~@/\\/* Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus nec facilisis lacus. Phasellus convallis commodo lorem. Nam vitae dignissim elit.</p>
                            <br><p class="tw-text-base tw-font-black tw-leading-4">Black: 0123456789 (){}[] +-*/= .,;:!? #&$%@|^#[ |||> |= ~@/\\/* Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus nec facilisis lacus. Phasellus convallis commodo lorem. Nam vitae dignissim elit.</p>
                        </div>
                        <div class="tw-block neutral-border tw-col-span-2">
                            <p class="tw-text-lg tw-font-thin tw-leading-5">Thin: 0123456789 (){}[] +-*/= .,;:!? #&$%@|^#[ |||> |= ~@/\\/* Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus nec facilisis lacus. Phasellus convallis commodo lorem. Nam vitae dignissim elit.</p>
                            <br><p class="tw-text-lg tw-font-extralight tw-leading-5">Extra Light: 0123456789 (){}[] +-*/= .,;:!? #&$%@|^#[ |||> |= ~@/\\/* Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus nec facilisis lacus. Phasellus convallis commodo lorem. Nam vitae dignissim elit.</p>
                            <br><p class="tw-text-lg tw-font-light tw-leading-5">Light: 0123456789 (){}[] +-*/= .,;:!? #&$%@|^#[ |||> |= ~@/\\/* Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus nec facilisis lacus. Phasellus convallis commodo lorem. Nam vitae dignissim elit.</p>
                            <br><p class="tw-text-lg tw-font-normal tw-leading-5">Normal: 0123456789 (){}[] +-*/= .,;:!? #&$%@|^#[ |||> |= ~@/\\/* Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus nec facilisis lacus. Phasellus convallis commodo lorem. Nam vitae dignissim elit.</p>
                            <br><p class="tw-text-lg tw-font-medium tw-leading-5">Medium: 0123456789 (){}[] +-*/= .,;:!? #&$%@|^#[ |||> |= ~@/\\/* Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus nec facilisis lacus. Phasellus convallis commodo lorem. Nam vitae dignissim elit.</p>
                            <br><p class="tw-text-lg tw-font-semibold tw-leading-5">Semibold: 0123456789 (){}[] +-*/= .,;:!? #&$%@|^#[ |||> |= ~@/\\/* Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus nec facilisis lacus. Phasellus convallis commodo lorem. Nam vitae dignissim elit.</p>
                            <br><p class="tw-text-lg tw-font-bold tw-leading-5">Bold: 0123456789 (){}[] +-*/= .,;:!? #&$%@|^#[ |||> |= ~@/\\/* Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus nec facilisis lacus. Phasellus convallis commodo lorem. Nam vitae dignissim elit.</p>
                            <br><p class="tw-text-lg tw-font-extrabold tw-leading-5">Extra Bold: 0123456789 (){}[] +-*/= .,;:!? #&$%@|^#[ |||> |= ~@/\\/* Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus nec facilisis lacus. Phasellus convallis commodo lorem. Nam vitae dignissim elit.</p>
                            <br><p class="tw-text-lg tw-font-black tw-leading-5">Black: 0123456789 (){}[] +-*/= .,;:!? #&$%@|^#[ |||> |= ~@/\\/* Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus nec facilisis lacus. Phasellus convallis commodo lorem. Nam vitae dignissim elit.</p>
                        </div>
                        <div class="tw-block neutral-border tw-col-span-2">
                            <p class="tw-text-xl tw-font-extralight tw-leading-6">Thin: 0123456789 (){}[] +-*/= .,;:!? #&$%@|^#[ |||> |= ~@/\\/* Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus nec facilisis lacus. Phasellus convallis commodo lorem. Nam vitae dignissim elit.</p>
                            <br><p class="tw-text-xl tw-font-light tw-leading-6">Extra Light: 0123456789 (){}[] +-*/= .,;:!? #&$%@|^#[ |||> |= ~@/\\/* Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus nec facilisis lacus. Phasellus convallis commodo lorem. Nam vitae dignissim elit.</p>
                            <br><p class="tw-text-xl tw-font-normal tw-leading-6">Normal: 0123456789 (){}[] +-*/= .,;:!? #&$%@|^#[ |||> |= ~@/\\/* Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus nec facilisis lacus. Phasellus convallis commodo lorem. Nam vitae dignissim elit.</p>
                            <br><p class="tw-text-xl tw-font-medium tw-leading-6">Medium: 0123456789 (){}[] +-*/= .,;:!? #&$%@|^#[ |||> |= ~@/\\/* Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus nec facilisis lacus. Phasellus convallis commodo lorem. Nam vitae dignissim elit.</p>
                            <br><p class="tw-text-xl tw-font-semibold tw-leading-6">Semibold: 0123456789 (){}[] +-*/= .,;:!? #&$%@|^#[ |||> |= ~@/\\/* Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus nec facilisis lacus. Phasellus convallis commodo lorem. Nam vitae dignissim elit.</p>
                            <br><p class="tw-text-xl tw-font-bold tw-leading-6">Bold: 0123456789 (){}[] +-*/= .,;:!? #&$%@|^#[ |||> |= ~@/\\/* Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus nec facilisis lacus. Phasellus convallis commodo lorem. Nam vitae dignissim elit.</p>
                            <br><p class="tw-text-xl tw-font-extrabold tw-leading-6">Extra Bold: 0123456789 (){}[] +-*/= .,;:!? #&$%@|^#[ |||> |= ~@/\\/* Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus nec facilisis lacus. Phasellus convallis commodo lorem. Nam vitae dignissim elit.</p>
                            <br><p class="tw-text-xl tw-font-black tw-leading-6">Black: 0123456789 (){}[] +-*/= .,;:!? #&$%@|^#[ |||> |= ~@/\\/* Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus nec facilisis lacus. Phasellus convallis commodo lorem. Nam vitae dignissim elit.</p>
                        </div>
                    </div>
                </div>
            </div>
        </DefaultWrapper>
    </div>
</template>

<script setup lang="ts">
import dataPayload from '@/public/data/payload.js';
definePageMeta({middleware: 'auth'});
useLayout().setNavigationMode('solid', 'Prototype.vue');

const clientReadyState = useClientReadyState();
import {storeToRefs} from 'pinia';
const {$themeStore, $formStore} = useNuxtApp();
const {
    thread: threadColor,
    lining: liningColor,
    neutral: neutralColor
} = storeToRefs($themeStore);

let tabGroup = reactive({
    'icon' : 'ic:sharp-check-box-outline-blank',
    'size' : 'md'
});

function showPrompt(){
    useNuxtApp().$promptStore.setPrompt({
        icon: 'mdi:connection',
        title: 'Title',
        message: 'Message.',
        action: {
            callback: () => {
                alert('Prompt callback');
            },
            label: 'Close'
        }
    });
}
function showServiceError(){
    useNuxtApp().$coreStore.setServiceError({
        prompt: true,
        icon: 'mdi:connection',
        title: 'Service Error',
        payload: {
            'message': 'Example message',
            'errors': [
                'error 1',
                'error 2',
            ]
        }
    });
}

const ofetchData = ref('');
const ofetchPending = ref(false);
const ofetchNoPromptData = ref('');
const ofetchNoPromptPending = ref(false);

async function oFetchPost(){
    ofetchData.value = '';
    ofetchPending.value = true;

    await laraFetch("/api/test-post", {
        method: 'POST',
    }, {
        onRequest: () => {
            console.log("CALLBACK ON REQUEST");
        },
        onRequestError: () => {
            console.log("CALLBACK ON REQUEST ERROR");
            ofetchPending.value = false;
        },
        onResponse: (request, response, options) => {
            console.log("CALLBACK ON RESPONSE");
            ofetchPending.value = false;
            ofetchData.value = response._data;
        },
        onSuccessResponse: (request, response, options) => {
            console.log("CALLBACK ON SUCCESS RESPONSE");
        },
        onNotAcceptableResponse: (request, response, options) => {
            console.log("CALLBACK ON NOT ACCEPTABLE RESPONSE");
        }
    });
}
async function oFetchNoPromptPost(){
    ofetchNoPromptData.value = '';
    ofetchNoPromptPending.value = true;

    await laraFetch("/api/test-post", {
        method: 'POST',
    }, {
        onRequestError: () => {
            ofetchNoPromptPending.value = false;
        },
        onResponse: (request, response, options) => {
            ofetchNoPromptPending.value = false;
            ofetchNoPromptData.value = response._data;
        }
    }, false);
}

const useFetchData = ref('');
const {
    pending: useFetchPending,
    execute: useFetchPost,
} = await laraUseFetch("/api/test-post", {
    lazy: false,
    method: 'POST',
}, {
    onRequest: async () => {
        console.log("CALLBACK ON REQUEST");
    },
    onRequestError: async () => {
        console.log("CALLBACK ON REQUEST ERROR");
    },
    onResponse: async (request, response, options) => {
        console.log("CALLBACK ON RESPONSE");
    },
    onSuccessResponse: async (request, response, options) => {
        console.log("CALLBACK ON SUCCESS RESPONSE");
        useFetchData.value = _get(response, "_data", '');
    },
    onNotAcceptableResponse: async (request, response, options) => {
        console.log("CALLBACK ON NOT ACCEPTABLE RESPONSE");
        useFetchData.value = _get(response, "_data", '');
    }
}, true);

let formStore = $formStore;
let remember1 = ref(null);
let remember2 = ref(true);
let remember3 = ref(1);
let remember4 = ref('1');
let categorySelection = reactive(dataPayload['prototype']['categorySelection']);
let statusGroup = reactive(dataPayload['prototype']['statusGroup']);
let transactionGroup = reactive(dataPayload['prototype']['transactionGroup']);
let genderGroup = reactive(dataPayload['prototype']['genderGroup']);
let categoryGroup = reactive(dataPayload['prototype']['categoryGroup']);
let accordionSingleExpand  = reactive(dataPayload['prototype']['accordionSingleExpand']);
let accordionMultiExpand  = reactive(dataPayload['prototype']['accordionMultiExpand']);
let category = reactive(dataPayload['prototype']['category']);
let plan = reactive(dataPayload['prototype']['plan']);
let perPage = reactive(dataPayload['prototype']['perPage']);
let bookingType = reactive(dataPayload['prototype']['bookingType']);
let multiSelectPrototypePayload = reactive(dataPayload['prototype']['multiSelectPrototypePayload']);
let singleSelectPrototype = reactive(dataPayload['prototype']['singleSelectPrototype']);
let singleSelectPrototypePayload = reactive(dataPayload['prototype']['singleSelectPrototypePayload']);

let dataTable1Selected = ref(dataPayload['prototype']['dataTables']['1']['selected']);
let dataTable1Headers = reactive(dataPayload['prototype']['dataTables']['1']['headers']);
let dataTable1Data = ref(dataPayload['prototype']['dataTables']['1']['data']);

let dataTable2Selected = ref(dataPayload['prototype']['dataTables']['2']['selected']);
let dataTable2Headers = reactive(dataPayload['prototype']['dataTables']['2']['headers']);
let dataTable2Data = ref(dataPayload['prototype']['dataTables']['2']['data']);

let dataTable3Selected = ref(dataPayload['prototype']['dataTables']['3']['selected']);
let dataTable3Headers = reactive(dataPayload['prototype']['dataTables']['3']['headers']);
let dataTable3Data = ref(dataPayload['prototype']['dataTables']['3']['data']);

//Render datetime picker for dataTable1Data row datetime added
let data_1_DateTimePickers = dataTable1Data.value.map(record => {
    return {
        id: `datetime_added-` + record.id,
        type: 'datetime',
        selectedCallback: (payload) => {
            record.datetime_added = payload.value;
        }
    }
});
//Render datetime picker for dataTable2Data row datetime added
let data_2_DateTimePickers = dataTable2Data.value.map(record => {
    return {
        id: `datetime_added-` + record.id,
        type: 'datetime',
        selectedCallback: (payload) => {
            record.datetime_added = payload.value;
        }
    }
});
//Render datetime picker for dataTable3Data row datetime added
let data_3_DateTimePickers = dataTable3Data.value.map(record => {
    return {
        id: `datetime_added-` + record.id,
        type: 'datetime',
        selectedCallback: (payload) => {
            record.datetime_added = payload.value;
        }
    }
});

//Render sample datetime pickers
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

//Concat sample datetime pickers with sample datatable's datetime added
dateTimePickers.value = dateTimePickers.value
    .concat(data_1_DateTimePickers)
    .concat(data_2_DateTimePickers)
    .concat(data_3_DateTimePickers);

const {render} = dateTimePicker();

//Render date time pickers on navigate
onMounted(async () => {
    await nextTick(() => {
        render(dateTimePickers.value);
    });
});

//Render date time pickers on load
watch(clientReadyState, async (clientReady) => {
    if(clientReady){
        await nextTick(() => {
            render(dateTimePickers.value);
        });
    }
})
</script>