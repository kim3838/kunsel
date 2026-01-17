<template>
    <SingleSelect
        v-model="proxyModel"
        :options="optionsRef"
    />
</template>

<script setup lang="ts">
const props = defineProps({
    modelValue: {
        type: [String, Number],
        default: undefined,
    },
    customIdentifier: {
        type: [String, Number],
        default: undefined,
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

const emit = defineEmits(["valueChange", "update:modelValue"]);

const proxyModel = computed({
    get() {
        return props.modelValue;
    },
    set(newValue) {
        emit("update:modelValue", newValue);
    }
});

if(proxyModel.value !== undefined){
    props.options.selected = proxyModel.value;
}

watch(proxyModel, newValue => {
    proxyModel.value = newValue;
    emit('valueChange', newValue, props.customIdentifier);
})
</script>

<style scoped>
</style>