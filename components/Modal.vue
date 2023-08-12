<template>
    <transition leave-active-class="tw-duration-200">
        <div v-show="show" class="tw-fixed tw-inset-0 tw-overflow-y-auto tw-px-4 tw-py-6 sm:tw-px-0 tw-z-40">
            <transition
                enter-active-class="tw-ease-out tw-duration-300"
                enter-class="tw-opacity-0"
                enter-to-class="tw-opacity-100"
                leave-active-class="tw-ease-in tw-duration-200"
                leave-class="tw-opacity-100"
                leave-to-class="tw-opacity-0">
                <div v-show="show" class="tw-fixed tw-inset-0 tw-transform tw-transition-all" @click="close">
                    <div class="tw-absolute tw-inset-0 tw-bg-darker tw-opacity-75"></div>
                </div>
            </transition>

            <transition
                enter-active-class="tw-ease-out tw-duration-300"
                enter-class="tw-opacity-0 tw-translate-y-4 sm:tw-translate-y-0 sm:tw-scale-95"
                enter-to-class="tw-opacity-100 tw-translate-y-0 sm:tw-scale-100"
                leave-active-class="tw-ease-in tw-duration-200"
                leave-class="tw-opacity-100 tw-translate-y-0 sm:tw-scale-100"
                leave-to-class="tw-opacity-0 tw-translate-y-4 sm:tw-translate-y-0 sm:tw-scale-95">
                <div class="tw-h-full tw-flex tw-items-center">
                    <div v-show="show" class="tw-mb-6 tw-bg-white tw-rounded-sm tw-overflow-hidden tw-shadow-xl tw-transform tw-transition-all tw-w-full sm:tw-w-full sm:tw-mx-auto" :class="maxWidthClass">
                        <slot></slot>
                    </div>
                </div>
            </transition>
        </div>
    </transition>
</template>

<script>
    export default {
        props: {
            loading: {
                default: false
            },
            show: {
                default: false
            },
            maxWidth: {
                default: '2xl'
            },
            closeable: {
                default: true
            },
        },

        methods: {
            close() {
                if (this.closeable) {
                    this.$emit('close')
                }
            }
        },

        created() {

        },

        computed: {
            maxWidthClass() {
                return {
                    'sm': 'sm:tw-max-w-sm',
                    'md': 'sm:tw-max-w-md',
                    'lg': 'sm:tw-max-w-lg',
                    'xl': 'sm:tw-max-w-xl',
                    '2xl': 'sm:tw-max-w-2xl',
                }[this.maxWidth]
            }
        }
    }
</script>
