<template>
    <div class="font-data flex" :class="[orientationClass]">
        <RadioBox
            class="flex items-center"
            v-for="selection in selections"
            v-model="computedSelected"
            :disabled="disabled"
            :selected="computedSelected"
            :key="selection.value"
            :value="selection.value"
            :label="selection.text"
            :size="size"/>
    </div>
</template>

<script setup lang="ts">
import type {SelectDataType} from "@/public/js/types/form";

const props = defineProps({
    modelValue: {
        type: [String, Number, null],
        default: 0
    },
    selections: {
        required: true,
        type: Array as PropType<SelectDataType[]>,
    },
    size: {
        type: String,
        default: 'md'
    },
    orientation: {
        type: String,
        default: 'vertical'
    },
    disabled: {
        type: Boolean,
        default: false
    },
});

const emit = defineEmits(["update:modelValue"]);

const computedSelected = computed({
    get() {
        return props.modelValue;
    },
    set(selected) {
        emit('update:modelValue', selected);
    }
});

const orientationClass = computed(() => {
    return {
        'horizontal': 'flex-row gap-4',
        'vertical': 'flex-col gap-0',
    }[props.orientation];
})
</script>

<style scoped>

</style>
