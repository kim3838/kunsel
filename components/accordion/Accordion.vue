<template>
    <div>
        <Details
            v-for="(detail, index) in payload.options"
            :key="detail.title"
            :size="size"
            :active="detail.active"
            :index="index"
            :single-expand="singleExpand"
            :center-content="centerContent"
            :title-icon="titleIcon"
            :multi-line-title="multiLineTitle"
            :active-border-color="activeBorderColor"
            @toggle="toggleDetail"
        >
            <template v-slot:title>
                <div :class="[titleFontClass, '']">
                    {{detail.title}}
                </div>
            </template>
            <template v-slot:body="{active}">
                <div
                    v-if="detail.body.type === 'text'"
                    class="text-type-content-alignment"
                    :class="[bodyFontClass]">
                    {{detail.body.value}}
                </div>
                <div
                    v-else-if="detail.body.type === 'checkbox'"
                    class="non-text-type-content-alignment"
                    :class="['flex', nonTextTypeContentAlignment]">
                    <div>
                        <label v-for="detailsCheckbox in detail.body.value" :key="detailsCheckbox">
                            <Checkbox v-model="detailsCheckbox.value" :label="detailsCheckbox.text" :size="checkBoxSize" />
                        </label>
                    </div>
                </div>
                <div
                    v-else-if="detail.body.type === 'radio'"
                    class="non-text-type-content-alignment"
                    :class="['flex', nonTextTypeContentAlignment]">
                    <div>
                        <RadioGroup
                            :selections="detail.body.value.selection"
                            :size="radioBoxSize"
                            v-model="detail.body.value.selected" />
                    </div>
                </div>
            </template>
        </Details>
    </div>
</template>
<script setup>
const props = defineProps({
    size: {
        default: 'md'
    },
    payload: {
        type: Object,
        default: function(){
            return {};
        }
    },
    centerContent: {
        type: Boolean,
        default: false
    },
    singleExpand: {
        type: Boolean,
        default: false
    },
    activeBorderColor: {
        type: String,
        default: ''
    },
    titleIcon: {
        type: Boolean,
        default: true
    },
    multiLineTitle: {
        type: Boolean,
        default: false
    },
});

const titleFontClass = computed(() => {
    return {
        'md': 'text-lg',
        'lg': 'text-xl font-semibold',
    }[props.size];
});

const bodyFontClass = computed(() => {
    return {
        'md': 'text-base',
        'lg': 'text-lg',
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

const textTypeContentAlignment = computed(() => {
    return props.centerContent ? 'center' : 'auto';
});

const nonTextTypeContentAlignment = computed(() => {
    return props.centerContent ? 'center' : 'left';
});

function toggleDetail(payload){
    if(props.singleExpand){
        props.payload.options.forEach(item => {
            item.active = false;
        });
    }

    props.payload.recentActive = payload.index;

    props.payload.options[payload.index].active = payload.active;
}
</script>
<style scoped>
.text-type-content-alignment{
    text-align: v-bind(textTypeContentAlignment);
}
.non-text-type-content-alignment{
    justify-content: v-bind(nonTextTypeContentAlignment);
}
</style>