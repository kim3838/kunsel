<template>
    <div class="relative w-full">
        <div
            :id="innerId"
            class="carousel-inner flex flex-nowrap"
            :style="innerCarouselStyle">
            <slot name="items" :slot="{items: items}"></slot>
        </div>

        <span
            v-if="showNavigation"
            class="nav-button prev flex h-14 w-7 items-center justify-center backdrop-blur-sm"
            @click="prevSlide"
        ><Icon :name="'ic:sharp-arrow-back-ios'" class="w-8 h-8"></Icon></span>
        <span
            v-if="showNavigation"
            class="nav-button next flex h-14 w-7 items-center justify-center backdrop-blur-sm"
            @click="nextSlide"
        ><Icon :name="'ic:sharp-arrow-forward-ios'" class="w-8 h-8"></Icon></span>

    </div>
</template>

<script setup>

const props = defineProps({
    innerId: {
        type: String,
        required: true
    },
    items: {
        type: Array,
        required: true,
    },
    visibleCount: {
        type: Number,
        default: 1,
    },
    xPadding: {
        type: String,
        default: '0px',
    },
    gap: {
        type: String,
        default: '0.5rem',
    },
    scrollSpeed: {
        type: String,
        default: '200ms',
    },
    buttonProperties: {
        type: Object,
        default: function(){
            return {
                'color': 'white',
                'background': 'rgba(200,200,200,0.25)',
                'hover_background': 'rgba(200,200,200,0.5)',
            };
        }
    },
});

const minimumVisibleCount = ref(1);
const currentIndex = ref(0);

//Todo: Show navigation when carousel items overflow
const showNavigation = computed(() => {return props.items.length > props.visibleCount;})

const prevSlide = () => {
    currentIndex.value = Math.max(currentIndex.value - 1, 0);
}

const nextSlide = () => {
    const maxIndex = props.items.length - minimumVisibleCount.value;
    currentIndex.value = Math.min(currentIndex.value + 1, maxIndex);
}

const innerCarouselStyle = reactive({
    transform: 'translateX(0)'
});

watch(currentIndex, (newVal, oldVal) => {

    if(newVal > 0){

        const gap = `${newVal} * ${props.gap}`;

        let translateX = `calc(`;

        let children = document.getElementById(props.innerId).children;
        let totalWidth = 0;

        for(let index = 0; index < newVal; index++){
            let width = children[index].offsetWidth
            totalWidth += width;
        }

        translateX = translateX + `-${totalWidth}px`;
        translateX = `${translateX} - ${gap})`;

        translateX = `translateX(${translateX})`;

        innerCarouselStyle.transform = translateX;
    }

    if(newVal < 1){

        innerCarouselStyle.transform = `translateX(0)`;
    }
})
</script>

<style scoped>
.carousel-inner {
    transition: transform v-bind(scrollSpeed) ease-in-out;
    padding-left: v-bind(xPadding);
    padding-right: v-bind(xPadding);
    gap: v-bind(gap);
}

.nav-button {
    background-color: v-bind(buttonProperties.background);
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    color: v-bind(buttonProperties.color);
    cursor: pointer;
    z-index: 30;
}

.nav-button:hover{
    border:1px solid v-bind(buttonProperties.background);
    background-color: v-bind(buttonProperties.hover_background);
}

.nav-button.prev {
    left: 10px;
}

.nav-button.next {
    right: 10px;
}
</style>
