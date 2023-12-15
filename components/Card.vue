<template>
    <div class="card">
        <VCutFrame>
            <template #header>
                <figure class="figure">
                    <img :src="image.path" />
                </figure>
            </template>

            <template #body>
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
                            <Button :variant="'flat'" :size="'md'" :icon="'ion:newspaper-outline'" :label="buttonLabel"></Button>
                        </NuxtLink>
                    </div>
                </div>
            </template>
        </VCutFrame>

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
    buttonLabel: {
        type: [String, undefined, null],
        default: 'Read More'
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
    return props.focused ? '100px' : '150px';
})
const cardTitleBottomSpacing = computed(()=>{
    return props.focused ? '7rem' : '10rem';
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
    margin: 0rem 1.5rem 0 1.5rem;
    color: v-bind(textColor);
}

.card-actions{
    position: absolute;
    bottom: 1.5rem;
    left: 1.5rem;
    right: 1.5rem;
}
</style>