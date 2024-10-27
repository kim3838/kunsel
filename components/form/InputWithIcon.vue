<template>
    <div class="tw-font-data tw-relative tw-box-border" :class="[heightClass]">
        <Glint :height-style="glintHeightStyle" :enable="glint" :orientation="'landscape'" :color="activeBorderComputed">
            <div v-if="icon?.trim()" class="tw-absolute tw-w-full tw-h-full tw-z-20 tw-flex tw-pointer-events-none">
                <div :class="[iconHolderClass]" class="tw-flex-none tw-h-full tw-flex tw-justify-end tw-items-center">
                    <Icon :class="[iconClass]" :name="icon" />
                </div>
                <div class="tw-w-full tw-relative"></div>
            </div>
            <input
                :id="id"
                :tabindex="tabindex"
                :disabled="disabled"
                :class="[
                    fontClass,
                    spacingClass,
                    backgroundClass,
                    'focus:tw-ring-transparent focus:tw-ring',
                    focusRing ? 'focus-ring' : '',
                    withBorder ? 'bordered' : 'borderless',
                    rounded ? 'tw-rounded-sm': ''
                ]"
                :style="{'top': absoluteTopAllocation}"
                class="tw-relative tw-w-full tw-h-full tw-z-10 tw-form-input tw-box-border"
                :value="modelValue"
                :placeholder="placeholder"
                :type="type"
                :readonly="readonly"
                @input="$emit('update:modelValue', $event.target.value)"
                ref="input">
        </Glint>
    </div>
</template>

<script setup>
import {ref, computed, watch} from 'vue';
import {storeToRefs} from 'pinia';

const {$themeStore} = useNuxtApp();
const input = ref(null);
const {focused: inputFocused} = useFocus(input);
const {
    hexAlpha,
    type: themeType,
    primary: primaryColor,
    lining: liningColor,
    thread: threadColor,
    tint: tintColor,
    textInvert: textInvertColor,
} = storeToRefs($themeStore);

const disabledBackgroundColor = computed(() => {
    return themeType.value == 'light'
        ? (primaryColor.value + hexAlpha.value['10'])
        : (textInvertColor.value + hexAlpha.value['40']);
});

const props = defineProps({
    modelValue: [String, Number],
    size: {
        default: 'md'
    },
    id: {
        type: String,
        default: null,
    },
    tabindex: {
        type: Number,
        default: 0
    },
    icon: {
        type: String,
        default: null,
    },
    type: {
        type: String,
        default: 'text',
    },
    placeholder: {
        type: String,
        default: ''
    },
    inCell: {
        type: Boolean,
        default: false
    },
    disabled: {
        type: Boolean,
        default: false
    },
    readonly: {
        type: Boolean,
        default: false
    },
    ring: {
        type: Boolean,
        default: false
    },
    focusRing: {
        type: Boolean,
        default: true
    },
    withBorder: {
        type: Boolean,
        default: true
    },
    activeBorder: {
        type: String,
        default: ''
    },
    rounded: {
        type: Boolean,
        default: true
    },
    override: {
        type: Object,
        default: function () {
            return {
                font_size: false
            }
        }
    },
    glint: {
        type: Boolean,
        default: false
    },
});

const emit = defineEmits(['update:modelValue', 'focusStateChanged']);

const iconHolderClass = computed(() => {
    return {
        '2xs': 'tw-w-5',
        'xs': 'tw-w-[1.5rem]',
        'sm': 'tw-w-[1.77rem]',
        'md': 'tw-w-[1.75rem]',
        'lg': 'tw-w-[2.8rem]',
        'xl': 'tw-w-[3rem]',
        '2xl': 'tw-w-[4rem]',
    }[props.size];
});

const iconClass = computed(() => {
    return {
        '2xs': 'tw-h-4 tw-w-4',
        'xs': 'tw-h-5 tw-w-5',
        'sm': 'tw-h-5 tw-w-5',
        'md': 'tw-h-5 tw-w-5',
        'lg': 'tw-h-8 tw-w-8',
        'xl': 'tw-h-9 tw-w-9',
        '2xl': 'tw-h-12 tw-w-12',
    }[props.size]
});

const absoluteTopAllocation = computed(() => {
    return {
        '2xs': props.inCell ? '0' : '-3px',
        'xs': props.inCell ? '0' : '-1px',
        'sm': '0',
        'md': '0',
        'lg': '0',
        'xl': '0',
        '2xl': '0',
    }[props.size]
});

const spacingClass = computed(() => {
    return {
        '2xs': props.icon?.trim() ? 'tw-pl-[1.4rem] tw-p-0' : '',
        'xs': props.icon?.trim() ? 'tw-pl-[1.65rem] tw-p-0' : '',
        'sm': props.icon?.trim() ? 'tw-pl-[1.875rem] tw-p-0' : '',
        'md': props.icon?.trim() ? 'tw-pl-[1.875rem] tw-p-0' : '',
        'lg': props.icon?.trim() ? 'tw-pl-[3rem] tw-p-0' : '',
        'xl': props.icon?.trim() ? 'tw-pl-[3.2rem] tw-p-0' : '',
        '2xl': props.icon?.trim() ? 'tw-pl-[4.3rem] tw-p-0' : ''
    }[props.size]
});

const heightClass = computed(() => {
    return {
        '2xs': 'tw-h-5',
        'xs': 'tw-h-6',
        'sm': 'tw-h-7',
        'md': 'tw-h-8',
        'lg': 'tw-h-11',
        'xl': 'tw-h-14',
        '2xl' : 'tw-h-16',
        '3xl' : 'tw-h-20',
    }[props.size]
});

const glintHeightStyle = computed(() => {
    return {
        '2xs': '1.25rem',
        'xs': '1.5rem',
        'sm': '1.75rem',
        'md': '2rem',
        'lg': '2.75rem',
        'xl': '3.5rem',
        '2xl' : '4rem',
        '3xl' : '5rem',
    }[props.size]
});

const fontClass = computed(() => {

    if(props.override.font_size){
        return props.override.font_size;
    }

    return {
        '2xs': 'tw-text-xs',
        'xs': 'tw-text-xs',
        'sm': 'tw-text-sm',
        'md': 'tw-text-sm',
        'lg': 'tw-text-lg',
        'xl': 'tw-text-2xl tw-font-semibold',
        '2xl': 'tw-text-4xl tw-font-semibold',
        '3xl': 'tw-text-5xl tw-font-bold',
    }[props.size];
});

const backgroundClass = computed(() => {
    return props.disabled ? 'input-disabled' : 'input-background';
});

const activeBorderComputed = computed(() => {
    return props.activeBorder ? props.activeBorder : liningColor.value;
});

watch(inputFocused, (focused) => {
    emit('focusStateChanged', focused);
});

</script>
<style scoped>
.input-disabled{
    background-color: v-bind(disabledBackgroundColor) !important;
}

.input-background{
    background-color: v-bind(tintColor) !important;
}

.focus-ring:focus{
    border-color: v-bind(activeBorderComputed) !important;
}

.bordered{
    border-width: 1px;
    border-color: v-bind(threadColor) !important;
}

.borderless{
    border: 1px solid transparent;
}

input[type=number] {
    position: relative;
}

input[type=number]::-webkit-inner-spin-button,
input[type=number]::-webkit-outer-spin-button {
    position: absolute;
    opacity: 1;
    top: 0;
    right: 0;
    height: 100%;
}

</style>