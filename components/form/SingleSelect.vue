<template>
    <div
        tabindex="0"
        v-on:focus="keepSelectionActive(1)"
        v-on:blur="loseFocus(1)"
        class="tw-w-full tw-relative focus:tw-outline-none tw-bg-white">
        <div class="tw-w-full tw-relative tw-flex tw-justify-start tw-border"
             :class="[heightClass, active ? 'tw-relative tw-border-light' : 'tw-border-neutral-200']">
            <div v-if="!active" :class="[iconHolderClass]" class="tw-flex tw-justify-center tw-items-center">
                <Icon :class="[iconClass]" :name="icon"/>
            </div>
            <div v-if="!active" class="tw-w-full tw-relative hover:tw-bg-neutral-100 tw-cursor-pointer">
                <div :class="[selectionClass]" class="tw-absolute tw-truncate tw-text-accent tw-flex tw-items-center">
                    {{selectionSummary}}
                </div>
                <div :class="[dropDownIconHolderClass]" class="tw-absolute tw-right-0 tw-top-0 tw-flex tw-justify-center tw-items-center">
                    <Icon :class="[dropDownIconClass]" name="ic:baseline-arrow-drop-down" />
                </div>
            </div>

            <div :class="[active ? 'tw-block' : 'tw-hidden']" class="tw-w-full tw-h-full tw-relative tw-overflow-hidden">
                <div :class="[inputHolderClass]" class="tw-absolute tw-left-0">
                    <Input
                        autocomplete="off"
                        class="tw-w-full"
                        ref="selectionSearch"
                        type="text"
                        placeholder="Search..."
                        v-on:focus="keepSelectionActive(2)"
                        v-on:blur="loseFocus(2)"
                        v-on:input="searchSelection"
                        v-model="props.options.search"
                        v-if="active"
                        :size="inputSize"
                        :withBorder="false"
                        :rounded="false"
                        :focusRing="false"
                        :disabled="false" />
                </div>
                <div :class="[dropDownIconHolderClass]" class="tw-absolute tw-right-0 tw-top-0 tw-flex tw-justify-center tw-items-center">
                    <Icon :class="[dropDownIconClass]" @click="clearSearch" class="tw-cursor-pointer hover:tw-bg-neutral-200" name="ic:baseline-clear" />
                </div>
            </div>
        </div>

        <div v-show="active" class="options-holder tw-z-10 tw-mt-[7px] tw-absolute tw-bg-white tw-border tw-border-light tw-w-max tw-drop-shadow-2xl">
            <div class="tw-absolute tw-border-solid tw-border-b-light" :style="[optionsArrowSlotClass]"></div>
            <div class="tw-absolute tw-border-solid tw-border-b-white" :style="[optionsArrowClass]"></div>
            <div class="tw-px-2 tw-pt-2" :class="[optionsFontClass]">
                {{searchPool.length ? `Select ` + label : 'Not Found.'}}
            </div>
            <div class="tw-max-h-[240px] tw-overflow-y-auto tw-border tw-border-t-lighter/25">
                <div
                    v-for="item in options.selection" :key="item.value"
                    class="tw-pl-1.5 hover:tw-bg-neutral-200 tw-flex tw-items-center tw-cursor-pointer"
                    :class="[isItemInSearchPool(item) ? '' : 'tw-hidden']"
                    @click="selectItem(item)">
                    <Icon class="tw-h-5 tw-w-[1.15rem]" :class="[isItemSelected(item) ? 'tw-text-accent' : 'tw-text-transparent']" name="ic:sharp-check-box"></Icon>
                    <span class="tw-text-accent tw-ml-0.5" :class="[optionsFontClass]">{{item.text}}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick  } from 'vue';

const props = defineProps({
    options: {
        type: Object,
        default: function () {
            return {
                search: '',
                data: [],
                selection: [],
                selected: []
            }
        }
    },
    icon: {
        type: String,
        default: 'ion:md-options'
    },
    label: {
        type: String,
        default: ''
    },
    key: {
        type: String,
        default: null
    },
    teleport: {
        type: String,
        default: null
    },
    size: {
        default: 'md'
    },
});

let keepFocus = ref(false);
let selectionSearch = ref(null);
let active = ref(false);
let searchPool = ref([]);
searchPool.value = props.options.data.map(item => item.value);

const heightClass = computed(() => {
    return {
        '2xs': 'tw-h-5',
        'xs': 'tw-h-6',
        'sm': 'tw-h-7',
        'md': 'tw-h-8'
    }[props.size];
});

const iconHolderClass = computed(() => {
    return {
        '2xs': 'tw-w-4',
        'xs': 'tw-w-6',
        'sm': 'tw-w-8',
        'md': 'tw-w-10'
    }[props.size];
});

const iconClass = computed(() => {
    return {
        '2xs': 'tw-h-4 tw-w-4',
        'xs': 'tw-h-5 tw-w-5',
        'sm': 'tw-h-5 tw-w-5',
        'md': 'tw-h-5 tw-w-5'
    }[props.size];
});

