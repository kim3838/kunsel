<template>
    <div v-show="show" class="fixed inset-0 overflow-y-auto px-0 z-50">
        <div v-show="show" class="fixed inset-0" @click="close">
            <div class="absolute inset-0 modal-layer opacity-75"></div>
        </div>

        <div v-show="show" class="h-full flex items-center relative z-[60] w-full" :class="[modalContainerClass]">
            <div class="modal-body overflow-hidden mx-auto w-full" :class="[modalBodyClass]" :style="[widthStyle]">
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
            secondary: secondaryColor,
            neutral: neutralColor,
            body: bodyColor,
            thread: threadColor,
        } = storeToRefs($themeStore);

        return {
            primaryColor,
            secondaryColor,
            neutralColor,
            bodyColor,
            threadColor
        };
    },
    props: {
        landscape: {
            default: false
        },
        show: {
            default: false
        },
        maxWidth: {
            type: [String, null],
            default: null
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
        widthStyle() {

            if(this.landscape){
                return {};
            }

            return {
                'max-width': this.maxWidth ? this.maxWidth : 'max-content'
            }
        },
        modalBodyClass() {
            if(this.landscape){
                return '';
            } else {
                return 'rounded-sm';
            }
        },
        modalContainerClass() {
            if(this.landscape){
                return '';
            } else {
                return 'px-2'
            }
        },
    }
}
</script>
<style scoped>
.modal-layer{
    background-color: v-bind(secondaryColor);
}

.modal-body{
    background-color: v-bind(bodyColor);
}
</style>