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
                <div :class="[iconHolderClass]" class="flex-none flex justify-end items-center">
                    <ClientOnly><Icon :class="[iconClass]" :name="pending ? 'eos-icons:loading' : icon"/></ClientOnly>
                </div>
                <div v-if="!active" class="w-full relative cursor-pointer">
                    <div :class="[selectionClass]" class="absolute truncate flex items-center">
                        {{selectionSummary}}
                    </div>
                    <div :class="[dropDownIconHolderClass]" class="absolute right-0 top-0 flex justify-center items-center">
                        <ClientOnly><Icon :class="[dropDownIconClass]" name="ic:baseline-arrow-drop-down" /></ClientOnly>
                    </div>
                </div>

                <div :class="[active ? 'block' : 'hidden']" class="w-full h-full relative overflow-hidden">
                    <div v-if="searchable" :class="[inputHolderClass]" class="absolute left-0 h-full flex items-center">
                        <Input
                            v-if="active"
                            :tabindex="tabindexInput"
                            :readonly="!searchable"
                            autocomplete="off"
                            ref="selectionSearch"
                            :placeholder="searchable ? 'Search...' : selectionSummary"
                            :override="{spacing: 'pl-[0.3rem] p-0'}"
                            @keydown="keyHandler"
                            @focusStateChanged="searchInputFocusStateChangedHandler"
                            v-model="props.payload.fetch.filters.search.keyword"
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
                                :name="pending ? 'eos-icons:loading' : 'ic:baseline-clear'" />
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

            <div v-show="selectedComputed.length" class="px-2 py-2 gap-1 flex overflow-x-scroll" :class="[optionsFontClass]">
                <Button
                    @focus-state-changed="toggleSelectedButtonVisibilityFocusStateChangedHandler"
                    @click="toggleSelectedVisibility"
                    :disabled="!selectedComputed.length"
                    :size="headerActionSize"
                    :icon="showSelectedToggleButton.icon"
                    :label="showSelectedToggleButton.label" />
                <Button
                    @focus-state-changed="clearSelectedButtonFocusStateChangedHandler"
                    @click="clearSelected"
                    :size="headerActionSize"
                    :icon="'ic:baseline-clear'"
                    :label="'Clear'"/>
            </div>
            <div v-show="showSelected" :style="{'height': selectedMaxHeight, 'max-height': selectedMaxHeight}" class="overflow-auto">
                <UnorderedList
                    v-for="item in selectedComputed" :key="item.text"
                    class="px-2 options-class"
                    :size="selectedItemSize"
                    :label="item.text"/>
            </div>
            <div class="horizontal-rule"></div>
            <div class="px-2 pt-2 text-left" :class="[optionsFontClass]">
                {{selectionHeaderSummary}}
            </div>
            <div tabindex="0" ref="selectionScroll" :style="{'max-height': selectionMaxHeight}" class="overflow-auto">
                <NonModelCheckBox
                    :size="checkBoxSize"
                    v-for="item in selection" :key="item.value"
                    class="px-2 options-class"
                    :checked="isItemSelected(item)"
                    :label="item.text"
                    :tabable="false"
                    @click="selectItem(item)"
                />
                <div v-show="showSelectionEndResult">
                    <UnorderedList
                        class="px-2"
                        :icon="selectionEndResult.icon"
                        :size="selectedItemSize"
                        :label="selectionEndResult.label"/>
                </div>
                <div v-if="selectionMaxViewableLine == selection.length && !showSelectionEndResult" class="h-8 w-full bg-transparent"></div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {useFocus, useScroll} from '@vueuse/core';
import {storeToRefs} from 'pinia';
const {$coreStore, $themeStore} = useNuxtApp();
const clientReadyState = useClientReadyState();

const {
    lining: liningColor,
    thread: threadColor,
    neutral: neutralColor,
    tint: tintColor
} = storeToRefs($themeStore);

