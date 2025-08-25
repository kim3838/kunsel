<template>
    <footer>
        <div class="mt-24 footer-rule"></div>
        <div class="mx-auto max-w-screen-lg">
            <div class="flex flex-wrap gap-2">

                <div v-for="navigationLink in navigationLinks" :key="navigationLink.key" class="flex-grow p-6 text-center sm:text-left">
                    <p class="font-business text-lg font-medium">
                        <NuxtLink
                            v-if="navigationLink.type == 'link'"
                            :to="navigationLink.to"
                            class="hover:underline">
                            {{navigationLink.title}}
                        </NuxtLink>
                        <span v-else>{{navigationLink.title}}</span>
                    </p>

                    <div v-if="navigationLink?.options && navigationLink.options.length > 0" class="mt-2 space-y-2 text-sm">
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
    neutral: neutralColor
} = storeToRefs($themeStore);

const {
    navigationLinks,
} = useLayout();
</script>

<style scoped>
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