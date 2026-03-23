<template>
    <div class="mx-auto max-w-screen-lg">
        <div class="flex flex-wrap gap-2">
            <div class="grow p-2">
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
                        :icon="'ic:sharp-phone'"
                        :label="'+63 99161 80206'"/>

                    <UnorderedList
                        class="flex"
                        :size="listSize"
                        :icon="'ic:sharp-location-on'"
                        :label="'Quezon City, Metro Manila, Philippines'"/>
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