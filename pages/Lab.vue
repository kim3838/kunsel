<template>
    <div class="tw-mx-auto tw-max-w-screen-2xl tw-pt-4">
        <div v-if="false">
            <AccentFrame>
                <template #content>
                    <SampleEmitter
                        v-model:[dynamicFoo]="fooComputed"
                        v-model:[dynamicBarCaller]="barComputed"
                        class="tw-w-[250px]"
                    />
                    <Button :variant="'flat'" @click="setPageLayout('default')" :label="'Default Layout'"></Button>
                    <Button :variant="'flat'" @click="setPageLayout('landing')" :label="'Landing Layout'"></Button>
                </template>
            </AccentFrame>
        </div>

        <div class="tw-grid tw-gap-2 tw-grid-cols-2 tw-h-[230px]">
            <Featured
                v-if="false"
                class="tw-w-[254px] tw-h-[354px]"
                focused
                :image="{path: '/images/product/cd8f248a-bd3d-4553-bcf7-849ed27c4b36.webp'}"
                :title="'Title'"
                :sub-title="'Sub Title'"
                :link="'/prototype'"
                :button-label="'Details'"
            />
            <HexagonFrame
                v-for="item in leftToRightItems"
                :frame-border="item.frameBorder"
                :content-border="item.contentBorder"
                :direction="'ltr'"
                :top-right="45"
                :bottom-left="55">
                <template #header>
                    <div class="tw-h-full tw-w-[40%]">
                        <div
                            class="tw-h-full tw-w-full tw-bg-cover tw-bg-center tw-bg-no-repeat"
                            :style="{'background':'url('+item.image.path+')'}"
                        />
                    </div>
                </template>
                <template #body>
                    <div class="tw-h-full tw-w-[60%] tw-p-1">
                        <div class="tw-font-semibold tw-text-lg">iGame Z790D5 FLOW V20 iGame Z790D5 FLOW V20</div>
                        <Button :label="'Learn more'" :size="'md'" :variant="'flat'"></Button>
                    </div>
                </template>
            </HexagonFrame>
        </div>

        <div class="tw-mt-6 tw-grid tw-gap-2 tw-grid-cols-5 tw-h-[454px]">
            <HexagonFrame
                v-for="item in topToBottomItems"
                :key="item"
                :frame-border="item.frameBorder"
                :content-border="item.contentBorder"
                :direction="'ttb'"
                :head-percentage="65"
                :top-right="55"
                :bottom-left="45">
                <template #header>
                    <div class="tw-h-[65%] tw-w-full">
                        <div
                            class="tw-h-full tw-w-full tw-bg-cover tw-bg-center tw-bg-no-repeat"
                            :style="{'background':'url('+item.image.path+')'}"
                        />
                    </div>
                </template>
                <template #body>
                    <div class="tw-h-[35%] tw-w-full tw-p-1">
                        <div class="tw-font-semibold tw-text-lg">{{item.subTitle}}</div>
                        <Button :label="'Learn more'" :size="'md'" :variant="'flat'"></Button>
                    </div>
                </template>
            </HexagonFrame>
        </div>

        <div v-if="false" class="scaffold tw-w-[170px] tw-h-[230px]">
            <HexagonFrame>
                <template #body>
                    <div class="tw-relative tw-h-full tw-flex tw-items-center tw-px-4 tw-text-center tw-font-['Google_Sans_Text'] tw-text-xl tw-font-semibold tw-px-8">
                        Label
                        <Button :label="'Click'"></Button>
                    </div>
                </template>
            </HexagonFrame>
        </div>

        <div v-if="false">
            <div>
                <div class="tw-mx-auto tw-max-w-screen-2xl tw-flex tw-flex-col">
                    <Featured
                        focused
                        class="tw-inline-block tw-mx-2"
                        :image="{path: '/images/product/ebac5037-c3d2-4275-b96b-24f855695841.webp'}"
                        :title="'Motherboard'"
                        :sub-title="'iGame Z790D5 ULTRA V20'"
                        :link="'/prototype'"
                        :button-label="'Details'"
                    />
                </div>
                <div class="tw-mx-auto tw-max-w-screen-2xl tw-flex tw-flex-col">
                    <Card
                        focused
                        class="tw-inline-block tw-mx-2"
                        :image="{path: '/images/product/ebac5037-c3d2-4275-b96b-24f855695841.webp'}"
                        :title="'Motherboard'"
                        :sub-title="'iGame Z790D5 ULTRA V20'"
                        :link="'/prototype'"
                        :button-label="'Details'"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {computed, ref, reactive, nextTick, onMounted} from "vue";
useLayout().setNavigationMode('solid');

definePageMeta({middleware: 'guest'});

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

let categorySelection = reactive([
    {text : 'Charms', value: false},
    {text : 'Bracelets', value: false},
    {text : 'Brooches and Pins', value: false},
    {text : 'Necklaces', value: false},
    {text : 'Earrings', value: false},
    {text : 'Rings', value: false},
    {text : 'Polyester', value: false},
]);

let transactionGroup = reactive({
    selection: [
        {text : 'Cash', value: 0},
        {text : 'Pre Paid', value: 1},
        {text : 'Tab\t\tPost\nPaid', value: 2},
        {text : 'Card', value: 3},
        {text : 'Debit', value: 4},
    ],
    selected: 3
});

