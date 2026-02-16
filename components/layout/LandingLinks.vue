<template>
    <div class="mx-auto max-w-screen-lg">
        <div class="flex flex-wrap gap-2">
            <div class="grow p-2 scaffold-border">
                <p class="text-lg font-medium font-business">Contact Us</p>

                <div class="mt-2 space-y-2">
                    <UnorderedList
                        class="flex"
                        :size="listSize"
                        :icon="'ic:round-mail-outline'"
                        :label="'info@kunsel-erp.com'"/>

                    <UnorderedList
                        class="flex"
                        :size="listSize"
                        :icon="'ic:sharp-phone'"
                        :label="'880- 3892 18'"/>

                    <UnorderedList
                        class="flex"
                        :size="listSize"
                        :icon="'ic:sharp-location-on'"
                        :label="'Quezon City, Metro Manila, Philippines'"/>
                </div>
            </div>

            <div class="grow p-2 scaffold-border">
                <p class="text-lg font-medium font-business">Our Services</p>

                <div class="mt-2 space-y-2">

                    <UnorderedList
                        class="flex"
                        :size="listSize"
                        :label="'Cloud based ERP solution'"/>
                </div>
            </div>

            <div class="grow p-2 scaffold-border">
                <p  class="text-lg font-medium font-business">Helpful Links</p>

                <div class="mt-2 space-y-2">

                    <UnorderedList
                        class="flex"
                        :size="listSize"
                        :icon="'ph:arrow-up-right'"
                        :label="'FAQs'"/>
                    <UnorderedList
                        class="flex overflow-visible"
                        :icon="'ph:arrow-up-right'"
                        :size="listSize">
                        <div class="flex">
                            <a class="inline-block hover:underline" href="/">
                                    <span class="transition group-hover:text-gray-700/75">
                                        Support
                                    </span>
                            </a>

                            <span class="ml-1 relative flex h-2 w-2">
                                    <span class="absolute inline-flex h-full w-full animate-ping rounded-full ping-highlight opacity-75"></span>
                                    <span class="relative inline-flex h-2 w-2 rounded-full ping"></span>
                                </span>
                        </div>
                    </UnorderedList>
                </div>
            </div>

            <div class="grow p-2 scaffold-border">
                <p class="text-lg font-medium font-business">About Us</p>

                <div class="mt-2 space-y-2 text-sm">

                    <UnorderedList
                        class="flex"
                        :size="listSize"
                        :icon="'ph:arrow-up-right'"
                        :label="'News'"/>
                    <UnorderedList
                        class="flex"
                        :size="listSize"
                        :icon="'ph:arrow-up-right'"
                        :label="'History'"/>
                    <UnorderedList
                        class="flex"
                        :size="listSize"
                        :icon="'ph:arrow-up-right'"
                        :label="'Leadership'"/>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {storeToRefs} from "pinia";

const {$themeStore} = useNuxtApp();

const {
    primary: primaryColor,
    accent: accentColor,
} = storeToRefs($themeStore);

const listSize = ref('md');
</script>

<style scoped>
.ping{
    background-color: v-bind(primaryColor);
}

.ping-highlight{
    background-color: v-bind(accentColor);
}
</style>