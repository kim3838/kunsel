<template>
    <div
        tabindex="0"
        v-on:focus="activateSelection(1)"
        v-on:blur="loseFocus(1)"
        class="tw-w-full tw-relative focus:tw-outline-none">
        <div class="tw-w-full tw-relative tw-h-8 tw-flex tw-justify-start tw-border"
             :class="[active ? 'tw-relative tw-border-light tw-border-b-neutral-200' : 'tw-border-neutral-200']">
            <!-- Idle -->
            <div v-if="!active" class="tw-w-10 tw-flex tw-justify-center tw-items-center"><!-- tw-border tw-border-[red] -->
                <Icon class="tw-h-5 tw-w-5" name="ion:md-options"/>
            </div>
            <div v-if="!active" class="tw-w-full tw-relative hover:tw-bg-neutral-100 tw-cursor-pointer"><!-- tw-border tw-border-[green] -->
                <div class="tw-absolute tw-h-8 tw-pt-[9px] tw-left-[0.2rem] tw-right-[2.2rem] tw-text-sm tw-leading-[0.875rem] tw-truncate"><!-- tw-border tw-border-[pink] -->
                    {{selectionSummary}}
                </div>
                <div class="tw-absolute tw-right-0 tw-top-0 tw-w-8 tw-h-8 tw-flex tw-justify-center tw-items-center"><!-- tw-border tw-border-[red] -->
                    <Icon class="tw-h-5 tw-w-5" name="ic:baseline-arrow-drop-down" />
                </div>
            </div>

            <div v-if="active" class="tw-w-10 tw-flex tw-justify-center tw-items-center"><!-- tw-border tw-border-[red] -->
                <Icon @click="toggleSelection()" class="tw-h-6 tw-w-6 tw-cursor-pointer" :name="headerIcon()"/>
            </div>
            <div v-if="active" class="tw-w-full tw-relative"><!-- tw-border tw-border-[green] -->
                <div class="tw-absolute tw-right-[2rem] tw-flex tw-items-center">
                    <FormInput
                        ref="selectionSearch"
                        v-if="active"
                        class="tw-w-full tw-h-[1.875rem]"
                        :size="'sm'"
                        type="text"
                        placeholder="Search..."
                        v-on:focus="activateSelection(2)"
                        v-on:blur="loseFocus(2)"
                        v-model="props.search"
                        autocomplete="off"
                        :withBorder="false"
                        :rounded="false"
                        :focusRing="false"
                        :disabled="false" />
                </div>
                <div class="tw-absolute tw-right-0 tw-top-0 tw-w-8 tw-h-8 tw-flex tw-justify-center tw-items-center"><!-- tw-border tw-border-[red] -->
                    <Icon class="tw-h-6 tw-w-6 tw-cursor-pointer hover:tw-bg-neutral-200" name="ic:baseline-clear" />
                </div>
            </div>
        </div>
        <!-- Selection Body
        <div v-if="active" class="tw-absolute tw-top-[1.875rem] tw-right-[-1px] tw-left-[-1px] tw-border tw-bg-white tw-border-light tw-border-t-neutral-200"> -->
        <div v-show="active" class="tw-z-10 tw-absolute tw-w-full tw-border tw-bg-white tw-border-light tw-border-t-transparent">
            <!-- Selection List -->
            <div>
                <FormCheckbox
                    :size="'sm'"
                    class="tw-pl-2 hover:tw-bg-neutral-200"
                    v-for="item in options.selection"
                    :key="item.value"
                    :checked="isItemSelected(item)"
                    :label="item.text"
                    :tabable="false"
                    @click="selectItem(item)"
                />
            </div>
            <div class="tw-pl-2 tw-text-xs">{{selectionSummary}}</div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, nextTick, onMounted  } from 'vue';

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
});

let recentId = ref(0);
let focused = ref(false);
let selectionSearch = ref(null);
let active = ref(false);

let selectionSummary = computed(() => props.options.selected);

async function activateSelection(id: number){
    if(!active.value){
        recentId.value = id;
        active.value = true;
    }

    await nextTick();

    selectionSearch.value.$refs.input.focus();
    focused.value = true;

    setTimeout(function(){
        focused.value = false;
    }, 40);
}

function loseFocus(id: number){
    setTimeout(function(){
        if(active.value && !focused.value){
            active.value = false;
        }
    }, 20);
}

function isItemSelected(item){
    return props.options.selected.indexOf(item.value) >= 0;
}

function selectedAllCurrentSelection(): boolean {
    return props.options.selected.length === props.options.selection.length;
}

function selectedSomeCurrentSelection(): boolean {
    return props.options.selected.length > 0 && !selectedAllCurrentSelection();
}

function headerIcon(): string{
    if (selectedAllCurrentSelection()) return 'ic:sharp-check-box';
    if (selectedSomeCurrentSelection()) return 'ic:sharp-indeterminate-check-box';
    return 'ic:sharp-check-box-outline-blank';
}

async function toggleSelection(){
    await nextTick();

    if (selectedAllCurrentSelection()){
        props.options.selected = [];
    } else {
        props.options.selected = props.options.selection.map(item => item.value);
    }
}

function selectItem(item: any): void{
    if(isItemSelected(item)){
        _remove(props.options.selected, (value) => value == item.value);
    } else {
        props.options.selected.push(item.value);
    }
}
</script>