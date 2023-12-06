<template>
    <div class="tw-space-y-4">
        <Details
            v-for="(detail, index) in modelValue"
            :key="detail.title"
            :size="size"
            :active="detail.active"
            :index="index"
            @toggle="toggleDetail"
        >
            <template v-slot:title>
                <div class="tw-text-lg">
                    {{detail.title}}
                </div>
            </template>
            <template v-slot:body="{active}">
                <div v-if="detail.body.type === 'text'">
                    {{detail.body.value}}
                </div>
                <div v-else-if="detail.body.type === 'checkbox'">
                    <label v-for="detailsCheckbox in detail.body.value" :key="detailsCheckbox">
                        <Checkbox v-model="detailsCheckbox.value" :label="detailsCheckbox.text" :size="'md'" />
                    </label>
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
    modelValue: {
        type: Array,
        default: function(){
            return [];
        }
    },
    singleExpand: {
        type: Boolean,
        default: false
    },
});

function toggleDetail(payload){
    if(props.singleExpand){
        props.modelValue.forEach(item => {
            item.active = false;
        });
    }

    props.modelValue[payload.index].active = payload.active;
}
</script>