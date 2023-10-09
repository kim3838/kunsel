<template>
    <div
        tabindex="0"
        v-on:focus="keepSelectionActive(1)"
        v-on:blur="loseFocus(1)"
        :style="{width: width}"
        class="focus:tw-outline-none">
        <div
            ref="selectHeader"
            :style="{'border-radius': '2px'}"
            class="tw-w-full tw-flex tw-justify-start background"
            :class="[heightClass, borderClass]">
            <div v-if="!active" :class="[iconHolderClass]" class="tw-flex tw-justify-center tw-items-center">
                <Icon :class="[iconClass]" :name="pending ? 'eos-icons:loading' : icon"/>
            </div>
            <div v-if="!active" class="tw-w-full tw-relative tw-cursor-pointer">
                <div :class="[selectionClass]" class="tw-absolute tw-truncate tw-flex tw-items-center">
                    {{selectionSummary}}
                </div>
                <div :class="[dropDownIconHolderClass]" class="tw-absolute tw-right-0 tw-top-0 tw-flex tw-justify-center tw-items-center">
                    <Icon :class="[dropDownIconClass]" name="ic:baseline-arrow-drop-down" />
                </div>
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
                        v-model="props.payload.fetch.filters.search.keyword"
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
                        class="tw-cursor-pointer"
                        :name="pending ? 'eos-icons:loading' : 'ic:baseline-clear'" /><!-- eos-icons:installing --> <!-- eos-icons:loading -->
                </div>
            </div>
        </div>

        <div
            v-show="active"
            :style="[selectionOffsetComputed, selectionWidthComputed, {'border-radius': '2px'}]"
            ref="selectionOrigin"
            class="tw-z-30 tw-mt-[7px] background"
            :class="[dropShadow ? 'tw-drop-shadow-2xl' : '', selectionFloat ? 'tw-absolute' : 'tw-relative', borderClass]">
            <div class="tw-absolute tw-border-solid options-arrow-lining-color" :style="[optionsArrowSlotClass]"></div>
            <div class="tw-absolute tw-border-solid options-arrow-color" :style="[optionsArrowClass]"></div>
            <div class="border-bottom tw-px-2 tw-pt-2 tw-text-left" :class="[optionsFontClass]">
                Selected
            </div>
            <div class="tw-px-2 tw-pt-2 tw-text-left" :class="[optionsFontClass]">
                {{selectionHeaderSummary}}
            </div>
            <div :style="{'max-height': selectionMaxHeight}" class="tw-overflow-auto">
                <!-- :class="[isItemInSearchPool(item) ? '' : 'tw-hidden']" -->
                <NonModelCheckBox
                    :size="checkBoxSize"
                    v-for="item in selection" :key="item.value"
                    class="tw-px-2 options-class"

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
import {storeToRefs} from 'pinia';
const {$coreStore, $themeStore} = useNuxtApp();

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
                        },
                        id: []
                    }
                },
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
let selection = ref([]);
let page = ref(1);
let perPage = ref(10);
let selectionSearch = ref(null);
let selectHeader = ref(null);
let selectionOrigin = ref(null);
let selectionWidth = ref(null);
let selectionOffset = reactive({
    origin: null,
    left: 0
});
let active = ref(!!props.alwaysActive);

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

const selectionHeaderSummary = computed(()=>{
    return (props.payload.fetch.filters.search.keyword.trim() && selection.value.length == 0)
        ? 'Not Found.'
        : props.label;
});

const selectionSummary = computed(() => {
    return "Selection Summary";
    // if(props.options.selected.length === 0){
    //     return "None Selected";
    // } else if(props.options.selected.length < 5) {
    //     return props.options.data.filter((item) => {
    //         return props.options.selected.indexOf(item.value) >= 0;
    //     }).map(item => item.text).join(", ");
    // } else if(props.options.selected.length > 4) {
    //     let summary = '';
    //
    //     if (props.options.selected.length < props.options.data.length) {
    //         summary = `${props.options.selected.length} Selected`;
    //     } else if (props.options.selected.length === props.options.data.length){
    //         summary = `All Selected`;
    //     }
    //
    //     return summary;
    // }
});

function isItemSelected(item): boolean{
    return props.payload.selected.indexOf(item.value) >= 0;
}

function selectItem(item: any): void{
    if(isItemSelected(item)){
        _remove(props.payload.selected, (value) => value == item.value);
    } else {
        props.payload.selected.push(item.value);
    }
}

function searchSelection(){

}

function clearSearch(){
    if(!pending.value){
        props.payload.fetch.filters.search.keyword = "";
    }
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

let paramsComputed = computed(() => {
    return {
        page: page.value,
        perPage: perPage.value,
        filters: {
            search: props.payload.fetch.filters.search.keyword
        }
    };
});

const {pending, execute} = csrFetch(props.payload?.fetch.url, {
    method: 'GET',
    params: paramsComputed,
    onRequest(){

    },
    onRequestError({ request, options, error }) {
        $coreStore.setServiceError({
            prompt: true,
            icon: 'ic:sharp-error-outline',
            title: 'Request failed',
            payload: {message: error.message}
        });
    },
    onResponse({request, response, options}) {
        //Todo: Response composable handler
        if (response._data.code >= 500 && response._data.code < 600) {
            $coreStore.setServiceError({
                prompt: true,
                icon: 'ic:sharp-error-outline',
                title: 'Something Went Wrong',
                payload: response._data
            });
        } else {
            selection.value = _get(response, '_data.values.selection.data', []);
        }
    }
});
watch(pending, async (newPending, oldPending) => {
    console.log({pending: newPending});
});
watch(() => {
    return props.payload.fetch.filters.search.keyword;
}, (keyword) => {
    clearTimeout(props.payload.fetch.filters.search.callback);

    props.payload.fetch.filters.search.callback = setTimeout(() => {
        execute();
    }, 1500);
});
</script>
<style scoped>
.background {
    background-color: v-bind(tintColor);
}

.border-bottom{
    border-bottom:1px solid v-bind(neutralColor);
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