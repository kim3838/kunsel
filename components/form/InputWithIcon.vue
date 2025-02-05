<template>
    <div class="font-data relative box-border" :class="[heightClass]">
        <Glint :height-style="glintHeightStyle" :enable="glint" :orientation="'landscape'" :color="activeBorderComputed">
            <div v-if="icon?.trim()" class="absolute w-full h-full z-20 flex pointer-events-none">
                <div :class="[iconHolderClass]" class="flex-none h-full flex justify-end items-center">
                    <Icon :class="[iconClass]" :name="icon" />
                </div>
                <div class="w-full relative"></div>
            </div>
            <input
                :id="id"
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
                class="relative w-full h-full z-10 box-border outline-none"
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
            return {}
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
        '2xs': 'w-5',
        'xs': 'w-[1.5rem]',
        'sm': 'w-[1.77rem]',
        'md': 'w-[1.75rem]',
        'lg': 'w-[2.8rem]',
        'xl': 'w-[3rem]',
        '2xl': 'w-[4rem]',
    }[props.size];
});

const iconClass = computed(() => {
    return {
        '2xs': 'h-4 w-4',
        'xs': 'h-5 w-5',
        'sm': 'h-5 w-5',
        'md': 'h-5 w-5',
        'lg': 'h-8 w-8',
        'xl': 'h-9 w-9',
        '2xl': 'h-12 w-12',
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
        '2xs': props.icon?.trim() ? 'pl-[1.4rem] p-0' : '',
        'xs': props.icon?.trim() ? 'pl-[1.65rem] p-0' : '',
        'sm': props.icon?.trim() ? 'pl-[1.875rem] p-0' : '',
        'md': props.icon?.trim() ? 'pl-[1.875rem] p-0' : '',
        'lg': props.icon?.trim() ? 'pl-[3rem] p-0' : '',
        'xl': props.icon?.trim() ? 'pl-[3.2rem] p-0' : '',
        '2xl': props.icon?.trim() ? 'pl-[4.3rem] p-0' : ''
    }[props.size]
});

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
        'md': 'text-sm',
        'lg': 'text-lg',
        'xl': 'text-2xl font-semibold',
        '2xl': 'text-4xl font-semibold',
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