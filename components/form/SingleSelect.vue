<template>
    <div
        tabindex="0"
        v-on:focus="keepSelectionActive(1)"
        v-on:blur="loseFocus(1)"
        class="tw-w-full tw-relative focus:tw-outline-none">
        <div class="tw-w-full tw-relative tw-h-8 tw-flex tw-justify-start tw-border"
             :class="[active ? 'tw-relative tw-border-light tw-border-b-neutral-200' : 'tw-border-neutral-200']">
            <div v-if="!active" class="tw-w-10 tw-flex tw-justify-center tw-items-center">
                <Icon class="tw-h-5 tw-w-5" :name="icon"/>
            </div>
            <div v-if="!active" class="tw-w-full tw-relative hover:tw-bg-neutral-100 tw-cursor-pointer">
                <div :class="[selectionClass]" class="tw-absolute tw-h-8 tw-left-[0.2rem] tw-right-[2.2rem] tw-truncate tw-text-accent tw-leading-[0.875rem]">
                    {{selectionSummary}}
                </div>
                <div class="tw-absolute tw-right-0 tw-top-0 tw-w-8 tw-h-8 tw-flex tw-justify-center tw-items-center">
                    <Icon class="tw-h-5 tw-w-5" name="ic:baseline-arrow-drop-down" />
                </div>
            </div>

            <div v-show="active" class="tw-w-full tw-relative">
                <div class="tw-absolute tw-flex tw-items-center">
                    <Input
                        autocomplete="off"
                        class="tw-w-full tw-h-[1.875rem]"
                        ref="selectionSearch"
                        type="text"
                        placeholder="Search..."
                        v-on:focus="keepSelectionActive(2)"
                        v-on:blur="loseFocus(2)"
                        v-on:input="searchSelection"
                        v-model="props.options.search"
                        v-if="active"
                        :size="'sm'"
                        :withBorder="false"
                        :rounded="false"
                        :focusRing="false"
                        :disabled="false" />
                </div>
                <div class="tw-absolute tw-right-0 tw-top-0 tw-w-8 tw-h-8 tw-flex tw-justify-center tw-items-center">
                    <Icon @click="clearSearch" class="tw-h-6 tw-w-6 tw-cursor-pointer hover:tw-bg-neutral-200" name="ic:baseline-clear" />
                </div>
            </div>
        </div>

        <div v-show="active" class="tw-z-10 tw-absolute tw-w-full tw-border tw-bg-white tw-border-light tw-border-t-transparent">
            <div class="tw-max-h-[240px] tw-overflow-y-auto">
                <div
                    v-for="item in options.selection" :key="item.value"
                    class="tw-pl-1.5 hover:tw-bg-neutral-200 tw-flex tw-items-center tw-cursor-pointer"
                    :class="[isItemInSearchPool(item) ? '' : 'tw-hidden']"
                    @click="selectItem(item)">
                    <Icon class="tw-h-5 tw-w-[1.15rem]" :class="[isItemSelected(item) ? 'tw-text-accent' : 'tw-text-transparent']" name="ic:sharp-check-box"></Icon>
                    <span class="tw-text-accent tw-ml-0.5" :class="[optionsFontClass]">{{item.text}}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick  } from 'vue';

const props = defineProps({
    options: {
        type: Object,
        default: function () {
            return {
                search: '',
                data: [],
                selection: [],
                selected: []
            }
        }
    },
    icon: {
        type: String,
        default: 'ion:md-options'
    },
    size: {
        default: null
    },
});

let keepFocus = ref(false);
let selectionSearch = ref(null);
let active = ref(false);
let searchPool = ref([]);
searchPool.value = props.options.data.map(item => item.value);

const selectionClass = computed(() => {
    return {
        [null]: 'tw-pt-[8px] tw-text-md',
        'sm': 'tw-pt-[8px] tw-text-md',
        'md': 'tw-pt-[9px] tw-text-sm',
        'lg': 'tw-pt-[8px] tw-text-md'
    }[props.size];
});

const optionsFontClass = computed(() => {
    return {
        [null]: 'tw-text-base',
        'sm': 'tw-text-base',
        'md': 'tw-text-base',
        'lg': 'tw-text-base'
    }[props.size];
});

let selectionSummary = computed(() => {
    if(props.options.selected == null){
        return "None Selected"
    } else {
        return props.options.data.filter((item) => {
            return item.value == props.options.selected;
        })[0].text;
    }
});

async function keepSelectionActive(chain: number){
    if(!active.value){
        active.value = true;
        //Keep focus to prevent losing active status
        keepFocus.value = true;
    }

    //If keepSelectionActive called from (Selection div parent)
    //transfer the focus on the (Selection body search input)
    if(chain == 1){
        await nextTick();

        selectionSearch.value.$refs.input.focus();

        //Revert back keep focus to false
        //so that elements that is not (Selection div parent / Selection body search input)
        //got focused will not trigger keepSelectionActive
        setTimeout(function(){
            keepFocus.value = false;
        }, 20);
    }
}

function loseFocus(chain: number){
    //Lose only active status if keepFocus is false
    if(active.value && !keepFocus.value){
        active.value = false;
    }
}

function selectItem(item: any): void{
    if(isItemSelected(item)){
        props.options.selected = null;
    } else {
        props.options.selected = item.value;
    }

    loseFocus();
}

function isItemSelected(item): boolean{
    return props.options.selected == item.value;
}

function isItemInSearchPool(item): boolean{
    return searchPool.value.indexOf(item.value) >= 0;
}

function searchSelection(){
    if (!props.options.search.trim()){
        searchPool.value = props.options.data.map(item => item.value);
    } else {
        searchPool.value = props.options.data.filter(data => {
            return data.text.toLowerCase().indexOf(props.options.search.toLowerCase()) > -1
        }).map(item => item.value);
    }
}

function clearSearch(){
    props.options.search = "";
    searchPool.value = props.options.data.map(item => item.value);
}
</script>