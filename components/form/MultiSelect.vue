<template>
    <div
        ref="selectParent"
        :tabindex="tabindexComputed"
        :style="{width: width}"
        class="font-data focus:outline-none">
        <Glint :enable="glint" :orientation="'landscape'" :color="activeBorderComputed">
            <div
                ref="selectHeader"
                :style="{'border-radius': '2px'}"
                class="w-full flex justify-start background"
                :class="[heightClass, borderClass]">
                <div v-if="!active" :class="[iconHolderClass]" class="flex-none flex justify-end items-center">
                    <ClientOnly><Icon :class="[iconClass]" :name="icon"/></ClientOnly>
                </div>
                <div v-if="!active" class="w-full relative cursor-pointer">
                    <div :class="[selectionClass]" class="absolute truncate flex items-center">
                        {{selectionSummary}}
                    </div>
                    <div :class="[dropDownIconHolderClass]" class="absolute right-0 top-0 flex justify-center items-center">
                        <ClientOnly><Icon :class="[dropDownIconClass]" name="ic:baseline-arrow-drop-down" /></ClientOnly>
                    </div>
                </div>

                <div :class="[active ? 'block pl-2' : 'hidden']" class="flex items-center">
                    <NonModelCheckBox @focusStateChanged="selectionToggleFocusStateChangedHandler" :tabable="false" :size="checkBoxSize" :checked="selectedAllCurrentSelection()" @click="toggleSelection" />
                </div>
                <div :class="[active ? 'block' : 'hidden']" class="w-full h-full relative overflow-hidden items-center">
                    <div v-if="searchable" :class="[inputHolderClass]" class="absolute left-0 h-full flex items-center">
                        <Input
                            v-if="active"
                            :tabindex="tabindexInput"
                            :readonly="!searchable"
                            autocomplete="off"
                            class="w-full"
                            ref="selectionSearch"
                            :placeholder="searchable ? 'Search...' : selectionSummary"
                            :override="{spacing: 'pl-[0.3rem] p-0'}"
                            @keydown="keyHandler"
                            @focusStateChanged="searchInputFocusStateChangedHandler"
                            v-on:input="searchSelection"
                            v-model="props.options.search"
                            :size="inputSize"
                            :withBorder="false"
                            :rounded="false"
                            :focusRing="false"
                            :disabled="false" />
                    </div>
                    <div v-else :class="[selectionClass]" class="absolute truncate flex items-center">
                        {{selectionSummary}}
                    </div>
                    <div
                        :class="[dropDownIconHolderClass]"
                        class="absolute right-0 top-0 flex justify-center items-center">
                        <ClientOnly>
                            <Icon
                                v-if="searchable"
                                @click="clearSearch"
                                :class="[dropDownIconClass]"
                                class="cursor-pointer"
                                name="ic:baseline-clear" />
                        </ClientOnly>
                    </div>
                </div>
            </div>
        </Glint>

        <div
            v-show="active"
            :style="[selectionOffsetComputed, selectionWidthComputed, {'border-radius': '2px'}]"
            ref="selectionOrigin"
            class="z-40 mt-[7px] background"
            :class="[dropShadow ? 'drop-shadow-sm' : '', selectionFloat ? 'absolute' : 'relative', borderClass]">
            <div class="absolute border-solid options-arrow-lining-color" :style="[optionsArrowSlotClass]"></div>
            <div class="absolute border-solid options-arrow-color" :style="[optionsArrowClass]"></div>
            <div class="px-2 pt-2 text-left" :class="[optionsFontClass]">
                {{selectionHeaderSummary}}
            </div>
            <div tabindex="0" ref="selectionScroll" :style="{'max-height': selectionMaxHeight}" class="overflow-auto">
                <NonModelCheckBox
                    :size="checkBoxSize"
                    v-for="item in options.selection" :key="item.value"
                    class="px-2 options-class"
                    :class="[isItemInSearchPool(item) ? '' : 'hidden']"
                    :checked="isItemSelected(item)"
                    :label="item.text"
                    :tabable="false"
                    @focusStateChanged="selectionToggleFocusStateChangedHandler"
                    @click="selectItem(item)"
                />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {storeToRefs} from 'pinia';
