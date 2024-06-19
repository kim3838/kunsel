<template>
    <div>
        <LandingWrapper>
            <div class="tw-mx-auto tw-pt-4 tw-max-w-screen-2xl">
                <div>Tailwind Url: <NuxtLink class="tw-text-sky-600" :to="'_tailwind'" target="_blank">{{('http://localhost:3000' + '/_tailwind/')}}</NuxtLink></div>

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
                                :type="'text'"
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
                                :type="'text'"
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
                                :type="'text'"
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
                    <div v-if="false" class="tw-grid tw-gap-2 sm:tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-4">
                        <div class="tw-block tw-col-span-1 sm:tw-col-span-3 md:tw-col-span-2 lg:tw-col-span-2 tw-p-2 neutral-border">
                            <InputLabel class="tw-mb-2" :size="'md'" value="MD Datatable" />
                            <DataTable
                                :headers="headers_1"
                                :size="'md'"
                                :rows="data_1"
                                v-model="selected_1"
                                selection>
                                <template v-slot:cell.name="{cell, index, slot}">
                                    <div class="tw-h-full tw-w-full tw-flex tw-items-center">
                                        <Button class="tw-w-full" :variant="'outline'" :icon="'fe:check-circle'" :size="slot.buttonSize" :label="`[${index}] ${cell.name}`"></Button>
                                    </div>
                                </template>
                                <template v-slot:cell.category="{cell, slot, scrollReference}">
                                    <MultiSelect
                                        in-horizontal-scrollable
                                        drop-shadow
                                        :scroll-reference="scrollReference"
                                        :size="slot.selectSize"
                                        :options="category"
                                        :icon="'ic:baseline-data-saver-on'"/>
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
                                <template v-slot:cell.name="{cell, index, slot}">
                                    <div class="tw-h-full tw-w-full tw-flex tw-items-center">
                                        <Button class="tw-w-full" :variant="'default'" :icon="'material-symbols:ev-mobiledata-badge-sharp'" :size="slot.buttonSize" :label="`${cell.name}`"></Button>
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
                                    <div class="tw-h-full tw-w-full tw-flex tw-items-center">
                                        <Button class="tw-w-full" :variant="'flat'" :icon="'ic:baseline-data-saver-on'" :size="slot.buttonSize" :label="`${cell.name}`"></Button>
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

                    <!-- Tab Indexed Group -->
                    <div v-if="true">
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
                                    <InputWithIcon :tabindex="4" :size="tabGroup.size" :icon="tabGroup.icon" :placeholder="'Enter value'" type="text" autocomplete="off" />
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
                                    <InputWithIcon :tabindex="7" :size="tabGroup.size" :icon="tabGroup.icon" :placeholder="'Enter value'" type="text" autocomplete="off" />
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
                                    <InputWithIcon :tabindex="11" :size="tabGroup.size" :icon="tabGroup.icon" :placeholder="'Enter value'" type="text" autocomplete="off" />
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
                                    <InputWithIcon :tabindex="14" :size="tabGroup.size" :icon="tabGroup.icon" :placeholder="'Enter value'" type="text" autocomplete="off" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Button and Input Grid Spacing Alignments -->
                    <div v-if="true">
                        <div class="tw-block tw-p-2 neutral-border">
                            <InputLabel class="tw-mb-2" :size="'md'" value="Spacing Aligment Grid" />
                            <div class="tw-grid tw-gap-1 tw-grid-cols-7">
                                <div v-if="true">
                                    <div>
                                        <MultiSelectPaginated
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
                                    </div>
                                    <div>
                                        <InputWithIcon :size="'2xs'" :icon="tabGroup.icon" :placeholder="'Enter value'" type="text" autocomplete="off" />
                                    </div>
                                    <div>
                                        <MultiSelect
                                            drop-shadow
                                            :searchable="false"
                                            :selection-float="true"
                                            :always-active="false"
                                            :selection-max-viewable-line="5"
                                            :size="'2xs'"
                                            :options="category"
                                            :icon="tabGroup.icon"/>
                                    </div>
                                    <div>
                                        <SingleSelectPaginated
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
                                    </div>
                                    <div>
                                        <SingleSelect
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
                                    </div>

                                    <div><Button class="tw-w-full" :size="'2xs'" :icon="tabGroup.icon" :label="'Button'" /></div>
                                    <div><Button class="tw-w-3/4" :size="'2xs'" :icon="tabGroup.icon" :variant="'outline'" :label="'Button'" /></div>
                                    <div><Button class="tw-w-1/2" :size="'2xs'" :icon="tabGroup.icon" :variant="'flat'" :label="'Button'" /></div>
                                    <div><Button class="tw-w-1/3" :size="'2xs'" :icon="tabGroup.icon" :variant="'flat'" disabled :label="'Button'" /></div>
                                    <div><Button class="" :size="'2xs'" :icon="tabGroup.icon" :variant="'flat'" :label="'Button'" /></div>
                                    <div><InputWithIcon ref="inputValue" :size="'2xs'" :icon="tabGroup.icon" :placeholder="'Enter value'" :type="'text'" autocomplete="off" /></div>
                                    <div><Button class="" :size="'2xs'" :icon="tabGroup.icon" :variant="'flat'" :label="''" /></div>
                                    <div><Button class="" :size="'2xs'" :icon="tabGroup.icon" :label="''" /></div>
                                </div>

                                <div v-if="true">
                                    <div>
                                        <MultiSelectPaginated
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
                                    </div>
                                    <div>
                                        <InputWithIcon :size="'xs'" :icon="tabGroup.icon" :placeholder="'Enter value'" type="text" autocomplete="off" />
                                    </div>
                                    <div>
                                        <MultiSelect
                                            drop-shadow
                                            :searchable="false"
                                            :selection-float="true"
                                            :always-active="false"
                                            :selection-max-viewable-line="5"
                                            :size="'xs'"
                                            :options="category"
                                            :icon="tabGroup.icon"/>
                                    </div>
                                    <div>
                                        <SingleSelectPaginated
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
                                    </div>
                                    <div>
                                        <SingleSelect
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
                                    </div>

                                    <div><Button class="tw-w-full" :size="'xs'" :icon="tabGroup.icon" :label="'Button'" /></div>
                                    <div><Button class="tw-w-3/4" :size="'xs'" :icon="tabGroup.icon" :variant="'outline'" :label="'Button'" /></div>
                                    <div><Button class="tw-w-1/2" :size="'xs'" :icon="tabGroup.icon" :variant="'flat'" :label="'Button'" /></div>
                                    <div><Button class="tw-w-1/3" :size="'xs'" :icon="tabGroup.icon" :variant="'flat'" disabled :label="'Button'" /></div>
                                    <div><Button class="" :size="'xs'" :icon="tabGroup.icon" :variant="'flat'" :label="'Button'" /></div>
                                    <div><InputWithIcon ref="inputValue" :size="'xs'" :icon="tabGroup.icon" :placeholder="'Enter value'" :type="'text'" autocomplete="off" /></div>
                                    <div><Button class="" :size="'xs'" :icon="tabGroup.icon" :variant="'flat'" :label="''" /></div>
                                    <div><Button class="" :size="'xs'" :icon="tabGroup.icon" :label="''" /></div>
                                </div>

                                <div v-if="true">
                                    <div>
                                        <MultiSelectPaginated
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
                                    </div>
                                    <div>
                                        <InputWithIcon :size="'sm'" :icon="tabGroup.icon" :placeholder="'Enter value'" type="text" autocomplete="off" />
                                    </div>
                                    <div>
                                        <MultiSelect
                                            drop-shadow
                                            :searchable="false"
                                            :selection-float="true"
                                            :always-active="false"
                                            :selection-max-viewable-line="5"
                                            :size="'sm'"
                                            :options="category"
                                            :icon="tabGroup.icon"/>
                                    </div>
                                    <div>
                                        <SingleSelectPaginated
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
                                    </div>
                                    <div>
                                        <SingleSelect
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
                                    </div>

                                    <div><Button class="tw-w-full" :size="'sm'" :icon="tabGroup.icon" :label="'Button'" /></div>
                                    <div><Button class="tw-w-3/4" :size="'sm'" :icon="tabGroup.icon" :variant="'outline'" :label="'Button'" /></div>
                                    <div><Button class="tw-w-1/2" :size="'sm'" :icon="tabGroup.icon" :variant="'flat'" :label="'Button'" /></div>
                                    <div><Button class="tw-w-1/3" :size="'sm'" :icon="tabGroup.icon" :variant="'flat'" disabled :label="'Button'" /></div>
                                    <div><Button class="" :size="'sm'" :icon="tabGroup.icon" :variant="'flat'" :label="'Button'" /></div>
                                    <div><InputWithIcon ref="inputValue" :size="'sm'" :icon="tabGroup.icon" :placeholder="'Enter value'" :type="'text'" autocomplete="off" /></div>
                                    <div><Button class="" :size="'sm'" :icon="tabGroup.icon" :variant="'flat'" :label="''" /></div>
                                    <div><Button class="" :size="'sm'" :icon="tabGroup.icon" :label="''" /></div>
                                </div>

                                <div v-if="true">
                                    <div>
                                        <MultiSelectPaginated
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
                                    </div>
                                    <div>
                                        <InputWithIcon :size="'md'" :icon="tabGroup.icon" :placeholder="'Enter value'" type="text" autocomplete="off" />
                                    </div>
                                    <div>
                                        <MultiSelect
                                            drop-shadow
                                            :searchable="false"
                                            :selection-float="true"
                                            :always-active="false"
                                            :selection-max-viewable-line="5"
                                            :size="'md'"
                                            :options="category"
                                            :icon="tabGroup.icon"/>
                                    </div>
                                    <div>
                                        <SingleSelectPaginated
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
                                    </div>
                                    <div>
                                        <SingleSelect
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
                                    </div>

                                    <div><Button class="tw-w-full" :size="'md'" :icon="tabGroup.icon" :label="'Button'" /></div>
                                    <div><Button class="tw-w-3/4" :size="'md'" :icon="tabGroup.icon" :variant="'outline'" :label="'Button'" /></div>
                                    <div><Button class="tw-w-1/2" :size="'md'" :icon="tabGroup.icon" :variant="'flat'" :label="'Button'" /></div>
                                    <div><Button class="tw-w-1/3" :size="'md'" :icon="tabGroup.icon" :variant="'flat'" disabled :label="'Button'" /></div>
                                    <div><Button class="" :size="'md'" :icon="tabGroup.icon" :variant="'flat'" :label="'Button'" /></div>
                                    <div><InputWithIcon ref="inputValue" :size="'md'" :icon="tabGroup.icon" :placeholder="'Enter value'" :type="'text'" autocomplete="off" /></div>
                                    <div><Button class="" :size="'md'" :icon="tabGroup.icon" :variant="'flat'" :label="''" /></div>
                                    <div><Button class="" :size="'md'" :icon="tabGroup.icon" :label="''" /></div>
                                </div>

                                <div v-if="true">
                                    <div>
                                        <MultiSelectPaginated
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
                                    </div>
                                    <div>
                                        <InputWithIcon :size="'lg'" :icon="tabGroup.icon" :placeholder="'Enter value'" type="text" autocomplete="off" />
                                    </div>
                                    <div>
                                        <MultiSelect
                                            drop-shadow
                                            :searchable="false"
                                            :selection-float="true"
                                            :always-active="false"
                                            :selection-max-viewable-line="5"
                                            :size="'lg'"
                                            :options="category"
                                            :icon="tabGroup.icon"/>
                                    </div>
                                    <div>
                                        <SingleSelectPaginated
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
                                    </div>
                                    <div>
                                        <SingleSelect
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
                                    </div>

                                    <div><Button class="tw-w-full" :size="'lg'" :icon="tabGroup.icon" :label="'Button'" /></div>
                                    <div><Button class="tw-w-3/4" :size="'lg'" :icon="tabGroup.icon" :variant="'outline'" :label="'Button'" /></div>
                                    <div><Button class="tw-w-1/3" :size="'lg'" :icon="tabGroup.icon" :variant="'flat'" disabled :label="'Button'" /></div>
                                    <div><Button class="" :size="'lg'" :icon="tabGroup.icon" :variant="'flat'" :label="'Button'" /></div>
                                    <div><InputWithIcon ref="inputValue" :size="'lg'" :icon="tabGroup.icon" :placeholder="'Enter value'" :type="'text'" autocomplete="off" /></div>
                                    <div><Button class="" :size="'lg'" :icon="tabGroup.icon" :variant="'flat'" :label="''" /></div>
                                    <div><Button class="" :size="'lg'" :icon="tabGroup.icon" :label="''" /></div>
                                </div>

                                <div v-if="true">
                                    <div><InputWithIcon :size="'xl'" :icon="tabGroup.icon" :placeholder="'Enter value'" type="text" autocomplete="off" /></div>
                                    <div><Button class="tw-w-full" :size="'xl'" :icon="tabGroup.icon" :label="'Button'" /></div>
                                    <div><Button class="tw-w-3/4" :size="'xl'" :icon="tabGroup.icon" :variant="'outline'" :label="'Button'" /></div>
                                    <div><Button class="tw-w-1/2" :size="'xl'" :icon="tabGroup.icon" :variant="'flat'" :label="'Button'" /></div>
                                    <div><Button class="tw-w-1/3" :size="'xl'" :icon="tabGroup.icon" :variant="'flat'" disabled :label="'Button'" /></div>
                                    <div><InputWithIcon ref="inputValue" :size="'xl'" :icon="tabGroup.icon" :placeholder="'Enter value'" :type="'text'" autocomplete="off" /></div>
                                    <div><Button class="" :size="'xl'" :icon="tabGroup.icon" :variant="'flat'" :label="''" /></div>
                                    <div><Button class="" :size="'xl'" :icon="tabGroup.icon" :label="''" /></div>
                                </div>

                                <div v-if="true">
                                    <div><InputWithIcon :size="'2xl'" :icon="tabGroup.icon" :placeholder="'Enter value'" type="text" autocomplete="off" /></div>
                                    <div><Button class="tw-w-full" :size="'2xl'" :icon="tabGroup.icon" :label="'Button'" /></div>
                                    <div><Button class="tw-w-3/4" :size="'2xl'" :icon="tabGroup.icon" :variant="'outline'" :label="'Button'" /></div>
                                    <div><Button class="tw-w-1/2" :size="'2xl'" :icon="tabGroup.icon" :variant="'flat'" :label="'Button'" /></div>
                                    <div><Button class="tw-w-1/3" :size="'2xl'" :icon="tabGroup.icon" :variant="'flat'" disabled :label="'Button'" /></div>
                                    <div><InputWithIcon ref="inputValue" :size="'2xl'" :icon="tabGroup.icon" :placeholder="'Enter value'" :type="'text'" autocomplete="off" /></div>
                                    <div><Button class="" :size="'2xl'" :icon="tabGroup.icon" :variant="'flat'" :label="''" /></div>
                                    <div><Button class="" :size="'2xl'" :icon="tabGroup.icon" :label="''" /></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Button and Input Horizontal Alignment -->
                    <div v-if="true">
                        <div class="tw-my-4 tw-flex tw-justify-center tw-space-x-1.5">
                            <Button :size="tabGroup.size" :icon="tabGroup.icon" :label="'Default'" />
                            <Button :size="tabGroup.size" :icon="tabGroup.icon" :variant="'outline'" :label="'Outline'" />
                            <Button :size="tabGroup.size" :icon="tabGroup.icon" :variant="'flat'" :label="'Flat'" />
                            <Button :size="tabGroup.size" :icon="tabGroup.icon" :variant="'flat'" disabled :label="'Flat'" />
                            <InputWithIcon ref="inputValue" :size="tabGroup.size" :icon="tabGroup.icon" :placeholder="'Enter value'" :type="'text'" autocomplete="off" />
                        </div>
                    </div>

                    <!-- Default Button -->
                    <div v-if="false" class="tw-grid tw-gap-2 tw-grid-cols-1 sm:tw-grid-cols-2 lg:tw-grid-cols-5 xl:tw-grid-cols-6 2xl:tw-grid-cols-9">
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

                    <!-- Outline Button -->
                    <div v-if="false" class="tw-grid tw-gap-2 tw-grid-cols-1 sm:tw-grid-cols-2 lg:tw-grid-cols-5 xl:tw-grid-cols-6 2xl:tw-grid-cols-9">
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
                    <div v-if="false" class="tw-grid tw-gap-2 tw-grid-cols-1 sm:tw-grid-cols-2 lg:tw-grid-cols-4">
                        <div>
                            <HeroPlate :size="'sm'" :bookmark="'FOR YOU'" :label="'B760M-MEOW'"/>
                        </div>
                        <div>
                            <HeroPlate :size="'sm'" :bookmark="'NEW ARRIVAL'" :theme="'gold'" :label="'COLORFIRE Meow Series'"/>
                        </div>
                        <div>
                            <HeroPlate :size="'sm'" :bookmark="'TRENDING'" :theme="'strawberry'" :label="'RTX 4060 MEOW-ORG'"/>
                        </div>
                        <div>
                            <HeroPlate :size="'sm'" :bookmark="'PC CASE'" :theme="'tulip'" :label="'Segotep Memphis-S'"/>
                        </div>

                        <div>
                            <HeroPlate :size="'md'" :bookmark="'FOR YOU'" :label="'B760M-MEOW'"/>
                        </div>
                        <div>
                            <HeroPlate :size="'md'" :bookmark="'NEW ARRIVAL'" :theme="'gold'" :label="'COLORFIRE Meow Series'"/>
                        </div>
                        <div>
                            <HeroPlate :size="'md'" :bookmark="'TRENDING'" :theme="'strawberry'" :label="'RTX 4060 MEOW-ORG'"/>
                        </div>
                        <div>
                            <HeroPlate :size="'md'" :bookmark="'PC CASE'" :theme="'tulip'" :label="'Segotep Memphis-S'"/>
                        </div>

                        <div>
                            <HeroPlate :size="'lg'" :bookmark="'FOR YOU'" :label="'B760M-MEOW'"/>
                        </div>
                        <div>
                            <HeroPlate :size="'lg'" :bookmark="'NEW ARRIVAL'" :theme="'gold'" :label="'COLORFIRE Meow Series'"/>
                        </div>
                        <div>
                            <HeroPlate :size="'lg'" :bookmark="'TRENDING'" :theme="'strawberry'" :label="'RTX 4060 MEOW-ORG'"/>
                        </div>
                        <div>
                            <HeroPlate :size="'lg'" :bookmark="'PC CASE'" :theme="'tulip'" :label="'Segotep Memphis-S'"/>
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
        </LandingWrapper>
    </div>
