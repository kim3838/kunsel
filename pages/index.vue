<template>
    <div>
        <SnapLandingWrapper>
            <CarouselModuleCarousel v-if="false" :mouse-drag="true" wrap-around class="tw-snap-start tw-snap-always">
                <CarouselModuleSlide v-for="slide in carouselPayload" :key="slide">
                    <div class="tw-w-screen tw-h-screen carousel-image" :style="{'background-image': `url(${slide.image.path})`}"></div>
                </CarouselModuleSlide>

                <template #addons>
                    <CarouselModuleNavigation />
                    <CarouselModulePagination class="tw-absolute tw-left-0 tw-bottom-0 tw-right-0 tw-m-0" />
                </template>
            </CarouselModuleCarousel>

            <!-- Spotlight: Video -->
            <div v-if="false" class="tw-snap-start tw-snap-always tw-relative tw-w-full tw-h-screen">
                <video :ref="'spotlightVideo_1'" preload="none" muted loop class="tw-absolute tw-z-30 tw-border-0 tw-object-cover tw-w-full tw-h-full">
                    <source :src="'videos/your_name_4.mp4'" type="video/mp4">
                </video>

                <div class="navigation-height tw-w-full tw-relative"></div>
                <div v-if="true" class="tw-absolute tw-w-full tw-h-full spotlight-content-height tw-z-30 tw-flex tw-justify-center">
                    <div class="tw-pb-10 tw-max-w-screen-2xl tw-w-full tw-flex tw-flex-col-reverse">
                        <article class="tw-w-full tw-h-max">
                            <CarouselModuleCarousel
                                dir="rtl"
                                v-model="spotlight_1_index"
                                v-bind="carouselSettings"
                                :breakpoints="carouselBreakpoints"
                                class="tw-w-full lg:tw-w-full">
                                <CarouselModuleSlide class="tw-w-[270px] tw-transition-all tw-duration-700 tw-opacity-70 hover:tw-opacity-100" v-for="spotLightItem in spotlight_1" :key="spotLightItem">
                                    <div class="tw-w-full tw-h-[350px] tw-mx-2">
                                        <HexagonFrame
                                            :frame-border="'#dedede'"
                                            :content-border="'#b7b7b7'"
                                            :direction="'ttb'"
                                            :head-percentage="70"
                                            :top-right="45"
                                            :bottom-left="45"
                                            :header-fade="true"
                                            :header-fade-color="'rgba(5,5,5,0.1)'">
                                            <template #header>
                                                <div class="tw-h-[70%] tw-w-full tw-p-[6px] tw-box-border">
                                                    <div
                                                        class="tw-h-full tw-w-full tw-bg-cover tw-bg-center tw-bg-no-repeat"
                                                        :style="{'background':'url('+spotLightItem.image+')'}"
                                                    />
                                                </div>
                                                <div class="tw-h-[30%] tw-w-full tw-box-border">
                                                    <div
                                                        class="tw-h-full tw-w-full tw-bg-cover tw-bg-center tw-bg-no-repeat tw-grayscale tw-opacity-20"
                                                        :style="{'background':'url('+spotLightItem.image+')'}"
                                                    />
                                                </div>
                                            </template>
                                            <template #body>
                                                <div class="tw-h-[30%] tw-w-full tw-pt-2 tw-pl-8 tw-overflow-hidden tw-flex tw-flex-col">

                                                    <div class="tw-overflow-auto tw-space-y-2">

                                                        <div class="tw-font-semibold tw-h-max tw-flex-none" style="text-align: left;">
                                                            <div class="tw-text-lg tw-font-semibold" v-text="spotLightItem.subTitle"></div>

                                                            <NuxtLink
                                                                v-if="spotLightItem.link"
                                                                :to="spotLightItem.link">
                                                                <UnorderedList
                                                                    class="tw-cursor-pointer hover:tw-underline"
                                                                    :size="'md'"
                                                                    :label="'Read more'"/>
                                                            </NuxtLink>
                                                        </div>
                                                    </div>
                                                </div>
                                            </template>
                                        </HexagonFrame>
                                    </div>
                                </CarouselModuleSlide>
                                <template #addons>
                                    <CarouselModuleNavigation />
                                </template>
                            </CarouselModuleCarousel>
                        </article>
                        <div class="tw-p-4 tw-space-x-2 tw-text-right">
                            <Button :variant="'outline'" :size="'xl'" :label="'GET BUNDLE'" />
                        </div>
                        <div class="tw-px-4 tw-text-right">
                            <div class="tw-flex tw-justify-end">
                                <HeroPlate :size="'lg'" :bookmark="'NEW ARRIVAL'" :theme="'gold'" :label="'COLORFIRE Meow Series'"/>
                            </div>

                            <div class="tw-text-xl" :style="{'direction': 'rtl', 'color': '#ffffff', 'text-shadow': '1px 1px 2px #000000'}">
                                <UnorderedList
                                    class="tw-space-x-2"
                                    :size="'lg'"
                                    :icon="'bi:gpu-card'"
                                    :label="'COLORFIRE GeForce RTX 4060 MEOW-ORG 8GB-V'"/>
                                <UnorderedList
                                    class="tw-space-x-2"
                                    :size="'lg'"
                                    :icon="'bi:motherboard'"
                                    :label="'COLORFIRE B760M-MEOW WIFI D5 ORANGE'"/>
                                <UnorderedList
                                    class="tw-space-x-2"
                                    :size="'lg'"
                                    :icon="'lucide:pc-case'"
                                    :label="'Segotep Memphis-S Meow PC Case (M-ATX / ITX supported)'"/>
                                <div class="tw-font-mono tw-font-semibold tw-text-4xl">₱28,500.00</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Spotlight: Image -->
            <div v-if="true" class="tw-snap-start tw-snap-always tw-relative tw-w-full tw-h-screen">
                <div class="tw-w-full tw-h-full tw-absolute tw-z-30 spotlight-image" :style="{'background-image': `url(/images/carousel/c12d1eba-e8c2-4827-a0d2-5298c4b0f421.webp)`}"></div>

                <div class="navigation-height tw-w-full tw-relative"></div>
                <div v-if="false" class="tw-absolute tw-w-full tw-h-full spotlight-content-height tw-z-30 tw-flex tw-justify-center">
                    <div class="tw-pb-10 tw-max-w-screen-2xl tw-w-full tw-flex tw-flex-col-reverse">

                        <article class="tw-w-full tw-h-max">
                            <CarouselModuleCarousel
                                dir="rtl"
                                v-model="spotlight_1_index"
                                v-bind="carouselSettings"
                                :breakpoints="carouselBreakpoints"
                                class="tw-w-full lg:tw-w-full">
                                <CarouselModuleSlide class="tw-w-[270px]" v-for="spotLightItem in spotlight_1" :key="spotLightItem">
                                    <div class="tw-w-full tw-h-[350px] tw-mx-2">
                                        <HexagonFrame
                                            :frame-border="'#dedede'"
                                            :content-border="'#b7b7b7'"
                                            :direction="'ttb'"
                                            :head-percentage="70"
                                            :top-right="45"
                                            :bottom-left="45"
                                            :header-fade="true"
                                            :header-fade-color="'rgba(5,5,5,0.1)'">
                                            <template #header>
                                                <div class="tw-h-[70%] tw-w-full tw-p-[6px] tw-box-border">
                                                    <div
                                                        class="tw-h-full tw-w-full tw-bg-cover tw-bg-center tw-bg-no-repeat"
                                                        :style="{'background':'url('+spotLightItem.image+')'}"
                                                    />
                                                </div>
                                                <div class="tw-h-[30%] tw-w-full tw-box-border">
                                                    <div
                                                        class="tw-h-full tw-w-full tw-bg-cover tw-bg-center tw-bg-no-repeat tw-grayscale tw-opacity-20"
                                                        :style="{'background':'url('+spotLightItem.image+')'}"
                                                    />
                                                </div>
                                            </template>
                                            <template #body>
                                                <div class="tw-h-[30%] tw-w-full tw-pt-2 tw-pl-8 tw-overflow-hidden tw-flex tw-flex-col">

                                                    <div class="tw-overflow-auto tw-space-y-2">

                                                        <div class="tw-font-semibold tw-h-max tw-flex-none" style="text-align: left;">
                                                            <div class="tw-text-lg tw-font-semibold" v-text="spotLightItem.subTitle"></div>

                                                            <NuxtLink
                                                                v-if="spotLightItem.link"
                                                                :to="spotLightItem.link">
                                                                <UnorderedList
                                                                    class="tw-cursor-pointer hover:tw-underline"
                                                                    :size="'md'"
                                                                    :label="'Read more'"/>
                                                            </NuxtLink>
                                                        </div>
                                                    </div>
                                                </div>
                                            </template>
                                        </HexagonFrame>
                                    </div>
                                </CarouselModuleSlide>
                                <template #addons>
                                    <CarouselModuleNavigation />
                                </template>
                            </CarouselModuleCarousel>
                        </article>
                        <div class="tw-p-4 tw-space-x-2 tw-text-right">
                            <Button :variant="'outline'" :size="'xl'" :label="'GET BUNDLE'" />
                        </div>
                        <div class="tw-px-4 tw-text-right">
                            <div class="tw-flex tw-justify-end tw-font-[Barlow_Semi_Condensed]">
                                <HeroPlate :size="'lg'" :bookmark="'NEW ARRIVAL'" :theme="'tulip'" :label="'COLORFIRE Meow Series'"/>
                            </div>

                            <div class="tw-text-xl" :style="{'direction': 'rtl', 'color': '#ffffff', 'text-shadow': '1px 1px 2px #000000'}">
                                <UnorderedList
                                    class="tw-space-x-2"
                                    :size="'lg'"
                                    :icon="'bi:gpu-card'"
                                    :label="'COLORFIRE GeForce RTX 4060 MEOW-ORG 8GB-V'"/>
                                <UnorderedList
                                    class="tw-space-x-2"
                                    :size="'lg'"
                                    :icon="'bi:motherboard'"
                                    :label="'COLORFIRE B760M-MEOW WIFI D5 ORANGE'"/>
                                <UnorderedList
                                    class="tw-space-x-2"
                                    :size="'lg'"
                                    :icon="'lucide:pc-case'"
                                    :label="'Segotep Memphis-S Meow PC Case (M-ATX / ITX supported)'"/>

                                <div class="tw-font-mono tw-font-semibold tw-text-4xl">₱28,500.00</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Spotlight: Image -->
            <div v-if="true" class="tw-snap-start tw-snap-always tw-relative tw-w-full tw-h-screen">
                <div class="tw-w-full tw-h-full tw-absolute tw-z-30 spotlight-image" :style="{'background-image': `url(/images/carousel/d519b14b-0289-43af-ae15-9d7446d4f914.webp)`}"></div>
            </div>

            <div v-if="true">
                <div class="navigation-height tw-w-full tw-snap-start tw-snap-always"></div>
                <div class="tw-pl-2 tw-mx-auto tw-max-w-screen-2xl tw-flex tw-flex-col">
                    <article class="tw-mt-4 tw-relative">
                        <CarouselModuleCarousel
                            v-model="carouselFeaturedItem"
                            v-bind="carouselSettings"
                            :breakpoints="carouselBreakpoints"
                            :mouse-drag="true"
                            class="tw-w-full lg:tw-w-full">
                            <CarouselModuleSlide class="tw-w-[170px]">

                                <HexagonFrame :top-right="45" :bottom-left="45">
                                    <template #body>
                                        <div class="tw-h-full tw-flex tw-items-center tw-text-center tw-font-['Google_Sans_Text'] tw-text-xl tw-font-semibold tw-px-8">
                                            Featured Products
                                        </div>
                                    </template>
                                </HexagonFrame>
                            </CarouselModuleSlide>
                            <CarouselModuleSlide class="tw-w-[270px]" v-for="featuredItem in carouselFeaturedItems" :key="featuredItem">
                                <div class="tw-w-full tw-h-[350px] tw-mx-2">
                                    <HexagonFrame
                                        :frame-border="'#dedede'"
                                        :content-border="'#b7b7b7'"
                                        :direction="'ttb'"
                                        :head-percentage="70"
                                        :top-right="45"
                                        :bottom-left="45"
                                        :header-fade="true"
                                        :header-fade-color="'rgba(5,5,5,0.1)'">
                                        <template #header>
                                            <div class="tw-h-[70%] tw-w-full tw-p-[6px] tw-box-border">
                                                <div
                                                    class="tw-h-full tw-w-full tw-bg-cover tw-bg-center tw-bg-no-repeat"
                                                    :style="{'background':'url('+featuredItem.image+')'}"
                                                />
                                            </div>
                                            <div class="tw-h-[30%] tw-w-full tw-box-border">
                                                <div
                                                    class="tw-h-full tw-w-full tw-bg-cover tw-bg-center tw-bg-no-repeat tw-grayscale tw-opacity-20"
                                                    :style="{'background':'url('+featuredItem.image+')'}"
                                                />
                                            </div>
                                        </template>
                                        <template #body>
                                            <div class="tw-h-[30%] tw-w-full tw-pt-2 tw-pl-8 tw-overflow-hidden tw-flex tw-flex-col">

                                                <div class="tw-overflow-auto tw-space-y-2">

                                                    <div class="tw-font-semibold tw-h-max tw-flex-none" style="text-align: left;">
                                                        <div class="tw-text-lg tw-font-semibold" v-text="featuredItem.subTitle"></div>

                                                        <NuxtLink
                                                            v-if="featuredItem.link"
                                                            :to="featuredItem.link">
                                                            <UnorderedList
                                                                class="tw-cursor-pointer hover:tw-underline"
                                                                :size="'md'"
                                                                :label="'Read more'"/>
                                                        </NuxtLink>
                                                    </div>
                                                </div>
                                            </div>
                                        </template>
                                    </HexagonFrame>
                                </div>
                            </CarouselModuleSlide>
                            <template #addons>
                                <CarouselModuleNavigation />
                            </template>
                        </CarouselModuleCarousel>
                    </article>
                </div>
            </div>

            <div v-if="true">
                <div class="navigation-height tw-w-full tw-snap-start tw-snap-always"></div>
                <div class="tw-pl-2 tw-mx-auto tw-max-w-screen-2xl tw-flex tw-flex-col">
                    <article class="tw-mt-4 tw-relative">
                        <CarouselModuleCarousel
                            v-model="carouselTrendingItem"
                            v-bind="carouselSettings"
                            :breakpoints="carouselBreakpoints"
                            :mouse-drag="true"
                            class="tw-w-full lg:tw-w-full">
                            <CarouselModuleSlide class="tw-w-[170px]">

                                <HexagonFrame :top-right="45" :bottom-left="45">
                                    <template #body>
                                        <div class="tw-h-full tw-flex tw-items-center tw-text-center tw-font-['Google_Sans_Text'] tw-text-xl tw-font-semibold tw-px-8">
                                            Trending
                                        </div>
                                    </template>
                                </HexagonFrame>
                            </CarouselModuleSlide>
                            <CarouselModuleSlide class="tw-w-[270px]" v-for="featuredItem in carouselTrendingItems" :key="featuredItem">
                                <div class="tw-w-full tw-h-[350px] tw-mx-2">
                                    <HexagonFrame
                                        :frame-border="'#dedede'"
                                        :content-border="'#b7b7b7'"
                                        :direction="'ttb'"
                                        :head-percentage="70"
                                        :top-right="45"
                                        :bottom-left="45"
                                        :header-fade="true"
                                        :header-fade-color="'rgba(5,5,5,0.1)'">
                                        <template #header>
                                            <div class="tw-h-[70%] tw-w-full tw-p-[6px] tw-box-border">
                                                <div
                                                    class="tw-h-full tw-w-full tw-bg-cover tw-bg-center tw-bg-no-repeat"
                                                    :style="{'background':'url('+featuredItem.image+')'}"
                                                />
                                            </div>
                                            <div class="tw-h-[30%] tw-w-full tw-box-border">
                                                <div
                                                    class="tw-h-full tw-w-full tw-bg-cover tw-bg-center tw-bg-no-repeat tw-grayscale tw-opacity-20"
                                                    :style="{'background':'url('+featuredItem.image+')'}"
                                                />
                                            </div>
                                        </template>
                                        <template #body>
                                            <div class="tw-h-[30%] tw-w-full tw-pt-2 tw-pl-8 tw-overflow-hidden tw-flex tw-flex-col">

                                                <div class="tw-overflow-auto tw-space-y-2">

                                                    <div class="tw-font-semibold tw-h-max tw-flex-none" style="text-align: left;">
                                                        <div class="tw-text-lg tw-font-semibold" v-text="featuredItem.subTitle"></div>

                                                        <NuxtLink
                                                            v-if="featuredItem.link"
                                                            :to="featuredItem.link">
                                                            <UnorderedList
                                                                class="tw-cursor-pointer hover:tw-underline"
                                                                :size="'md'"
                                                                :label="'Read more'"/>
                                                        </NuxtLink>
                                                    </div>
                                                </div>
                                            </div>
                                        </template>
                                    </HexagonFrame>
                                </div>
                            </CarouselModuleSlide>
                            <template #addons>
                                <CarouselModuleNavigation />
                            </template>
                        </CarouselModuleCarousel>
                    </article>
                </div>
            </div>

            <div v-if="true">
                <div class="navigation-height tw-w-full tw-snap-start tw-snap-always"></div>
                <div class="tw-pl-2 tw-mx-auto tw-max-w-screen-2xl tw-flex tw-flex-col">
                    <article class="tw-mt-4 w-relative">
                        <CarouselModuleCarousel
                            v-model="carouselNewArrival"
                            v-bind="carouselSettings"
                            :breakpoints="carouselBreakpoints"
                            class="tw-w-full lg:tw-w-full">
                            <CarouselModuleSlide class="tw-w-[170px]">
                                <HexagonFrame :top-right="75" :bottom-left="75">
                                    <template #body>
                                        <div class="tw-h-full tw-flex tw-items-center tw-text-center tw-font-['Google_Sans_Text'] tw-text-xl tw-font-semibold tw-px-8">
                                            New Arrivals
                                        </div>
                                    </template>
                                </HexagonFrame>
                            </CarouselModuleSlide>

                            <CarouselModuleSlide v-for="newArrival in carouselNewArrivals" :key="newArrival">
                                <div class="tw-mx-2 tw-w-[440px] tw-h-[500px]">
                                    <InformationCard
                                        :image="newArrival.image"
                                        :title="newArrival.title"
                                        :sub-title="newArrival.subTitle"
                                    />
                                </div>

                            </CarouselModuleSlide>
                            <CarouselModuleSlide :class="[`tw-w-[340px]`]">
                            </CarouselModuleSlide>

                            <template #addons>
                                <CarouselModuleNavigation />
                            </template>
                        </CarouselModuleCarousel>
                    </article>
                </div>
            </div>

            <div v-if="false">
                <div id="latest-news" class="navigation-height tw-w-full tw-snap-start tw-snap-always"></div>
                <div class="tw-pl-2 tw-mx-auto tw-max-w-screen-2xl tw-flex tw-flex-col" >
                    <ClientOnly>
                        <article class="tw-mt-4">
                            <div v-if="screenWidth < screens['md']" class="tw-text-center tw-text-3xl tw-font-bold tw-font-['Google_Sans_Text']">Latest News</div>
                            <div :class="[screenWidth >= screens['md'] ? 'tw-flex-nowrap tw-snap-x tw-snap-mandatory tw-overflow-x-scroll' : 'tw-flex-col']" class="tw-relative tw-flex tw-items-center tw-space-x-2 lg:tw-space-x-8 tw-w-full ">

                                <div v-if="screenWidth >= screens['md']" class="tw-snap-center tw-snap-always tw-inline-block tw-h-[375px] tw-w-[170px] tw-flex-none tw-flex tw-justify-center">
                                    <div class="tw-w-[170px] tw-h-[247px]">
                                        <HexagonFrame  :top-right="75" :bottom-left="75">
                                            <template #body>
                                                <div class="tw-w-full tw-h-full tw-font-['Google_Sans_Text'] tw-text-xl tw-font-semibold tw-flex tw-justify-center tw-items-center">
                                                    Latest News
                                                </div>
                                            </template>
                                        </HexagonFrame>
                                    </div>
                                </div>

                                <div v-for="blog in news" :class="screenWidth >= screens['md'] ? 'tw-snap-center tw-snap-always tw-inline-block sm:tw-w-1/2 lg:tw-w-1/3 xl:tw-w-1/4 tw-flex-none tw-flex tw-justify-center' : ''" class="tw-cursor-pointer">
                                    <div v-if="screenWidth < screens['md']" class="tw-mb-4 navigation-height tw-w-full tw-snap-start tw-snap-always"></div>
                                    <div class="tw-w-[370px] tint-background thread-border">
                                        <img :src="blog.image.path" class="tw-h-[247px] tw-w-full">
                                        <div class="tw-px-2 tw-pt-2 tw-text-xl tw-h-[3.5rem] tw-line-clamp-2 tw-font-bold tw-tracking-normal tw-leading-tight hover:tw-underline">{{blog.title}}</div>
                                        <div class="tw-px-2 tw-pt-4 tw-text-base tw-h-[4rem] tw-line-clamp-2">{{blog.subTitle}}</div>
                                    </div>
                                </div>
                            </div>
                        </article>
                    </ClientOnly>
                </div>
            </div>

            <div v-if="false">
                <div id="faq" class="navigation-height tw-w-full tw-snap-start tw-snap-always"></div>
                <div class="tw-px-2 tw-mx-auto tw-max-w-screen-2xl tw-flex tw-flex-col" >
                    <article class="tw-mt-4 tw-w-full tw-px-4 tw-flex tw-flex-wrap lg:tw-flex-nowrap tw-justify-center">
                        <div class="tw-text-center lg:tw-text-start lg:tw-w-1/4 tw-font-['Google_Sans_Text']">
                            <div class="tw-text-3xl tw-font-bold">Frequently Answered Questions</div>
                            <div class="tw-text-xl tw-font-semibold">Have a question? Check out our frequently asked questions to find your answer.</div>
                            <div class="tw-h-60 tw-w-full tw-bg-contain tw-bg-center lg:tw-bg-left tw-bg-no-repeat" :style="{'background-image': 'url(/deco/undraw/undraw_my_answer_re_k4dv.svg)'}"></div>
                        </div>
                        <Accordion
                            v-model:payload="faqs"
                            :title-icon="false"
                            :multi-line-title="true"
                            :active-border-color="'transparent'"
                            :center-content="faqCenterContent"
                            :size="'lg'"
                            single-expand
                            class="tw-mt-4 lg:tw-w-1/2 lg:tw-mt-0 tw-space-y-4"/>
                    </article>
                </div>
            </div>
        </SnapLandingWrapper>
    </div>
