<template>
    <div>
        <LandingWrapper>
            <div class="tw-mx-auto tw-max-w-screen-2xl tw-pt-4">
                <div v-if="true" class="tw-flex tw-mb-4">
                    <SampleEmitter
                        v-model:[dynamicFoo].capitalizeEveryWord ="fooComputed"
                        v-model:[dynamicBarCaller].capitalize="barComputed"
                        class="tw-w-[250px]"
                    />
                </div>

                <div v-if="false" class="tw-mb-4 tw-relative tw-w-[370px] tw-h-[530px]">
                    <InformationCard
                        :image="'/images/spotlight/1697501586302.jpg'"
                        :title="'FORGE YOUR FUTURE'"
                        :sub-title="'New Z790 motherboards from ROG pave the way for 14th Gen Intel Core CPUs'"
                        :body-color="''"
                        :fade-color="''"
                        :inner-border="'silver'"
                        :outer-border="'gray'"
                    />
                </div>

                <a v-if="false" class="hub-card" href="https://www.callofduty.com/blackcell" style="width: 400px; height: 200px; background-color: #ececec;">
                    <span class="glint"></span>
                    <span class="glint"></span>
                    <span class="glint"></span>
                    <span class="glint"></span>
                </a>

                <div v-if="false" class="tw-w-[170px] tw-h-[230px] tw-mb-4">
                    <!-- Todo: make hexagon frame individual lines -->
                    <HexagonFrame>
                        <template #body>
                            <div class="tw-relative tw-h-full tw-flex tw-items-center tw-px-4 tw-text-center tw-font-['Google_Sans_Text'] tw-text-xl tw-font-semibold tw-px-8">
                                Hexagon Frame Without Corner
                            </div>
                        </template>
                    </HexagonFrame>
                </div>

                <div v-if="false" class="tw-grid tw-gap-4 tw-grid-cols-1 md:tw-grid-cols-2 xl:tw-grid-cols-3">
                    <div
                        v-for="item in leftToRightItems"
                        class="tw-h-[230px]">
                        <HexagonFrame
                            :frame-border="item.frameBorder"
                            :content-border="item.contentBorder"
                            :direction="'ltr'"
                            :head-percentage="50"
                            :top-right="45"
                            :bottom-left="55"
                            :header-fade="true"
                            :header-fade-color="'rgba(25,25,25,0.1)'">
                            <template #header>
                                <div class="tw-h-full tw-w-[50%]">
                                    <div
                                        class="tw-h-full tw-w-full tw-bg-cover tw-bg-center tw-bg-no-repeat"
                                        :style="{'background':'url('+item.image.path+')'}"
                                    />
                                </div>
                                <div class="tw-h-full tw-w-[50%]">
                                    <div
                                        class="tw-h-full tw-w-full tw-bg-cover tw-bg-center tw-bg-no-repeat tw-opacity-10"
                                        :style="{'background':'url('+item.image.path+')'}"
                                    />
                                </div>
                            </template>
                            <template v-slot:body="{frameBorderColor, contentBorderColor}">
                                <div class="tw-h-full tw-w-[50%] tw-p-4 tw-overflow-hidden tw-relative tw-flex tw-flex-col tw-text[#5A5A5A]">

                                    <div class="tw-overflow-auto tw-space-y-0.5">
                                        <div class="tw-font-semibold tw-h-max tw-flex-none">
                                            <UnorderedList
                                                class="tw-cursor-pointer hover:tw-underline"
                                                :size="'md'"
                                                :icon="item.listIcon"
                                                :label="item.title"/>
                                        </div>

                                        <div class="horizontal-rule"></div>

                                        <div v-if="item?.bullets?.value?.length" class="tw-flex tw-flex-row tw-flex-nowrap">
                                            <div class="tw-w-full" :style="{'columns': (item.bullets.column ? item.bullets.column : 1)}">
                                                <UnorderedList
                                                    v-for="bullet in item.bullets.value"
                                                    :size="'sm'"
                                                    :icon="'eos-icons:commit'"
                                                    :label="bullet"/>
                                            </div>
                                        </div>

                                        <div
                                            v-if="item.description"
                                            v-html="item.description"
                                            class="tw-text-base tw-leading-5 tw-line-clamp-3"
                                            :style="{'font-family': 'Source Sans Pro'}"
                                        ></div>

                                        <UnorderedList
                                            class="tw-cursor-pointer hover:tw-underline"
                                            :font-family="'Source Sans Pro'"
                                            :size="'sm'"
                                            :label="'Read more'"/>
                                    </div>
                                </div>
                            </template>
                        </HexagonFrame>
                    </div>
                </div>

                <div v-if="false" class="tw-mt-6 tw-mx-auto tw-w-11/12">
                    <div class="tw-grid tw-gap-[1rem] tw-grid-cols-1 sm:tw-grid-cols-2 lg:tw-grid-cols-3 xl:tw-grid-cols-4">
                        <div
                            v-for="item in topToBottomItems" class="tw-h-[430px]">
                            <HexagonFrame
                                :frame-border="item.frameBorder"
                                :content-border="item.contentBorder"
                                :direction="'ttb'"
                                :head-percentage="50"
                                :top-right="50"
                                :bottom-left="50"
                                :header-fade="false">
                                <template #header>
                                    <div class="tw-h-[50%] tw-w-full">
                                        <div
                                            class="tw-h-full tw-w-full tw-bg-cover tw-bg-center tw-bg-no-repeat"
                                            :style="{'background':'url('+item.image.path+')'}"
                                        />
                                    </div>
                                    <div class="tw-h-[50%] tw-w-full tw-bg-black">
                                        <div
                                            class="tw-h-full tw-w-full tw-bg-cover tw-bg-center tw-bg-no-repeat tw-opacity-90 tw-blur-2xl"
                                            :style="{'background':'url('+item.image.path+')'}"
                                        />
                                    </div>
                                </template>
                                <template #body>
                                    <div class="tw-h-[50%] tw-w-full tw-p-4 tw-overflow-hidden tw-relative tw-flex tw-flex-col tw-text-[#e3e3e3]">

                                        <div class="tw-overflow-auto tw-space-y-2">

                                            <div class="tw-font-semibold tw-h-max tw-flex-none">
                                                <UnorderedList
                                                    class="tw-cursor-pointer hover:tw-underline"
                                                    :size="'lg'"
                                                    :icon="item.listIcon"
                                                    :label="item.title"/>
                                            </div>

                                            <div class="horizontal-rule"></div>

                                            <div v-if="item?.bullets?.value?.length" class="tw-flex tw-flex-row tw-flex-nowrap">
                                                <div class="tw-w-full" :style="{'columns': (item.bullets.column ? item.bullets.column : 1)}">
                                                    <UnorderedList
                                                        v-for="bullet in item.bullets.value"
                                                        :size="'sm'"
                                                        :icon="'eos-icons:commit'"
                                                        :label="bullet"/>
                                                </div>
                                            </div>

                                            <div
                                                v-if="item.description"
                                                v-html="item.description"
                                                class="tw-text-base tw-leading-5 tw-line-clamp-3"
                                            ></div>

                                            <UnorderedList
                                                class="tw-cursor-pointer hover:tw-underline"
                                                :font-family="'Source Sans Pro'"
                                                :size="'sm'"
                                                :label="'Read more'"/>
                                        </div>
                                    </div>
                                </template>
                            </HexagonFrame>
                        </div>
                    </div>
                </div>

            </div>
        </LandingWrapper>
    </div>
