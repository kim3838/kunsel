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
    props.options.selected = proxyModel.value;
}
</script>

<style scoped>
</style>