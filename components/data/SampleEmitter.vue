<template>
    <div class="tw-flex">
        <InputWithIcon
            :icon="'twemoji:calendar'"
            v-model="fooModel"
            :type="'text'"
        />
        <InputWithIcon
            :icon="'twemoji:calendar'"
            v-model="barModel"
            :type="'text'"
        />
    </div>
</template>

<script setup>
const fooModel = ref('Foo');
const barModel = ref('Bar');

const props = defineProps({
    foo: String,
    bar: String,
    fooModifiers: { default: () => ({customModifier: true}) },
    barModifiers: { default: () => ({}) }
});

const emit = defineEmits([
    'update:modelValue',
    'update:foo',
    'update:bar',
]);

watch(fooModel, value => {
    if(props.fooModifiers['capitalizeEveryWord']){
        value = _words(value).map(word => _capitalize(word)).join(' ');
    }

    if(props.fooModifiers.capitalize){
        value = value.charAt(0).toUpperCase() + value.slice(1);
    }

    fooModel.value = value;
    emit('update:foo', value);
});

watch(barModel, value => {
    if(props.barModifiers.capitalize){
        value = value.charAt(0).toUpperCase() + value.slice(1);
    }

    barModel.value = value;
    emit('update:bar', value);
});
</script>