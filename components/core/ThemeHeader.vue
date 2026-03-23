<template>
    <div
        class="px-2 max-w-max font-medium font-header header"
        :class="[headerClass]"
        :style="style">
        <slot></slot>
    </div>
</template>

<script setup lang="ts">
const {
    appTheme,
    primaryColor, primaryColor90, primaryColor80,
    accentColor80, accentColor70, accentColor40,
    neutralColor,
    textColor,
    textInvertColor,
    activeClearFluidBackground
} = useCosmetic();


const props = defineProps({
    type: {
        type: String,
        default: 'default'
    },
});
const style = computed(() => {
    return {
        'border-radius': '2px'
    }
})

const headerClass = computed(() => {

    if(['dark-silver', 'dark-emerald'].indexOf(appTheme.value) >= 0){
        return {
            'default': 'header-dark',
            'gray': 'header-gray-dark',
        }[props.type];
    }

    if(['default-blue'].indexOf(appTheme.value) >= 0){
        return {
            'default': 'header-light',
            'gray': 'header-gray-light',
        }[props.type];
    }
})
</script>

<style lang="scss" scoped>
.header-light{
    position: relative;
    z-index: 1;
    color: v-bind(textColor) !important;
    overflow: hidden;
    background: linear-gradient(to right, transparent 20%, v-bind(accentColor40) 60%, v-bind(accentColor40) 85%, transparent 100%);
    @include fluid-gold-before($left: -35%, $opacity: 0.4);
}
.header-gray-light{
    position: relative;
    z-index: 1;
    color: v-bind(textColor) !important;
    overflow: hidden;
    @include fluid-gold-before($left: -35%, $opacity: 0.2);
}
.header-dark{
    position: relative;
    z-index: 1;
    color: v-bind(textColor) !important;
    @extend .text-shadow;
    overflow: hidden;
    background: linear-gradient(to right, transparent 20%, transparent 60%, v-bind(accentColor40) 85%, transparent 100%);
    @include fluid-gold-before($left: -35%, $opacity: 0.1);
}
.header-gray-dark{
    position: relative;
    z-index: 1;
    color: v-bind(textColor) !important;
    @extend .text-shadow;
    overflow: hidden;
    @include ripple($opacity: 0.2, $animate: false);
}
</style>