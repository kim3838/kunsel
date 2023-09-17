<template>
    <button
        ref="button"
        :disabled="disabled"
        :style="{'border-radius': '2px'}"
        :class="[heightClass, spacingClass, colorClass, borderClass]"
        :type="type"
        class="
            tw-font-[Barlow]
            tw-inline-flex
            tw-items-center
            tw-font-medium
            tw-tracking-wide
            tw-box-border
            focus:tw-outline-none
            focus:tw-border-light
            focus:tw-ring
            focus:tw-ring-transparent
            disabled:tw-opacity-60
            tw-transition
            tw-relative">
        <div :class="[shadeClass]" class="shade tw-rounded-sm"></div>
        <slot :fontClass="fontClass">
            <span class="tw-flex tw-items-center" :class="[fontClass]">
                <Icon v-if="icon?.trim()" :class="[iconClass, icon?.trim() ? 'tw-mr-0.5' : '']" :name="icon"></Icon><span>{{label}}</span>
            </span>
        </slot>
    </button>
</template>

<script>
    export default {
        props: {
            type: {
                type: String,
                default: 'submit',
            },
            variant: {
                type: String,
                default: 'default',
            },
            size: {
                default: 'md'
            },
            disabled: {
                type: Boolean,
                default: false
            },
            icon: {
                type: String,
                default: null,
            },
            label: {
                type: String,
                default: '',
            },
        },

        computed: {
            heightClass() {
                return {
                    '2xs': 'tw-h-5',
                    'xs': 'tw-h-6',
                    'sm': 'tw-h-7',
                    'md': 'tw-h-8',
                    'lg': 'tw-h-11',
                    'xl': 'tw-h-14',
                }[this.size]
            },

            spacingClass() {
                return {
                    '2xs': 'tw-px-1',
                    'xs': 'tw-px-1.5',
                    'sm': 'tw-px-1.5',
                    'md': 'tw-px-2',
                    'lg': 'tw-px-3',
                    'xl': 'tw-px-7',
                }[this.size]
            },

            iconClass(){
                return {
                    '2xs': 'tw-h-[0.875rem] tw-w-[0.875rem]',
                    'xs': 'tw-h-[1rem] tw-w-[1rem]',
                    'sm': 'tw-h-[1rem] tw-w-[1rem]',
                    'md': 'tw-h-[1.2rem] tw-w-[1.2rem] tw-mt-[0.2rem]',
                    'lg': 'tw-h-[1.875rem] tw-w-[1.875rem] tw-mt-[0.1rem]',
                    'xl': 'tw-h-[2.25rem] tw-w-[2.25rem] tw-mt-[0.1rem]',
                }[this.size]
            },

            fontClass(){
                return {
                    '2xs': 'tw-text-xs tw-font-semibold',
                    'xs': 'tw-text-xs tw-font-semibold',
                    'sm': 'tw-text-sm tw-font-semibold',
                    'md': 'tw-text-base tw-font-semibold tw-tracking-normal',
                    'lg': 'tw-text-2xl tw-font-black',
                    'xl': 'tw-text-3xl tw-font-black',
                }[this.size]
            },

            colorClass(){
                return {
                    'default': 'tw-bg-darker hover:tw-bg-darker/90 active:tw-bg-darker/90 tw-text-white',
                    'outline': this.disabled ? 'tw-bg-[#b4b4b4]/50' : 'tw-text-accent hover:tw-bg-darker hover:tw-text-white',
                }[this.variant]
            },

            borderClass(){
                return {
                    'default': '',
                    'outline': 'tw-border tw-border-[#b4b4b4]',
                }[this.variant]
            },

            shadeClass(){
                return {
                    'default': 'tw-bg-gradient-to-br tw-bg-transparent tw-from-dark/90 tw-via-transparent tw-to-dark/50',
                    'outline': this.disabled ? '' : 'hover:tw-bg-gradient-to-br hover:tw-bg-transparent hover:tw-from-dark/90 hover:tw-via-transparent hover:tw-to-dark/50',
                }[this.variant]
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
