<template>
    <div
        ref="selectParent"
        :tabindex="tabindexComputed"
        :style="{width: width}"
        class="focus:outline-none"
        :class="[navigationMode ? 'relative' : '', baseFontFamilyClass]">
        <Glint :enable="glint" :orientation="'landscape'" :color="activeBorderComputed">
            <div
                ref="selectHeader"
                :style="{'border-radius': '2px'}"
                class="w-full flex justify-start background"
                :class="[heightClass, headerBorderClass, navigationMode ? 'navigation-mode' : defaultModeSpacingClass]">
                <div v-if="icon" :class="[iconHolderClass]" class="flex-none flex justify-end items-center">
                    <ClientOnly><Icon :class="[iconClass]" :name="icon"/></ClientOnly>
                </div>
                <div v-if="!active && !navigationMode" class="w-full relative cursor-pointer">
                    <div :class="[selectionClass]" class="absolute truncate flex items-center">
                        {{selectionSummary}}
                    </div>
                    <div :class="[dropDownIconHolderClass]" class="absolute right-0 top-0 flex justify-center items-center">
                        <ClientOnly><Icon :class="[dropDownIconClass]" name="ic:baseline-arrow-drop-down" /></ClientOnly>
                    </div>
                </div>
                <div v-if="!active && navigationMode" class="h-full inline-flex items-center cursor-pointer" :class="[navigationModeSpacingClass]">
                    <div :class="[selectionClass]" class="truncate h-full inline-flex items-center">
                        {{selectionSummary}}
                    </div>
                    <Icon :class="[dropDownIconClass]" name="ic:baseline-arrow-drop-down" />
                </div>

                <div v-if="!navigationMode" :class="[active ? 'block' : 'hidden']" class="w-full h-full relative overflow-hidden">
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

                <div v-if="navigationMode" :class="[active ? 'block' : 'hidden', navigationModeSpacingClass]" class="h-full relative overflow-hidden">
                    <div v-if="searchable" :class="[inputHolderClass]" class="left-0 h-full flex items-center">
                        <Input
                            v-if="active"
                            :tabindex="tabindexInput"
                            :readonly="!searchable"
                            autocomplete="off"
                            class=""
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
                    <div v-else :class="[selectionClass]" class="truncate h-full inline-flex items-center">
                        {{selectionSummary}}
                        <Icon :class="[dropDownIconClass]" name="ic:baseline-arrow-drop-down" />
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
                <UnorderedList
                    v-for="item in selectionOptions" :key="`${item.value}-${selectionOptionsKey}`"
                    class="px-2 options-class cursor-pointer"
                    :class="[isItemInSearchPool(item) ? '' : 'hidden', optionsFontClass]"
                    @click="valuePersist && isItemSelected(item) ? false :selectItem(item)"
                    :icon="isItemSelected(item) ? 'ic:sharp-radio-button-checked' : 'ic:sharp-radio-button-unchecked'"
                    :size="selectionItemSize"
                    :label="item.text"/>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {storeToRefs} from 'pinia';
import type {
    SelectValueInterface,
    SelectDataType,
    SingleSelectSelectionOffsetT,
    SelectSearchPoolT,
} from "@/public/js/types/form";
const {$themeStore} = useNuxtApp();

const {
    hexAlpha,
    accent: accentColor,
    lining: liningColor,
    thread: threadColor,
    neutral: neutralColor,
    tint: tintColor,
    text: textColor,
} = storeToRefs($themeStore);

const accentColor40 = computed(() => {
    return accentColor.value + hexAlpha.value['40'];
});

