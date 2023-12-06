<template>
    <div>
        <div @click="activeComputed = !activeComputed" class="scaffold tw-px-2 tw-cursor-pointer tw-h-8 tw-flex tw-items-center">
            <span class="tw-truncate tw-text-base">
                <slot name="title"></slot>
            </span>
            <Icon class="tw-flex-none tw-h-5 tw-w-5" :name="'ic:baseline-arrow-drop-down'"></Icon>
        </div>
        <div v-show="activeComputed" class="scaffold tw-px-2 tw-text-base">
            <slot name="body"></slot>
        </div>
    </div>
</template>

<script setup>
import {computed} from "vue";

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
    }
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
</script>