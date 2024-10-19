<template>
    <div
        ref="selectParent"
        :tabindex="tabindexComputed"
        :style="{width: width}"
        class="tw-font-data focus:tw-outline-none">
        <Glint :enable="glint" :orientation="'landscape'" :color="activeBorderComputed">
            <div
                ref="selectHeader"
                :style="{'border-radius': '2px'}"
                class="tw-w-full tw-flex tw-justify-start background"
                :class="[heightClass, borderClass]">
                <div :class="[iconHolderClass]" class="tw-flex-none tw-flex tw-justify-end tw-items-center">
                    <ClientOnly><Icon :class="[iconClass]" :name="pending ? 'eos-icons:loading' : icon"/></ClientOnly>
                </div>
                <div v-if="!active" class="tw-w-full tw-relative tw-cursor-pointer">
                    <div :class="[selectionClass]" class="tw-absolute tw-truncate tw-flex tw-items-center">
                        {{selectionSummary}}
                    </div>
                    <div :class="[dropDownIconHolderClass]" class="tw-absolute tw-right-0 tw-top-0 tw-flex tw-justify-center tw-items-center">
                        <ClientOnly><Icon :class="[dropDownIconClass]" name="ic:baseline-arrow-drop-down" /></ClientOnly>
                    </div>
                </div>

                <div :class="[active ? 'tw-block' : 'tw-hidden']" class="tw-w-full tw-h-full tw-relative tw-overflow-hidden">
                    <div v-if="searchable" :class="[inputHolderClass]" class="tw-absolute tw-left-0 tw-h-full tw-flex tw-items-center">
                        <Input
                            v-if="active"
                            :tabindex="tabindexInput"
                            :readonly="!searchable"
                            autocomplete="off"
                            ref="selectionSearch"
                            :placeholder="searchable ? 'Search...' : selectionSummary"
                            @keydown="keyHandler"
                            @focusStateChanged="searchInputFocusStateChangedHandler"
                            v-model="props.payload.fetch.filters.search.keyword"
                            :size="inputSize"
                            :withBorder="false"
                            :rounded="false"
                            :focusRing="false"
                            :disabled="false" />
                    </div>
                    <div v-else :class="[selectionClass]" class="tw-absolute tw-truncate tw-flex tw-items-center">
                        {{selectionSummary}}
                    </div>
                    <div
                        :class="[dropDownIconHolderClass]"
                        class="tw-absolute tw-right-0 tw-top-0 tw-flex tw-justify-center tw-items-center">
                        <ClientOnly>
                            <Icon
                                v-if="searchable"
                                @click="clearSearch"
                                :class="[dropDownIconClass]"
                                class="tw-cursor-pointer"
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
            class="tw-z-40 tw-mt-[7px] background"
            :class="[dropShadow ? 'tw-drop-shadow-2xl' : '', selectionFloat ? 'tw-absolute' : 'tw-relative', borderClass]">
            <div class="tw-absolute tw-border-solid options-arrow-lining-color" :style="[optionsArrowSlotClass]"></div>
            <div class="tw-absolute tw-border-solid options-arrow-color" :style="[optionsArrowClass]"></div>
            <div class="tw-px-2 tw-pt-2 tw-text-left" :class="[optionsFontClass]">
                {{selectionHeaderSummary}}
            </div>
            <div tabindex="0" ref="selectionScroll" :style="{'max-height': selectionMaxHeight}" class="tw-overflow-auto">
                <UnorderedList
                    v-for="item in selection" :key="item.value"
                    class="tw-px-2 options-class tw-cursor-pointer"
                    @click="valuePersist && isItemSelected(item) ? false :selectItem(item)"
                    :icon="isItemSelected(item) ? 'ic:sharp-radio-button-checked' : 'ic:sharp-radio-button-unchecked'"
                    :size="selectionItemSize"
                    :label="item.text"/>
                <div v-show="showSelectionEndResult">
                    <UnorderedList
                        class="tw-px-2"
                        :icon="selectionEndResult.icon"
                        :size="selectionItemSize"
                        :label="selectionEndResult.label"/>
                </div>
                <div v-if="selectionMaxViewableLine == selection.length && !showSelectionEndResult" class="tw-h-8 tw-w-full tw-bg-transparent"></div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {storeToRefs} from 'pinia';
const {$coreStore,$themeStore} = useNuxtApp();
const clientReadyState = useClientReadyState();

const {
    lining: liningColor,
    thread: threadColor,
    neutral: neutralColor,
    tint: tintColor,
    text: textColor,
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
                selected: null
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
    valuePersist: {
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
let selection = ref([]);
let selected = ref({});
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
        '2xs': 'tw-h-5',
        'xs': 'tw-h-6',
        'sm': 'tw-h-7',
        'md': 'tw-h-8',
        'lg': 'tw-h-11'
    }[props.size];
});

const borderClass = computed(() => {
    return (active.value ? 'active-border' : 'idle-border');
});

const selectionItemSize = computed(() => {
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
        '2xs': 'tw-w-[1.2rem]',
        'xs': 'tw-w-[1.45rem]',
        'sm': 'tw-w-[1.7rem]',
        'md': 'tw-w-[1.7rem]',
        'lg': 'tw-w-[2.75rem]'
    }[props.size];
});

const iconClass = computed(() => {
    return {
        '2xs': 'tw-h-4 tw-w-4',
        'xs': 'tw-h-5 tw-w-5',
        'sm': 'tw-h-5 tw-w-5',
        'md': 'tw-h-5 tw-w-5',
        'lg': 'tw-h-8 tw-w-8'
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

    if(props.payload.selected == null){
        return "None Selected";
    } else {
        return selected.value.text;
    }
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

    const selected = _get(props, 'payload.selected', null);

    return {
        page: 1,
        perPage: 1,
        filters: {
            id: selected ? Array.of(selected) : []
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
    return props.payload.selected == item.value;
}

function selectItem(item: any): void{
    if(isItemSelected(item)){
        props.payload.selected = null;
        selected.value = null;
    } else {
        props.payload.selected = item.value;
        selected.value = item;
    }

    loseFocus();
}

function clearSearch(){
    if(!pending.value){
        props.payload.fetch.filters.search.keyword = "";
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
        params: selectedParamsComputed.value,
    }, {
        onRequestError: () => {
            pending.value = false;
        },
        onResponse: () => {
            pending.value = false;
        },
        onSuccessResponse: (request, response, options) => {
            let data = _get(response, '_data.values.selection.data', {});

            selected.value = Array.isArray(data) ? data[0] : {};
        }
    });
}

if(props.payload.selected){
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

.options-active{
    color: v-bind(textColor);
}
</style>