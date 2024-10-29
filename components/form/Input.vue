<template>
    <div class="tw-font-data tw-relative tw-box-border" :class="[heightClass]">
        <Glint :height-style="glintHeightStyle" :enable="glint" :orientation="'landscape'" :color="activeBorderComputed">
            <input
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
                class="tw-relative tw-form-input tw-h-full tw-w-full tw-box-border"
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
    type: {
        type: String,
        default: 'text'
    },
    placeholder: {
        type: String,
        default: ''
    },
    inCell: {
        type: Boolean,
        default: false
    },
    size: {
        default: 'md'
    },
    tabindex: {
        type: Number,
        default: 0
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
            return {}
        }
    },
    glint: {
        type: Boolean,
        default: false
    },
});

const emit = defineEmits(['update:modelValue', 'focusStateChanged']);

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

    if(props.override.spacing){
        return props.override.spacing;
    }

    return {
        '2xs': 'tw-pl-[0.3rem] tw-p-0',
        'xs': 'tw-pl-[0.3rem] tw-p-0',
        'sm': 'tw-pl-[0.65rem] tw-p-0',
        'md': 'tw-pl-[0.65rem] tw-p-0',
        'lg': 'tw-pl-[0.95rem] tw-p-0',
        'xl': 'tw-pl-[1rem] tw-p-0',
        '2xl': 'tw-pl-[1.25rem] tw-p-0'
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
        '2xl': 'tw-text-3xl tw-font-bold',
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