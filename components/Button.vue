<template>
    <button
        :disabled="disabled"
        :class="[heightClass, spacingClass, fontClass]"
        :type="type"
        class="
            tw-font-[Barlow]
            tw-inline-flex
            tw-items-center
            tw-bg-darker
            tw-rounded-sm
            tw-font-medium
            tw-tracking-wide
            tw-text-white
            hover:tw-bg-darker/90
            active:tw-bg-darker/90
            focus:tw-outline-none
            focus:tw-border-light
            focus:tw-ring
            focus:tw-ring-transparent
            disabled:tw-opacity-60
            tw-transition
            tw-relative">
        <div
            class="
                shade
                tw-rounded-sm
                tw-bg-gradient-to-br
                tw-bg-transparent
                tw-from-dark/90
                tw-via-transparent
                tw-to-dark/50"></div>
        <slot></slot>
    </button>
</template>

<script>
    export default {
        props: {
            type: {
                type: String,
                default: 'submit',
            },
            size: {
                default: null
            },
            disabled: {
                type: Boolean,
                default: false
            }
        },

        computed: {
            heightClass() {
                return {
                    [null]: 'tw-h-9',
                    'xs': 'tw-h-5',
                    'sm': 'tw-h-7',
                    'md': 'tw-h-8',
                    'lg': 'tw-h-10',
                    'xl': 'tw-h-14',
                }[this.size]
            },

            spacingClass() {
                return {
                    [null]: 'tw-px-2',
                    'xs': 'tw-px-1.5',
                    'sm': 'tw-px-1.5',
                    'md': 'tw-px-2',
                    'lg': 'tw-px-3',
                    'xl': 'tw-px-7',
                }[this.size]
            },

            fontClass(){
                return {
                    [null]: 'tw-text-base tw-tracking-tighter',
                    'xs': 'tw-text-xs',
                    'sm': 'tw-text-sm',
                    'md': 'tw-text-base tw-tracking-tighter',
                    'lg': 'tw-text-xl',
                    'xl': 'tw-text-3xl',
                }[this.size]
            }
        },
    }
</script>

<style scoped>
.shade{
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
}
</style>
