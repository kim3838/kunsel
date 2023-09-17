<template>
    <div
        tabindex="0"
        v-on:focus="keepSelectionActive(1)"
        v-on:blur="loseFocus(1)"
        :style="{width: width}"
        class="focus:tw-outline-none tw-bg-white">
        <div
            ref="selectHeader"
            :style="{'border-radius': '2px'}"
            class="tw-w-full tw-flex tw-justify-start"
            :class="[heightClass, borderClass]">
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

            <div :class="[active ? 'tw-block tw-pl-2' : 'tw-hidden']" class="tw-flex tw-items-center">
                <NonModelCheckBox :size="checkBoxSize" :checked="selectedAllCurrentSelection()" @click="toggleSelection" />
            </div>
            <div :class="[active ? 'tw-block' : 'tw-hidden']" class="tw-w-full tw-h-full tw-relative tw-overflow-hidden tw-items-center">
                <div :class="[inputHolderClass]" class="tw-absolute tw-left-0 tw-h-full tw-flex tw-items-center">
                    <Input
                        :readonly="!searchable"
                        autocomplete="off"
                        class="tw-w-full"
                        ref="selectionSearch"
                        type="text"
                        :placeholder="searchable ? 'Search...' : selectionSummary"
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
                <div
                    :class="[dropDownIconHolderClass]"
                    class="tw-absolute tw-right-0 tw-top-0 tw-flex tw-justify-center tw-items-center">
                    <Icon
                        v-if="searchable"
                        @click="clearSearch"
                        :class="[dropDownIconClass]"
                        class="tw-cursor-pointer hover:tw-bg-neutral-200"
                        name="ic:baseline-clear" />
                </div>
            </div>
        </div>

        <div
            v-show="active"
            :style="[selectionOffsetComputed, selectionWidthComputed, {'border-radius': '2px'}]"
            ref="selectionOrigin"
            class="tw-z-10 tw-mt-[7px] tw-bg-white tw-border tw-border-light"
            :class="[dropShadow ? 'tw-drop-shadow-2xl' : '', selectionFloat ? 'tw-absolute' : 'tw-relative']">
            <div class="tw-absolute tw-border-solid tw-border-b-light" :style="[optionsArrowSlotClass]"></div>
            <div class="tw-absolute tw-border-solid tw-border-b-white" :style="[optionsArrowClass]"></div>
            <div class="tw-px-2 tw-pt-2 tw-text-left" :class="[optionsFontClass]">
                {{selectionHeaderSummary}}
            </div>
            <div :style="{'max-height': selectionMaxHeight}" class="tw-overflow-auto tw-border tw-border-t-lighter/25">
                <NonModelCheckBox
                    :size="checkBoxSize"
                    v-for="item in options.selection" :key="item.value"
                    class="tw-px-2 hover:tw-bg-neutral-200"
                    :class="[isItemInSearchPool(item) ? '' : 'tw-hidden']"
                    :checked="isItemSelected(item)"
                    :label="item.text"
                    :tabable="false"
                    @click="selectItem(item)"
                />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {ref, computed, nextTick, watch, onMounted} from 'vue';

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
    inHorizontalScrollable: Boolean,
    dropShadow: Boolean,
    alwaysActive: Boolean,
    width: {
        type: String,
        default: '100%'
    },
    idleBorder: {
        type: String,
        default: '#e5e5e5'//neutral-200
    },
    selectionMaxWidth: {
        type: Boolean,
        default: true
    },
    selectionMaxHeight: {
        type: String,
        default: '240px'
    },
    selectionFloat: {
        type: Boolean,
        default: true
    },
    searchable: {
        type: Boolean,
        default: true
    },
    scrollReference: {
        type: Object,
        default: null
    },
    icon: {
        type: String,
        default: 'ion:md-options'
    },
    label: {
        type: String,
        default: 'Select'
    },
    size: {
        default: 'md'
    },
});

let keepFocus = ref(false);
let selectionSearch = ref(null);
let selectHeader = ref(null);
let selectionOrigin = ref(null);
let selectionWidth = ref(null);
let selectionOffset = reactive({
    origin: null,
    left: 0
});
let active = ref(!!props.alwaysActive);
let searchPool = ref([]);
searchPool.value = props.options.data.map(item => item.value);

