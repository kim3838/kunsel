<template>
    <div class="card tw-h-full tw-cursor-pointer">
        <NuxtLink
            :to="link">
            <VCutFrame
                :inner-border="innerBorder"
                :outer-border="outerBorder">
                <template #header>
                    <figure class="figure">
                        <img :src="image" />
                    </figure>
                </template>

                <template #body>
                    <div class="card-content" :style="{'font-family': fontFamily}">
                        <div class="card-title tw-text-xl tw-font-bold tw-tracking-normal tw-leading-tight">
                            {{title}}
                        </div>
                        <div class="card-sub-title tw-text-lg tw-line-clamp-3 tw-leading-5">
                            {{subTitle}}
                        </div>
                    </div>
                </template>
            </VCutFrame>
        </NuxtLink>
    </div>
</template>
<script setup>
import {storeToRefs} from 'pinia';
import {computed} from "vue";
const {$themeStore} = useNuxtApp();

const {
    hexAlpha,
    lining: liningColor,
    thread: threadColor,
    tint: tintColor,
    text: textColor,
    textInvert: textInvertColor,
} = storeToRefs($themeStore);

const threadColor50 = computed(() => {
    return threadColor.value + hexAlpha.value['50'];
});

const props = defineProps({
    image: {
        type: String,
        default: null
    },
    link: {
        type: [String],
        default: ''
    },
    title: {
        type: String,
        default: ''
    },
    subTitle: {
        type: String,
        default: ''
    },
    fontFamily: {
        type: String,
        default: 'revert'
    },
    innerBorder: {
        type: String,
        default: ''
    },
    outerBorder: {
        type: String,
        default: ''
    },
    bodyColor: {
        type: String,
        default: ''
    },
    fadeColor: {
        type: String,
        default: ''
    },
    textColor: {
        type: String,
        default: ''
    },
});

const bodyColorComputed = computed(() => {
    return props.bodyColor ? props.bodyColor: tintColor.value;
})
const bodyFadeColorComputed = computed(() => {
    return props.fadeColor ? props.fadeColor: threadColor50.value;
})
const textColorComputed = computed(() => {
    return props.textColor ? props.textColor: textColor.value;
})
const innerBorderComputed = computed(() => {
    return props.innerBorder ? props.innerBorder: threadColor.value;
})
const outerBorderComputed = computed(() => {
    return props.outerBorder ? props.outerBorder: liningColor.value;
})
</script>
<style scoped>
.card{
    position: relative;
    transition: opacity .6s linear 0s,transform .6s cubic-bezier(.165,.84,.44,1) 0s;
    border-radius: 4px;
    overflow: hidden;
}

.figure{
    width: 100%;
    height: 80%;
    position: relative;
    overflow: hidden;
}

.figure:before{
    content: "";
    display: block;
    padding-top: 100%;
    box-sizing: border-box;
}

.figure img{
    height: 100%;
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    object-fit: cover;
    object-position: 50% 0;
}

.figure:after{
    content: "";
    box-sizing: border-box;
    display: block;
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 25%;
    background: linear-gradient(
        to bottom,
        transparent 10%,
        v-bind(bodyColorComputed) 70%);
}

.card-content{
    box-sizing: border-box;
    text-align: center;
    width: 100%;
    height: 20%;
    background: linear-gradient(
        to bottom,
        v-bind(bodyColorComputed),
        v-bind(bodyFadeColorComputed) 100%);
}

.card-title{
    position: absolute;
    top: calc(calc(80%) - calc(1.75rem + 5px));
    left: 1.5rem;
    right: 1.5rem;
    padding-bottom: 5px;
    font-weight: 500;
    color: v-bind(textColorComputed);
    text-shadow: 1px 1px 1px v-bind(bodyFadeColorComputed);
}

.card-title:after{
    content: "";
    position: absolute;
    height: 1px;
    width: 100%;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
        to right,
        transparent 0%,
        v-bind(innerBorderComputed) 15%,
        v-bind(outerBorderComputed) 50%,
        v-bind(innerBorderComputed) 85%,
        transparent 100%
    );
}

.card-sub-title{
    position: absolute;
    margin: 0;
    padding: 0 1.5rem 1.5rem;
    color: v-bind(textColorComputed);
    width: 100%;
    height: 3.75rem;
}

</style>