const {$themeStore} = useNuxtApp();

const {
    lining: liningColor,
    thread: threadColor,
    neutral: neutralColor,
    tint: tintColor
} = storeToRefs($themeStore);

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
    tabindex: {
        type: Number,
        default: 0
    },
    inHorizontalScrollable: Boolean,
    dropShadow: Boolean,
    alwaysActive: Boolean,
    glint: {
        type: Boolean,
        default: false
    },
    width: {
        type: String,
        default: '100%'
    },
    idleBorder: {
        type: String,
        default: ''
    },
    activeBorder: {
        type: String,
        default: ''
    },
    selectionMaxContent: {
        type: Boolean,
        default: true
    },
    selectionMaxViewableLine: {
        type: Number,
        default: 10
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

let active = ref(!!props.alwaysActive);
let backTabbed = ref(false);
let tabindexComputed = toRef(props.tabindex);
let tabindexInput = computed(() => {
    return tabindexComputed.value + 1;
});
let keepFocus = ref(false);
let keepFocusCallback = ref(1);
let selectParent = ref(null);
let selectionSearch = ref(null);
let selectionScroll = ref<HTMLElement | null>(null);
let selectHeader = ref(null);
let selectionOrigin = ref(null);
let selectionWidth = ref(null);
let selectionOffset = reactive({
    origin: null,
    left: 0
});

const { focused: selectParentFocused } = useFocus(selectParent);
const { focused: selectionScrollFocused } = useFocus(selectionScroll);

let searchPool = ref([]);
searchPool.value = props.options.data.map(item => item.value);

const idleBorderComputed = computed(() => {
    return props.idleBorder ? props.idleBorder : threadColor.value;
});

const activeBorderComputed = computed(() => {
    return props.activeBorder ? props.activeBorder : liningColor.value;
});

const heightClass = computed(() => {
    return {
        '2xs': 'h-5',
        'xs': 'h-6',
        'sm': 'h-7',
        'md': 'h-8',
        'lg': 'h-11',
    }[props.size];
});

const borderClass = computed(() => {
    return (active.value ? 'active-border' : 'idle-border');
});

const checkBoxSize = computed(() => {
    return {
        '2xs': 'sm',
        'xs': 'sm',
        'sm': 'sm',
        'md': 'md',
        'lg': 'lg'
    }[props.size];
});

const iconHolderClass = computed(() => {
    return {
        '2xs': 'w-[1.2rem]',
        'xs': 'w-[1.45rem]',
        'sm': 'w-[1.7rem]',
        'md': 'w-[1.7rem]',
        'lg': 'w-[2.75rem]'
    }[props.size];
});

const iconClass = computed(() => {
    return {
        '2xs': 'h-4 w-4',
        'xs': 'h-5 w-5',
        'sm': 'h-5 w-5',
        'md': 'h-5 w-5',
        'lg': 'h-8 w-8'
    }[props.size];
});

const dropDownIconHolderClass = computed(() => {
    return {
        '2xs': 'w-5 h-5',
        'xs': 'w-6 h-6',
        'sm': 'w-7 h-7',
        'md': 'w-8 h-8',
        'lg': 'w-11 h-11'
    }[props.size];
});

const dropDownIconClass = computed(() => {
    return {
        '2xs': 'h-4 w-4',
        'xs': 'h-5 w-5',
        'sm': 'h-5 w-5',
        'md': 'h-5 w-5',
        'lg': 'h-6 w-6'
    }[props.size];
});

const selectionMaxHeight = computed(() => {
    let rowSize = {
        '2xs': 20,
        'xs': 20,
        'sm': 20,
        'md': 24,
        'lg': 28
    }[props.size];

    return `${(rowSize ?? 24) * props.selectionMaxViewableLine}px`;
});

const selectionClass = computed(() => {
    return {
        '2xs': 'text-xs h-5 leading-[0.875rem] left-[0.2rem] right-[1.45rem]',
        'xs': 'text-xs h-6 leading-[0.875rem] left-[0.2rem] right-[1.7rem]',
        'sm': 'text-sm h-7 leading-[0.875rem] left-[0.2rem] right-[1.85rem]',
        'md': 'text-base h-8 leading-[0.875rem] left-[0.2rem] right-[2.2rem]',
        'lg': 'text-lg h-11 leading-[0.875rem] left-[0.2rem] right-[2.95rem]',
    }[props.size];
});

const optionsFontClass = computed(() => {
    return {
        '2xs': 'text-base',
        'xs': 'text-base',
        'sm': 'text-base',
        'md': 'text-base',
        'lg': 'text-lg'
    }[props.size];
});

const inputHolderClass = computed(() => {
    return {
        '2xs': 'right-5',
        'xs': 'right-6',
        'sm': 'right-7',
        'md': 'right-8',
        'lg': 'right-11',
    }[props.size];
});

const inputSize = computed(() => {
    return {
        '2xs': 'xs',
        'xs': 'md',
        'sm': 'md',
        'md': 'md',
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

    if(selectionWidth.value === null || props.selectionMaxContent){
        widthStyles['width'] = 'max-content';

        if(selectionWidth.value != null){
            widthStyles['min-width'] = `${selectionWidth.value}px`;
        }
    } else {
        widthStyles['width'] = `${selectionWidth.value}px`;
    }

    return widthStyles;
});

function keepFocusAlive(){
    if(!active.value){
        active.value = true;
    }
    nextTick(() => {
        if(props.searchable){
            selectionSearch.value.$refs.input.focus();
        } else {
            selectParentFocused.value = true;
        }

        clearTimeout(keepFocusCallback.value);
        keepFocus.value = true;

        keepFocusCallback.value = setTimeout(() => {
            keepFocus.value = false;
        }, 20);
    });
}

function loseFocus(chain: Boolean = false){
    setTimeout(function(){
        //Lose only active status if keepFocus is false or Not Active Lock
        if(active.value && !keepFocus.value && !props.alwaysActive){
            active.value = false;
        }
    }, 10);
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

watch(selectParentFocused, (focused) => {
    if (focused) {
        if(backTabbed.value){
            loseFocus();
        } else {
            keepFocusAlive();
        }
    } else {
        loseFocus();
    }
});
watch(selectionScrollFocused, (focused) => {
    if (focused) {
        keepFocusAlive();
    } else {
        loseFocus();
    }
});

function selectionToggleFocusStateChangedHandler(focused: boolean) {
    if (focused) {
        keepFocusAlive();
    } else {
        loseFocus();
    }
}

function searchInputFocusStateChangedHandler(focused: boolean) {
    if (focused) {
        keepFocusAlive();
    } else {
        loseFocus();
    }
}

function keyHandler(event) {
    let key = event.which;

    if (event.shiftKey && event.keyCode === 9){
        handleBackTab();
    }
}

function handleBackTab() {
    backTabbed.value = true;
    tabindexComputed.value = tabindexComputed.value * -1;

    setTimeout(function() {
        backTabbed.value = false;
        tabindexComputed.value = Math.abs(tabindexComputed.value);
    }, 10)
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
.background {
    background-color: v-bind(tintColor);
}

.idle-border {
    border-width: 1px;
    border-color: v-bind(idleBorderComputed) !important;
}

.active-border {
    border-width: 1px;
    border-color: v-bind(activeBorderComputed) !important;
}

.options-arrow-lining-color{
    border-bottom-color: v-bind(activeBorderComputed) !important;
}

.options-arrow-color {
    border-bottom-color: v-bind(tintColor) !important;
}

.options-class:hover{
    background-color: v-bind(neutralColor);
}
</style>