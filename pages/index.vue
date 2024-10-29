<template>
    <div>
        <SnapLandingWrapper>
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
                <div class="tw-pl-2 tw-mx-auto tw-max-w-screen-2xl tw-flex tw-flex-col">
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
import dataPayload from '@/public/data/payload.js';
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

const carouselNewArrivals = ref(dataPayload['carousel']['newArrivals']);
const carouselFeaturedItems = ref(dataPayload['carousel']['featuredItems']);
const carouselTrendingItems = ref(dataPayload['carousel']['trendingItems']);

const news = ref([]);
const faqs = ref({
    recentActive: 0,
    options: []
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