</template>

<script setup lang="ts">
definePageMeta({middleware: 'guest'});
useLayout().setNavigationMode('solid', 'Lab.vue');

const dynamicFoo = ref('foo');
const dynamicBarCaller = ref('bar');
const fooProp = ref('');
const barProp = ref('');
const barComputed = computed({
    get () {
        return barProp.value;
    },

    set (value) {
        barProp.value = value;
    }
})
const fooComputed = computed({
    get () {
        return fooProp.value;
    },

    set (value) {
        fooProp.value = value;
    }
})
watch(fooProp, value => {
    console.log({'FOO UPDATED' : value});
});
watch(barProp, value => {
    console.log({'BAR UPDATED' : value});
});

const leftToRightItems = ref([
    {
        'image':{
            'path': '/images/product/202306201506003693.webp'
        },
        'listIcon': 'octicon:circuit-board',
        'title': 'Segotep Memphis-S Meow PC Case (M-ATX / ITX supported)',
        'description': 'Designed in collaboration with Segotep, the MEOW Series chassis is a micro-ATX tower featuring panel art inspired by Bobi the orange tabby cat. The chassis features a semi-mesh front and side panels to allow airflow and improve cooling. The tempered glass side panel provides a clear view of the interior and the rest of the MEOW ORANGE Series components.',
        'bullets': {
            'value': [
                'COLORFIRE Series',
                'Supports mini-ITX and micro-ATX motherboards',
                'Up to three 2.5" SSDs and one 3.5" HDD',
                'Up to 240mm radiators of AIO liquid coolers Supports up to 170mm tall CPU coolers',
                'Up to six 120mm case fans'
            ]
        },
        'link': '/prototype',
        'frameBorder': '#dedede',
        'contentBorder': '#b7b7b7'
    },
    {
        'image':{
            'path': '/images/product/c76383ac-e6c0-4725-bec0-b171449c5960.webp'
        },
        'listIcon': 'octicon:circuit-board',
        'title': 'COLORFIRE B760M-MEOW WIFI D5 ORANGE',
        'description': 'COLORFUL introduces the CVN B760M FROZEN WIFI D5 and CVN B760I FROZEN WIFI motherboards for gamers and enthusiasts.',
        'bullets': {
            'value': [
                'COLORFIRE Series',
                'Support the 14th/13th and 12th generation Intel adapting to the LGA 1700 slot of the motherboard ® Core TM, Pentium ® And Cylon ® processor',
                'Support dual channel DDR5-7200 (OC) MHz memory',
                'Provide 3 PCIe 4.0 x4 M.2 SSD slots',
                'Provide one USB 3.2 Gen 2 Type-C and two USB 3.2 Gen 1 Type-A high-speed rear interfaces'
            ]
        },
        'link': '/prototype',
        'frameBorder': '#dedede',
        'contentBorder': '#b7b7b7'
    },
    {
        'image':{
            'path': '/images/product/d942910a-ffe9-461c-8847-a6fdb4ab480c.webp'
        },
        'listIcon': 'bi:gpu-card',
        'title': 'COLORFIRE GeForce RTX 4070 SUPER MEOW-ORG 12GB-V',
        'description': '',
        'bullets': {
            'value': [
                'COLORFIRE Series',
                'Efficient and durable heat dissipation.',
                'With triple fans to enhance air pressure and air input, supporting auto-stop technology.',
                'Adjustable lighting effects via iGame Center.'
            ]
        },
        'link': '/prototype',
        'frameBorder': '#dedede',
        'contentBorder': '#b7b7b7'
    },
]);
const topToBottomItems = ref([
    {
        'image':{
            'path': '/images/spotlight/5037c274-2024-46d3-8f04-e70ccea4ec8f.webp'
        },
        'listIcon': 'bi:gpu-card',
        'title': 'COLORFUL Introduces GeForce RTX 4070 Series Graphics Card Lineup',
        'link': '/prototype',
        'description': '',
        'bullets': {
            'value': [
                'iGame GeForce RTX 4070 Vulcan OC',
                'COLORFUL iGame GeForce RTX 4070 Neptune OC',
                'COLORFUL iGame GeForce RTX 4070 Advanced OC',
                'COLORFUL iGame GeForce RTX 4070 Ultra W',
                'COLORFUL GeForce RTX 4070 NB EX'
            ]
        },
        'frameBorder': '#C2446F',
        'contentBorder': '#922042'
    },
    {
        'image':{
            'path': '/images/spotlight/w636.jpg'
        },
        'listIcon': 'octicon:circuit-board',
        'title': 'ASUS B550 Series- Rise Above the Battlefield',
        'link': '/prototype',
        'description': 'ASUS B550 Series packs all the essentials for the latest AMD processors. WiFi 6 and 2.5 Gb Ethernet provide ample bandwidth for online gaming, while AI Noise-Canceling Mic software ensures you’re clearly heard in-game. And system set up is a breeze with the intuitive BIOS Flashback™.',
        'frameBorder': '#f9dbbd',
        'contentBorder': '#f4a261'
    },
    {
        'image':{
            'path': '/images/spotlight/w637.jpg'
        },
        'listIcon': 'octicon:circuit-board',
        'title': 'ASUS Z490 Series- AI Motherboards',
        'link': '/prototype',
        'description': 'ASUS Z490 motherboards feature intelligent overclocking, revolutionary cooling, a robust power solution, optimized memory and next-gen connectivity to unleash the power of the latest 10th Gen Intel® Core™ processors.',
        'frameBorder': '#a8dadc',
        'contentBorder': '#4b6e7a'
    },
    {
        'image':{
            'path': '/images/spotlight/c869bdd2-4aa7-408d-b2af-75681836aa9a.webp'
        },
        'listIcon': 'octicon:circuit-board',
        'title': 'COLORFUL Launches EVOL P15 Gaming Laptop',
        'link': '/prototype',
        'description': null,
        'bullets': {
            'column': 2,
            'value': [
                'Retro-Futuristic Design',
                'Deep Chiller System',
            ]
        },
        'frameBorder': '#a8dadc',
        'contentBorder': '#4b6e7a'
    },
    {
        'image':{
            'path': '/images/spotlight/CODM-S4-FOOLS-GOLD-009.jpg'
        },
        'listIcon': 'octicon:circuit-board',
        'title': 'FOOL\'S GOLD',
        'link': '/prototype',
        'description': 'Season 4 — Fool’s Gold launches on Call of Duty: Mobile on April 17 at 5 PM PT.',
        'frameBorder': '#3b6b2a',
        'contentBorder': '#3b6b2a'
    },
    {
        'image':{
            'path': '/images/spotlight/1697501586302.jpg'
        },
        'listIcon': 'octicon:circuit-board',
        'title': 'New Z790 motherboards from ROG pave the way for 14th Gen Intel Core CPUs',
        'link': '/prototype',
        'description': 'WiFi 7 support, more fast storage, front-panel device charging, intelligent controls — our latest Z790 motherboards have it all.',
        'frameBorder': '#a8dadc',
        'contentBorder': '#4b6e7a'
    },
    {
        'image':{
            'path': '/images/spotlight/w638.jpg'
        },
        'listIcon': 'octicon:circuit-board',
        'title': 'ROG Gaming Audio',
        'link': '/prototype',
        'description': 'Utilizing advanced trace layout techniques to mitigate noise, and featuring carefully selected components and a host of software options that enhance the gaming experience, ROG Gaming Audio pushes onboard audio to the very limits.',
        'frameBorder': '#696969',
        'contentBorder': '#457b9d'
    },
    {
        'image':{
            'path': '/images/spotlight/1692323352671.webp'
        },
        'listIcon': 'octicon:circuit-board',
        'title': 'Race after your dreams with the power of the ROG Strix SCAR 16 and SCAR 18',
        'link': '/prototype',
        'description': 'Discover the amazing true story of a gamer turned pro racer in the new movie Gran Turismo.',
        'frameBorder': '#f9dbbd',
        'contentBorder': '#f4a261'
    },
]);


onMounted(async () => {
    nextTick(() => {

    });
});

</script>

<style scoped lang="scss">
.horizontal-rule{
    height: 1px;
    width: 100%;
    background: linear-gradient(
        to right,
        transparent 0%,
        #e3e3e3 30%,
        #e3e3e3 70%,
        transparent 100%
    );
}
</style>