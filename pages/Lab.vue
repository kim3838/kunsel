<template>
    <div>
        <NuxtLayout name="custom">
            <template #content>
                <div id="lab" class="tw-m-2 tw-p-2 tw-border tw-border-light tw-flex tw-justify-center tw-items-center">
                    <div class="moody-card">
                        <div class="moody-card-frame"></div>
                        <div class="tw-relative tw-border tw-border-light tw-border-b-0 tw-p-3 tw-flex tw-justify-center tw-items-center">
                            Static SingleSelect
                        </div>
                        <div class="tw-relative tw-border tw-border-light tw-p-14 tw-pb-96">
                            <div class="tw-border tw-w-60 tw-p-[0.5rem] tw-border-slate-400/20">
                                <FormInputLabel :size="'md'" value="Static Multi Select" />
                                <FormMultiSelect :size="'md'" :icon="'ic:sharp-hdr-on-select'" :options="category"/>
                            </div>
                            <div class="tw-border tw-w-60 tw-p-[0.5rem] tw-border-slate-400/20">
                                <FormInputLabel :size="'md'" value="Static Single Select" />
                                <FormSingleSelect :size="'md'" :icon="'ic:sharp-solar-power'" :options="plan"/>
                            </div>
                            <div class="tw-border tw-w-60 tw-p-[0.5rem] tw-border-slate-400/20">
                                <FormInputLabel :size="'md'" value="Static Multi Select" />
                                <FormMultiSelect :size="'md'" :icon="'ic:sharp-rsvp'" :options="status"/>
                            </div>
                            <FormInput
                                class="tw-w-full"
                                :size="'sm'"
                                type="text"
                                placeholder="SM Search..."
                                autocomplete="off"
                                :withBorder="true"
                                :rounded="false"
                                :focusRing="false"
                                :disabled="false" />
                            <FormInput
                                class="tw-w-full"
                                :size="'md'"
                                type="text"
                                placeholder="MD Search..."
                                autocomplete="off"
                                :withBorder="true"
                                :rounded="false"
                                :focusRing="true"
                                :disabled="false" />
                            <FormInput
                                class="tw-w-full"
                                :size="'lg'"
                                type="text"
                                placeholder="LG Search..."
                                autocomplete="off"
                                :withBorder="true"
                                :rounded="false"
                                :focusRing="true"
                                :disabled="false" />
                        </div>
                    </div>
                </div>
            </template>
        </NuxtLayout>
    </div>
</template>

<script setup lang="ts">

definePageMeta({
    layout: false,
    middleware: 'guest'
});

let category = reactive({
    search: '',
    data: [
        {text : 'Charms', value: 0},
        {text : 'Bracelets', value: 1},
        {text : 'Brooches and Pins', value: 2},
        {text : 'Necklaces', value: 3},
        {text : 'Earrings', value: 4},
        {text : 'Rings', value: 5},
        {text : 'Polyester', value: 6},
    ],
    selection: [
        {text : 'Charms', value: 0},
        {text : 'Bracelets', value: 1},
        {text : 'Brooches and Pins', value: 2},
        {text : 'Necklaces', value: 3},
        {text : 'Earrings', value: 4},
        {text : 'Rings', value: 5},
        {text : 'Polyester', value: 6},
    ],
    selected: []
});

let status = reactive({
    search: '',
    data: [
        {text : 'For Approval', value: 0},
        {text : 'Processing', value: 1},
        {text : 'Approved', value: 2},
        {text : 'Rejected', value: 3},
        {text : 'Complete', value: 4},
    ],
    selection: [
        {text : 'For Approval', value: 0},
        {text : 'Processing', value: 1},
        {text : 'Approved', value: 2},
        {text : 'Rejected', value: 3},
        {text : 'Complete', value: 4},
    ],
    selected: []
});

let plan = reactive({
    search: '',
    data: [
        {text : 'Free', value: 0},
        {text : 'Individual', value: 1},
        {text : 'Standard Corporate', value: 2},
        {text : 'Custom Corporate', value: 3},
        {text : 'Evaluator', value: 4}
    ],
    selection: [
        {text : 'Free', value: 0},
        {text : 'Individual', value: 1},
        {text : 'Standard Corporate', value: 2},
        {text : 'Custom Corporate', value: 3},
        {text : 'Evaluator', value: 4}
    ],
    selected: null
});

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