<template>
    <div class="card">
        <figure class="figure">
            <img :src="image.path" />
        </figure>

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

        <div class="card-content">
            <div class="card-title tw-text-lg tw-font-semibold tw-tracking-normal tw-leading-tight">
                {{title}}
            </div>
            <div class="card-sub-title tw-text-base tw-line-clamp-4 tw-leading-tight">
                {{subTitle}}
            </div>
            <div class="card-actions">
                <NuxtLink
                    v-if="link"
                    :to="link">
                    <Button :variant="'flat'" :size="'sm'" :icon="'ion:newspaper-outline'" :label="'Read More'"></Button>
                </NuxtLink>
            </div>
        </div>
    </div>
</template>
<script setup>
import {storeToRefs} from 'pinia';
import {computed} from "vue";
const {$themeStore} = useNuxtApp();

const {
    hexAlpha,
    accent: accentColor,
    lining: liningColor,
    thread: threadColor,
    tint: tintColor,
    shade: shadeColor,
    text: textColor,
    textInvert: textInvertColor,
} = storeToRefs($themeStore);

const threadColor50 = computed(() => {
    return threadColor.value + hexAlpha.value['50'];
});

const liningColor50 = computed(() => {
    return liningColor.value + hexAlpha.value['50'];
});

const props = defineProps({
    image: {
        type: Object,
        default: function () {
            return {
                path: null
            }
        }
    },
    link: {
        type: [String, Boolean],
        default: false
    },
    title: {
        type: String,
        default: ''
    },
    subTitle: {
        type: String,
        default: ''
    },
    focused: Boolean
});

const cardContentHeight = computed(()=>{
    return props.focused ? '100px' : '180px';
})
const cardTitleBottomSpacing = computed(()=>{
    return props.focused ? '6rem' : '10rem';
})
</script>
<style scoped>
.card{
    width: 370px;
    position: relative;
    transition: opacity .6s linear 0s,transform .6s cubic-bezier(.165,.84,.44,1) 0s;
    border-radius: 4px;
    overflow: hidden;
}

.figure{
    width: 100%;
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
    display: block;
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 25%;
    background: linear-gradient(
        to bottom,
        transparent 10%,
        v-bind(tintColor) 90%);
}

.card-content{
    height: v-bind(cardContentHeight);
    text-align: center;
    background: linear-gradient(
        to bottom,
        v-bind(tintColor),
        v-bind(threadColor50) 100%);
}

.card-title{
    position: absolute;
    left: 1.5rem;
    right: 1.5rem;
    bottom: v-bind(cardTitleBottomSpacing);
    padding-bottom: 5px;
    font-weight: 500;
    color: v-bind(textColor);
    text-shadow: 1px 1px 1px v-bind(liningColor50);
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
        v-bind(threadColor) 20%,
        v-bind(liningColor) 80%,
        transparent 100%
    );
}

.card-sub-title{
    position: absolute;
    left: 0;
    right: 0;
    margin: 2rem 1.5rem 0 1.5rem;
    color: v-bind(textColor);
}

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
    border: 1px solid v-bind(threadColor);
    border-top: none;
}

.frame-outer:after{
    position: absolute;
    top: 2.5rem;
    bottom: 0.5rem;
    left: -0.5rem;
    right: -0.5rem;
    content: "";
    border: 1px solid v-bind(liningColor);
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
    border: 1px solid v-bind(threadColor);/*#99664d*/
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
    border:1px solid v-bind(threadColor);/*#99664d*/
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
    border: 1px solid v-bind(threadColor);/*#68482c*/
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
    border: 1px solid v-bind(threadColor);/*#68482c*/
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
    background: v-bind(threadColor);
}
.frame-inner:after{
    content: "";
    position: absolute;
    right: 0;
    width: calc(50% - 1rem);
    height: 1px;
    background: v-bind(threadColor);
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
    border: 1px solid v-bind(threadColor);
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
    background: v-bind(liningColor);
}
.frame-outer-sub-border-top:after{
    position: absolute;
    right: 0;
    content: "";
    width: calc(50% - 2rem);
    height: 1px;
    background: v-bind(liningColor);
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
    border: 1px solid v-bind(liningColor);
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
    border: 1px solid v-bind(liningColor);
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
    border: 1px solid v-bind(liningColor);
    border-radius: 45%;
    box-sizing: border-box;
}

.card-actions{
    position: absolute;
    bottom: 1.5rem;
    left: 1.5rem;
    right: 1.5rem;
}
</style>