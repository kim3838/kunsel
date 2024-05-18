<template>
    <div v-show="show" class="tw-fixed tw-inset-0 tw-overflow-y-auto tw-px-0 tw-z-50">
        <div v-show="show" class="tw-fixed tw-inset-0" @click="close">
            <div class="tw-absolute tw-inset-0 modal-layer tw-opacity-75"></div>
        </div>

        <div v-show="show" class="tw-h-full tw-flex tw-items-center thread-border">
            <div  class="modal-body tw-rounded-sm tw-overflow-hidden tw-w-full sm:tw-w-full sm:tw-mx-auto" :class="maxWidthClass">
                <slot></slot>
            </div>
        </div>
    </div>
</template>

<script>
import {storeToRefs} from 'pinia';

export default {
    setup(){
        const {$themeStore} = useNuxtApp();

        const {
            primary: primaryColor,
            neutral: neutralColor,
            body: bodyColor,
            thread: threadColor,
        } = storeToRefs($themeStore);

        return {
            primaryColor,
            neutralColor,
            bodyColor,
            threadColor
        };
    },
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
<style scoped>
.modal-layer{
    background-color: transparent;
}

.modal-body{
    background-color: v-bind(bodyColor);
    border: 1px solid v-bind(threadColor);
    filter:
        drop-shadow(v-bind(threadColor) 0px 0px 100px)
        drop-shadow(v-bind(threadColor) 0px 0px 50px);
}
</style>