let accordion = reactive({
    recentActive: 2,
    options: [
        {
            title: 'Check box',
            body: {
                type: 'checkbox',
                value: categorySelection
            },
            active: false
        },
        {
            title: 'Radio box',
            body: {
                type: 'radio',
                value: transactionGroup
            },
            active: false
        },
        {
            title: 'Coldiron Armor Set, Coldiron Armor Set, Coldiron Armor Set, Coldiron Armor Set',
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
            title: 'Weapon skins, Mount Trophies, Emotes, Platinum, and more',
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

let tabGroup = reactive({
    'icon' : 'ic:sharp-qr-code',
    'size' : 'md'
});
let multiSelectPrototypePayload = reactive({
    fetch: {
        url: '/api/selections/prototype',
        filters: {
            search: {
                keyword: '',
                callback: 1
            }
        }
    },
    selected: [1992,1263]
});
let singleSelectPrototypePayload = reactive({
    fetch: {
        url: '/api/selections/prototype',
        filters: {
            search: {
                keyword: '',
                callback: 1
            }
        }
    },
    selected: null,
});
let singleSelectPrototype = reactive({
    search: '',
    data: [
        {text : 'PRT3221289642 005-5RZX3-MPJ-9GRRWA', value: 0},
        {text : 'PRT3224439642 005-5RZX3-MPJ-9GRRWA', value: 1},
        {text : 'PRT3222219642 005-5RZX3-MPJ-9GRRWA', value: 2},
        {text : 'PRT3224324642 005-5RZX3-MPJ-9GRRWA', value: 3},
        {text : 'PRT3221285552 005-5RZX3-MPJ-9GRRWA', value: 4},
    ],
    selection: [
        {text : 'PRT3221289642 005-5RZX3-MPJ-9GRRWA', value: 0},
        {text : 'PRT3224439642 005-5RZX3-MPJ-9GRRWA', value: 1},
        {text : 'PRT3222219642 005-5RZX3-MPJ-9GRRWA', value: 2},
        {text : 'PRT3224324642 005-5RZX3-MPJ-9GRRWA', value: 3},
        {text : 'PRT3221285552 005-5RZX3-MPJ-9GRRWA', value: 4},
    ],
    selected: null
});
let category = reactive({
    search: '',
    data: [
        {text : 'Charms', value: 0},
        {text : 'Bracelets', value: 1},
        {text : 'Tab\t\tBrooches\nand\nPins', value: 2},
        {text : 'Necklaces', value: 3},
        {text : 'Earrings', value: 4},
        {text : 'Rings', value: 5},
        {text : 'Polyester', value: 6},
    ],
    selection: [
        {text : 'Charms', value: 0},
        {text : 'Bracelets', value: 1},
        {text : 'Tab\t\tBrooches\nand\nPins', value: 2},
        {text : 'Necklaces', value: 3},
        {text : 'Earrings', value: 4},
        {text : 'Rings', value: 5},
        {text : 'Polyester', value: 6},
    ],
    selected: []
});

const leftToRightItems = ref([
    {
        'image':{
            'path': '/images/product/202306201506003693.webp'
        },
        'title': 'PC Case',
        'subTitle': 'Segotep Memphis-S Meow PC Case (M-ATX / ITX supported)',
        'link': '/prototype',
        'frameBorder': '#f9dbbd',
        'contentBorder': '#f4a261'
    },
    {
        'image':{
            'path': '/images/product/c76383ac-e6c0-4725-bec0-b171449c5960.webp'
        },
        'title': 'Motherboard',
        'subTitle': 'COLORFIRE B760M-MEOW WIFI D5 ORANGE',
        'link': '/prototype',
        'frameBorder': '#f9dbbd',
        'contentBorder': '#f4a261'
    },
    {
        'image':{
            'path': '/images/product/7d5178c3-e5dc-4b8f-b8d1-cbe0bbc14e84.webp'
        },
        'title': 'Graphics Card',
        'subTitle': 'COLORFIRE GeForce RTX 4060 MEOW-ORG 8GB-V',
        'link': '/prototype',
        'frameBorder': '#f9dbbd',
        'contentBorder': '#f4a261'
    },
]);
const topToBottomItems = ref([
    {
        'image':{
            'path': '/images/product/c7dfc1f1-102a-4ea9-84f6-f87dda2094b8.webp'
        },
        'title': 'Motherboard',
        'subTitle': 'CVN Z790D5 GAMING PRO WIFI V20',
        'link': '/prototype',
        'frameBorder': '#adb5bd',
        'contentBorder': '#ced4da'
    },
    {
        'image':{
            'path': '/images/product/38131462-2ae0-443e-8555-9e744c532887.webp'
        },
        'title': 'Motherboard',
        'subTitle': 'BATTLE-AX Z790AK-PLUS D5 V20',
        'link': '/prototype',
        'frameBorder': '#adb5bd',
        'contentBorder': '#ced4da'
    },
    {
        'image':{
            'path': '/images/product/ebac5037-c3d2-4275-b96b-24f855695841.webp'
        },
        'title': 'Motherboard',
        'subTitle': 'iGame Z790D5 ULTRA V20',
        'link': '/prototype',
        'frameBorder': '#a8dadc',
        'contentBorder': '#457b9d'
    },
    {
        'image':{
            'path': '/images/product/f9b5a1a7-d532-4cf8-970c-d812b857a666.webp'
        },
        'title': 'Motherboard',
        'subTitle': 'iGame Z790D5 FLOW V20',
        'link': '/prototype',
        'frameBorder': '#a8dadc',
        'contentBorder': '#457b9d'
    }
]);
onMounted(async () => {
    nextTick(() => {

    });
});

</script>

<style scoped lang="scss">
@for $i from 1 through 20 {
    .border-fragment:nth-child(#{$i}) {
        animation-delay: #{random(5) * 0.5}s !important;
    }
}
#lab{
    height: calc(100vh - calc(41px) - calc(1rem));
}
</style>