<template>
    <div class="tw-relative tw-w-full tw-h-full">
        <div class="clip"></div>
        <div class="clip-frame tw-z-30">
            <div class="clip-body tw-flex body-direction">
                <slot
                    name="body"
                    :slot="{
                    frameBorderColor: frameBorderColor,
                    contentBorderColor: contentBorderColor
                }"
                ></slot>
            </div>
        </div>
        <div class="clip-inner tint-background tw-z-20 tw-flex" :class="[direction === 'ltr' ? 'tw-flex-row' : 'tw-flex-col']">
            <div :style="fadeTransition"></div>
            <slot name="header"></slot>
        </div>
    </div>
</template>

<script setup>
import {storeToRefs} from 'pinia';
const {$themeStore} = useNuxtApp();

const {
    hexAlpha,
    primary: primaryColor,
    thread: threadColor,
    lining: liningColor,
    tint: tintColor,
} = storeToRefs($themeStore);

const props = defineProps({
    frameBorder: {
        type: String,
        default: ''
    },
    contentBorder: {
        type: String,
        default: ''
    },
    topRight: {
        type: Number,
        default: 0
    },
    bottomLeft: {
        type: Number,
        default: 0
    },
    headPercentage: {
        type: Number,
        default: 0
    },
    direction: {
        type: String,
        default: 'ltr'
    },
    headerFade: {
        type: Boolean,
        default: true
    },
    headerFadeColor: {
        type: String,
        default: ''
    },
});

const tintColor50 = computed(() => {
    return tintColor.value + hexAlpha.value['50'];
});
const frameBorderColor = computed(() => {
    return props.frameBorder ? props.frameBorder : threadColor.value;
});
const contentBorderColor = computed(() => {
    return props.contentBorder ? props.contentBorder : liningColor.value;
});
const topRightAllocationInPixels = computed(() => {
    return (props.topRight + 'px');
});
const bottomLeftAllocationInPixels = computed(() => {
    return (props.bottomLeft + 'px');
});
const bodyFlexDirection = computed(() => {
    return {
        'ltr': 'row-reverse',
        'ttb': 'column-reverse',
    }[props.direction];
});

const fadeTransition = computed(() => {

    if(!props.headerFade){
        return {};
    }

    var headerFadeColor = props.headerFadeColor ? props.headerFadeColor: tintColor50.value;

    return {
        display: (props.headPercentage > 0 ? 'block' : 'none'),
        position: 'absolute',
        width: (props.direction === 'ltr' ? (`${props.headPercentage}%`) : (`100%`)),
        height: (props.direction === 'ttb' ? (`${props.headPercentage}%`) : (`100%`)),
        background: 'linear-gradient(to ' + (props.direction === 'ltr' ? 'right' : 'bottom') + ', transparent 50%, ' + headerFadeColor + ' 100%)'
    };
})
</script>

<style scoped lang="scss">
@keyframes animate-border {
    0%{background-position: 0% 0%;}
    50%{background-position: 600% 0%;}
    100%{background-position: 0% 0%;}
}
.body-direction{
    flex-direction: v-bind(bodyFlexDirection) !important;
}
.clip{
    width: 100%;
    height: 100%;
    clip-path: polygon(
        calc(100% - v-bind(topRightAllocationInPixels)) 0px,
        100% v-bind(topRightAllocationInPixels),
        100% 100%,
        v-bind(bottomLeftAllocationInPixels) 100%,
        0 calc(100% - v-bind(bottomLeftAllocationInPixels)),
        0 0
    );
    background-size: 150% 100%;
    background-position: 0% 0;
    background-repeat: repeat;
    background-image: linear-gradient(
        112deg,
        v-bind(contentBorderColor) 40%,
        transparent 50%,
        transparent 55%,
        v-bind(contentBorderColor) 65%);
    -webkit-animation: animate-border 15s infinite ease;
    -moz-animation: animate-border 15s infinite ease;
    animation: animate-border 15s infinite ease;
}
.clip-frame{
    border:1px solid v-bind(frameBorderColor);
    position: absolute;
    content: "";
    top: 7px;
    left: 7px;
    right: 7px;
    bottom: 7px;
}
.clip-inner{
    clip-path: polygon(
        calc(100% - v-bind(topRightAllocationInPixels)) 1px,
        calc(100% - 1px) v-bind(topRightAllocationInPixels),
        calc(100% - 1px) calc(100% - 1px),
            v-bind(bottomLeftAllocationInPixels) calc(100% - 1px),
        1px calc(100% - v-bind(bottomLeftAllocationInPixels)),
        1px 1px
    );
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
}
.clip-body{
    clip-path: polygon(
        calc(100% - v-bind(topRightAllocationInPixels) + 14px + 1px) 0px,
        calc(100%) calc(v-bind(topRightAllocationInPixels) - 14px - 1px),
        calc(100%) calc(100%),
        calc(v-bind(bottomLeftAllocationInPixels) - 14px - 1px) calc(100%),
        0px calc(100% - v-bind(bottomLeftAllocationInPixels) + 14px + 1px),
        0px 0px
    );
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
}
</style>