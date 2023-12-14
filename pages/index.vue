<template>
    <div ref="scrollable">
        <NuxtLayout :name="$coreStore.layout">
            <template #content>
                <CarouselModuleCarousel wrap-around>
                    <CarouselModuleSlide v-for="slide in carouselPayload" :key="slide">
                        <div class="tw-w-screen tw-h-screen carousel-image" :style="{'background-image': `url(${slide.image.path})`}"></div>
                    </CarouselModuleSlide>

                    <template #addons>
                        <CarouselModuleNavigation />
                        <CarouselModulePagination />
                    </template>
                </CarouselModuleCarousel>
                <div class="tw-mx-auto tw-max-w-screen-2xl tw-space-y-8 tw-flex tw-flex-col">
                    <article class="tw-mt-8">
                        <div class="tw-text-center tw-text-3xl tw-font-semibold">New Arrivals</div>
                        <AccentFrame class="tw-mt-4">
                            <template #content>
                                <div class="tw-mt-4 tw-gap-2 tw-flex tw-flex-wrap tw-justify-center">
                                    <Card
                                        class="tw-inline-block tw-flex-none"
                                        focused
                                        v-for="newArrival in newArrivals"
                                        :key="newArrival"
                                        :image="newArrival.image"
                                        :title="newArrival.title"
                                        :sub-title="newArrival.subTitle"
                                    />
                                </div>
                            </template>
                        </AccentFrame>
                    </article>

                    <article>
                        <div class="tw-text-center tw-text-3xl tw-font-semibold">Latest News</div>
                        <div class="tw-grid tw-grid-cols-1 sm:tw-grid-cols-2 md:tw-grid-cols-3 lg:tw-grid-cols-3 xl:tw-grid-cols-4 2xl:tw-grid-cols-5 tw-gap-2">
                            <div v-for="blog in news" class="neutral-border">
                                <figure class="figure">
                                    <img :src="blog.image.path" />
                                </figure>
                                <div class="tw-px-4 tw-pt-2 tw-text-lg tw-font-semibold tw-tracking-normal tw-leading-tigh">{{blog.title}}</div>
                                <div class="tw-px-4 tw-pt-2 tw-text-base tw-line-clamp-4 tw-leading-tight">{{blog.subTitle}}</div>
                            </div>
                        </div>
                    </article>
                </div>
            </template>
        </NuxtLayout>
    </div>
</template>

<script setup lang="ts">
import {ref,reactive} from "vue";
const {$coreStore} = useNuxtApp();

$coreStore.setNavigationMode('clear');

definePageMeta({
    layout: false
});

