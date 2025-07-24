<template>
    <MultiSelect
        v-model="proxyModel"
        :options="optionsRef"
    />
</template>

<script setup lang="ts">
const props = defineProps({
    modelValue: {
        type: Array,
        default: undefined
    },
    options: {
        type: Object,
        default: function () {
            return {
                search: '',
                selection: []
            }
        }
    },
});

const optionsRef = ref({ ...props.options });

const emit = defineEmits(["update:modelValue"]);

const proxyModel = computed({
    get() {
        return props.modelValue;
    },
    set(newValue) {
        emit("update:modelValue", newValue);
    }
});

if(proxyModel.value !== undefined){
    optionsRef.value.selected = proxyModel.value;
} else {
    optionsRef.value.selected = _get(optionsRef, 'value.selected', []);
}
</script>

<style scoped>
</style>