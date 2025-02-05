<template>
    <div>
        <div
            @click="activeComputed = !activeComputed"
            :class="[heightClass, singleExpand && activeComputed ? 'active-border-title' : '']"
            class="text-type-title-content-alignment px-2 cursor-pointer flex items-center">
            <div class="text-base" :class="[multiLineTitle ? '' : 'truncate']">
                <slot name="title"></slot>
            </div>
            <Icon v-if="titleIcon" class="flex-none h-5 w-5" :name="'ic:baseline-arrow-drop-down'"></Icon>
        </div>
        <div
            v-show="activeComputed"
            :class="[singleExpand && activeComputed ? 'active-border-body' : '']"
            class="px-2 text-base">
            <slot name="body"></slot>
        </div>
    </div>
</template>

<script setup>
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
    activeBorderColor: {
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

const activeBorderColorComputed = computed(() => {
    return props.activeBorderColor ? props.activeBorderColor : liningColor.value;
});

const heightClass = computed(() => {
    return {
        'md': props.multiLineTitle ? '' : 'h-8',
        'lg': props.multiLineTitle ? '' : 'h-11'
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
    border-color: v-bind(activeBorderColorComputed) !important;
}
.active-border-body {
    border-width: 1px;
    border-color: v-bind(activeBorderColorComputed) !important;
    border-top: none;
}
.text-type-title-content-alignment{
    justify-content: v-bind(textTypeTitleContentAlignment);
    text-align: v-bind(textTypeTitleContentAlignment);
}
</style>