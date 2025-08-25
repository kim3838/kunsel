<template>
    <footer>
        <div class="mt-24 footer-rule"></div>
        <div class="mx-auto max-w-screen-lg">

            <div class="flex flex-wrap gap-2">
                <div class="flex-grow p-6">
                    <p :class="headerClass">Contact Us</p>

                    <div class="mt-2 space-y-2">
                        <UnorderedList
                            class="flex"
                            :size="listSize"
                            :icon="'ic:round-mail-outline'"
                            :label="'info@host.com'"/>

                        <UnorderedList
                            class="flex"
                            :size="listSize"
                            :icon="'ic:sharp-phone'"
                            :label="'+63 99-1999-1991'"/>

                        <UnorderedList
                            class="flex"
                            :size="listSize"
                            :icon="'ic:sharp-location-on'"
                            :label="'Quezon City, Metro Manila, Philippines'"/>
                    </div>
                </div>

                <div class="flex-grow p-6">
                    <p :class="headerClass">Our Services</p>

                    <div class="mt-2 space-y-2">

                        <UnorderedList
                            class="flex"
                            :size="listSize"
                            :label="'Payroll System'"/>
                        <UnorderedList
                            class="flex"
                            :size="listSize"
                            :label="'Product/Services Landing Page'"/>
                    </div>
                </div>

                <div class="flex-grow p-6">
                    <p :class="headerClass">Helpful Links</p>

                    <div class="mt-2 space-y-2">

                        <UnorderedList
                            class="flex"
                            :size="listSize"
                            :icon="'ri:info-i'"
                            :label="'FAQs'"/>
                        <UnorderedList
                            class="flex overflow-visible"
                            :icon="'ri:info-i'"
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

                <div class="flex-grow p-6">
                    <p :class="headerClass">About Us</p>

                    <div class="mt-2 space-y-2 text-sm">

                        <UnorderedList
                            class="flex"
                            :size="listSize"
                            :icon="'ri:info-i'"
                            :label="'News'"/>
                        <UnorderedList
                            class="flex"
                            :size="listSize"
                            :icon="'ri:info-i'"
                            :label="'History'"/>
                        <UnorderedList
                            class="flex"
                            :size="listSize"
                            :icon="'ri:info-i'"
                            :label="'Leadership'"/>
                    </div>
                </div>

                <div class="p-6">
                    <div class="flex justify-start">
                        <p class="font-business text-2xl font-medium">
                            Kunsel
                        </p>
                    </div>

                    <p class="mt-6 max-w-md text-sm leading-relaxed sm:max-w-xs sm:text-left">
                        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Incidunt
                        consequuntur amet culpa cum itaque neque.
                    </p>

                    <ul class="mt-2 flex justify-start gap-2 sm:justify-start md:gap-4">
                        <li>
                            <a href="/" rel="noreferrer" target="_blank">
                                <Icon class="h-5 w-5" name="famicons:logo-facebook"></Icon>
                            </a>
                        </li>
                        <li>
                            <a href="/" rel="noreferrer" target="_blank">
                                <Icon class="h-5 w-5" name="famicons:logo-youtube"></Icon>
                            </a>
                        </li>
                        <li>
                            <a href="/" rel="noreferrer" target="_blank">
                                <Icon class="h-5 w-5" name="famicons:logo-tiktok"></Icon>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>

            <div class="mx-auto max-w-screen-lg flex justify-start ">
                <div class="p-6 text-sm">
                    <div class="space-x-2">
                        <a class="inline-block hover:underline" href="/">
                            &#169;Kunsel 2021. All rights reserved.
                        </a>
                        <span>|</span>
                        <a class="inline-block hover:underline" href="/">
                            Terms & Conditions
                        </a>
                        <span>|</span>
                        <a class="inline-block hover:underline" href="/">
                            Privacy Policy
                        </a>
                    </div>
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

const headerClass = ref('font-business text-lg font-medium"');
const listSize = ref('sm');
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