const heightClass = computed(() => {
    return {
        '2xs': 'tw-h-5',
        'xs': 'tw-h-6',
        'sm': 'tw-h-7',
        'md': 'tw-h-8',
        'lg': 'tw-h-11'
    }[props.size];
});

const borderClass = computed(() => {
    return (active.value ? 'tw-border tw-border-light' : 'idle-border');
});

const checkBoxSize = computed(() => {
    return {
        '2xs': 'md',
        'xs': 'md',
        'sm': 'md',
        'md': 'md',
        'lg': 'lg'
    }[props.size];
});

const iconHolderClass = computed(() => {
    return {
        '2xs': 'tw-w-4',
        'xs': 'tw-w-6',
        'sm': 'tw-w-8',
        'md': 'tw-w-10',
        'lg': 'tw-w-11'
    }[props.size];
});

const iconClass = computed(() => {
    return {
        '2xs': 'tw-h-4 tw-w-4',
        'xs': 'tw-h-5 tw-w-5',
        'sm': 'tw-h-5 tw-w-5',
        'md': 'tw-h-5 tw-w-5',
        'lg': 'tw-h-6 tw-w-6'
    }[props.size];
});

const dropDownIconHolderClass = computed(() => {
    return {
        '2xs': 'tw-w-5 tw-h-5',
        'xs': 'tw-w-6 tw-h-6',
        'sm': 'tw-w-7 tw-h-7',
        'md': 'tw-w-8 tw-h-8',
        'lg': 'tw-w-11 tw-h-11'
    }[props.size];
});

const dropDownIconClass = computed(() => {
    return {
        '2xs': 'tw-h-4 tw-w-4',
        'xs': 'tw-h-5 tw-w-5',
        'sm': 'tw-h-5 tw-w-5',
        'md': 'tw-h-5 tw-w-5',
        'lg': 'tw-h-6 tw-w-6'
    }[props.size];
});

const selectionClass = computed(() => {
    return {
        '2xs': 'tw-text-xs tw-h-5 tw-leading-[0.875rem] tw-left-[0.2rem] tw-right-[1.45rem]',
        'xs': 'tw-text-xs tw-h-6 tw-leading-[0.875rem] tw-left-[0.2rem] tw-right-[1.7rem]',
        'sm': 'tw-text-sm tw-h-7 tw-leading-[0.875rem] tw-left-[0.2rem] tw-right-[1.85rem]',
        'md': 'tw-text-sm tw-h-8 tw-leading-[0.875rem] tw-left-[0.2rem] tw-right-[2.2rem]',
        'lg': 'tw-text-lg tw-h-11 tw-leading-[0.875rem] tw-left-[0.2rem] tw-right-[2.95rem]',
    }[props.size];
});

const optionsFontClass = computed(() => {
    return {
        '2xs': 'tw-text-base',
        'xs': 'tw-text-base',
        'sm': 'tw-text-base',
        'md': 'tw-text-base',
        'lg': 'tw-text-lg'
    }[props.size];
});

const inputHolderClass = computed(() => {
    return {
        '2xs': 'tw-right-5',
        'xs': 'tw-right-6',
        'sm': 'tw-right-7',
        'md': 'tw-right-8',
        'lg': 'tw-right-11',
    }[props.size];
});

const inputSize = computed(() => {
    return {
        '2xs': '2xs',
        'xs': '2xs',
        'sm': 'xs',
        'md': 'sm',
        'lg': 'lg',
    }[props.size];
});

const optionsArrowSlotClass = computed(() => {
    return {'left':'9px', 'top': '-7px', 'border-right': '7px solid transparent', 'border-left': '7px solid transparent', 'border-bottom': '7px'};
});

const optionsArrowClass = computed(() => {
    return {'left':'10px', 'top': '-6px', 'border-right': '6px solid transparent', 'border-left': '6px solid transparent', 'border-bottom': '6px'};
});

const selectionHeaderSummary = computed(()=>{
    return searchPool.value.length ? props.label : 'Not Found.';
});

