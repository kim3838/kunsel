<template>
    <div class="tw-relative tw-h-full tw-w-full">
        <slot name="header"></slot>

        <div class="frame-outer">
            <span class="frame-pin"></span>
            <span class="frame-round"></span>
        </div>

        <div class="frame-inner">
            <span class="frame-inner-v-cut"></span>
        </div>

        <div class="frame-outer-sub">
            <span class="frame-outer-sub-border-top"></span>
            <span class="frame-outer-sub-v-cut"></span>
            <span class="frame-round-sub"></span>
        </div>

        <slot name="body"></slot>
    </div>
</template>

<script setup>
import {storeToRefs} from 'pinia';
const {$themeStore} = useNuxtApp();

const {
    hexAlpha,
    lining: liningColor,
    thread: threadColor,
    tint: tintColor,
    textInvert: textInvertColor,
} = storeToRefs($themeStore);

const props = defineProps({
    innerBorder: {
        type: String,
        default: ''
    },
    outerBorder: {
        type: String,
        default: ''
    },
});

const innerBorderComputed = computed(() => {
    return props.innerBorder ? props.innerBorder: threadColor.value;
})
const outerBorderComputed = computed(() => {
    return props.outerBorder ? props.outerBorder: liningColor.value;
})
</script>

<style scoped>
.frame-outer{
    position: absolute;
    top: 1rem;
    bottom: 0.5rem;
    left: 1rem;
    right: 1rem;
    box-sizing: border-box;
}

.frame-outer:before{
    position: absolute;
    top: 2rem;
    bottom: 0;
    left: 0;
    right: 0;
    content: "";
    border: 1px solid v-bind(innerBorderComputed);
    border-top: none;
}

.frame-outer:after{
    position: absolute;
    top: 2.5rem;
    bottom: 0.5rem;
    left: -0.5rem;
    right: -0.5rem;
    content: "";
    border: 1px solid v-bind(outerBorderComputed);
    border-top: none;
}

.frame-pin{
    position: absolute;
    left:0;
    top:0;
    right:0;
    height: 2rem;
    display: block;
    box-sizing: border-box;
}
.frame-pin:before{
    content: "";
    position: absolute;
    top: .2rem;
    left: .2rem;
    height: .5rem;
    width: .5rem;
    border-radius: 50%;
    border: 1px solid v-bind(innerBorderComputed);
    box-sizing: border-box;
}
.frame-pin:after{
    content: "";
    position: absolute;
    top: .2rem;
    right: .2rem;
    height: .5rem;
    width: .5rem;
    border-radius: 50%;
    border:1px solid v-bind(innerBorderComputed);
    box-sizing: border-box;
}

.frame-round{
    position: relative;
    display: block;
    height: 2rem;
    overflow: hidden;
}
.frame-round:before{
    content: "";
    position: absolute;
    left: -2rem;
    top: -2rem;
    width: 4rem;
    height: 4rem;
    border: 1px solid v-bind(innerBorderComputed);
    border-radius: 50%;
    box-sizing: border-box;
}
.frame-round:after{
    content: "";
    position: absolute;
    right: -2rem;
    top: -2rem;
    width: 4rem;
    height: 4rem;
    border: 1px solid v-bind(innerBorderComputed);
    border-radius: 50%;
    box-sizing: border-box;
}

.frame-inner{
    content: "";
    position: absolute;
    top: 1rem;
    left: 3rem;
    right: 3rem;
    bottom: 0;
    box-sizing: border-box;
    overflow: hidden;
}
.frame-inner:before{
    content: "";
    position: absolute;
    left: 0;
    width: calc(50% - 1rem);
    height: 1px;
    background: v-bind(innerBorderComputed);
}
.frame-inner:after{
    content: "";
    position: absolute;
    right: 0;
    width: calc(50% - 1rem);
    height: 1px;
    background: v-bind(innerBorderComputed);
}
.frame-inner-v-cut{
    position: absolute;
    width: 2rem;
    height: 2rem;
    display: block;
    top: -1.3rem;
    left: 50%;
    transform: translateX(-50%);
}
.frame-inner-v-cut:before{
    position: absolute;
    content: "";
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    border: 1px solid v-bind(innerBorderComputed);
    transform: rotate(45deg);
}

.frame-outer-sub{
    position: absolute;
    top: 0.5rem;
    bottom: 1rem;
    left: 0.5rem;
    right: 0.5rem;
    box-sizing: border-box;
    overflow: hidden;
}

.frame-outer-sub-border-top{
    content: "";
    position: absolute;
    left: 3rem;
    right: 3rem;
    height: 3rem;
}
.frame-outer-sub-border-top:before{
    position: absolute;
    left: 0;
    content: "";
    width: calc(50% - 2rem);
    height: 1px;
    background: v-bind(outerBorderComputed);
}
.frame-outer-sub-border-top:after{
    position: absolute;
    right: 0;
    content: "";
    width: calc(50% - 2rem);
    height: 1px;
    background: v-bind(outerBorderComputed);
}

.frame-outer-sub-v-cut{
    position: absolute;
    width: 3rem;
    height: 3rem;
    display: block;
    top: -1.5rem;
    left: 50%;
    transform: translateX(-50%);
}

.frame-outer-sub-v-cut:before{
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    border: 1px solid v-bind(outerBorderComputed);
    transform: rotate(45deg);
    content: "";
}

.frame-round-sub{
    position: relative;
    display: block;
    height: 3.5rem;
    overflow: hidden;
    box-sizing: border-box;
}
.frame-round-sub:before{
    content: "";
    position: absolute;
    left: -3rem;
    top: -3rem;
    width: 6rem;
    height: 6rem;
    border: 1px solid v-bind(outerBorderComputed);
    border-radius: 45%;
    box-sizing: border-box;
}
.frame-round-sub:after{
    content: "";
    position: absolute;
    right: -3rem;
    top: -3rem;
    width: 6rem;
    height: 6rem;
    border: 1px solid v-bind(outerBorderComputed);
    border-radius: 45%;
    box-sizing: border-box;
}
</style>