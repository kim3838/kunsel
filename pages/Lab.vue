<template>
    <div>
        <NuxtLayout name="custom">
            <template #content>
                <div id="lab" class="tw-m-2 tw-p-2 tw-border tw-border-light tw-flex tw-justify-center tw-items-center">
                    <div class="moody-card">
                        <div class="moody-card-frame"></div>
                        <div class="tw-relative tw-border tw-border-light tw-border-b-0 tw-p-3 tw-flex tw-justify-center tw-items-center">
                            Static MultiSelect
                        </div>
                        <div class="tw-relative tw-border tw-border-light tw-p-14 tw-pb-96">
                            <div class="tw-border tw-w-60 tw-p-[0.5rem] tw-border-slate-400/20">
                                <FormInputLabel :size="'md'" @click="active = !active" value="Static Multi Select" />
                                <div
                                    class="tw-w-full tw-relative tw-h-8 tw-flex tw-justify-start tw-border"
                                    :class="[
                                        active
                                            ? 'tw-relative tw-border-light tw-border-b-neutral-200'
                                            : 'tw-border-neutral-200']"
                                >
                                    <!-- Idle -->
                                    <div v-if="!active" class="tw-w-10 tw-flex tw-justify-center tw-items-center"><!-- tw-border tw-border-[red] -->
                                        <Icon class="tw-h-5 tw-w-5" name="ion:md-options"/>
                                    </div>
                                    <div v-if="!active" class="tw-w-full tw-relative tw-cursor-pointer"><!-- tw-border tw-border-[green] -->
                                        <div class="tw-absolute tw-h-8 tw-pt-[9px] tw-left-[0.2rem] tw-right-[2.2rem] tw-text-sm tw-leading-[0.875rem] tw-truncate"><!-- tw-border tw-border-[pink] -->
                                            Option 01, Option 02, Option 03
                                        </div>
                                        <div class="tw-absolute tw-right-0 tw-top-0 tw-w-8 tw-h-8 tw-flex tw-justify-center tw-items-center"><!-- tw-border tw-border-[red] -->
                                            <Icon class="tw-h-5 tw-w-5" name="ic:baseline-arrow-drop-down" />
                                        </div>
                                    </div>

                                    <div v-if="active" class="tw-w-10 tw-flex tw-justify-center tw-items-center"><!-- tw-border tw-border-[red] -->
                                        <!-- carbon:checkbox -->
                                        <!-- carbon:checkbox-checked-filled -->
                                        <!-- carbon:checkbox-indeterminate-filled -->
                                        <Icon class="tw-h-6 tw-w-6" :name="'carbon:checkbox'"/>
                                    </div>
                                    <div v-if="active" class="tw-w-full tw-relative"><!-- tw-border tw-border-[green] -->
                                        <div class="tw-absolute tw-right-[2rem] tw-flex tw-items-center">
                                            <FormInput
                                                v-if="active"
                                                class="tw-w-full tw-h-[1.875rem]"
                                                :size="'sm'"
                                                type="text"
                                                placeholder="Search..."
                                                v-model="inputData"
                                                autocomplete="off"
                                                :withBorder="false"
                                                :rounded="false"
                                                :focusable="false"
                                                :disabled="false" />
                                        </div>
                                        <div class="tw-absolute tw-right-0 tw-top-0 tw-w-8 tw-h-8 tw-flex tw-justify-center tw-items-center"><!-- tw-border tw-border-[red] -->
                                            <Icon class="tw-h-6 tw-w-6 tw-cursor-pointer hover:tw-bg-neutral-200" name="ic:baseline-clear" />
                                        </div>
                                    </div>
                                    <!-- Selection Body -->
                                    <div v-if="active" class="tw-absolute tw-top-[1.875rem] tw-right-[-1px] tw-left-[-1px] tw-border tw-bg-white tw-border-light tw-border-t-neutral-200">

                                        <!-- Selection List -->
                                        <div>
                                            <FormCheckbox
                                                :size="'sm'"
                                                class="tw-pl-2 hover:tw-bg-neutral-200"
                                                v-for="item in options.selection"
                                                :key="item.value"
                                                :checked="isItemSelected(item)"
                                                :label="item.text"
                                                @click="selectItem(item)"
                                            />
                                        </div>
                                        <div class="tw-pl-2 tw-text-xs">{{selectedSummary}}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </NuxtLayout>
    </div>
</template>

<script setup lang="ts">

import { ref, computed, reactive } from 'vue';

definePageMeta({
    layout: false,
});

let active = ref(true);
let inputData = ref(null);
let options  = reactive({
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
let selectedSummary = computed(() => options.selected);

function isItemSelected(item){
    return options.selected.indexOf(item.value) >= 0;
}

function selectItem(item: any){
    if(isItemSelected(item)){
        _remove(options.selected, (value) => value == item.value);
    } else {
        options.selected.push(item.value);
    }
}
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