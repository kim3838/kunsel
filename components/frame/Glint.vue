<template>
    <div class="w-full glint-trail" :style="{'height': heightStyle}" :class="glintClass">
        <span v-if="enable" class="glint"></span>
        <span v-if="enable" class="glint"></span>
        <span v-if="enable" class="glint"></span>
        <span v-if="enable" class="glint"></span>
        <slot></slot>
    </div>
</template>

<script setup lang="ts">
import {storeToRefs} from "pinia";
const {$themeStore} = useNuxtApp();

const {
    hexAlpha,
    accent: accentColor,
} = storeToRefs($themeStore);

const props = defineProps({
    enable: {
        type: Boolean,
        default: true
    },
    orientation: {
        type: String,
        default: 'portrait'
    },
    color: {
        type: String,
        default: ''
    },
    heightStyle: {
        type: String,
        default: '100%'
    }
});

const glintColor = computed(() => {
    return props.color ? props.color: accentColor.value;
});
const glintClass = computed(() => {
    return props.enable ? 'overflow-hidden' : '';
});

const verticalGlintTransitionDuration = computed(() => {
    return {
        'portrait': '0.25s',
        'landscape': '0.125s',
    }[props.orientation];
})
const horizontalGlintTransitionDuration = computed(() => {
    return {
        'portrait': '0.125s',
        'landscape': '0.25s',
    }[props.orientation];
})

const glint1TransitionDelay = computed(() => {
    return {
        'portrait': '0.2s',
        'landscape': '0.075s',
    }[props.orientation];
})
const glint2TransitionDelay = computed(() => {
    return {
        'portrait': '0.2s',
        'landscape': '0.075s',
    }[props.orientation];
})
const glint3TransitionDelay = computed(() => {
    return {
        'portrait': '0.075s',
        'landscape': '0.2s',
    }[props.orientation];
})
const glint4TransitionDelay = computed(() => {
    return {
        'portrait': '0.075s',
        'landscape': '0.2s',
    }[props.orientation];
})
</script>

<style scoped>
.glint-trail {
    position: relative;
}
.glint-trail .glint {
    position: absolute;
    display: block;
    z-index: 30;
    border-radius: 2px;
}
.glint-trail .glint:nth-child(1),
.glint-trail .glint:nth-child(2),
.glint-trail .glint:nth-child(3),
.glint-trail .glint:nth-child(4)
{
    background: linear-gradient(
        138.275deg,
        rgba(255, 255, 255, 0) 0%,
        v-bind(glintColor) 44.79%,
        v-bind(glintColor) 58.85%,
        rgba(255, 255, 255, 0) 100%
    );
}

.glint-trail .glint:nth-child(1),
.glint-trail .glint:nth-child(2) {
    height: 3px;
    width: 108px;
    left: -111px;
    transition: left v-bind(horizontalGlintTransitionDuration) ease-in-out;
}
.glint-trail .glint:nth-child(3),
.glint-trail .glint:nth-child(4) {
    width: 3px;
    height: 108px;
    top: -111px;
    transition: top v-bind(verticalGlintTransitionDuration) ease-in-out;
}

.glint-trail .glint:nth-child(1) {
    top: 0;
    transition-delay: v-bind(glint1TransitionDelay);
}
.glint-trail .glint:nth-child(2) {
    bottom: 0;
}
.glint-trail .glint:nth-child(3) {
    left: 0;
    transition-delay: v-bind(glint3TransitionDelay);
}
.glint-trail .glint:nth-child(4) {
    right: 0;
}

.glint-trail:hover .glint:nth-child(1),
.glint-trail:hover .glint:nth-child(2) {
    left: 100%;
    transition: left v-bind(horizontalGlintTransitionDuration) ease-in-out;
}
.glint-trail:hover .glint:nth-child(2) {
    transition-delay: v-bind(glint2TransitionDelay);
}
.glint-trail:hover .glint:nth-child(3),
.glint-trail:hover .glint:nth-child(4) {
    top: 100%;
    transition: top v-bind(verticalGlintTransitionDuration) ease-in-out;
}
.glint-trail:hover .glint:nth-child(4) {
    transition-delay: v-bind(glint4TransitionDelay);
}
</style>