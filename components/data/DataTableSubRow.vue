<template>
    <div class="relative" :style="[subRowTemplateStyle]">

        <div>
            <div v-if="hasSubRowExtension" :style="[extensionLineStyle]"></div>
            <div v-if="typeIsBordered" :style="[borderedBranchLineStyle]"/>
            <div v-if="typeIsTitled" :style="[titledBranchLineStyle]"/>
            <div v-if="rowVerticalLine && (rowIndex + 1) < rows.length" :style="[rowVerticalLineStyle]"/>
        </div>

        <div :data-payload='`sub-row-container-${rowIndex}`' :ref="`sub-row-container-${rowIndex}`" :style="[subRowContainerStyle]">
            <slot
                :name="'sub-row'"
                :slot="{titleSizeClass:titleSizeClass,iconSizeClass:iconSizeClass,iconHolderClass:iconHolderClass,slug:slug}"
                :rowIndex="rowIndex"
                :cell="row"
            ></slot>
        </div>

        <div v-if="hasSubRowExtension" :style="[subRowExtensionContainerStyle]">
            <div :style="[subRowContainerStyle]">
                <slot
                    :name="'sub-row-extension'"
                    :slot="{
                        titleSizeClass:titleSizeClass,
                        iconSizeClass:iconSizeClass,
                        iconHolderClass:iconHolderClass,
                        slug:slug,
                        extensionSlug:extensionSlug,
                        extensionSlugContentMaxHeight:subRowContentElementHeightComputed,
                    }"
                    :rowIndex="rowIndex"
                    :cell="row"
                ></slot>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {storeToRefs} from "pinia";
import type {TableRowT} from "@/public/js/types/data";

const {$themeStore} = useNuxtApp();

const {
    hexAlpha,
    lining: liningColor,
} = storeToRefs($themeStore);

const liningColor70 = computed(() => {
    return liningColor.value + hexAlpha.value['70'];
});

const props = defineProps({
    rowIndex: {
        type: Number,
        default: 0
    },
    row: {
        type: Object,
        default: null
    },
    rows: {
        type: Array as PropType<TableRowT[]>,
        default: () => [],
    },
    rowVerticalLine: {
        type: Boolean,
        default: true
    },
    slug: {
        type: String,
        default: null
    },
    extensionSlug: {
        type: String,
        default: null
    },
    type: {
        type: Number,
        default: DATATABLE_SUBROW_TYPE.TITLED
    },
    containerPaddingTop: {
        type: Number,
        default: 0.25
    },
    containerPaddingBottom: {
        type: Number,
        default: 0.75
    },
    containerPaddingUnit: {
        type: String,
        default: 'rem'
    },
    titleSize: {
        type: String,
        default: 'md'
    },
    verticalBorderType: {
        type: String,
        default: 'dashed'
    },
    horizontalBorderType: {
        type: String,
        default: 'dashed'
    },
});

const typeIsTitled = computed(() => {
    return props.type == DATATABLE_SUBROW_TYPE.TITLED;
});
const typeIsBordered = computed(() => {
    return props.type == DATATABLE_SUBROW_TYPE.BORDERED;
});

const subRowContainerReference = useTemplateRef(`sub-row-container-${props.rowIndex}`);
const { width: subRowContainerReferenceWidth} = useElementSize(subRowContainerReference);

const subRowTemplateStyle = computed(() => {

    return {
        height: `${subRowContainerReference?.value ? subRowContainerReference.value.offsetHeight : 0}px`
    }
});

const borderedBranchLineBreakpoint = computed(() => {
    let containerPaddingTop = `${props.containerPaddingTop}${props.containerPaddingUnit}`;

    return `${containerPaddingTop}`;
});

const titledBranchLineBreakpoint = computed(() => {
    let containerPaddingTop = `${props.containerPaddingTop}${props.containerPaddingUnit}`;
    let titleLineHeightInPixel = titleLineHeightInPixelComputed?.value ? titleLineHeightInPixelComputed.value : 24;
    let titleLineHeightCenterInPixel = `${titleLineHeightInPixel / 2}px`;

    return `calc(${containerPaddingTop} + ${titleLineHeightCenterInPixel})`;
});