const dropDownIconHolderClass = computed(() => {
    return {
        '2xs': 'tw-w-5 tw-h-5',
        'xs': 'tw-w-6 tw-h-6',
        'sm': 'tw-w-7 tw-h-7',
        'md': 'tw-w-8 tw-h-8'
    }[props.size];
});

const dropDownIconClass = computed(() => {
    return {
        '2xs': 'tw-h-4 tw-w-4',
        'xs': 'tw-h-5 tw-w-5',
        'sm': 'tw-h-5 tw-w-5',
        'md': 'tw-h-5 tw-w-5'
    }[props.size];
});

const selectionClass = computed(() => {
    return {
        '2xs': 'tw-text-xs tw-h-5 tw-leading-[0.875rem] tw-left-[0.2rem] tw-right-[1.45rem]',
        'xs': 'tw-text-xs tw-h-6 tw-leading-[0.875rem] tw-left-[0.2rem] tw-right-[1.7rem]',
        'sm': 'tw-text-sm tw-h-7 tw-leading-[0.875rem] tw-left-[0.2rem] tw-right-[1.85rem]',
        'md': 'tw-text-sm tw-h-8 tw-leading-[0.875rem] tw-left-[0.2rem] tw-right-[2.2rem]'
    }[props.size];
});

const optionsFontClass = computed(() => {
    return {
        '2xs': 'tw-text-xs',
        'xs': 'tw-text-xs',
        'sm': 'tw-text-xs',
        'md': 'tw-text-base'
    }[props.size];
});

const inputHolderClass = computed(() => {
    return {
        '2xs': 'tw-right-5',
        'xs': 'tw-right-6',
        'sm': 'tw-right-7',
        'md': 'tw-right-8'
    }[props.size];
});

const inputSize = computed(() => {
    return {
        '2xs': '2xs',
        'xs': '2xs',
        'sm': 'xs',
        'md': 'sm'
    }[props.size];
});

const optionsArrowSlotClass = computed(() => {
    return {
        '2xs': {'left':'7px', 'top': '-5px', 'border-right': '5px solid transparent', 'border-left': '5px solid transparent', 'border-bottom': '5px'},
        'xs': {'left':'9px', 'top': '-7px', 'border-right': '7px solid transparent', 'border-left': '7px solid transparent', 'border-bottom': '7px'},
        'sm': {'left':'9px', 'top': '-7px', 'border-right': '7px solid transparent', 'border-left': '7px solid transparent', 'border-bottom': '7px'},
        'md': {'left':'9px', 'top': '-7px', 'border-right': '7px solid transparent', 'border-left': '7px solid transparent', 'border-bottom': '7px'}
    }[props.size];
});

const optionsArrowClass = computed(() => {
    return {
        '2xs': {'left':'8px', 'top': '-4px', 'border-right': '4px solid transparent', 'border-left': '4px solid transparent', 'border-bottom': '4px'},
        'xs': {'left':'10px', 'top': '-6px', 'border-right': '6px solid transparent', 'border-left': '6px solid transparent', 'border-bottom': '6px'},
        'sm': {'left':'10px', 'top': '-6px', 'border-right': '6px solid transparent', 'border-left': '6px solid transparent', 'border-bottom': '6px'},
        'md': {'left':'10px', 'top': '-6px', 'border-right': '6px solid transparent', 'border-left': '6px solid transparent', 'border-bottom': '6px'}
    }[props.size];
});

let selectionSummary = computed(() => {
    if(props.options.selected == null){
        return "None Selected"
    } else {
        return props.options.data.filter((item) => {
            return item.value == props.options.selected;
        })[0].text;
    }
});

async function keepSelectionActive(chain: number){
    if(!active.value){
        active.value = true;
        //Keep focus to prevent losing active status
        keepFocus.value = true;
    }

    //If keepSelectionActive called from (Selection div parent)
    //transfer the focus on the (Selection body search input)
    if(chain == 1){
        await nextTick();

        selectionSearch.value.$refs.input.focus();

        //Revert back keep focus to false
        //so that elements that is not (Selection div parent / Selection body search input)
        //got focused will not trigger keepSelectionActive
        setTimeout(function(){
            keepFocus.value = false;
        }, 20);
    }
}

function loseFocus(chain: number){
    //Lose only active status if keepFocus is false
    if(active.value && !keepFocus.value){
        active.value = false;
    }
}

function selectItem(item: any): void{
    if(isItemSelected(item)){
        props.options.selected = null;
    } else {
        props.options.selected = item.value;
    }

    loseFocus();
}

function isItemSelected(item): boolean{
    return props.options.selected == item.value;
}

function isItemInSearchPool(item): boolean{
    return searchPool.value.indexOf(item.value) >= 0;
}

function searchSelection(){
    if (!props.options.search.trim()){
        searchPool.value = props.options.data.map(item => item.value);
    } else {
        searchPool.value = props.options.data.filter(data => {
            return data.text.toLowerCase().indexOf(props.options.search.toLowerCase()) > -1
        }).map(item => item.value);
    }
}

function clearSearch(){
    props.options.search = "";
    searchPool.value = props.options.data.map(item => item.value);
}
</script>