const props = defineProps({
    options: {
        type: Object,
        default: function () {
            return {
                search: '',
                data: [],
                selection: [],
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
    navigationMode: {
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
    disableHeaderBorder: {
        type: Boolean,
        default: false
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
        type: Object as PropType<HTMLElement | null>,
        default: null
    },
    icon: {
        type: String,
        default: null
    },
    label: {
        type: String,
        default: 'Select'
    },
    size: {
        default: 'md'
    },
    dropAlign: {
        default: 'left'
    },
    override: {
        type: Object,
        default: function () {
            return {}
        }
    },
});

let active = ref(!!props.alwaysActive);
let backTabbed = ref(false);
let tabindexComputed = toRef(props.tabindex);
let tabindexInput = computed(() => {
    return tabindexComputed.value + 1;
});
let keepFocus = ref(false);
let keepFocusCallback = ref<ReturnType<typeof setTimeout> | number>(1);
let selectParent = ref(null);
let selectionSearch = ref(null);
let selectionScroll = ref<HTMLElement | null>(null);
let selectHeader = ref<HTMLElement | null>(null);
let selectionOrigin = ref<HTMLElement | null>(null);
const selectionOriginRef = useTemplateRef('selectionOrigin');
let selectionHeaderWidth = ref<number | null>(null);
let selectionOffset = reactive<SingleSelectSelectionOffsetT>({
    origin: null,
    left: '0'
});

const searchPool = ref<SelectSearchPoolT>(props.options.data.map((item: SelectDataType) => item.value));
const selectionOptionsKey = ref(0);
const selectionOptions = ref(props.options.selection);

watch(() => props.options.selection, (newValue)=>{
    selectionOptions.value = newValue;
    selectionOptionsKey.value++;
})
watch(() => props.options.data, (newValue)=>{
    searchPool.value = newValue.map((item: SelectDataType) => item.value);
})

const { focused: selectParentFocused } = useFocus(selectParent);
const { focused: selectionScrollFocused } = useFocus(selectionScroll);

const idleBorderComputed = computed(() => {
    return props.idleBorder ? props.idleBorder : threadColor.value;
});

const activeBorderComputed = computed(() => {
    return props.activeBorder ? props.activeBorder : liningColor.value;
});

const heightClass = computed(() => {

    if(props.override.height){
        return props.override.height;
    }

    return {
        '2xs': 'h-5',
        'xs': 'h-6',
        'sm': 'h-7',
        'md': 'h-8',
        'lg': 'h-11'
    }[props.size];
});

const baseFontFamilyClass = computed(() => {

    if(props.override.font_family_class){
        return props.override.font_family_class;
    }

    return 'font-data';
});

const borderClass = computed(() => {
    return (active.value ? 'active-border' : 'idle-border');
});

const headerBorderClass = computed(() => {
    if(props.disableHeaderBorder){
        return;
    }

    return (active.value ? 'active-border' : 'idle-border');
});

const defaultModeSpacingClass = computed(() => {
    return (props.icon ? '' : 'pl-2');
});

const navigationModeSpacingClass = computed(() => {
    return (props.icon ? '' : 'pl-2');
});

const selectionItemSize = computed(() => {
    return {
        '2xs': 'sm',
        'xs': 'sm',
        'sm': 'md',
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

    if(props.navigationMode){
        return {
            '2xs': 'text-xs h-5 leading-[0.875rem] left-[0.2rem] right-[1.45rem]',
            'xs': 'text-sm h-6 leading-[0.875rem] left-[0.2rem] right-[1.7rem]',
            'sm': 'text-base h-7 leading-[0.875rem] left-[0.2rem] right-[1.85rem]',
            'md': 'text-lg h-8 leading-[0.875rem] left-[0.2rem] right-[2.2rem]',
            'lg': 'text-xl h-11 leading-[0.875rem] left-[0.2rem] right-[2.95rem]',
        }[props.size];
    } else {
        return {
            '2xs': 'text-xs h-5 leading-[0.875rem] left-[0.2rem] right-[1.45rem]',
            'xs': 'text-xs h-6 leading-[0.875rem] left-[0.2rem] right-[1.7rem]',
            'sm': 'text-sm h-7 leading-[0.875rem] left-[0.2rem] right-[1.85rem]',
            'md': 'text-base h-8 leading-[0.875rem] left-[0.2rem] right-[2.2rem]',
            'lg': 'text-lg h-11 leading-[0.875rem] left-[0.2rem] right-[2.95rem]',
        }[props.size];
    }
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
    return {
        [props.dropAlign]:'9px',
        'top': '-7px',
        'border-right': '7px solid transparent',
        'border-left': '7px solid transparent',
        'border-bottom': '7px'
    };
});

const optionsArrowClass = computed(() => {
    return {
        [props.dropAlign]:'10px',
        'top': '-6px',
        'border-right': '6px solid transparent',
        'border-left': '6px solid transparent',
        'border-bottom': '6px'
    }
});

const selectionHeaderSummary = computed(()=>{
    return searchPool.value.length ? props.label : 'Not Found.';
});

const selectionSummary = computed(() => {
    if(props.options.selected == null){
        return "None Selected";
    } else {
        return props.options.data.filter((item: SelectDataType) => {
            return item.value == props.options.selected;
        })[0].text;
    }
});

const selectionOffsetComputed = computed(()=>{
    let offsetStyles: { left?: string, right?: string } = {};
    let selectionRightAlign = props.dropAlign == 'right';

    if (selectionOffset.origin === null || !props.inHorizontalScrollable){

        if(selectionRightAlign){
            offsetStyles = {
                ...offsetStyles,
                'left': selectionOffset.left
            };
        }
    } else {
        offsetStyles = {
            ...offsetStyles,
            'left': selectionOffset.left
        };
    }

    return offsetStyles;
});

const selectionWidthComputed = computed(()=>{
    let widthStyles: { width?: string, "min-width"?: string } = {};

    if(selectionHeaderWidth.value === null || props.selectionMaxContent){
        widthStyles['width'] = 'max-content';

        if(selectionHeaderWidth.value != null){
            widthStyles['min-width'] = `${selectionHeaderWidth.value}px`;
        }
    } else {
        widthStyles['width'] = `${selectionHeaderWidth.value}px`;
    }

    return widthStyles;
});

function keepFocusAlive(){
    if(!active.value){
        active.value = true;
    }
    nextTick(() => {
        if(props.searchable && selectionSearch.value){
            //@ts-ignore
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

function selectItem(item: SelectValueInterface): void{
    if(isItemSelected(item)){
        props.options.selected = null;
    } else {
        props.options.selected = item.value;
    }

    loseFocus();
}

function isItemSelected(item: SelectValueInterface): boolean{
    return props.options.selected == item.value;
}

function isItemInSearchPool(item: SelectValueInterface): boolean{
    return searchPool.value.indexOf(item.value) >= 0;
}

function searchSelection(){
    if (!props.options.search.trim()){
        searchPool.value = props.options.data.map((item: SelectDataType) => item.value);
    } else {
        searchPool.value = props.options.data.filter((data: SelectDataType) => {
            return data.text.toLowerCase().indexOf(props.options.search.toLowerCase()) > -1
        }).map((item: SelectDataType) => item.value);
    }
}

function clearSearch(){
    props.options.search = "";
    searchPool.value = props.options.data.map((item: SelectDataType) => item.value);
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

function searchInputFocusStateChangedHandler(focused: boolean) {
    if (focused) {
        keepFocusAlive();
    } else {
        loseFocus();
    }
}

function keyHandler(event: KeyboardEvent) {
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
    selectionHeaderWidth.value = selectHeader.value ? selectHeader.value.offsetWidth: null;

    if(props.inHorizontalScrollable){
        if(selectionOffset.origin === null){
            selectionOffset.origin = selectionOrigin.value ? selectionOrigin.value.offsetLeft: null;
        }

        if(newValue){
            let originOffsetLeft = selectionOffset.origin;
            let parentScrollLeft = props.scrollReference?.scrollLeft ?? 0;
            let offsetLeft = (originOffsetLeft ?? 0) - parentScrollLeft;
            selectionOffset.left = `${offsetLeft < 0 ? 0 : offsetLeft}px`;
        } else {
            selectionOffset.left = `${selectionOffset.origin}px`;
        }
    } else {

        if(props.dropAlign == 'right' && selectionOrigin.value){
            selectionOffset.left = `calc(-${selectionOrigin.value.offsetWidth}px + 100%)`;
        }

    }
});

onMounted(async () => {
    await nextTick();
    selectionHeaderWidth.value = selectHeader.value ? selectHeader.value.offsetWidth: null;

    if(props.alwaysActive){
        if(props.dropAlign == 'right' && selectionOriginRef.value){
            selectionOffset.left = `calc(-${selectionOriginRef.value.offsetWidth}px + 100%)`;
        }
    }
});

const emit = defineEmits(["valueChange"]);

watch(() => props.options.selected, newValue => {
    emit('valueChange', newValue);
})
</script>
<style scoped>
.navigation-mode:hover{
    background-color: v-bind(accentColor40);
}

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