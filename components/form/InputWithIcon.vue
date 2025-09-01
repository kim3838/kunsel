<template>
    <div class="relative box-border" :class="[heightClass, baseFontFamilyClass]">
        <Glint :height-style="glintHeightStyle" :enable="glint" :orientation="'landscape'" :color="activeBorderComputed">
            <div v-if="icon?.trim()" class="absolute w-full h-full z-20 flex pointer-events-none">
                <div :class="[iconHolderClass]" class="flex-none h-full flex justify-end items-center">
                    <Icon :class="[iconClass]" :name="icon" />
                </div>
                <div class="w-full relative"></div>
            </div>
            <div
                class="relative w-full h-full z-10 box-border outline-none flex items-center"
                :class="[
                    backgroundClass,
                    cursorClass,
                    focusRing ? 'focus-ring' : '',
                    withBorder ? 'bordered' : 'borderless',
                    rounded ? 'rounded-[2px]': '',
                    disabled ? 'cursor-not-allowed' : '',
                ]">
                <input
                    :id="id"
                    :tabindex="tabindex"
                    :disabled="disabled"
                    class="relative w-full box-border outline-none"
                    :class="[
                        fontClass,
                        spacingClass,
                        cursorClass,
                    ]"
                    :value="modelValue"
                    :placeholder="placeholder"
                    :type="type"
                    :min="min"
                    :max="max"
                    @keydown="limitKeys"
                    @focus="focusInput"
                    @input="inputInput"
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
    typeStrict: {
        type: Boolean,
        default: false,
    },
    placeholder: {
        type: String,
        default: ''
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
    }
});

const emit = defineEmits(['update:modelValue', 'focusStateChanged', 'valueChanged']);

function limitKeys(event) {
    if(props.type === 'number' && props.typeStrict){
        const invalidKeys = ['e', 'E', '+', '-']

        if (invalidKeys.includes(event.key)) {
            event.preventDefault()
        }
    }
}

const inputInput = (event) => {
    emit('update:modelValue', event.target.value)
    emit('valueChanged', event.target.value)
};

function focusInput(event) {
    if(props.highLightAllTextOnFocus){
        selectAllText(event);
    }
}

function selectAllText(event) {
    event.target.select();
}

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