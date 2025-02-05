<template>
    <div v-show="show" class="fixed inset-0 overflow-y-auto px-0 z-50">
        <div v-show="show" class="fixed inset-0" @click="close">
            <div class="absolute inset-0 modal-layer opacity-75"></div>
        </div>

        <div v-show="show" class="h-full flex items-center thread-border">
            <div  class="modal-body rounded-sm overflow-hidden w-full sm:w-full sm:mx-auto" :class="maxWidthClass">
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
                'sm': 'sm:max-w-sm',
                'md': 'sm:max-w-md',
                'lg': 'sm:max-w-lg',
                'xl': 'sm:max-w-xl',
                '2xl': 'sm:max-w-2xl',
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