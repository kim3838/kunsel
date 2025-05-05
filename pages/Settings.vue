<template>
    <div>
        <DefaultWrapper>
            <div class="mx-auto max-w-screen-2xl">

                <!-- Payroll Settings -->
                <div class="space-y-2 my-4 p-[20px]  neutral-border">
                    <div class="grid grid-cols-12">
                        <div class="col-span-full font-medium text-xl font-header">Payroll</div>

                        <div class="col-span-12 grid grid-cols-subgrid">
                            <PayrollSettingsCompanyCompensation
                                class="col-start-2 col-span-full space-y-1"
                            />
                        </div>
                        <div class="col-span-12 grid grid-cols-subgrid">
                            <div class="col-start-2 col-span-full">
                                <div class="font-medium text-lg font-header">
                                    Employee Deductions
                                </div>
                            </div>
                        </div>
                        <div class="col-span-12 grid grid-cols-subgrid">
                            <div class="col-start-2 col-span-full">
                                <div class="font-medium text-lg font-header">
                                    Salary Statement Modules
                                </div>
                            </div>
                        </div>
                        <div class="col-span-12 grid grid-cols-subgrid">
                            <div class="col-start-2 col-span-full">
                                <div class="font-medium text-lg font-header">
                                    Pay Period Settings
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DefaultWrapper>
    </div>
</template>

<script setup lang="ts">
definePageMeta({middleware: 'auth'});
useLayout().setNavigationMode('solid', 'Settings.vue');
</script>

<style scoped lang="scss">

</style>