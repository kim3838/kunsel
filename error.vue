<template>
    <div class="nuxt-error-page mx-auto max-w-screen-2xl">
        <div class="p-4">
            <div class="my-4 text-xl font-header font-medium">
                <div v-if="props.error?.statusCode === 404">Not found</div>
                <div v-else-if="props.error?.statusCode === 403">Forbidden</div>
                <div v-else >Something went wrong</div>
            </div>
            <div class="my-4">
                <p>{{ errorUrl }}</p>
                <p>{{ errorDisplay }}</p>
            </div>
            <div class="text-sm flex flex-row gap-2" >
                <Button class="max-w-min inline-block" :size="'sm'" @click="handleError" :label="'Home'"/>
            </div>
        </div>
        <!-- Footer -->
        <LandingFooter/>
    </div>
</template>

<script setup lang="ts">
import {storeToRefs} from 'pinia';
import type { NuxtError } from '#app'

const {$themeStore} = useNuxtApp();
const coreStore = useCoreStore();
const {
    text: textColor,
} = storeToRefs($themeStore);

const props = defineProps({
    error: Object as () => NuxtError
})

const errorUrl = computed(()=>{
    return (props.error as NuxtError & { url?: string })?.url;
})

const errorDisplay = computed(()=>{
    return `Error ${props.error?.statusCode}: ${props.error?.statusMessage || props.error?.message}`;
})

const handleError = () => {
    coreStore.resetServiceError();
    clearError({ redirect: '/' });
};
const reload = () => window.location.reload();
</script>

<style>
.nuxt-error-page{
    color: v-bind(textColor);
}
</style>
