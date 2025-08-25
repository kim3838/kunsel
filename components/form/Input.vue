<template>
    <div class="relative box-border" :class="[heightClass, baseFontFamilyClass]">
        <Glint :height-style="glintHeightStyle" :enable="glint" :orientation="'landscape'" :color="activeBorderComputed">
            <div
                class="relative w-full h-full box-border outline-none flex items-center"
                :class="[
                    backgroundClass,
                    cursorClass,
                    focusRing ? 'focus-ring' : '',
                    withBorder ? 'bordered' : 'borderless',
                    rounded ? 'rounded-[2px]': '',
                    disabled ? 'cursor-not-allowed' : ''
                ]">
                <input
                    :tabindex="tabindex"
                    :disabled="disabled"
                    :class="[
                        fontClass,
                        spacingClass,
                        cursorClass,
                    ]"
                    class="relative w-full box-border outline-none"
                    :value="modelValue"
                    :placeholder="placeholder"
                    :type="type"
                    :min="min"
                    :max="max"
                    @keydown="limitKeys"
                    @focus="focusInput"
                    @blur="blurInput"
                    @input="$emit('update:modelValue', $event.target.value)"
                    :readonly="readonly"
                    ref="input">
            </div>
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
    modelValue: [String, Number, null],
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
    highLightAllTextOnFocus: {
        type: Boolean,
        default: false
    },
    timeBlur: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['update:modelValue', 'focusStateChanged']);

const formatTime = (value) => {
    if (!value) return '';

    // Remove invalid chars except digits and colon
    value = value.replace(/[^\d:]/g, '');

    let hours = 0;
    let minutes = 0;

    if (value.includes(':')) {
        const parts = value.split(':');
        hours = parts[0] ? parseInt(parts[0], 10) : 0;
        minutes = parts[1] ? parseInt(parts[1], 10) : 0;
    } else {
        if (value.length <= 2) {
            hours = parseInt(value, 10);
            minutes = 0;
        } else {
            hours = parseInt(value.slice(0, value.length - 2), 10);
            minutes = parseInt(value.slice(-2), 10);
        }
    }

    // Clamp values
    hours = Math.min(Math.max(hours, 0), 23);
    minutes = Math.min(Math.max(minutes, 0), 59);

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

const blurInput = async (event) => {
    if(props.timeBlur){
        await nextTick();
        emit('update:modelValue', formatTime(event.target.value));
    }
}

function limitKeys(event) {
    if(props.type === 'number' && props.typeStrict){
        const invalidKeys = ['e', 'E', '+', '-']

        if (invalidKeys.includes(event.key)) {
            event.preventDefault()
        }
    }
}

function focusInput(event) {
    if(props.highLightAllTextOnFocus){
        selectAllText(event);
    }
}

function selectAllText(event) {
    event.target.select();
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


const cursorClass = computed(() => {
    return {
        'file': 'cursor-pointer'
    }[props.type]
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

const baseFontFamilyClass = computed(() => {

    if(props.override.font_family_class){
        return props.override.font_family_class;
    }

    return 'font-data';
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
        '2xs': 'text-sm',
        'xs': 'text-sm',
        'sm': 'text-base',
        'md': 'text-base',
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