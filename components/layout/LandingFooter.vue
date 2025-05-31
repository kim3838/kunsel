<template>
    <footer>
        <div class="mx-auto max-w-screen-2xl px-4 pb-6 pt-16 sm:px-6 lg:px-8 scaffold-border-left-bottom-right">
            <div class="mx-auto max-w-screen-lg grid grid-cols-1 gap-2 mt-8 lg:mt-0 sm:grid-cols-2 md:grid-cols-5 lg:col-span-3">

                <div class="text-center sm:text-left md:col-span-2">
                    <p :class="headerClass">Contact Us</p>

                    <div class="mt-2 space-y-2">
                        <UnorderedList
                            class="flex sm:justify-start justify-center"
                            :size="'sm'"
                            :icon="'ic:round-mail-outline'"
                            :label="'info@globalfoundries.com'"/>

                        <UnorderedList
                            class="flex sm:justify-start justify-center"
                            :size="'sm'"
                            :icon="'ic:sharp-phone'"
                            :label="'+63 99-1999-1991'"/>

                        <UnorderedList
                            class="flex sm:justify-start justify-center"
                            :size="'sm'"
                            :icon="'ic:sharp-location-on'"
                            :label="'Quezon City, Metro Manila, Philippines'"/>
                    </div>
                </div>

                <div class="text-center mt-12 sm:text-left sm:mt-0">
                    <p :class="headerClass">Our Services</p>

                    <div class="mt-2 space-y-2">

                        <UnorderedList
                            class="flex sm:justify-start justify-center"
                            :size="'sm'"
                            :label="'Custom Web Services'"/>
                        <UnorderedList
                            class="flex sm:justify-start justify-center"
                            :size="'sm'"
                            :label="'Product Landing Page'"/>
                    </div>
                </div>

                <div class="text-center mt-12 sm:text-left md:mt-0">
                    <p :class="headerClass">Helpful Links</p>

                    <div class="mt-2 space-y-2">

                        <UnorderedList
                            class="flex sm:justify-start justify-center"
                            :size="'sm'"
                            :icon="'ri:info-i'"
                            :label="'FAQs'"/>
                        <UnorderedList
                            class="flex sm:justify-start justify-center overflow-visible"
                            :icon="'ri:info-i'"
                            :size="'sm'">
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

                <div class="text-center mt-12 sm:text-left md:mt-0">
                    <p :class="headerClass">About Us</p>

                    <div class="mt-2 space-y-2 text-sm">

                        <UnorderedList
                            class="flex sm:justify-start justify-center"
                            :size="'sm'"
                            :icon="'ri:info-i'"
                            :label="'News'"/>
                        <UnorderedList
                            class="flex sm:justify-start justify-center"
                            :size="'sm'"
                            :icon="'ri:info-i'"
                            :label="'History'"/>
                        <UnorderedList
                            class="flex sm:justify-start justify-center"
                            :size="'sm'"
                            :icon="'ri:info-i'"
                            :label="'Leadership'"/>
                    </div>
                </div>

            </div>

            <div class="footer-rule mt-2"></div>

            <div class="mx-auto max-w-screen-lg pt-2 mt-2">
                <div class="text-center sm:flex sm:justify-between sm:text-left">
                    <p class="text-sm">

                        <a class="inline-block hover:underline" href="/">
                            Terms & Conditions
                        </a>
                        <span>&nbsp;.&nbsp;</span>
                        <a class="inline-block hover:underline" href="/">
                            Privacy Policy
                        </a>
                    </p>
                    <p class="mt-4 text-sm flex items-center justify-center sm:justify-start sm:order-first sm:mt-0">
                        Copyright © GLOBAL FOUNDRIES inc.&nbsp;<span class="block sm:inline">All Rights Reserved.</span>
                    </p>
                </div>
            </div>
        </div>
    </footer>
</template>

<script setup lang="ts">
import {storeToRefs} from "pinia";

const {$themeStore} = useNuxtApp();

const {
    primary: primaryColor,
    accent: accentColor,
    neutral: neutralColor
} = storeToRefs($themeStore);

const headerClass = ref('font-business text-lg');
</script>

<style scoped>
.ping{
    background-color: v-bind(primaryColor);
}

.ping-highlight{
    background-color: v-bind(accentColor);
}

.footer-rule{
    height: 1px;
    width: 100%;
    background: linear-gradient(
        to right,
        transparent 0%,
        v-bind(neutralColor) 10%,
        v-bind(neutralColor) 90%,
        transparent 100%
    );
}
</style>