<template>
    <div>
        <DefaultWrapper>
            <div class="tw-mx-auto tw-pt-4 tw-max-w-screen-2xl">
                Example page
            </div>
        </DefaultWrapper>
    </div>
</template>

<script setup lang="ts">
definePageMeta({middleware: 'auth'});
// await new Promise((resolve, reject)=>{
//     setTimeout(()=>{
//         resolve(1);
//     }, 2000);
// });
// await ssrFetch("/api/user", {
//     method: 'GET',
// });
useLayout().setNavigationMode('solid', 'Example.vue');
</script>