<template>
    <div class="font-data relative box-border" :class="[heightClass]">
        <Glint :height-style="glintHeightStyle" :enable="glint" :orientation="'landscape'" :color="activeBorderComputed">
            <input
                :tabindex="tabindex"
                :disabled="disabled"
                :class="[
                    fontClass,
                    spacingClass,
                    backgroundClass,
                    focusRing ? 'focus-ring' : '',
                    withBorder ? 'bordered' : 'borderless',
                    rounded ? 'rounded-[2px]': ''
                ]"
                :style="{'top': absoluteTopAllocation}"
                class="relative h-full w-full box-border outline-none"
                :value="modelValue"
                :placeholder="placeholder"
                :type="type"
                :min="min"
                :max="max"
                @keydown="limitKeys"
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
    typeStrict: {
        type: Boolean,
        default: false,
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
    min: {
        type: Number,
        default: null
    },
    max: {
        type: Number,
        default: null
    },
});

const emit = defineEmits(['update:modelValue', 'focusStateChanged']);

function limitKeys(event) {
    if(props.type === 'number' && props.typeStrict){
        const invalidKeys = ['e', 'E', '+', '-']

        if (invalidKeys.includes(event.key)) {
            event.preventDefault()
        }
    }
}

const heightClass = computed(() => {
    return {
        '2xs': 'h-5',
        'xs': 'h-6',
        'sm': 'h-7',
        'md': 'h-8',
        'lg': 'h-11',
        'xl': 'h-14',
        '2xl' : 'h-16',
        '3xl' : 'h-20',
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
        '2xs': 'pl-[0.3rem] p-0',
        'xs': 'pl-[0.3rem] p-0',
        'sm': 'pl-[0.65rem] p-0',
        'md': 'pl-[0.65rem] p-0',
        'lg': 'pl-[0.95rem] p-0',
        'xl': 'pl-[1rem] p-0',
        '2xl': 'pl-[1.25rem] p-0'
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
        '2xs': 'text-xs',
        'xs': 'text-xs',
        'sm': 'text-sm',
        'md': 'text-base',
        'lg': 'text-lg',
        'xl': 'text-2xl font-semibold',
        '2xl': 'text-3xl font-bold',
        '3xl': 'text-5xl font-bold',
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