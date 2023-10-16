<template>
    <div>
        <NuxtLayout :name="$coreStore.layout">
            <template #content>
                <div class="tw-mx-auto tw-max-w-screen-2xl tw-flex">
                    <div class="tw-w-full">
                        <div class="tw-my-4 tw-grid tw-gap-2 tw-grid-cols-5">
                            <div>
                                <AccentFrame class="tw-w-full">
                                    <template #content>
                                        <Input :tabindex="1" :size="size" :placeholder="'Enter value'" type="text" autocomplete="off" />
                                    </template>
                                </AccentFrame>
                            </div>
                            <div>
                                <AccentFrame class="tw-w-full">
                                    <template #content>
                                        <MultiSelectPaginated
                                            :tabindex="2"
                                            :drop-shadow="true"
                                            :selection-max-content="false"
                                            :selected-max-viewable-line="6"
                                            :selection-max-viewable-line="10"
                                            :searchable="true"
                                            :selection-float="true"
                                            :always-active="false"
                                            :label="'Select Prototypes'"
                                            :size="size"
                                            :payload="multiSelectPrototypePayload"
                                            :icon="'logos:codio'"/>
                                    </template>
                                </AccentFrame>
                            </div>
                            <div>
                                <AccentFrame class="tw-w-full">
                                    <template #content>
                                        <Input :tabindex="4" :size="size" :placeholder="'Enter value'" type="text" autocomplete="off" />
                                    </template>
                                </AccentFrame>
                            </div>
                            <div>
                                <AccentFrame class="tw-w-full">
                                    <template #content>
                                        <MultiSelect
                                            :tabindex="5"
                                            drop-shadow
                                            :searchable="true"
                                            :selection-float="true"
                                            :always-active="false"
                                            :selection-max-viewable-line="5"
                                            :size="size" :options="category"
                                            :icon="'ic:sharp-qr-code'"/>
                                    </template>
                                </AccentFrame>
                            </div>
                            <div>
                                <AccentFrame class="tw-w-full">
                                    <template #content>
                                        <InputWithIcon :tabindex="7" ref="inputValue" :size="size" :icon="'ic:sharp-qr-code'" :placeholder="'Enter value'" type="text" autocomplete="off" />
                                    </template>
                                </AccentFrame>
                            </div>
                            <div>
                                <AccentFrame class="tw-w-full">
                                    <template #content>
                                        <SingleSelect
                                            :tabindex="8"
                                            :value-persist="true"
                                            :drop-shadow="true"
                                            :selection-max-content="true"
                                            :searchable="true"
                                            :selection-float="true"
                                            :always-active="false"
                                            :size="size"
                                            :selection-max-viewable-line="8"
                                            :icon="'emojione-monotone:japanese-no-vacancy-button'"
                                            :options="singleSelectPrototype"/>
                                    </template>
                                </AccentFrame>
                            </div>
                            <div>
                                <AccentFrame class="tw-w-full">
                                    <template #content>
                                        <label v-for="category in categorySelection" :key="category">
                                            <Checkbox
                                                v-model="category.value"
                                                :label="category.text"
                                                :size="size" />
                                        </label>
                                    </template>
                                </AccentFrame>
                            </div>
                            <div>
                                <AccentFrame class="tw-w-full">
                                    <template #content>
                                        <InputWithIcon :tabindex="10" ref="inputValue" :size="size" :icon="'ic:sharp-qr-code'" :placeholder="'Enter value'" type="text" autocomplete="off" />
                                    </template>
                                </AccentFrame>
                            </div>
                            <div>
                                <AccentFrame class="tw-w-full">
                                    <template #content>
                                        <SingleSelectPaginated
                                            :tabindex="13"
                                            :value-persist="true"
                                            :drop-shadow="true"
                                            :selection-max-content="false"
                                            :selection-max-viewable-line="10"
                                            :searchable="true"
                                            :selection-float="true"
                                            :always-active="false"
                                            :label="'Select Prototype'"
                                            :size="size"
                                            :payload="singleSelectPrototypePayload"
                                            :icon="'emojione-monotone:japanese-no-vacancy-button'"/>
                                    </template>
                                </AccentFrame>
                            </div>
                            <div>
                                <AccentFrame class="tw-w-full">
                                    <template #content>
                                        <InputWithIcon :tabindex="15" ref="inputValue" :size="size" :icon="'ic:sharp-qr-code'" :placeholder="'Enter value'" type="text" autocomplete="off" />
                                    </template>
                                </AccentFrame>
                            </div>
                        </div>

                        <div class="tw-my-4 tw-h-[1px] tw-bg-gradient-to-r tw-from-transparent tw-via-neutral-400 tw-to-transparent"></div>

                        <AccentFrame class="tw-w-full">
                            <template #content>
                                <InputWithIcon class="tw-my-4 " ref="inputValue" :size="size" :icon="'ic:sharp-qr-code'" :placeholder="'Enter value'" type="text" autocomplete="off" />
                                <div class="tw-my-4 tw-flex tw-justify-center tw-space-x-1.5 tw-flex-nowrap">
                                    <Input ref="inputValue" :size="size" :placeholder="'Enter value'" type="text" autocomplete="off" />
                                    <Button :size="size" :icon="icon" :variant="'flat'" :label="'Flat'" />
                                    <InputWithIcon ref="inputValue" :size="size" :icon="icon" :placeholder="'Enter value'" :type="'text'" autocomplete="off" />
                                </div>
                                <div class="tw-my-4 tw-flex tw-justify-center tw-space-x-1.5">
                                    <Button :size="size" :icon="icon" :label="'Default'" />
                                    <Button :size="size" :icon="icon" :variant="'outline'" :label="'Outline'" />
                                    <Button :size="size" :icon="icon" :variant="'flat'" :label="'Flat'" />
                                    <Button :size="size" :icon="icon" :variant="'flat'" disabled :label="'Flat'" />
                                </div>
                            </template>
                        </AccentFrame>
                    </div>
                </div>
            </template>
        </NuxtLayout>
    </div>
</template>

<script setup lang="ts">
import {ref, reactive, nextTick, onMounted} from "vue";

definePageMeta({
    layout: false,
    middleware: 'guest'
});
let size = ref('md');
let icon = ref('simple-icons:googlecalendar');
let inputValue = ref(null);

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
                keyword: '',//1239
                callback: 1
            }
        }
    },
    selected: null,//1263
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
let categorySelection = reactive([
    {text : 'Charms', value: true},
    {text : 'Bracelets', value: true},
    {text : 'Brooches\nand\nPins', value: false},
    {text : 'Necklaces', value: true},
    {text : 'Earrings', value: false},
    {text : 'Rings', value: true},
    {text : 'Polyester', value: true},
]);

onMounted(async () => {
    nextTick(() => {
        inputValue.value.$refs.input.focus();
    });
})


</script>

<style scoped>
    #lab{
        height: calc(100vh - calc(41px) - calc(1rem));
    }
</style>