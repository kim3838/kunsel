<template>
    <div class="tw-relative tw-box-border">
        <Glint :enable="glint" :orientation="'landscape'" :color="activeBorderComputed">
            <input
                :tabindex="tabindex"
                :type="type"
                :disabled="disabled"
                :class="[
                    fontClass,
                    heightClass,
                    backgroundClass,
                    'focus:tw-ring-transparent focus:tw-ring',
                    focusRing ? 'focus-ring' : '',
                    withBorder ? 'bordered' : 'borderless',
                    rounded ? 'tw-rounded-sm': '']"
                class="tw-font-data tw-pl-1 tw-form-input tw-w-full"
                :value="modelValue"
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
    type: {
        type: String,
        default: 'text'
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

const fontClass = computed(() => {
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