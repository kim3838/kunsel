<template>
    <div>
        <div
            @click="activeComputed = !activeComputed"
            :class="[heightClass, singleExpand && activeComputed ? 'active-border-title' : '']"
            class="text-type-title-content-alignment tw-px-2 tw-cursor-pointer tw-flex tw-items-center">
            <div class="tw-text-base" :class="[multiLineTitle ? '' : 'tw-truncate']">
                <slot name="title"></slot>
            </div>
            <Icon v-if="titleIcon" class="tw-flex-none tw-h-5 tw-w-5" :name="'ic:baseline-arrow-drop-down'"></Icon>
        </div>
        <div
            v-show="activeComputed"
            :class="[singleExpand && activeComputed ? 'active-border-body' : '']"
            class="tw-px-2 tw-text-base">
            <slot name="body"></slot>
        </div>
    </div>
</template>

<script setup>
import {computed} from "vue";
import {storeToRefs} from 'pinia';
const {$themeStore} = useNuxtApp();

const {
    lining: liningColor,
} = storeToRefs($themeStore);

const props = defineProps({
    size: {
        default: 'md'
    },
    index: {
        type: Number
    },
    active: {
        type: Boolean,
        default: false
    },
    activeBorder: {
        type: String,
        default: ''
    },
    singleExpand: {
        type: Boolean,
        default: false
    },
    centerContent: {
        type: Boolean,
        default: false
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

const activeBorderComputed = computed(() => {
    return props.activeBorder ? props.activeBorder : liningColor.value;
});

const heightClass = computed(() => {
    return {
        'md': props.multiLineTitle ? '' : 'tw-h-8',
        'lg': props.multiLineTitle ? '' : 'tw-h-11'
    }[props.size]
});

const emit = defineEmits(["toggle"]);

const activeComputed = computed({
    get() {
        return props.active;
    },
    set(active) {
        emit('toggle', {
            index: props.index,
            active: active
        });
    }
});

const textTypeTitleContentAlignment = computed(() => {
    return props.centerContent ? 'center' : 'left';
});
</script>
<style scoped>
.active-border-title {
    border-width: 1px;
    border-color: v-bind(activeBorderComputed) !important;
}
.active-border-body {
    border-width: 1px;
    border-color: v-bind(activeBorderComputed) !important;
    border-top: none;
}
.text-type-title-content-alignment{
    justify-content: v-bind(textTypeTitleContentAlignment);
    text-align: v-bind(textTypeTitleContentAlignment);
}
</style>