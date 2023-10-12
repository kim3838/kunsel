<template>
    <div>
        <NuxtLayout :name="$coreStore.layout">
            <template #content>
                <div class="tw-mx-auto tw-max-w-screen-2xl tw-flex tw-justify-center">
                    <div v-if="true">
                        <div class="tw-my-4 tw-grid tw-gap-1 tw-grid-cols-2">
                            <div>
                                <AccentFrame class="tw-w-full">
                                    <template #content>
                                        <label v-for="category in categorySelection" :key="category">
                                            <Checkbox
                                                v-model="category.value"
                                                :label="category.text"
                                                :size="'lg'" />
                                        </label>
                                    </template>
                                </AccentFrame>
                            </div>
                            <div class="tw-w-80">
                                <AccentFrame class="tw-w-full">
                                    <template #content>
                                        <MultiSelectPaginated
                                            :selection-max-content="false"
                                            :selected-max-viewable-line="4"
                                            :selection-max-viewable-line="8"
                                            :selection-float="false"
                                            :searchable="false"
                                            :always-active="true"
                                            :active-border="$themeStore.thread"
                                            :label="'Select Prototypes'"
                                            :size="'lg'"
                                            :payload="prototypePayload"
                                            :icon="'logos:codio'"/>
                                    </template>
                                </AccentFrame>
                            </div>
                        </div>

                        <div class="tw-my-4 tw-h-[1px] tw-bg-gradient-to-r tw-from-transparent tw-via-neutral-400 tw-to-transparent"></div>

                        <AccentFrame class="tw-w-full">
                            <template #content>
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
                            </template>
                        </AccentFrame>
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

let prototypePayload = reactive({
    fetch: {
        url: '/api/selections/prototype',
        filters: {
            search: {
                keyword: '',//1239
                callback: 1
            }
        }
    },
    selected: [1992]//[1992, 1263, 1256]
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