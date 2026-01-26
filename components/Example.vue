<template>
    <div>
        sampleObject: {{sampleObject}}<br>
        sampleBoolean: {{sampleBoolean}}<br>
        <Button class="w-min" :label="'Update Object'" @click="updateObject" />
        <Button class="w-min" :label="'Toggle Boolean'" @click="$emit('update:sampleBoolean', !sampleBoolean)" />
    </div>
</template>

<script setup lang="ts">

const props = defineProps({
    sampleObject: {
        type: Object,
        default: () => {
            return {};
        }
    },
    sampleBoolean: {
        type: Boolean,
        default: false,
    },
});

watch(() => props.sampleObject, (value) => {
    console.log('sampleObject changed', value);
});

watch(() => props.sampleBoolean, (value) => {
    console.log('sampleBoolean changed', value);
});

const emit = defineEmits([
    'update:sampleObject',
    'update:sampleBoolean',
]);

const updateObject = () => {
    let objectTemp = {
        ...props.sampleObject,
        test: 'test',
    };

    emit('update:sampleObject', objectTemp);
};
</script>



<style scoped>

</style>