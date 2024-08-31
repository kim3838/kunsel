<template>
    <label :for="labelId" class="tw-font-data ">
        <div class="tw-flex tw-items-start tw-justify-start">
            <ClientOnly>
                <div :style="{'height': radioBoxSlotHeight}" class="tw-flex tw-items-center">
                    <Icon v-if="selected == value" :class="[radioSize, 'radio']" name="ic:sharp-radio-button-checked"></Icon>
                    <Icon v-else :class="[radioSize]" class='radio' name="ic:sharp-radio-button-unchecked"></Icon>
                </div>
            </ClientOnly>

            <div v-if="label?.trim()" :class="[fontClass]" class="tw-ml-1 tw-whitespace-pre-line">{{label}}</div>
            <input
                type="radio"
                :value="value"
                :checked="isChecked"
                :id="labelId"
                @change="$emit('update:modelValue', $event.target.value)"
                name="radio-input"/>
        </div>
    </label>
</template>

<script setup lang="ts">
import {ref, computed} from 'vue';
import {storeToRefs} from 'pinia';
const {$themeStore} = useNuxtApp();

const {
    hexAlpha,
    primary: primaryColor,
    text: textColor,
} = storeToRefs($themeStore);

const primaryColor70 = computed(() => {
    return primaryColor.value + hexAlpha.value['70'];
});

const props = defineProps({
    modelValue: {
        type: [String, Number],
        default: 0
    },
    value: {
        type: [String, Number],
        default: 0
    },
    label: {
        type: String,
        default: ''
    },
    selected: {
        type: [String, Number, null],
        default: 0
    },
    size: {
        default: 'md'
    }
});

const labelId = computed(() => props.modelValue + '-' +props.label);

const isChecked = computed(() => {
    return props.selected === props.value;
});

const radioBoxSlotHeight = computed(()=>{
    return {
        'sm': '20px',
        'md': '24px',
        'lg': '28px',
    }[props.size];
});

const radioSize = computed(() => {
    return {
        'sm': 'tw-h-3.5 tw-w-3.5',
        'md': 'tw-h-5 tw-w-5',
        'lg': 'tw-h-6 tw-w-6',
    }[props.size]
});

const fontClass = computed(() => {
    return {
        'sm': 'tw-text-sm',
        'md': 'tw-text-base',
        'lg': 'tw-text-lg'
    }[props.size]
});

</script>

<style scoped>
input[type="radio"] {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
}

.radio{
    color: v-bind(textColor) !important;
}
</style>
