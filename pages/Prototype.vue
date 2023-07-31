<template>
    <div>
        <NuxtLayout name="custom">
            <template #content>
                <div class="tw-m-2 tw-p-2 tw-border tw-border-light">

                    <div>Tailwind Url: <NuxtLink class="tw-text-sky-600" :to="'_tailwind'" target="_blank">{{('http://localhost:3000' + '/_tailwind/')}}</NuxtLink></div>

                    <div class="tw-space-y-2">
                        <div class="tw-grid tw-gap-2 tw-grid-cols-1 sm:tw-grid-cols-2 lg:tw-grid-cols-5 xl:tw-grid-cols-6 2xl:tw-grid-cols-8">
                            <div class="tw-block tw-border tw-border-neutral-200">
                                <FormInputLabel :size="'md'" for="bootstrapDatePicker" value="Date" />
                                <FormInput
                                    :size="'md'"
                                    class="tw-w-full"
                                    type="text"
                                    id="bootstrapDatePicker"
                                    v-model="formStore.filters.date"
                                    autocomplete="off"
                                    :disabled="false" />
                            </div>
                            <div class="tw-block tw-border tw-border-neutral-200">
                                <FormInputLabel for="bootstrapDateTimePicker" value="DateTime" />
                                <FormInput
                                    :size="'md'"
                                    class="tw-w-full"
                                    type="text"
                                    id="bootstrapDateTimePicker"
                                    v-model="formStore.filters.dateTime"
                                    autocomplete="off"
                                    :disabled="false" />
                            </div>

                            <div class="tw-block tw-border tw-border-neutral-200">
                                <FormInputLabel for="bootstrapMonthPicker" value="Month" />
                                <FormInput
                                    :size="'md'"
                                    class="tw-w-full"
                                    type="text"
                                    id="bootstrapMonthPicker"
                                    v-model="formStore.filters.monthLabel"
                                    autocomplete="off"
                                    :disabled="false" />
                            </div>
                        </div>

                        <div class="tw-grid tw-gap-2 tw-grid-cols-1 sm:tw-grid-cols-2 lg:tw-grid-cols-5 xl:tw-grid-cols-6 2xl:tw-grid-cols-8">
                            <div class="tw-flex tw-items-start tw-justify-start tw-block tw-border tw-border-neutral-200">
                                <Button :height="'xs'"><span class="tw-font-semibold">XS Button</span></Button>
                            </div>
                            <div class="tw-flex tw-items-start tw-justify-start tw-block tw-border tw-border-neutral-200">
                                <Button :height="'sm'"><span class="tw-font-semibold">SM Authenticate</span></Button>
                            </div>
                            <div class="tw-flex tw-items-start tw-justify-start tw-block tw-border tw-border-neutral-200">
                                <Button :height="'md'"><span class="tw-font-semibold">MD Authenticate</span></Button>
                            </div>
                            <div class="tw-flex tw-items-start tw-justify-start tw-block tw-border tw-border-neutral-200">
                                <Button :disabled="true"><span class="tw-font-semibold">DEFAULT Disabled</span></Button>
                            </div>
                            <div class="tw-flex tw-items-start tw-justify-start tw-block tw-w-full tw-border tw-border-neutral-200">
                                <Button :height="'lg'"><span class="tw-font-bold">LG SKIP</span></Button>
                            </div>
                            <div class="tw-col-span-2 tw-flex tw-items-start tw-justify-start tw-block tw-w-full tw-border tw-border-neutral-200">
                                <Button :height="'xl'"><span class="tw-font-bold">XL Authenticate</span></Button>
                            </div>
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
});

const { $formStore} = useNuxtApp();
let formStore = $formStore;

bootDatetimePicker();

</script>