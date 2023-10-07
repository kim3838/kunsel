<template>
    <div>
        <NuxtLayout :name="$coreStore.layout">
            <template #content>
                <div class="tw-mx-auto tw-max-w-screen-2xl tw-flex tw-justify-center">
                    <div v-if="true">
                        <div class="tw-my-4 tw-grid tw-grid-cols-2">
                            <div>
                                <label v-for="category in categorySelection" :key="category">
                                    <Checkbox v-model="category.value" :label="category.text" :size="'md'" />
                                </label>
                            </div>
                            <div class="tw-w-80">
                                <MultiSelectPaginated
                                    :selection-max-content="false"
                                    :selection-max-height="'280px'"
                                    :selection-float="false"
                                    :always-active="true"
                                    :active-border="$themeStore.thread"
                                    :label="'Select Prototypes'"
                                    :size="'md'"
                                    :options="category"
                                    :icon="'logos:aurora'"/>
                            </div>
                        </div>

                        <div class="tw-my-4 tw-h-[1px] tw-bg-gradient-to-r tw-from-transparent tw-via-neutral-400 tw-to-transparent"></div>

                        <InputWithIcon class="tw-my-4 tw-w-full" ref="inputValue" :size="size" :icon="'ic:sharp-qr-code'" :placeholder="'Enter value'" type="text" autocomplete="off" />
                        <div class="tw-my-4 tw-flex tw-justify-center tw-space-x-1.5 tw-flex-nowrap">
                            <Input ref="inputValue" :size="size" :placeholder="'Enter value'" type="text" autocomplete="off" />
                            <Button :size="size" :icon="icon" :variant="'flat'" :label="'Flat'" />
                            <InputWithIcon ref="inputValue" :size="size" :icon="icon" :placeholder="'Enter value'" :type="'text'" autocomplete="off" />
                        </div>
                        <div class="tw-my-4 tw-flex tw-justify-center tw-space-x-1.5">
                            <Button :size="size" :icon="icon" :label="'Default'" />
                            <Button :size="size" :icon="icon" :variant="'outline'" :label="'Outline'" />
                            <Button :size="size" :icon="icon" :variant="'flat'" :label="'Flat'" />
                            <Button :size="size" :icon="icon" :variant="'flat'" disabled :label="'Flat'" />
                        </div>
                    </div>
                </div>
            </template>
        </NuxtLayout>
    </div>
</template>

<script setup lang="ts">
import {ref, reactive, nextTick, onMounted} from "vue";

definePageMeta({
    layout: false,
    middleware: 'guest'
});
let size = ref('lg');
let icon = ref('simple-icons:googlecalendar');
let inputValue = ref(null);

let category = reactive({
    search: '',
    data: [
        {text : 'Charms', value: 0},
        {text : 'Bracelets', value: 1},
        {text : 'Brooches and Pins\nBrooches and Pins\nBrooches and Pins', value: 2},
        {text : 'Necklaces', value: 3},
        {text : 'Earrings', value: 4},
        {text : 'Rings', value: 5},
        {text : 'Polyester', value: 6},
    ],
    selection: [
        {text : 'Charms', value: 0},
        {text : 'Bracelets', value: 1},
        {text : 'Brooches and Pins\nBrooches and Pins\nBrooches and Pins', value: 2},
        {text : 'Necklaces', value: 3},
        {text : 'Earrings', value: 4},
        {text : 'Rings', value: 5},
        {text : 'Polyester', value: 6},
    ],
    selected: []
});
let categorySelection = reactive([
    {text : 'Charms', value: true},
    {text : 'Bracelets', value: true},
    {text : 'Brooches\nand\nPins', value: false},
    {text : 'Necklaces', value: true},
    {text : 'Earrings', value: false},
    {text : 'Rings', value: true},
    {text : 'Polyester', value: true},
]);

onMounted(async () => {
    nextTick(() => {
        inputValue.value.$refs.input.focus();
    });
})


</script>

<style scoped>
    #lab{
        height: calc(100vh - calc(41px) - calc(1rem));
    }
</style>