let newArrivals = reactive([
    {
        'image':{
            'path': '/images/hero/667a2407-ae78-4e4d-b69e-059552bca96e.webp'
        },
        'title': 'Graphics Card',
        'subTitle': 'iGame GeForce RTX 4090 Vulcan OC-V',
    },
    {
        'image':{
            'path': '/images/hero/a5a3aa00-67ea-4c3e-b6b4-6b9b92a0a50a.webp'
        },
        'title': 'Motherboard',
        'subTitle': 'CVN B760I FROZEN WIFI D5 V20',
    },
    {
        'image':{
            'path': '/images/hero/607742af-81ec-4893-b94c-1b49c228fbde.webp'
        },
        'title': 'SSD',
        'subTitle': 'CN700 1TB',
    },
    {
        'image':{
            'path': 'images/hero/21f0a52e-db0a-4108-9405-44a8a548e534.webp'
        },
        'title': 'MEOW SET',
        'subTitle': 'RTX 4060 Ti MEOW-ORG OC 16GB / B760M-MEOW WIFI D5 ORANGE.',
    },
    {
        'image':{
            'path': 'images/hero/ea05cc1d-1384-47f4-84ab-b3c049f7e13e.webp'
        },
        'title': 'AIO PC',
        'subTitle': 'iGame G-ONE Plus i7-12700H/RTX3060.',
    },
    {
        'image':{
            'path': 'images/hero/353f5cb4-8113-43fa-b5c4-3a9bf1314474.webp'
        },
        'title': 'Laptop',
        'subTitle': 'Colorful EVOL P15 ',
    },
]);
let news = reactive([
    {
        'image':{
            'path': '/images/c46535a6-f120-46e3-8bea-4ace73c8eb82.webp'
        },
        'title': 'COLORFUL Launches The GeForce RTX 4060 Ti and RTX 4060 Series Graphics Cards Supercharged by DLSS 3',
        'subTitle': 'COLORFUL introduces the CVN B760M FROZEN WIFI D5 and CVN B760I FROZEN WIFI motherboards for gamers and enthusiasts. Coming in a compact micro-ATX and mini-ITX form factors, both motherboards feature PCIe 5.0 x16 slot to support the latest high-end graphics cards. The CVN B760 motherboards also come with Wi-Fi 6, three PCIe 4.0 M.2 slots for the CVN B760M FROZEN WIFI D5 and two PCIe 4.0 M.2 slots for the CVN B760I FROZEN WIFI mini-ITX motherboard. COLORFUL also presents the BATTLE-AX B760M-F PRO motherboard with DDR4 memory support and two PCIe 4.0 M.2 slots.',
    },
    {
        'image':{
            'path': '/images/b38f4a68-129d-44c7-bd5b-35b7349d4166.webp'
        },
        'title': 'Seize the Season With RTX',
        'subTitle': 'Celebrate the holiday season with the ultimate upgrade.Treat yourself to unrivaled performance and features with GeForce RTX™ 40 Series graphics cards and laptops built to transform every experience.',
    },
    {
        'image':{
            'path': '/images/68fc854c-e748-49a8-8388-6efa64f59239.webp'
        },
        'title': 'COLORFUL Launches B760 Series Motherboards',
        'subTitle': 'COLORFUL introduces the CVN B760M FROZEN WIFI D5 and CVN B760I FROZEN WIFI motherboards for gamers and enthusiasts. Coming in a compact micro-ATX and mini-ITX form factors, both motherboards feature PCIe 5.0 x16 slot to support the latest high-end graphics cards. The CVN B760 motherboards also come with Wi-Fi 6, three PCIe 4.0 M.2 slots for the CVN B760M FROZEN WIFI D5 and two PCIe 4.0 M.2 slots for the CVN B760I FROZEN WIFI mini-ITX motherboard. COLORFUL also presents the BATTLE-AX B760M-F PRO motherboard with DDR4 memory support and two PCIe 4.0 M.2 slots.',
    },
    {
        'image':{
            'path': '/images/e9be486f-6a38-4d04-90e2-c5cf7c67f34f.webp'
        },
        'title': 'Further With AI, Faster on RTX',
        'subTitle': 'From enhanced creativity + ultra-efficient productivity to blisteringly fast gaming. The ultimate in AI power on Windows PCs is on NVIDIA RTX and GeForce RTX.',
    },
    {
        'image':{
            'path': 'images/a447b48a-2ed6-4c7b-ad81-a7159fd341a7.webp'
        },
        'title': 'PC Game Pass Game Bundle',
        'subTitle': 'Get PC Game Pass for 3 months with select GeForce RTX 40 Series*',
    },
    {
        'image':{
            'path': 'images/ff4e09cf-c5f9-42fa-9bff-e1490dc1e2fa.webp'
        },
        'title': 'COLORFUL Launches EVOL X15 AT Gaming Laptop Powered by Intel 13th Gen CPUs and NVIDIA GeForce RTX 4060 GPU',
        'subTitle': 'The EVOL X15 AT sports a 15.6” QHD (2560x1440) 165Hz display with NVIDIA G-SYNC support for stutter-free and tear-free gaming experience. Aside from Pine Blue and Mist Grey, the new EVOL X15 AT gaming laptop comes in the new Purple Grape color.',
    },
]);
let carouselPayload = reactive([
    {
        'image': {
            'path': '/images/carousel/f415740d-5951-4b5d-af98-1404e9c65df5.jpg'
        }
    },
    {
        'image': {
            'path': '/images/carousel/60a0ac44-4533-421b-aa6c-cfba7036fb97.webp'
        }
    },
    {
        'image': {
            'path': '/images/carousel/81dbd81d-596d-4500-87d1-1e4fe1b9462c.webp'
        }
    },
    {
        'image': {
            'path': '/images/carousel/202ae924-b777-45a2-94c6-f78134b17020.webp'
        }
    },
    {
        'image': {
            'path': '/images/carousel/2271fbba-86bf-4dc7-93cb-59eb0aab62d8.webp'
        }
    }
]);
</script>
<style scoped>
.figure img{
    object-fit: cover;
}
.carousel-image{
    background-position: center center;
    background-size: cover;
    background-repeat: no-repeat;
}
</style>