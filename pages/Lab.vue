<template>
    <div>
        <NuxtLayout :name="$coreStore.layout">
            <template #content>
                <div class="tw-m-20 tw-flex tw-justify-center tw-space-x-2 tw-mx-auto">
                    <div v-for="card in cards" :key="card">
                        <Card
                            :image="card.image"
                            :title="card.title"
                            :sub-title="card.subTitle"
                            :link="card.link"
                        />
                    </div>
                </div>
            </template>
        </NuxtLayout>
    </div>
</template>

<script setup lang="ts">
import {ref,reactive} from "vue";

definePageMeta({
    layout: false,
    middleware: 'guest'
});

let cards = reactive([
    {
        'image':{
            'path': '/images/hero/aa5b582b-908b-4db3-b5bc-1276f062d609.webp'
        },
        'title': 'COLORFUL Launches EVOL X15 AT Gaming Laptop Powered by Intel 13th Gen CPUs and NVIDIA GeForce RTX 4060 GPU',
        'subTitle': 'The EVOL X15 AT sports a 15.6” QHD (2560x1440) 165Hz display with NVIDIA G-SYNC support for stutter-free and tear-free gaming experience. Aside from Pine Blue and Mist Grey, the new EVOL X15 AT gaming laptop comes in the new Purple Grape color.',
        'link' : '/prototype'
    },
    {
        'image':{
            'path': '/images/hero/667a2407-ae78-4e4d-b69e-059552bca96e.webp'
        },
        'title': 'Upgrade to Beyond Fast',
        'subTitle': 'GeForce RTX 40 Series and DLSS 3.',
        'link' : '/prototype'
    },
    {
        'image':{
            'path': '/images/hero/2e38535a-c147-416f-995e-1d1b618d07ca.webp'
        },
        'title': 'COLORFUL Launches B760 Series Motherboards',
        'subTitle': 'COLORFUL introduces the CVN B760M FROZEN WIFI D5 and CVN B760I FROZEN WIFI motherboards for gamers and enthusiasts. Coming in a compact micro-ATX and mini-ITX form factors, both motherboards feature PCIe 5.0 x16 slot to support the latest high-end graphics cards. The CVN B760 motherboards also come with Wi-Fi 6, three PCIe 4.0 M.2 slots for the CVN B760M FROZEN WIFI D5 and two PCIe 4.0 M.2 slots for the CVN B760I FROZEN WIFI mini-ITX motherboard. COLORFUL also presents the BATTLE-AX B760M-F PRO motherboard with DDR4 memory support and two PCIe 4.0 M.2 slots.',
        'link' : '/prototype'
    },
    {
        'image':{
            'path': 'images/hero/21f0a52e-db0a-4108-9405-44a8a548e534.webp'
        },
        'title': 'MEOW SET',
        'subTitle': 'RTX 4060 Ti MEOW-ORG OC 16GB / B760M-MEOW WIFI D5 ORANGE.',
        'link' : '/prototype'
    },
    {
        'image':{
            'path': 'images/hero/ea05cc1d-1384-47f4-84ab-b3c049f7e13e.webp'
        },
        'title': 'AIO PC',
        'subTitle': 'iGame G-ONE Plus i7-12700H/RTX3060.',
        'link' : '/prototype'
    },
]);

</script>

<style scoped>
    #lab{
        height: calc(100vh - calc(41px) - calc(1rem));
    }
</style>