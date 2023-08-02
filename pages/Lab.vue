<template>
    <div>
        <NuxtLayout name="custom">
            <template #content>
                <div id="lab" class="tw-m-2 tw-p-2 tw-border tw-border-light tw-flex tw-justify-center tw-items-center">
                    <div class="moody-card">
                        <div class="moody-card-frame"></div>
                        <div class="tw-relative tw-border tw-border-light tw-border-b-0 tw-p-3 tw-flex tw-justify-center tw-items-center">
                            Static MultiSelect
                        </div>
                        <div class="tw-relative tw-border tw-border-light tw-p-14 tw-pb-96">
                            <div class="tw-border tw-w-60 tw-p-[0.5rem] tw-border-slate-400/20">
                                <FormInputLabel :size="'md'" value="Label" />
                                <div class="tw-w-full tw-h-8 tw-flex tw-justify-start tw-border tw-border-neutral-200"><!--  -->
                                    <!-- Idle -->
                                    <div class="tw-w-12 tw-flex tw-justify-center tw-items-center"><!-- tw-border tw-border-[red] -->
                                        <Icon class="tw-h-7 tw-w-7" name="mdi:food-kosher"/>
                                    </div>
                                    <div class="tw-w-full tw-relative tw-cursor-pointer"><!-- tw-border tw-border-[green] -->
                                        <div class="tw-absolute tw-h-8 tw-pt-[9px] tw- tw-left-[0.2rem] tw-right-[2.2rem] tw-text-sm tw-leading-[0.875rem] tw-truncate"><!-- tw-border tw-border-[pink] -->
                                            None Selected, None Selected Selected
                                        </div>
                                        <div class="tw-absolute tw-right-0 tw-top-0 tw-w-8 tw-h-8 tw-flex tw-justify-center tw-items-center"><!-- tw-border tw-border-[red] -->
                                            <Icon class="tw-h-5 tw-w-5" name="ic:baseline-arrow-drop-down" />
                                        </div>
                                    </div>

                                    <!-- Clicked -->
                                    <FormInput
                                        v-if="false"
                                        class="tw-border-[transparent] tw-w-2/3"
                                        :size="'md'"
                                        type="text"
                                        v-model="inputData"
                                        autocomplete="off"
                                        :focusable="true"
                                        :disabled="false" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </NuxtLayout>
    </div>
</template>

<script setup lang="ts">

import { ref } from 'vue';

definePageMeta({
    layout: false,
});

let inputData = ref(null);
</script>

<style scoped>
    #lab{
        height: calc(100vh - calc(41px) - calc(1rem));
    }

    .moody-card{
        border: 1px solid silver;
        position: relative;
        margin: 24px;
    }

    .moody-card-frame{
        box-sizing: border-box;
        display: block;
        content: none;
    }

    .moody-card-frame:before{
        position: absolute;
        content: "";
        top: -8px;
        left: -9px;
        right: 7px;
        bottom: 7px;
        border: 1px solid silver;
        display: block;
    }

    .moody-card-frame:after{
        position: absolute;
        content: "";
        top: 7px;
        left: 7px;
        right: -9px;
        bottom: -8px;
        border: 1px solid silver;
        display: block;
    }
</style>