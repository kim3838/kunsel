<template>
    <div>
        <DefaultWrapper>
            <div class="mx-auto max-w-screen-2xl">

                <div class="my-20 flex justify-center">
                    <HeroLink><span class="font-business">Dashboard coming soon...</span></HeroLink>
                </div>

            </div>
        </DefaultWrapper>
    </div>
</template>

<script setup lang="ts">
definePageMeta({middleware: 'auth'});
useLayout().setNavigationMode('solid');
</script>

<style scoped>

</style>