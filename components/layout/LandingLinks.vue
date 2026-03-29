<template>
    <div class="mx-auto max-w-screen-lg">
        <div class="flex flex-wrap justify-center gap-2">
            <div class="grow-0 neutral-border grow p-2">
                <ThemeHeader :type="'gray'" class="text-lg">Contact Us</ThemeHeader>

                <div class="mt-2 space-y-2">
                    <UnorderedList
                        class="flex"
                        :size="listSize"
                        :icon="'ic:round-mail-outline'"
                        :label="'info@kunsel-erp.com'"/>

                    <UnorderedList
                        class="flex"
                        :size="listSize"
                        :icon="'ic:sharp-location-on'"
                        :label="'Quezon City, Metro Manila, Philippines'"/>
                </div>
            </div>

            <div class="grow-0 neutral-border grow p-2">
                <ThemeHeader :type="'gray'" class="text-lg">Support</ThemeHeader>

                <div class="mt-2 space-y-2">
                    <UnorderedList
                        class="flex"
                        :size="listSize"
                        :icon="'ic:round-mail-outline'"
                        :label="'support@kunsel-erp.com'"/>

                    <UnorderedList
                        class="flex"
                        :size="listSize"
                        :icon="'ic:sharp-phone'"
                        :label="'+63 00000 00000'"/>
                </div>
            </div>

            <div class="grow-0 neutral-border grow p-2">
                <ThemeHeader :type="'gray'" class="text-lg">Core Modules</ThemeHeader>

                <div class="mt-2 space-y-2">
                    <UnorderedList
                        class="flex"
                        :size="listSize"
                        :icon="'icon-park-outline:coordinate-system'"
                        :label="'HR & payroll'"/>

                    <UnorderedList
                        class="flex"
                        :size="listSize"
                        :icon="'mdi:button-cursor'"
                        :label="'Employee self-service portal'"/>
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