</template>

<script setup lang="ts">
useLayout().setNavigationMode('clear', 'index.vue');
const clientReadyState = useClientReadyState();

import {storeToRefs} from "pinia";
const {$themeStore} = useNuxtApp();
const {screens, width: screenWidth, } = useScreen();
const {
    hexAlpha,
    lining: liningColor,
} = storeToRefs($themeStore);

const spotlightVideo_1 = ref<HTMLElement | null>(null);

onMounted(async () => {
    await nextTick(() => {
        if(clientReadyState.value){
            console.log({'onMounted spotlightVideo_1': spotlightVideo_1.value});
            reIndexSpotlightCarousel();
            autoPlayVideoSpotlights();
        }
    });
});

watch(clientReadyState, async (clientReady) => {
    console.log({'index.vue Watch clientReadyState':clientReady});
    if(clientReady){
        await nextTick(() => {
            reIndexSpotlightCarousel();
            autoPlayVideoSpotlights();
        });
    }
})

const spotlight_1_index = ref(0);
watch(screenWidth, value => {
    reIndexSpotlightCarousel();
});
function autoPlayVideoSpotlights(){
    [spotlightVideo_1].forEach(video => {
        if(video.value != null){
            let playPromise = video.value.play();

            if(playPromise != undefined){
                playPromise.then(()=>{
                    let observer = new IntersectionObserver(
                        (entries) => {
                            entries.forEach((entry) => {
                                if (entry.intersectionRatio !== 1 && !video.value.paused) {
                                    video.value.pause();
                                } else if (video.value.paused) {
                                    video.value.play();
                                }
                            });
                        },
                        {threshold: 1}
                    );

                    observer.observe(video.value);
                }).catch((error: any) => {

                });
            }
        }
    })
}
function reIndexSpotlightCarousel(){
    if (screenWidth.value >= screens['2xl']) {//>=1536
        spotlight_1_index.value = 0;
    } else if (screenWidth.value >= screens['xl'] && screenWidth.value < screens['2xl']) {//>=1280 < 1536
        spotlight_1_index.value = 0;
    } else if (screenWidth.value >= screens['lg'] && screenWidth.value < screens['xl']) {//>=1024 < 1280
        spotlight_1_index.value = 0.5;
    } else if (screenWidth.value >= screens['md'] && screenWidth.value < screens['lg']) {//>=768 < 1024
        spotlight_1_index.value = 1.5;
    } else if (screenWidth.value >= screens['sm'] && screenWidth.value < screens['md']) {//>=640 < 768
        spotlight_1_index.value = 2;
    } else if (screenWidth.value < screens['sm']) {//<640
        spotlight_1_index.value = 2;
    }
};