const rowVerticalLineStyle = computed(() => {

    let branchLineBreakpoint = '0'

    if(typeIsTitled.value){
        branchLineBreakpoint = titledBranchLineBreakpoint.value;
    }
    if(typeIsBordered.value){
        branchLineBreakpoint = borderedBranchLineBreakpoint.value;
    }

    return {
        'position': 'absolute',
        'inset': `${branchLineBreakpoint} 0 0 50%`,
        'border-left': `1px ${props.verticalBorderType} ${liningColor70.value}`,
    }
});

const titledBranchLineStyle = computed(() => {
    return {
        'position': 'absolute',
        'inset': `0 0 calc(100% - 1px - ${titledBranchLineBreakpoint.value}) 50%`,
        'border-bottom': `1px ${props.horizontalBorderType} ${liningColor70.value}`,
        'border-left': `1px ${props.verticalBorderType} ${liningColor70.value}`,
    }
});

const borderedBranchLineStyle = computed(() => {

    let containerPaddingTop = `${props.containerPaddingTop}${props.containerPaddingUnit}`;

    return {
        'position': 'absolute',
        'inset': `0 0 calc(100% - 1px - ${containerPaddingTop}) 50%`,
        'border-bottom': `1px ${props.horizontalBorderType} ${liningColor70.value}`,
        'border-left': `1px ${props.verticalBorderType} ${liningColor70.value}`,
    }
});

const hasSubRowExtension = computed(() => {
    return props.extensionSlug && props.row[props.extensionSlug];
})

const subRowTitleElementWidth = computed(() => {
    const subRowContainerFirstChildAsSubRowTitleElement = subRowContainerReference.value?.firstElementChild;

    return subRowContainerFirstChildAsSubRowTitleElement?.offsetWidth || 0;
});

const subRowContentElementHeight = computed(() => {
    const subRowContainerSecondChildAsSubRowContentElement = subRowContainerReference.value?.children[1];

    return subRowContainerSecondChildAsSubRowContentElement?.offsetHeight || 0;
});

const subRowContentElementHeightComputed = computed(() => {
    return `${subRowContentElementHeight.value}px`;
});

const extensionLineStyle = computed(() => {

    let branchLineBreakpoint = '0'

    if(typeIsTitled.value){
        branchLineBreakpoint = titledBranchLineBreakpoint.value;
    }
    if(typeIsBordered.value){
        branchLineBreakpoint = borderedBranchLineBreakpoint.value;
    }

    return {
        'position': 'absolute',
        'inset': `${branchLineBreakpoint} calc(-${subRowContainerReferenceWidth.value}px - 100%) 0 calc(100% + ${subRowTitleElementWidth.value}px)`,
        'border-top': `1px ${props.horizontalBorderType} ${liningColor70.value}`,
    }
});

const titleLineHeightInPixelComputed = computed(() => {
    return {
        'sm': 20,
        'md': 24,
        'lg': 28,
    }[props.titleSize];
});

const titleSizeClass = computed(() => {
    return {
        'sm': 'text-sm',
        'md': 'text-base',
        'lg': 'text-lg',
    }[props.titleSize];
});

const iconSizeClass = computed(() => {
    return {
        'sm': 'text-xl',
        'md': 'text-xl',
        'lg': 'text-2xl',
    }[props.titleSize];
});

const iconHolderClass = computed(() => {
    return {
        'sm': 'w-[20px]',
        'md': 'w-[20px]',
        'lg': 'w-[24px]',
    }[props.titleSize];
});

const subRowContainerStyle = computed(() => {

    return {
        'position': 'absolute',
        'left': `100%`,
        'padding-top': `${props.containerPaddingTop}${props.containerPaddingUnit}`,
        'padding-bottom': `${props.containerPaddingBottom}${props.containerPaddingUnit}`,
    }
});

const subRowExtensionContainerStyle = computed(() => {

    return {
        'position': 'absolute',
        'width': '200%',
        'left': `${subRowContainerReferenceWidth.value}px`,
    }
});
</script>

<style scoped>

</style>