const props = defineProps({
    payload: {
        type: Object,
        default: function () {
            return {
                fetch: {
                    url: null,
                    filters: {
                        search: {
                            keyword: '',
                            callback: 1
                        }
                    }
                },
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
    selectedMaxViewableLine: {
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
let tabindexInput = computed(()=>{
    return tabindexComputed.value + 1;
});
let keepFocus = ref(false);
let keepFocusCallback = ref(1);
let selection = ref([]);
let selected = ref([]);
let searchTriggered = ref(false);
let page = ref(1);
let perPage = computed(() => {
    return props.selectionMaxViewableLine;
});
let selectParent = ref(null);
let selectionSearch = ref(null);
let selectionScroll = ref<HTMLElement | null>(null);
let selectionEndResult = reactive({
    'icon': 'eos-icons:loading',
    'label': 'Loading...',
});
let showSelectedToggleButton = reactive({
    'icon': 'ion:md-eye',
    'label': 'Show Checked',
});
let showSelected = ref(false);
let selectHeader = ref(null);
let selectionOrigin = ref(null);
let selectionWidth = ref(null);
let selectionOffset = reactive({
    origin: null,
    left: 0
});

const { focused: selectParentFocused } = useFocus(selectParent);
const { focused: selectionScrollFocused } = useFocus(selectionScroll);

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
        'lg': 'h-11'
    }[props.size];
});

const borderClass = computed(() => {
    return (active.value ? 'active-border' : 'idle-border');
});

const selectedItemSize = computed(() => {
    return {
        '2xs': 'md',
        'xs': 'md',
        'sm': 'md',
        'md': 'md',
        'lg': 'lg'
    }[props.size];
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

const selectedMaxHeight = computed(() => {
    let rowSize = {
        '2xs': 24,
        'xs': 24,
        'sm': 24,
        'md': 24,
        'lg': 28
    }[props.size];

    return `${(rowSize ?? 24) * props.selectedMaxViewableLine}px`;
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

const headerActionSize = computed(() => {
    return {
        '2xs': 'xs',
        'xs': 'xs',
        'sm': 'xs',
        'md': 'xs',
        'lg': 'sm'
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

const selectionHeaderSummary = computed(()=>{
    return (props.payload.fetch.filters.search.keyword.trim() && selection.value.length == 0)
        ? 'Not Found.'
        : props.label;
});

const selectionSummary = computed(() => {

    if(pending.value){
        return 'Loading...';
    }

    const filteredSelected = selected.value
        .filter(item => item.text)
        .map(item => item.text);

    if (filteredSelected.length === 0){
        return "None selected";
    } else if (filteredSelected.length < 5){
        return filteredSelected.join(', ');
    } else {
        return `${filteredSelected.length} Selected`;
    }
});

const selectedComputed = computed(() => {
    return selected.value;
});

let paramsComputed = computed(() => {
    return {
        page: page.value,
        perPage: perPage.value,
        filters: {
            search: props.payload.fetch.filters.search.keyword
        }
    };
});

let selectedParamsComputed = computed(() => {

    const selected = _get(props, 'payload.selected', []);

    return {
        page: 1,
        perPage: selected.length,
        filters: {
            id: selected
        }
    };
});

const {
    y: selectionScrollY,
    arrivedState: selectionScrollArrivedState
} = useScroll(selectionScroll, { behavior: 'smooth' })
const {bottom: selectionScrollBottomReached} = toRefs(selectionScrollArrivedState);

const showSelectionEndResult = computed(() => {
    let selectionIsGreaterThanViewableMaxLine = selection.value.length > props.selectionMaxViewableLine;

    return selectionIsGreaterThanViewableMaxLine || pending.value;
});

function keepFocusAlive(){
    if(!active.value){
        active.value = true;
    }
    nextTick(() => {
        if(props.searchable){
            selectionSearch.value.$refs.input.focus();
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

function isItemSelected(item): boolean{
    return props.payload.selected.indexOf(item.value) >= 0;
}

async function selectItem(item: any): void{
    await nextTick();
    if(isItemSelected(item)){
        _remove(props.payload.selected, (value) => value == item.value);
        _remove(selected.value, (list) => list.value == item.value);
        if(selected.value.length == 0){
            resetSelectedVisibilityToggleButton();
        }
    } else {
        props.payload.selected.push(item.value);
        selected.value.push(item);
    }
}

function clearSearch(){
    if(!pending.value){
        props.payload.fetch.filters.search.keyword = "";
    }
}

function clearSelected(){
    props.payload.selected = [];
    selected.value = [];
    resetSelectedVisibilityToggleButton();
}

function resetSelectedVisibilityToggleButton(){
    showSelected.value = false;
    showSelectedToggleButton.icon = 'ion:md-eye';
    showSelectedToggleButton.label = 'Show Checked';
}

function toggleSelectedVisibility(){
    if(showSelected.value){
        resetSelectedVisibilityToggleButton()
    } else {
        showSelected.value = true;
        showSelectedToggleButton.icon = 'ion:md-eye-off';
        showSelectedToggleButton.label = 'Hide Checked';
    }
}

watch(active, async (newValue) => {
    await nextTick();

    //On active state: Fetch selection if selection is empty
    if(newValue && _isEmpty(selection.value)){
        execute();
    }

    //If selection is in horizontal scrollable
    //set selection options offset left to align just below its selection header
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

function toggleSelectedButtonVisibilityFocusStateChangedHandler(focused: boolean){
    if (focused) {
        keepFocusAlive();
    } else {
        loseFocus();
    }
}

function clearSelectedButtonFocusStateChangedHandler(focused: boolean){
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

const pending = ref(false);
const execute = async () => {
    pending.value = true;
    selectionEndResult.icon = 'eos-icons:loading';
    selectionEndResult.label = 'Loading...';

    await laraFetch(props.payload.fetch.url, {
        method: 'GET',
        params: paramsComputed.value,
    }, {
        onRequestError: () => {
            pending.value = false;
            selectionEndResult.icon = 'eos-icons:loading';
            selectionEndResult.label = 'Loading failed.';
        },
        onResponse: () => {
            pending.value = false;
            selectionEndResult.icon = 'eos-icons:loading';
            selectionEndResult.label = 'Please wait...';
        },
        onSuccessResponse: async (request, response, options) => {
            if(searchTriggered.value){
                selection.value = [];
            }

            let data = _get(response, '_data.values.selection.data', []);
            selection.value = selection.value.concat(data);

            if(searchTriggered.value){
                searchTriggered.value = false;

                await nextTick(() => {
                    selectionScrollY.value = 0;
                });
            }

            if(selection.value.length && data.length == 0){
                selectionEndResult.icon = 'radix-icons:dot';
                selectionEndResult.label = 'End of result.';
            }
        }
    });
}

watch(selectionScrollBottomReached, (bottomReached) => {
    if(bottomReached && active.value){
        page.value += 1;
        execute();
    }
});

watch(() => {
    return props.payload.fetch.filters.search.keyword;
}, (keyword) => {
    clearTimeout(props.payload.fetch.filters.search.callback);

    props.payload.fetch.filters.search.callback = setTimeout(() => {
        searchTriggered.value = true;
        page.value = 1;
        execute();
    }, 1500);
});

const selectedExecute = async () => {
    pending.value = true;

    await laraFetch(props.payload.fetch.url, {
        method: 'GET',
        params: selectedParamsComputed.value
    }, {
        onRequestError: () => {
            pending.value = false;
        },
        onResponse: () => {
            pending.value = false;
        },
        onSuccessResponse: (request, response, options) => {
            selected.value = _get(response, '_data.values.selection.data', []);
        }
    });
}

if(_get(props, 'payload.selected', []).length){
    selectedExecute();
}

onMounted(async () => {
    await nextTick(() => {
        let selectionOffsetWidth = selectHeader.value?.offsetWidth;

        if(selectionOffsetWidth !== null &&  selectionOffsetWidth !== undefined){
            selectionWidth.value = selectionOffsetWidth;
        }
    });
});

watch(clientReadyState, async (clientReady) => {
    if(clientReady){
        await nextTick(() => {
            let selectionOffsetWidth = selectHeader.value?.offsetWidth;

            if(selectionOffsetWidth !== null &&  selectionOffsetWidth !== undefined){
                selectionWidth.value = selectionOffsetWidth;
            }
        });
    }
})

</script>
<style scoped>
.background {
    background-color: v-bind(tintColor);
}

.horizontal-rule{
    height: 1px;
    width: 100%;
    background-color: v-bind(activeBorderComputed);
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