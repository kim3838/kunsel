<template>
    <div class="font-data ">
        <RadioBox
            class="flex items-center"
            v-for="selection in selections"
            v-model="computedSelected"
            :selected="computedSelected"
            :key="selection.value"
            :value="selection.value"
            :label="selection.text"
            :size="size"/>
    </div>
</template>

<script setup lang="ts">

const props = defineProps({
    modelValue: {
        type: [String, Number],
        default: 0
    },
    selections: {
        required: true,
        type: Array,
    },
    size: {
        default: null
    }
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
</script>

<style scoped>

</style>
