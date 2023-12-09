<template>
    <div>
        <Details
            v-for="(detail, index) in modelValue.options"
            :key="detail.title"
            :size="size"
            :active="detail.active"
            :index="index"
            :single-expand="singleExpand"
            @toggle="toggleDetail"
        >
            <template v-slot:title>
                <div :class="[titleFontClass]">
                    {{detail.title}}
                </div>
            </template>
            <template v-slot:body="{active}">
                <div v-if="detail.body.type === 'text'" :class="[bodyFontClass]">
                    {{detail.body.value}}
                </div>
                <div v-else-if="detail.body.type === 'checkbox'">
                    <label v-for="detailsCheckbox in detail.body.value" :key="detailsCheckbox">
                        <Checkbox v-model="detailsCheckbox.value" :label="detailsCheckbox.text" :size="checkBoxSize" />
                    </label>
                </div>
                <div v-else-if="detail.body.type === 'radio'">
                    <RadioGroup
                        :selections="detail.body.value.selection"
                        :size="radioBoxSize"
                        v-model="detail.body.value.selected" />
                </div>
            </template>
        </Details>
    </div>
</template>
<script setup>
import {computed} from "vue";

const props = defineProps({
    size: {
        default: 'md'
    },
    modelValue: {
        type: Object,
        default: function(){
            return {};
        }
    },
    singleExpand: {
        type: Boolean,
        default: false
    },
});

const titleFontClass = computed(() => {
    return {
        'md': 'tw-text-lg',
        'lg': 'tw-text-xl',
    }[props.size];
});

const bodyFontClass = computed(() => {
    return {
        'md': 'tw-text-base',
        'lg': 'tw-text-lg',
    }[props.size];
});

const checkBoxSize = computed(() => {
    return {
        'md': 'md',
        'lg': 'lg',
    }[props.size];
});

const radioBoxSize = computed(() => {
    return {
        'md': 'md',
        'lg': 'lg',
    }[props.size];
});

function toggleDetail(payload){
    if(props.singleExpand){
        props.modelValue.options.forEach(item => {
            item.active = false;
        });
    }

    props.modelValue.recentActive = payload.index;

    props.modelValue.options[payload.index].active = payload.active;
}
</script>