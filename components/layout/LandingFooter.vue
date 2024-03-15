<template>
    <footer :class="[enableScrollSnap ? 'tw-snap-start tw-snap-always' : '']">
        <div class="tw-mx-auto tw-max-w-screen-xl tw-px-4 tw-pb-6 tw-pt-16 sm:tw-px-6 lg:tw-px-8">
            <div class="tw-grid tw-grid-cols-1 lg:tw-grid-cols-4">
                <div>
                    <div class="tw-flex tw-justify-center lg:tw-justify-start">
                        <KettleFoods class="lg:tw-w-max tw-w-1/2"/>
                    </div>

                    <p v-if="false" class="tw-mt-5 tw-text-center tw-leading-relaxed sm:tw-max-w-md sm:tw-text-left">
                        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Incidunt
                        consequuntur amet culpa cum itaque neque.
                    </p>

                    <ul v-if="false" class="tw-mt-2 tw-flex tw-justify-center tw-gap-6 sm:tw-justify-start md:gap-8">
                        <li>
                            <a href="/" rel="noreferrer" target="_blank">
                                <ClientOnly><Icon class="tw-h-5 tw-w-5" name="mdi:facebook"></Icon></ClientOnly>
                            </a>
                        </li>
                        <li>
                            <a href="/" rel="noreferrer" target="_blank">
                                <ClientOnly><Icon class="tw-h-5 tw-w-5" name="mdi:instagram"></Icon></ClientOnly>
                            </a>
                        </li>
                        <li>
                            <a href="/" rel="noreferrer" target="_blank">
                                <ClientOnly><Icon class="tw-h-5 tw-w-5" name="mdi:youtube"></Icon></ClientOnly>
                            </a>
                        </li>
                    </ul>
                </div>

                <div class="tw-grid tw-grid-cols-1 tw-gap-2 tw-mt-8 lg:tw-mt-0 sm:tw-grid-cols-2 md:tw-grid-cols-5 lg:tw-col-span-3">
                    <div class="tw-text-center sm:tw-text-left md:tw-col-span-2">
                        <p class="tw-text-lg tw-font-medium tw-font-['Roboto']">Contact Us</p>

                        <div class="tw-mt-8 tw-space-y-2">
                            <UnorderedList
                                class="tw-flex sm:tw-justify-start tw-justify-center"
                                :size="'md'"
                                :icon="'ic:round-mail-outline'"
                                :label="'info@colorful-technology.com'"/>

                            <UnorderedList
                                class="tw-flex sm:tw-justify-start tw-justify-center"
                                :size="'md'"
                                :icon="'ic:sharp-phone'"
                                :label="'+63 99-1999-1991'"/>

                            <UnorderedList
                                class="tw-flex sm:tw-justify-start tw-justify-center"
                                :size="'md'"
                                :icon="'ic:sharp-location-on'"
                                :label="'Quezon City, Metro Manila, Philippines'"/>
                        </div>
                    </div>

                    <div class="tw-text-center tw-mt-12 sm:tw-text-left sm:tw-mt-0">
                        <p class="tw-text-lg tw-font-medium tw-font-['Roboto']">Our Services</p>

                        <div class="tw-mt-8 tw-space-y-2">

                            <UnorderedList
                                class="tw-flex sm:tw-justify-start tw-justify-center"
                                :size="'md'"
                                :label="'Custom Web Applications'"/>
                            <UnorderedList
                                class="tw-flex sm:tw-justify-start tw-justify-center"
                                :size="'md'"
                                :label="'Mobile Applications'"/>
                            <UnorderedList
                                class="tw-flex sm:tw-justify-start tw-justify-center"
                                :size="'md'"
                                :label="'Product Landing Page'"/>
                            <UnorderedList
                                class="tw-flex sm:tw-justify-start tw-justify-center"
                                :size="'md'"
                                :label="'E-Commerce Site'"/>
                        </div>
                    </div>

                    <div class="tw-text-center tw-mt-12 sm:tw-text-left md:tw-mt-0">
                        <p class="tw-text-lg tw-font-medium tw-font-['Roboto']">Helpful Links</p>

                        <div class="tw-mt-8 tw-space-y-2">

                            <UnorderedList
                                class="tw-flex sm:tw-justify-start tw-justify-center"
                                :size="'md'"
                                :icon="'ri:info-i'"
                                :label="'FAQs'"/>
                            <UnorderedList
                                class="tw-flex sm:tw-justify-start tw-justify-center"
                                :size="'md'"
                                :icon="'ri:info-i'"
                                :label="'Support'"/>
                            <UnorderedList
                                class="tw-flex sm:tw-justify-start tw-justify-center tw-overflow-visible"
                                :icon="'ri:info-i'"
                                :size="'md'">
                                <div class="tw-flex">
                                        <span class="tw-transition group-hover:tw-text-gray-700/75">
                                            Live Chat
                                        </span>
                                    <span class="tw-ml-1 tw-relative tw-flex tw-h-2 tw-w-2">
                                            <span class="tw-absolute tw-inline-flex tw-h-full tw-w-full tw-animate-ping tw-rounded-full ping-highlight tw-opacity-75"></span>
                                            <span class="tw-relative tw-inline-flex tw-h-2 tw-w-2 tw-rounded-full ping"></span>
                                        </span>
                                </div>
                            </UnorderedList>
                        </div>
                    </div>

                    <div class="tw-text-center tw-mt-12 sm:tw-text-left md:tw-mt-0">
                        <p class="tw-text-lg tw-font-medium tw-font-['Roboto']">About Us</p>

                        <div class="tw-mt-8 tw-space-y-2 tw-text-sm">

                            <UnorderedList
                                class="tw-flex sm:tw-justify-start tw-justify-center"
                                :size="'md'"
                                :icon="'ri:info-i'"
                                :label="'Company History'"/>
                            <UnorderedList
                                class="tw-flex sm:tw-justify-start tw-justify-center"
                                :size="'md'"
                                :icon="'ri:info-i'"
                                :label="'Meet the Team'"/>
                        </div>
                    </div>
                </div>
            </div>

            <div class="footer-rule tw-mt-2"></div>

            <div class="tw-pt-2 tw-mt-2">
                <div class="tw-text-center sm:tw-flex sm:tw-justify-between sm:tw-text-left">
                    <p class="tw-text-base">

                        <a class="tw-inline-block hover:tw-underline" href="/">
                            Terms & Conditions
                        </a>
                        <span>&nbsp;.&nbsp;</span>
                        <a class="tw-inline-block hover:tw-underline" href="/">
                            Privacy Policy
                        </a>
                    </p>
                    <p class="tw-mt-4 tw-text-base tw-flex tw-items-center tw-justify-center sm:tw-justify-start sm:tw-order-first sm:tw-mt-0">
                        <ClientOnly><Icon name="ic:sharp-copyright"></Icon></ClientOnly>
                        2024
                        &nbsp;
                        <span class="tw-block sm:tw-inline">All rights reserved.</span>
                    </p>
                </div>
            </div>
        </div>
    </footer>
</template>

<script setup lang="ts">
const {
    enableScrollSnap
} = useLayout();
</script>

<style scoped>

</style>