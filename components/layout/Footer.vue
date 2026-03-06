<template>
    <footer class="pt-18">

        <div v-if="topRuleDivider" class="scaffold-border-top"></div>

        <div class="space-y-16 pt-16">

            <LandingLinks v-if="landingLinks" />

            <div v-if="navigationLinks.length" class="mx-auto max-w-screen-lg">

                <div class="flex flex-wrap gap-4">

                    <div v-for="navigationLink in navigationLinks" :key="navigationLink.key" class="flex-grow p-2 text-left">
                        <p class="text-lg font-medium font-business">
                            <NuxtLink
                                v-if="navigationLink.type == 'link'"
                                :to="navigationLink.to"
                                class="hover:underline">
                                {{navigationLink.title}}
                            </NuxtLink>
                            <span v-else>{{navigationLink.title}}</span>
                        </p>

                        <div v-if="navigationLink?.options && navigationLink.options.length > 0" class="mt-2 space-y-2 text-base">
                            <div v-for="subLink in navigationLink.options" :key="subLink.key">
                                <NuxtLink
                                    v-if="subLink.type == 'link'"
                                    :to="subLink.to"
                                    class="hover:underline">
                                    {{subLink.title}}
                                </NuxtLink>
                                <span v-else>{{subLink.title}}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="mx-auto max-w-screen-lg mb-4">

                <div class="p-2">
                    <div class="flex flex-row flex-wrap justify-start items-center">
                        <div class="w-max text-xl font-medium font-[Overpass] flex flex-row items-center gap-2">
                            Kunsel ERP<span class="text-sm font-serif">work in progress...</span>
                        </div>
                        <BreadCrumbs prefix-arrow :prefix-company="breadcrumbsPrefixCompany" />
                    </div>

                    <p class="mt-2 max-w-md text-base leading-relaxed sm:max-w-xs sm:text-left">
                        Flexible ERP designed for modern, cloud-powered businesses.
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

                <div class="mx-auto max-w-screen-xl flex justify-start ">
                    <div class="p-2 text-sm">
                        <div class="space-x-2">
                            <a class="inline-block hover:underline">
                                Kunsel ERP 2026
                            </a>
                            <span v-if="false">|</span>
                            <a v-if="false" class="inline-block hover:underline">
                                Terms & Conditions
                            </a>
                            <span v-if="false">|</span>
                            <a v-if="false" class="inline-block hover:underline">
                                Privacy Policy
                            </a>
                        </div>
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
    neutral: neutralColor
} = storeToRefs($themeStore);

const {
    navigationLinks,
} = useLayout();

defineProps({
    topRuleDivider: {
        type: Boolean,
        default: false,
    },
    landingLinks: {
        type: Boolean,
        default: false,
    },
    breadcrumbsPrefixCompany: {
        type: Boolean,
        default: false,
    },
});
</script>

<style scoped>

</style>