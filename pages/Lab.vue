<template>
    <div class="tw-mx-auto tw-max-w-screen-2xl">
        <div>
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

        <div v-if="true">
            <div>
                <div class="tw-mx-auto tw-max-w-screen-2xl tw-flex tw-flex-col">
                    <Featured
                        focused
                        class="tw-inline-block tw-mx-2"
                        :image="{path: 'images/product/ebac5037-c3d2-4275-b96b-24f855695841.webp'}"
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
                        :image="{path: 'images/product/ebac5037-c3d2-4275-b96b-24f855695841.webp'}"
                        :title="'Motherboard'"
                        :sub-title="'iGame Z790D5 ULTRA V20'"
                        :link="'/prototype'"
                        :button-label="'Details'"
                    />
                </div>
                <div class="tw-mx-auto tw-max-w-screen-2xl tw-flex tw-flex-col">
                    <Featured
                        focused
                        class="tw-inline-block tw-mx-2"
                        :image="{path: 'images/product/ebac5037-c3d2-4275-b96b-24f855695841.webp'}"
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
                        :image="{path: 'images/product/ebac5037-c3d2-4275-b96b-24f855695841.webp'}"
                        :title="'Motherboard'"
                        :sub-title="'iGame Z790D5 ULTRA V20'"
                        :link="'/prototype'"
                        :button-label="'Details'"
                    />
                </div>
                <div class="tw-mx-auto tw-max-w-screen-2xl tw-flex tw-flex-col">
                    <Featured
                        focused
                        class="tw-inline-block tw-mx-2"
                        :image="{path: 'images/product/ebac5037-c3d2-4275-b96b-24f855695841.webp'}"
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
                        :image="{path: 'images/product/ebac5037-c3d2-4275-b96b-24f855695841.webp'}"
                        :title="'Motherboard'"
                        :sub-title="'iGame Z790D5 ULTRA V20'"
                        :link="'/prototype'"
                        :button-label="'Details'"
                    />
                </div>
                <div class="tw-mx-auto tw-max-w-screen-2xl tw-flex tw-flex-col">
                    <Featured
                        focused
                        class="tw-inline-block tw-mx-2"
                        :image="{path: 'images/product/ebac5037-c3d2-4275-b96b-24f855695841.webp'}"
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
                        :image="{path: 'images/product/ebac5037-c3d2-4275-b96b-24f855695841.webp'}"
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
const {$layoutStore} = useNuxtApp();

definePageMeta({layout: false, middleware: 'guest'});
setPageLayout('default');
$layoutStore.setNavigationMode('solid');

const layout = ref('default')


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
onMounted(async () => {
    nextTick(() => {

    });
});

</script>

<style scoped>
    #lab{
        height: calc(100vh - calc(41px) - calc(1rem));
    }
</style>