const spotlight_1 = ref([
    {
        'image': '/images/product/202306201506003693.webp',
        'title': 'PC Case',
        'subTitle': 'Segotep Memphis-S Meow',
        'link': '/prototype'
    },
    {
        'image': '/images/product/c76383ac-e6c0-4725-bec0-b171449c5960.webp',
        'title': 'Motherboard',
        'subTitle': 'COLORFIRE B760M-MEOW WIFI D5 ORANGE',
        'link': '/prototype'
    },
    {
        'image': '/images/product/7d5178c3-e5dc-4b8f-b8d1-cbe0bbc14e84.webp',
        'title': 'Graphics Card',
        'subTitle': 'COLORFIRE GeForce RTX 4060 MEOW-ORG 8GB-V',
        'link': '/prototype'
    },
]);
const featured = ref([
    {
        'image': '/images/product/f85a85cd-fa65-48d3-9d36-755b4a6acf87.webp',
        'title': 'Graphics Card',
        'subTitle': 'COLORFIRE GeForce RTX 4060 Ti MEOW-ORG 8GB-V',
        'link': '/prototype'
    },
    {
        'image': '/images/product/176a61f6-884b-4def-9c35-5d30cdca686f.webp',
        'title': 'Graphics Card',
        'subTitle': 'iGame GeForce RTX 4080 16GB Ultra W OC-V',
        'link': '/prototype'
    },
    {
        'image': '/images/product/cd8f248a-bd3d-4553-bcf7-849ed27c4b36.webp',
        'title': 'Graphics Card',
        'subTitle': 'iGame GeForce RTX 4070 Ti Ultra W OC-V',
        'link': '/prototype'
    },
    {
        'image': '/images/product/20220923155420669106.webp',
        'title': 'Graphics Card',
        'subTitle': 'iGame GeForce RTX 4090 Vulcan OC-V',
        'link': '/prototype'
    }
]);