</template>

<script setup lang="ts">
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
    'icon' : 'ic:sharp-qr-code',
    'size' : 'md'
});

let formStore = $formStore;
let remember1 = ref(null);
let remember2 = ref(true);
let remember3 = ref(1);
let remember4 = ref('1');
let categorySelection = reactive([
    {text : 'Charms', value: true},
    {text : 'Bracelets', value: true},
    {text : 'Tab\t\tBrooches\nand\nPins', value: false},
    {text : 'Necklaces', value: true},
    {text : 'Earrings', value: false},
    {text : 'Rings', value: true},
    {text : 'Polyester', value: true},
]);
let statusGroup = reactive({
    selection: [
        {text : 'For Approval', value: 0},
        {text : 'Approved', value: 1},
        {text : 'Tab\t\tProcessing\nNew Line\nNew Line', value: 2},
        {text : 'Rejected', value: 3},
        {text : 'Complete', value: 4},
    ],
    selected: 3
});
let transactionGroup = reactive({
    selection: [
        {text : 'Cash', value: 0},
        {text : 'Pre Paid', value: 1},
        {text : 'Tab\t\tPost\nPaid', value: 2},
        {text : 'Card', value: 3},
        {text : 'Debit', value: 4},
    ],
    selected: 3
});
let genderGroup = reactive({
    selection: [
        {text : 'Male', value: 0},
        {text : 'Female', value: 1},
    ],
    selected: 1
});
let categoryGroup = reactive({
    selection: [
        {text : 'Charms', value: 0},
        {text : 'Bracelets', value: 1},
        {text : 'Tab\t\tBrooches\nand\nPins', value: 2},
        {text : 'Necklaces', value: 3},
        {text : 'Earrings', value: 4},
        {text : 'Rings', value: 5},
        {text : 'Polyester', value: 6},
    ],
    selected: 3
});
let accordionSingleExpand  = reactive({
    recentActive: 2,
    options: [
        {
            title: 'Check box',
            body: {
                type: 'checkbox',
                value: categorySelection
            },
            active: false
        },
        {
            title: 'Radio box',
            body: {
                type: 'radio',
                value: transactionGroup
            },
            active: false
        },
        {
            title: 'Coldiron Armor Set, Coldiron Armor Set, Coldiron Armor Set, Coldiron Armor Set',
            body: {
                type: 'text',
                value: 'This armor was forged for the sole purpose of resisting the malignance spreading across the land.'
            },
            active: true
        },
        {
            title: 'Coldiron Barding Mount Armor',
            body: {
                type: 'text',
                value: 'Adorn your new steeds with mount armor inspired by the malignance taking over Sanctuary.'
            },
            active: false
        },
        {
            title: 'Weapon skins, Mount Trophies, Emotes, Platinum, and more',
            body: {
                type: 'text',
                value: 'Explore a range of cosmetics to earn along the Premium Battle Pass. Collect a weapon transmog for all 19 weapon types. 2 emotes for each class let you threaten your enemies or find a little time to play around with malignant heart cages. 2 headstones even let you die in style. Adorn your horse with 5 new mount trophies.'
            },
            active: false
        },
        {
            title: '“On the Warpath” Emote – Accelerated Battle Pass',
            body: {
                type: 'text',
                value: 'Show everyone you’re ready for battle when you slam your banner down, signaling to enemies that you’re ready for a fight. This emote is only included in the Accelerated Battle Pass.'
            },
            active: false
        }
    ]
});
let accordionMultiExpand  = reactive({
    recentActive: 2,
    options: [
        {
            title: 'Check box',
            body: {
                type: 'checkbox',
                value: categorySelection
            },
            active: false
        },
        {
            title: 'Radio box',
            body: {
                type: 'radio',
                value: transactionGroup
            },
            active: false
        },
        {
            title: 'Coldiron Armor Set, Coldiron Armor Set, Coldiron Armor Set, Coldiron Armor Set',
            body: {
                type: 'text',
                value: 'This armor was forged for the sole purpose of resisting the malignance spreading across the land.'
            },
            active: true
        },
        {
            title: 'Coldiron Barding Mount Armor',
            body: {
                type: 'text',
                value: 'Adorn your new steeds with mount armor inspired by the malignance taking over Sanctuary.'
            },
            active: false
        },
        {
            title: 'Weapon skins, Mount Trophies, Emotes, Platinum, and more',
            body: {
                type: 'text',
                value: 'Explore a range of cosmetics to earn along the Premium Battle Pass. Collect a weapon transmog for all 19 weapon types. 2 emotes for each class let you threaten your enemies or find a little time to play around with malignant heart cages. 2 headstones even let you die in style. Adorn your horse with 5 new mount trophies.'
            },
            active: false
        },
        {
            title: '“On the Warpath” Emote – Accelerated Battle Pass',
            body: {
                type: 'text',
                value: 'Show everyone you’re ready for battle when you slam your banner down, signaling to enemies that you’re ready for a fight. This emote is only included in the Accelerated Battle Pass.'
            },
            active: false
        }
    ]
});
let category = reactive({
    search: '',
    data: [
        {text : 'Charms', value: 0},
        {text : 'Bracelets', value: 1},
        {text : 'Tab\t\tBrooches\nand\nPins', value: 2},
        {text : 'Necklaces', value: 3},
        {text : 'Earrings', value: 4},
        {text : 'Rings', value: 5},
        {text : 'Polyester', value: 6},
    ],
    selection: [
        {text : 'Charms', value: 0},
        {text : 'Bracelets', value: 1},
        {text : 'Tab\t\tBrooches\nand\nPins', value: 2},
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
    selected: [400, 476]
});
let singleSelectPrototype = reactive({
    search: '',
    data: [
        {text : 'PRT3221289642 005-5RZX3-MPJ-9GRRWA', value: 0},
        {text : 'PRT3224439642 005-5RZX3-MPJ-9GRRWA', value: 1},
        {text : 'PRT3222219642 005-5RZX3-MPJ-9GRRWA', value: 2},
        {text : 'PRT3224324642 005-5RZX3-MPJ-9GRRWA', value: 3},
        {text : 'PRT3221285552 005-5RZX3-MPJ-9GRRWA', value: 4},
    ],
    selection: [
        {text : 'PRT3221289642 005-5RZX3-MPJ-9GRRWA', value: 0},
        {text : 'PRT3224439642 005-5RZX3-MPJ-9GRRWA', value: 1},
        {text : 'PRT3222219642 005-5RZX3-MPJ-9GRRWA', value: 2},
        {text : 'PRT3224324642 005-5RZX3-MPJ-9GRRWA', value: 3},
        {text : 'PRT3221285552 005-5RZX3-MPJ-9GRRWA', value: 4},
    ],
    selected: null
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
    selected: 400,
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
        "name": "Jamaal Hodkiewicz",
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
        "name": "Tracy Ward",
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
        "name": "Amari Gerlach",
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
        "name": "Imani Lang",
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
        "name": "Fae Torp",
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
        "name": "Katarina Shanahan",
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
        "name": "Imani Lang",
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
        "name": "Fae Torp",
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
        "name": "Katarina Shanahan",
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
        "name": "Janice Doe",
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