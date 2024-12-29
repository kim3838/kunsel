<template>
    <div class="tw-relative tw-w-full tw-h-full">
        <div class="clip"></div>
        <div :style="clipFrameStyle" class="clip-frame tw-z-30">
            <div class="clip-body tw-flex body-direction">
                <slot
                    name="body"
                    :frameBorderColor="frameBorderColor"
                ></slot>
            </div>
        </div>
        <div class="clip-inner tw-z-20 tw-flex" :class="[direction === 'ltr' ? 'tw-flex-row' : 'tw-flex-col', opaque ? 'base-background' : '']">
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
    text: textColor,
    textInvert: textInvertColor,
} = storeToRefs($themeStore);

const props = defineProps({
    theme: {
        type: String,
        default: 'light'
    },
    frameBorderGradientEnable: {
        type: Boolean,
        default: false
    },
    frameBorderPrimaryColor: {
        type: String,
        default: ''
    },
    frameBorderSecondaryColor: {
        type: String,
        default: ''
    },
    frameBorderWidth: {
        type: String,
        default: '1px'
    },
    contentBackground: {
        type: String,
        default: `transparent`
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
    opaque: {
        type: Boolean,
        default: true
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

    if(props.frameBorderGradientEnable){
        return 'transparent';
    }

    return props.frameBorderPrimaryColor ? props.frameBorderPrimaryColor : threadColor.value;
});
const clipFrameStyle = computed(() => {

    let frameBorderPrimaryColor = props.frameBorderPrimaryColor ? props.frameBorderPrimaryColor : threadColor.value;

    if(!props.frameBorderGradientEnable){
        return {
            'border': `${props.frameBorderWidth} solid ${frameBorderPrimaryColor}`,
        }
    }

    let frameBorderSecondaryColor = props.frameBorderSecondaryColor ? props.frameBorderSecondaryColor : frameBorderPrimaryColor;

    return {
        'border': `${props.frameBorderWidth} solid`,
        'border-image-source': `linear-gradient(45deg, ${frameBorderPrimaryColor} 20%, ${frameBorderSecondaryColor}, transparent 70%, ${frameBorderSecondaryColor}, ${frameBorderPrimaryColor} 100%)`,
        'border-image-slice': '1'
    };
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
const textColorComputed = computed(() => {
    return {
        'light': textColor.value,
        'dark': textInvertColor.value,
    }[props.theme];
});

const fadeTransition = computed(() => {

    if(!props.headerFade){
        return {};
    }

    let headerFadeColor = props.headerFadeColor ? props.headerFadeColor: tintColor50.value;

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
}
.base-background{
    background: v-bind(contentBackground);
}
.clip-frame{
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
    color: v-bind(textColorComputed);
}
</style>