const carouselSettings = ref({
    itemsToShow: 2,
    snapAlign: 'start',
});
const carouselBreakpoints = ref({
    [screens['sm']]: {
        itemsToShow: 2,
        snapAlign: 'start',
    },

    [screens['md']]: {
        itemsToShow: 2.5,
        snapAlign: 'start',
    },

    [screens['lg']]: {
        itemsToShow: 4.5,
        snapAlign: 'start',
    },
});

const carouselFeaturedItem = ref(0);
const carouselNewArrival = ref(0);
const carouselTrendingItem = ref(0);

const carouselNewArrivals = ref([
    {
        'image': '/images/hero/21f0a52e-db0a-4108-9405-44a8a548e534.webp',
        'title': 'MEOW SET',
        'subTitle': 'RTX 4060 Ti MEOW-ORG OC 16GB / B760M-MEOW WIFI D5 ORANGE.',
        'link': '/'
    },
    {
        'image': '/images/hero/ea05cc1d-1384-47f4-84ab-b3c049f7e13e.webp',
        'title': 'AIO PC',
        'subTitle': 'iGame G-ONE Plus i7-12700H/RTX3060.',
        'link': '/'
    },
    {
        'image': '/images/hero/353f5cb4-8113-43fa-b5c4-3a9bf1314474.webp',
        'title': 'Laptop',
        'subTitle': 'Colorful EVOL P15 ',
        'link': '/'
    },
    {
        'image': '/images/hero/667a2407-ae78-4e4d-b69e-059552bca96e.webp',
        'title': 'Graphics Card',
        'subTitle': 'iGame GeForce RTX 4090 Vulcan OC-V',
        'link': '/'
    },
    {
        'image': '/images/hero/a5a3aa00-67ea-4c3e-b6b4-6b9b92a0a50a.webp',
        'title': 'Motherboard',
        'subTitle': 'CVN B760I FROZEN WIFI D5 V20',
        'link': '/'
    },
    {
        'image': '/images/hero/607742af-81ec-4893-b94c-1b49c228fbde.webp',
        'title': 'SSD',
        'subTitle': 'CN700 1TB',
        'link': '/'
    }
]);
const carouselFeaturedItems = ref([]);
const carouselTrendingItems = ref([

    {
        'image': '/images/product/c7dfc1f1-102a-4ea9-84f6-f87dda2094b8.webp',
        'title': 'Motherboard',
        'subTitle': 'CVN Z790D5 GAMING PRO WIFI V20',
        'link': '/prototype'
    },
    {
        'image': '/images/product/38131462-2ae0-443e-8555-9e744c532887.webp',
        'title': 'Motherboard',
        'subTitle': 'BATTLE-AX Z790AK-PLUS D5 V20',
        'link': '/prototype'
    },
    {
        'image': '/images/product/ebac5037-c3d2-4275-b96b-24f855695841.webp',
        'title': 'Motherboard',
        'subTitle': 'iGame Z790D5 ULTRA V20',
        'link': '/prototype'
    },
    {
        'image': '/images/product/f9b5a1a7-d532-4cf8-970c-d812b857a666.webp',
        'title': 'Motherboard',
        'subTitle': 'iGame Z790D5 FLOW V20',
        'link': '/prototype'
    }
]);
carouselFeaturedItems.value = carouselFeaturedItems.value;//concat(spotlight_1.value);
carouselFeaturedItems.value = carouselFeaturedItems.value.concat(featured.value);

