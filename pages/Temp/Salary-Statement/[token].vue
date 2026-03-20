<template>
    <div>
        <NoNavigationWrapper>
            <div class="mx-auto max-w-screen-2xl">

                <SalaryStatementBreakdown
                    class="pt-[20px]"
                    :salaryStatementFetchUrl="salaryStatementFetchUrl"
                    v-model:salary-statement-pending="salaryStatementPending" />
            </div>
        </NoNavigationWrapper>
    </div>
</template>

<script setup lang="ts">

useHead({titleTemplate: (titleChunk) => {return `Salary Statement`}});
definePageMeta({middleware: 'guest'});
useLayout().setNavigationMode('solid');

const route = useRoute();

const salaryStatementPending = ref(false);
const salaryStatementFetchUrl = ref(`/public/salary-statement/${route.params.token}`);
</script>

<style scoped>

</style>