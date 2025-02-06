<template>
    <div class="font-data relative box-border">
        <textarea
            :tabindex="tabindex"
            :disabled="disabled"
            :rows="rows"
            :cols="cols"
            :class="[
                    fontClass,
                    spacingClass,
                    backgroundClass,
                    focusRing ? 'focus-ring' : '',
                    withBorder ? 'bordered' : 'borderless',
                    rounded ? 'rounded-[2px]': ''
                ]"
            :style="{'top': absoluteTopAllocation, 'min-height': minHeight}"
            class="relative box-border outline-none"
            :value="modelValue"
            :placeholder="placeholder"
            :readonly="readonly"
            @input="$emit('update:modelValue', $event.target.value)"
            ref="textarea"></textarea>
    </div>
</template>

<script setup>
import {storeToRefs} from 'pinia';

const {$themeStore} = useNuxtApp();
const textarea = ref(null);
const {focused: inputFocused} = useFocus(textarea);
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
    rows: {
        type: Number,
        default: 5
    },
    cols: {
        type: Number,
        default: 40
    },
    minHeight: {
        type: String,
        default: '8rem'
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
    }
});

const emit = defineEmits(['update:modelValue', 'focusStateChanged']);

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
        '2xs': 'p-[0.3rem]',
        'xs': 'p-[0.3rem]',
        'sm': 'p-[0.65rem]',
        'md': 'p-[0.65rem]',
        'lg': 'p-[0.95rem]',
        'xl': 'p-[1rem]',
        '2xl': 'p-[1.25rem]'
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
</style>