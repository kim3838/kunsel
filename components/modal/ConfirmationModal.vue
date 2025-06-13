<template>
    <Modal
        :show="show"
        :max-width="maxWidth"
        :closeable="closeable"
        @close="close">
        <div class="p-3 modal-body">
            <div class="sm:flex sm:items-start">
                <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 sm:hidden">
                    <Icon v-if="icon" class="h-full w-full" :name="icon"></Icon>
                </div>

                <div>
                    <div class="flex items-center justify-center gap-1">
                        <Icon v-if="icon" class="hidden sm:inline-block h-8 w-8" :name="icon"></Icon>
                        <h3 class="text-xl font-medium font-header">
                            <slot name="title"></slot>
                        </h3>
                    </div>

                    <div class="mt-1 text-base">
                        <slot name="content"></slot>
                    </div>
                </div>
            </div>
        </div>

        <div class="px-3 py-2.5">
            <slot name="footer">
            </slot>
        </div>
    </Modal>
</template>

<script>
import {storeToRefs} from 'pinia';

export default {
    setup(){
        const {$themeStore} = useNuxtApp();

        const {
            neutral: neutralColor,
        } = storeToRefs($themeStore);

        return {
            neutralColor
        };
    },
    props: {
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
        icon: {
            type: String,
            default: 'mdi:information-slab-symbol'
        }
    },

    methods: {
        close() {
            this.$emit('close')
        },
    }
}
</script>
<style scoped>

.modal-body{
    border-bottom:1px solid v-bind(neutralColor);
}
</style>