const news = ref([
    {
        'image':{
            'path': '/images/spotlight/CODM-S4-FOOLS-GOLD-009.jpg'
        },
        'title': 'COLORFUL Launches The GeForce RTX 4060 Ti and RTX 4060 Series Graphics Cards Supercharged by DLSS 3',
        'subTitle': 'COLORFUL introduces the CVN B760M FROZEN WIFI D5 and CVN B760I FROZEN WIFI motherboards for gamers and enthusiasts. Coming in a compact micro-ATX and mini-ITX form factors, both motherboards feature PCIe 5.0 x16 slot to support the latest high-end graphics cards. The CVN B760 motherboards also come with Wi-Fi 6, three PCIe 4.0 M.2 slots for the CVN B760M FROZEN WIFI D5 and two PCIe 4.0 M.2 slots for the CVN B760I FROZEN WIFI mini-ITX motherboard. COLORFUL also presents the BATTLE-AX B760M-F PRO motherboard with DDR4 memory support and two PCIe 4.0 M.2 slots.',
    },
    {
        'image':{
            'path': '/images/spotlight/CODM-S4-FOOLS-GOLD-002.jpg'
        },
        'title': 'Seize the Season With RTX',
        'subTitle': 'Celebrate the holiday season with the ultimate upgrade.Treat yourself to unrivaled performance and features with GeForce RTX™ 40 Series graphics cards and laptops built to transform every experience.',
    },
    {
        'image':{
            'path': '/images/spotlight/CODM-S4-FOOLS-GOLD-TOUT.jpg'
        },
        'title': 'COLORFUL Launches B760 Series Motherboards',
        'subTitle': 'COLORFUL introduces the CVN B760M FROZEN WIFI D5 and CVN B760I FROZEN WIFI motherboards for gamers and enthusiasts. Coming in a compact micro-ATX and mini-ITX form factors, both motherboards feature PCIe 5.0 x16 slot to support the latest high-end graphics cards. The CVN B760 motherboards also come with Wi-Fi 6, three PCIe 4.0 M.2 slots for the CVN B760M FROZEN WIFI D5 and two PCIe 4.0 M.2 slots for the CVN B760I FROZEN WIFI mini-ITX motherboard. COLORFUL also presents the BATTLE-AX B760M-F PRO motherboard with DDR4 memory support and two PCIe 4.0 M.2 slots.',
    },
    {
        'image':{
            'path': '/images/spotlight/CODM-S4-FOOLS-GOLD-003.jpg'
        },
        'title': 'Further With AI, Faster on RTX',
        'subTitle': 'From enhanced creativity + ultra-efficient productivity to blisteringly fast gaming. The ultimate in AI power on Windows PCs is on NVIDIA RTX and GeForce RTX.',
    },
    {
        'image':{
            'path': '/images/spotlight/CODM-S4-FOOLS-GOLD-001.jpg'
        },
        'title': 'PC Game Pass Game Bundle',
        'subTitle': 'Get PC Game Pass for 3 months with select GeForce RTX 40 Series*',
    },
    {
        'image':{
            'path': '/images/spotlight/CODM-S4-FOOLS-GOLD-008.jpg'
        },
        'title': 'COLORFUL Launches EVOL X15 AT Gaming Laptop Powered by Intel 13th Gen CPUs and NVIDIA GeForce RTX 4060 GPU and NVIDIA GeForce RTX 4060 GPU and NVIDIA GeForce RTX 4060 GPU',
        'subTitle': 'The EVOL X15 AT sports a 15.6” QHD (2560x1440) 165Hz display with NVIDIA G-SYNC support for stutter-free and tear-free gaming experience. Aside from Pine Blue and Mist Grey, the new EVOL X15 AT gaming laptop comes in the new Purple Grape color.',
    },
]);
const carouselPayload = ref([
    {
        'key': 1,
        'image': {
            'path': '/images/carousel/f415740d-5951-4b5d-af98-1404e9c65df5.jpg'
        }
    },
    {
        'key': 2,
        'image': {
            'path': '/images/carousel/60a0ac44-4533-421b-aa6c-cfba7036fb97.webp'
        }
    },
    {
        'key': 3,
        'image': {
            'path': '/images/carousel/81dbd81d-596d-4500-87d1-1e4fe1b9462c.webp'
        }
    },
    {
        'key': 4,
        'image': {
            'path': '/images/carousel/202ae924-b777-45a2-94c6-f78134b17020.webp'
        }
    },
    {
        'key': 5,
        'image': {
            'path': '/images/carousel/2271fbba-86bf-4dc7-93cb-59eb0aab62d8.webp'
        }
    }
]);
const faqs = ref({
    recentActive: 0,
    options: [
        {
            title: 'Coldiron Armor Set',
            body: {
                type: 'text',
                value: 'This armor was forged for the sole purpose of resisting the malignance spreading across the land.'
            },
            active: true
        },
        {
            title: 'Coldiron Barding Mount Armor',
            body: {
                type: 'text',
                value: 'Adorn your new steeds with mount armor inspired by the malignance taking over Sanctuary.'
            },
            active: false
        },
        {
            title: 'Weapon skins, Mount Trophies, Emotes, Platinum, and more - Weapon skins, Mount Trophies, Emotes, Platinum, and more',
            body: {
                type: 'text',
                value: 'Explore a range of cosmetics to earn along the Premium Battle Pass. Collect a weapon transmog for all 19 weapon types. 2 emotes for each class let you threaten your enemies or find a little time to play around with malignant heart cages. 2 headstones even let you die in style. Adorn your horse with 5 new mount trophies.'
            },
            active: false
        },
        {
            title: '“On the Warpath” Emote – Accelerated Battle Pass',
            body: {
                type: 'text',
                value: 'Show everyone you’re ready for battle when you slam your banner down, signaling to enemies that you’re ready for a fight. This emote is only included in the Accelerated Battle Pass.'
            },
            active: false
        }
    ]
});
const faqCenterContent = computed(() => {
    return screenWidth.value < screens['lg'];
})
</script>
<style scoped lang="scss">
.figure img{
    object-fit: cover;
}
.spotlight-image{
    background-position: center center;
    background-size: cover;
    background-repeat: no-repeat;
}
.carousel-image{
    background-position: center center;
    background-size: cover;
    background-repeat: no-repeat;
}
</style>