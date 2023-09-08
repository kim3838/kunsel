<template>
    <div
        tabindex="0"
        v-on:focus="keepSelectionActive(1)"
        v-on:blur="loseFocus(1)"
        class="tw-w-full tw-relative focus:tw-outline-none">
        <div class="tw-w-full tw-relative tw-h-8 tw-flex tw-justify-start tw-border"
             :class="[active ? 'tw-relative tw-border-light' : 'tw-border-neutral-200']">
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

            <div :class="[active ? 'tw-block tw-px-[0.5rem] tw-flex' : 'tw-hidden']" class="tw-justify-center tw-items-center">
                <Icon v-if="false" @click="toggleSelection" class="tw-text-neutral-300 tw-h-6 tw-w-6 tw-cursor-pointer" :name="headerIcon()"/>
                <NonModelCheckBox :checked="selectedAllCurrentSelection()" @click="toggleSelection" />
            </div>
            <div :class="[active ? 'tw-block' : 'tw-hidden']" class="tw-w-full tw-relative">
                <div class="tw-absolute tw-left-0 tw-right-[2rem] tw-flex tw-items-center">
                    <Input
                        autocomplete="off"
                        class="tw-w-full"
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
                    <Icon @click="clearSearch" class="tw-h-5 tw-w-5 tw-cursor-pointer hover:tw-bg-neutral-200" name="ic:baseline-clear" />
                </div>
            </div>
        </div>

        <div v-show="active" class="tw-z-10 tw-absolute tw-w-full tw-border tw-bg-white tw-pr-1.5 tw-border-light tw-w-max tw-border-t-transparent">
            <div class="tw-max-h-[240px] tw-overflow-y-auto">
                <NonModelCheckBox
                    :size="'md'"
                    v-for="item in options.selection" :key="item.value"
                    class="tw-pl-2 hover:tw-bg-neutral-200"
                    :class="[isItemInSearchPool(item) ? '' : 'tw-hidden']"
                    :checked="isItemSelected(item)"
                    :label="item.text"
                    :tabable="false"
                    @click="selectItem(item)"
                />
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
    size: {
        default: null
    },
    icon: {
        type: String,
        default: 'ion:md-options'
    }
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
        'md': 'tw-pt-[8px] tw-text-sm',
        'lg': 'tw-pt-[8px] tw-text-md'
    }[props.size];
});

let selectionSummary = computed(() => {
    if(props.options.selected.length === 0){
        return "None Selected"
    } else if(props.options.selected.length < 3) {
        return props.options.data.filter((item) => {
            return props.options.selected.indexOf(item.value) >= 0;
        }).map(item => item.text).join(", ");
    } else if(props.options.selected.length > 2) {
        let summary = '';

        if (props.options.selected.length < props.options.data.length) {
            summary = `${props.options.selected.length} Selected`;
        } else if (props.options.selected.length === props.options.data.length){
            summary = `All Selected`;
        }

        return summary;
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

function toggleSelection(){
    if (props.options.search.trim()){
        if (selectedAllCurrentSelection()){
            props.options.selected = props.options.selected.filter(value => {
                return !isItemInSearchPool({value: value});
            });
        } else {
            let selectedNotInSearch = props.options.selected.filter(value => {
                return !isItemInSearchPool({value: value});
            });
            let selectionInSearch = props.options.selection.filter(data => {
                return data.text.toLowerCase().indexOf(props.options.search.trim().toLowerCase()) > -1
            }).map(item => item.value);

            props.options.selected = _uniq(selectedNotInSearch.concat(selectionInSearch));
        }
    } else {
        if (selectedAllCurrentSelection()){
            props.options.selected = [];
        } else {
            props.options.selected = props.options.selection.map(item => item.value);
        }
    }
}

function selectedAllCurrentSelection(): boolean {
    if (props.options.search.trim()){
        let selected = props.options.selected.filter(value => {
            return isItemInSearchPool({value: value});
        });

        let selection = props.options.selection.filter(data => {
            return data.text.toLowerCase().indexOf(props.options.search.trim().toLowerCase()) > -1
        });

        return (selection.length > 0) && (selected.length === selection.length);
    } else {
        return props.options.selected.length === props.options.selection.length;
    }
}

function selectedSomeCurrentSelection(): boolean {
    if (props.options.search.trim()){
        let selected = props.options.selected.filter(value => {
            return isItemInSearchPool({value: value});
        });

        return selected.length > 0 && !selectedAllCurrentSelection();
    } else {
        return props.options.selected.length > 0 && !selectedAllCurrentSelection();
    }
}

function headerIcon(): string{
    if (selectedAllCurrentSelection()) return 'ic:sharp-check-box';
    if (selectedSomeCurrentSelection()) return 'ic:sharp-indeterminate-check-box';
    return 'ic:sharp-check-box-outline-blank';
}

function selectItem(item: any): void{
    if(isItemSelected(item)){
        _remove(props.options.selected, (value) => value == item.value);
    } else {
        props.options.selected.push(item.value);
    }
}

function isItemSelected(item): boolean{
    return props.options.selected.indexOf(item.value) >= 0;
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