const selectionSummary = computed(() => {
    if(props.options.selected.length === 0){
        return "None Selected";
    } else if(props.options.selected.length < 5) {
        return props.options.data.filter((item) => {
            return props.options.selected.indexOf(item.value) >= 0;
        }).map(item => item.text).join(", ");
    } else if(props.options.selected.length > 4) {
        let summary = '';

        if (props.options.selected.length < props.options.data.length) {
            summary = `${props.options.selected.length} Selected`;
        } else if (props.options.selected.length === props.options.data.length){
            summary = `All Selected`;
        }

        return summary;
    }
});

const selectionOffsetComputed = computed(()=>{
    let offsetStyles = {};

    if (selectionOffset.origin === null || !props.inHorizontalScrollable){

    } else {
        offsetStyles['left'] = `${selectionOffset.left}px`
    }

    return offsetStyles;
});

const selectionWidthComputed = computed(()=>{
    let widthStyles = {};

    if(selectionWidth.value === null || props.selectionMaxWidth){
        widthStyles['width'] = 'max-content';

        if(selectionWidth.value != null){
            widthStyles['min-width'] = `${selectionWidth.value}px`;
        }
    } else {
        widthStyles['width'] = `${selectionWidth.value}px`;
    }

    return widthStyles;
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
    //Lose only active status if keepFocus is false or Not Active Lock
    if(active.value && !keepFocus.value && !props.alwaysActive){
        active.value = false;
    }
}

function toggleSelection(){
    if (props.options.search.trim()){
        if (selectedAllCurrentSelection()){
            props.options.selected = props.options.selected.filter(value => {
                return !isItemInSearchPool({value: value});
            });
        } else {
            let selectedNotInSearch = props.options.selected.filter(value => {
                return !isItemInSearchPool({value: value});
            });
            let selectionInSearch = props.options.selection.filter(data => {
                return data.text.toLowerCase().indexOf(props.options.search.trim().toLowerCase()) > -1
            }).map(item => item.value);

            props.options.selected = _uniq(selectedNotInSearch.concat(selectionInSearch));
        }
    } else {
        if (selectedAllCurrentSelection()){
            props.options.selected = [];
        } else {
            props.options.selected = props.options.selection.map(item => item.value);
        }
    }
}

function selectedAllCurrentSelection(): boolean {
    if (props.options.search.trim()){
        let selected = props.options.selected.filter(value => {
            return isItemInSearchPool({value: value});
        });

        let selection = props.options.selection.filter(data => {
            return data.text.toLowerCase().indexOf(props.options.search.trim().toLowerCase()) > -1
        });

        return (selection.length > 0) && (selected.length === selection.length);
    } else {
        return props.options.selected.length === props.options.selection.length;
    }
}

function selectedSomeCurrentSelection(): boolean {
    if (props.options.search.trim()){
        let selected = props.options.selected.filter(value => {
            return isItemInSearchPool({value: value});
        });

        return selected.length > 0 && !selectedAllCurrentSelection();
    } else {
        return props.options.selected.length > 0 && !selectedAllCurrentSelection();
    }
}

function headerIcon(): string{
    if (selectedAllCurrentSelection()) return 'ic:sharp-check-box';
    if (selectedSomeCurrentSelection()) return 'ic:sharp-indeterminate-check-box';
    return 'ic:sharp-check-box-outline-blank';
}

function selectItem(item: any): void{
    if(isItemSelected(item)){
        _remove(props.options.selected, (value) => value == item.value);
    } else {
        props.options.selected.push(item.value);
    }
}

function isItemSelected(item): boolean{
    return props.options.selected.indexOf(item.value) >= 0;
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

watch(active, async (newValue) => {
    await nextTick();
    selectionWidth.value = selectHeader.value.offsetWidth;

    if(props.inHorizontalScrollable){
        if(selectionOffset.origin === null){
            selectionOffset.origin = selectionOrigin.value.offsetLeft;
        }

        if(newValue){
            let originOffsetLeft = selectionOffset.origin;
            let parentScrollLeft = props.scrollReference.scrollLeft;
            let offsetLeft = originOffsetLeft - parentScrollLeft;
            selectionOffset.left = offsetLeft < 0 ? 0 : offsetLeft;
        } else {
            selectionOffset.left = selectionOffset.origin;
        }
    }
});

onMounted(async () => {
    await nextTick();
    selectionWidth.value = selectHeader.value.offsetWidth;
});
</script>
<style scoped>
.idle-border {
    border-width: 1px;
    border-color: v-bind(idleBorder);
}
</style>