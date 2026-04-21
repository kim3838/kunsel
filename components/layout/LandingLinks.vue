<template>
    <div class="mx-auto max-w-screen-lg">
        <div class="flex flex-wrap justify-center gap-2">

            <div class="grow-0 grow p-2">
                <div class="font-medium font-header">Core Modules</div>

                <div class="mt-2 space-y-2">
                    <UnorderedList
                        class="flex"
                        :size="listSize"
                        :icon="'mdi:crowd'"
                        :label="'HR & payroll'"/>

                    <UnorderedList
                        class="flex"
                        :size="listSize"
                        :icon="'mdi:button-cursor'"
                        :label="'Employee self-service'"/>

                    <UnorderedList
                        class="flex"
                        :size="listSize"
                        :icon="'icon-park-outline:ad-product'"
                        :label="'Inventory & logistics'"/>

                    <UnorderedList
                        class="flex"
                        :size="listSize"
                        :icon="'mdi:finance'"
                        :label="'Finance'"/>

                    <UnorderedList
                        class="flex"
                        :size="listSize"
                        :icon="'icon-park-outline:coordinate-system'"
                        :label="'Point of sale'"/>
                </div>
            </div>

            <div class="grow-0 grow p-2">
                <div class="font-medium font-header">Support</div>

                <div class="mt-2 space-y-2">
                    <UnorderedList
                        class="flex"
                        :size="listSize"
                        :icon="'ic:round-mail-outline'"
                        :label="'support@kunsel-erp.com'"/>

                    <UnorderedList
                        class="flex"
                        :size="listSize"
                        :icon="'basil:viber-outline'"
                        :label="'viber: +63 9916180206'"/>
                </div>
            </div>

            <div class="grow-0 max-w-80 grow p-2">
                <div class="font-medium font-header">Contact Us</div>

                <div class="mt-2 space-y-2">
                    <UnorderedList
                        class="flex"
                        :size="listSize"
                        :icon="'ic:round-mail-outline'"
                        :label="'info@endeavier.com'"/>

                    <UnorderedList
                        class="flex"
                        :size="listSize"
                        :icon="'ic:sharp-location-on'"
                        :label="'41/F, Highlands Tower II, Pioneer West, Madison St. Mandaluyong City, Metro Manila, Philippines'"/>
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