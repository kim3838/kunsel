<template>
    <div>
        <DefaultWrapper>
            <div class="mx-auto max-w-screen-2xl">

                <DialogModal
                    :max-width="'410px'"
                    :show="resolvedEmployeeModal"
                    :closeable="false">
                    <template #title>
                        {{resolvedEmployeeModalTitle}}
                    </template>
                    <template #content>

                        <div class="mt-4 space-y-2">
                            <fieldset class="neutral-border px-2 pb-2 space-y-2">
                                <legend class="font-header">{{_get(resolvedEmployee, 'user_id', false) ? 'User account details' : 'No user account'}}</legend>

                                <div v-if="_get(resolvedEmployee, 'user_id', false)">
                                    <table class="border-separate font-data">
                                        <tbody>
                                        <tr><td class="font-semibold">Username</td><td class="pl-2">{{ _get(resolvedEmployee, 'user.name', null) }}</td></tr>
                                        <tr><td class="font-semibold">Email</td><td class="pl-2">{{ _get(resolvedEmployee, 'user.email', null) }}</td></tr>
                                        </tbody>
                                    </table>

                                    <div v-if="employeeHasNewlyCreatedUser && _get(resolvedEmployee, 'user_id', false)" class="mt-4 text-sm">
                                        An email will be sent to the employee regarding of his account registration and login credentials.
                                    </div>
                                </div>

                            </fieldset>

                            <fieldset class="neutral-border px-2 pb-2 space-y-2">
                                <legend class="font-header">Employee details</legend>
                                <table class="border-separate font-data">
                                    <tbody>
                                    <tr><td class="font-semibold">Number</td><td class="pl-2">{{ _get(resolvedEmployee, 'number', null) }}</td></tr>
                                    <tr><td class="font-semibold">Full name</td><td class="pl-2">{{ _get(resolvedEmployee, 'full_name', null) }}</td></tr>
                                    </tbody>
                                </table>
                            </fieldset>
                        </div>
                    </template>
                    <template #footer>
                        <div class="flex space-x-2 justify-between">
                            <div class="space-x-2 inline-flex">

                            </div>
                            <div class="space-x-2 inline-flex items-center">
                                <Button :icon="'ic:sharp-keyboard-arrow-left'" @click="navigateTo({path: `/workforce/employees`, replace: true})" :label="'Back to employees'" />
                                <Button :icon="'mdi:plus'" :variant="'outline'" v-if="creatingEmployee" @click="resetPageToInitialState" :label="'Create another'" />
                            </div>
                        </div>
                    </template>
                </DialogModal>

                <div class="p-[20px] space-y-2">
                    <div class="flex">
                        <NuxtLink
                            :to="`/workforce/employees`">
                            <Button class="w-min" :variant="`outline`" :disabled="disableActions" :size="'sm'" :icon="disableActions ? 'eos-icons:loading' : 'ic:sharp-keyboard-arrow-left'" :label="disableActions ? 'Please wait' : ''"></Button>
                        </NuxtLink>
                    </div>

                    <div v-if="false">
                        validateForms: {{validateForms}}<br>
                        creatingEmployee: {{creatingEmployee}}<br>
                        employeeHasUser: {{employeeHasUser}}<br>
                        employeeHasNewlyCreatedUser: {{employeeHasNewlyCreatedUser}}<br>
                        employeeUserCreationOptionsDisabled: {{employeeUserCreationOptionsDisabled}}<br>
                        employeeHasContact: {{employeeHasContact}}<br>
                        employeeUserCreationOptions.selected: {{employeeUserCreationOptions.selected}}<br>
                        employeeId: {{employeeId}}<br>
                    </div>

                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <fieldset class="neutral-border px-2 pb-2 space-y-2">
                            <legend class="text-lg font-medium font-header">User Account</legend>
                            <div v-if="employeeHasUser">
                                <div class="flex gap-3">
                                    <div>
                                        <UnorderedList
                                            class="w-full font-data"
                                            :size="'md'"
                                            :label="'Username'"/>
                                        <UnorderedList
                                            class="w-full font-data"
                                            :icon="'ic:sharp-person-pin'"
                                            :size="'md'"
                                            :label="employee.user.name"/>
                                    </div>
                                    <div>
                                        <UnorderedList
                                            class="font-data"
                                            :icon="employee.user?.email_verified_at ? 'ic:sharp-verified-user' : 'mdi:security-close'"
                                            :size="'md'"
                                            :label="employee.user?.email_verified_at ? 'Email Verified' : 'Email Not Verified'"/>
                                        <UnorderedList
                                            class="w-full font-data"
                                            :icon="'ic:round-mail-outline'"
                                            :size="'md'"
                                            :label="employee.user.email"/>
                                    </div>
                                </div>
                            </div>
                            <div v-else class="space-y-4">
                                <RadioGroup
                                    :disabled="disableActions || employeeUserCreationOptionsDisabled"
                                    :selections="employeeUserCreationOptions.selection"
                                    :size="'md'"
                                    :orientation="employeeUserCreationOrientation"
                                    v-model="employeeUserCreationOptions.selected" />

                                <div v-if="employeeUserCreationOptions.selected == EMPLOYEE_USER_CREATION.AUTOGENERATED">
                                    <div>Auto generate user account as follows:</div>
                                    <br>
                                    <p><span class="font-semibold">Username:</span> (Family name in lowercase without space)(dot)(First letter of Given name in lowercase)(dot)(User nth)</p>
                                    <p><span class="font-semibold">Password:</span> Random 8 character password</p>
                                    <p><span class="font-semibold">Email:</span> Provided office email</p>
                                    <p><span class="font-semibold">Timezone:</span> Company Timezone</p>
                                </div>

                                <div v-if="employeeUserCreationOptions.selected == EMPLOYEE_USER_CREATION.EXISTING_USER" class="grid gap-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
                                    <div class="sm:col-span-2 lg:col-span-2">
                                        <InputLabel :size="'sm'" value="User"/>
                                        <SingleSelect :disabled="disableActions || employeeUserCreationOptionsDisabled" drop-shadow :size="'md'" :options="nonEmployeeUserOptions"/>
                                    </div>
                                </div>

                                <div v-if="employeeUserCreationOptions.selected == EMPLOYEE_USER_CREATION.MANUAL" class="grid gap-2 grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-3 xl:grid-cols-6">
                                    <div class="xl:col-span-2">
                                        <InputLabel :size="'sm'" value="Username *"/>
                                        <Input :disabled="disableActions" :size="'md'" v-model="employeeUsername" type="text"/>
                                    </div>
                                    <div class="xl:col-span-2">
                                        <InputLabel :size="'sm'" value="User email *"/>
                                        <Input :disabled="disableActions" :size="'md'" v-model="employeeUserEmail" type="email"/>
                                    </div>
                                    <div class="xl:col-span-2">
                                        <InputLabel :size="'sm'" value="Timezone *"/>
                                        <SingleSelect :icon="'stash:globe-timezone-solid'" :disabled="disableActions" value-persist drop-shadow :size="'md'" :options="employeeUserTimezoneOptions"/>
                                    </div>
                                    <div class="xl:col-span-2">
                                        <InputLabel :size="'sm'" value="Status"/>
                                        <SingleSelect :icon="'mdi:checkbook'" :disabled="disableActions" value-persist drop-shadow :size="'md'" :options="employeeUserStatusOptions"/>
                                    </div>
                                    <div class="xl:col-span-2">
                                        <InputLabel :size="'sm'" value="Password *"/>
                                        <Input :disabled="disableActions" :size="'md'" v-model="employeeUserPassword" type="password"/>
                                    </div>
                                    <div class="xl:col-span-2">
                                        <InputLabel :size="'sm'" value="Re-type Password *"/>
                                        <Input :disabled="disableActions" :size="'md'" v-model="employeeUserPasswordConfirmation" type="password"/>
                                    </div>
                                </div>
                            </div>
                        </fieldset>

                        <fieldset class="neutral-border px-2 pb-2 space-y-2">
                            <legend class="text-lg font-medium font-header">Contact</legend>

                            <div class="grid gap-2 grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-5 xl:grid-cols-6">
                                <div class="lg:col-span-2">
                                    <InputLabel :size="'sm'" :value="`Office email ${employeeUserCreationOptions.selected == EMPLOYEE_USER_CREATION.AUTOGENERATED ? '*' : ''}`"/>
                                    <InputWithIcon :disabled="disableActions" :icon="'ic:baseline-mail-outline'" :size="'md'" v-model="employeeOfficeEmail" type="email"/>
                                </div>
                                <div class="lg:col-span-2">
                                    <InputLabel :size="'sm'" value="Personal email"/>
                                    <InputWithIcon :disabled="disableActions" :icon="'ic:baseline-mail-outline'" :size="'md'" v-model="employeePersonalEmail" type="email"/>
                                </div>
                                <div class="hidden lg:block"></div>
                                <div class="lg:col-span-2">
                                    <InputLabel :size="'sm'" value="Office phone number"/>
                                    <InputWithIcon :disabled="disableActions" :icon="'ic:baseline-phone-android'" :size="'md'" v-model="employeeOfficePhone" type="text"/>
                                </div>
                                <div class="lg:col-span-2">
                                    <InputLabel :size="'sm'" value="Personal phone number"/>
                                    <InputWithIcon :disabled="disableActions" :icon="'ic:baseline-phone-android'" :size="'md'" v-model="employeePersonalPhone" type="text"/>
                                </div>
                            </div>
                        </fieldset>
                    </div>

                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <fieldset class="neutral-border px-2 pb-2 space-y-2">
                            <legend class="text-lg font-medium font-header">Employee Information</legend>

                            <div v-if="false">
                                <span class="font-semibold">Employee:</span> {{employee}}<br>
                                <span class="font-semibold">Child Component Employee Payload:</span> {{childComponentEmployeePayload}}<br>
                            </div>

                            <div class="grid gap-2 grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-4 xl:grid-cols-5">
                                <div>
                                    <InputLabel :size="'sm'" value="Employee number *"/>
                                    <Input :disabled="disableActions" :size="'md'" v-model="employeeNumber" type="text"/>
                                </div>
                            </div>

                            <div class="grid gap-2 grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-4 xl:grid-cols-5">
                                <div>
                                    <InputLabel :size="'sm'" value="Family name *"/>
                                    <Input :disabled="disableActions" :size="'md'" v-model="employeeFamilyName" type="text"/>
                                </div>
                                <div>
                                    <InputLabel :size="'sm'" value="Middle name"/>
                                    <Input :disabled="disableActions" :size="'md'" v-model="employeeMiddleName" type="text"/>
                                </div>
                                <div>
                                    <InputLabel :size="'sm'" value="Given name *"/>
                                    <Input :disabled="disableActions" :size="'md'" v-model="employeeGivenName" type="text"/>
                                </div>
                                <div>
                                    <InputLabel :size="'sm'" value="Gender"/>
                                    <SingleSelect :disabled="disableActions" drop-shadow value-persist :size="'md'" :options="genderOptions"/>
                                </div>
                                <div>
                                    <InputLabel :size="'sm'" value="Marital Status"/>
                                    <SingleSelect :disabled="disableActions" drop-shadow value-persist :size="'md'" :options="maritalStatusOptions"/>
                                </div>
                                <div>
                                    <InputLabel :size="'sm'" value="Birthdate *"/>
                                    <InputWithIcon
                                        :disabled="disableActions"
                                        :override="{font_family_class: 'font-sans'}"
                                        :icon="'mdi:calendar-cursor-outline'"
                                        :id="`datetime-birthdate-${route.params.id}`" v-model="employeeBirthdate" :size="'md'" />
                                </div>
                            </div>
                        </fieldset>

                        <fieldset class="neutral-border px-2 pb-2 space-y-2">
                            <legend class="text-lg font-medium font-header">Organization</legend>

                            <div class="grid gap-2 grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-5 xl:grid-cols-6">
                                <div class="lg:col-span-2">
                                    <InputLabel :size="'sm'" value="Department"/>
                                    <SingleSelect :icon="'ic:baseline-all-inbox'" :disabled="disableActions" drop-shadow :size="'md'" :options="departmentOptions"/>
                                </div>
                                <div class="lg:col-span-2">
                                    <InputLabel :size="'sm'" value="Designation"/>
                                    <SingleSelect :icon="'ic:baseline-inbox'" :disabled="disableActions" drop-shadow :size="'md'" :options="designationOptions"/>
                                </div>
                                <div class="hidden lg:block"></div>
                                <div class="col-span-2">
                                    <InputLabel :size="'sm'" value="Manager"/>
                                    <SingleSelectPaginated
                                        :disabled="disableActions"
                                        drop-shadow
                                        :selection-max-viewable-line="10"
                                        :label="'Select Manager'"
                                        :size="'md'"
                                        :icon="'mdi:badge-account-outline'"
                                        :payload="managerOptions"/>
                                </div>
                            </div>
                        </fieldset>
                    </div>

                    <PayrollComponentAssignmentModal
                        v-model:creatingOrEditing="creatingOrEditingPayrollComponent"
                        v-model:employeePayload="childComponentEmployeePayload"
                        v-model:editPayloadIndex="editPayrollComponentPayloadIndex"
                        v-model:editPayload="payrollComponentEditPayload"
                        v-model:payrollComponentFormulable="creatingOrEditingPayrollComponentFormulable"
                        :pay-frequency-selection="payFrequencySelection"
                        @resolved="payrollComponentResolved"
                    ></PayrollComponentAssignmentModal>

                    <fieldset class="neutral-border px-2 pb-2 space-y-2">
                        <legend class="text-lg font-medium font-header">Payroll Information</legend>

                        <div v-if="false">
                            <span class="font-semibold">Edit Payload Index:</span> {{editPayrollComponentPayloadIndex}}<br>
                        </div>

                        <div class="grid gap-2 grid-cols-1">
                            <fieldset class="neutral-border px-2 pb-2 space-y-2">
                                <legend class="text-sm">Compensations</legend>
                                <div v-if="false">
                                    <span class="font-semibold">Employee Compensations:</span> {{employeeCompensationData}}<br>
                                    <span class="font-semibold">Employee Compensations[1]:</span> {{employeeCompensationData[1]}}<br>
                                    <span class="font-semibold">Selected Employee Compensations:</span> {{selectedEmployeeCompensation}}<br>
                                </div>
                                <div class="inline-flex gap-2 items-center">
                                    <Button
                                        class="w-min"
                                        :variant=" 'outline'"
                                        :size="'sm'"
                                        :disabled="disableEmployeeCompensationActions"
                                        :icon="'mdi:plus'"
                                        @click="createOrEditPayrollComponent(FORMULABLE.EARNINGS)"/>
                                    <Button
                                        v-if="!creatingEmployee"
                                        class="w-min"
                                        :variant="'outline'"
                                        :size="'sm'"
                                        :icon="'mdi:delete-outline'"
                                        :disabled="disableEmployeeCompensationActions"
                                        @click="deleteSelectedPayrollComponent(FORMULABLE.EARNINGS)" />
                                    <Button
                                        v-if="!creatingEmployee"
                                        class="w-min"
                                        :variant="'outline'"
                                        :size="'sm'"
                                        :icon="'ic:sharp-restart-alt'"
                                        :disabled="disableEmployeeCompensationActions"
                                        @click="employeeCompensationExecute" />
                                </div>
                                <UnorderedList
                                    v-if="disableEmployeeCompensationActions"
                                    :icon="'eos-icons:loading'"
                                    :size="'md'"
                                    :label="'Please wait...'"/>
                                <DataTable
                                    :headers="employeeCompensationHeaders"
                                    :size="'lg'"
                                    :rows="employeeCompensationData"
                                    :disabled="disableEmployeeCompensationDataTable"
                                    v-model="selectedEmployeeCompensation"
                                    selection>
                                    <template v-slot:cell.action="{cell,slot, headerIndex, rowIndex}">
                                        <div class="h-full mx-0.5 space-x-0.5 w-full flex items-center">
                                            <Button
                                                v-if="creatingEmployee"
                                                class="w-min"
                                                :variant="'outline'"
                                                :size="slot.buttonSize"
                                                :disabled="disableEmployeeCompensationActions"
                                                :icon="'mdi:delete-forever'"
                                                @click="deletePayrollComponentRow(FORMULABLE.EARNINGS, rowIndex)"/>
                                            <Button
                                                class="w-min"
                                                :variant="'outline'"
                                                :size="slot.buttonSize"
                                                :disabled="disableEmployeeCompensationActions"
                                                :icon="'mdi:pen'"
                                                @click="createOrEditPayrollComponent(FORMULABLE.EARNINGS, cell, rowIndex)"/>
                                        </div>
                                    </template>
                                    <template v-slot:cell.name="{cell, slot, scrollReference}">
                                        <div class="p-[3px]">{{cell.payroll_componentable.name}}</div>
                                    </template>
                                    <template v-slot:cell.type="{cell, slot, scrollReference}">
                                        <div class="p-[3px]">{{cell.payroll_componentable.type?.text}}</div>
                                    </template>
                                    <template v-slot:cell.pay_period="{cell, slot, scrollReference}">
                                        <div class="p-[3px]">{{cell.pay_period?.text}}</div>
                                    </template>
                                    <template v-slot:cell.pay_type="{cell, slot, scrollReference}">
                                        <div class="p-[3px]">{{cell.pay_type?.text}}</div>
                                    </template>
                                    <template v-slot:cell.pay_frequency_code="{cell, slot, scrollReference}">
                                        <div class="p-[3px]">{{cell.pay_frequency?.code}}</div>
                                    </template>
                                    <template v-slot:cell.pay_frequency="{cell, slot, scrollReference}">
                                        <div class="p-[3px]">{{cell.pay_frequency?.type?.text}}</div>
                                    </template>
                                </DataTable>
                            </fieldset>
                        </div>

                        <div class="grid grid-cols-1 md:gap-2 grid-cols-1 lg:grid-cols-3">
                            <fieldset class="neutral-border px-2 pb-2 space-y-2">
                                <legend class="text-sm">Deductions</legend>
                                <div v-if="false">
                                    <span class="font-semibold">Employee Deductions:</span> {{employeeDeductionData}}<br>
                                    <span class="font-semibold">Employee Deductions[1]:</span> {{employeeDeductionData[1]}}<br>
                                    <span class="font-semibold">Selected Employee Deductions:</span> {{selectedEmployeeDeduction}}<br>
                                </div>
                                <div class="inline-flex gap-2 items-center">
                                    <Button
                                        class="w-min"
                                        :variant=" 'outline'"
                                        :size="'sm'"
                                        :disabled="disableEmployeeDeductionActions"
                                        :icon="'mdi:plus'"
                                        @click="createOrEditPayrollComponent(FORMULABLE.DEDUCTIONS)"/>
                                    <Button
                                        v-if="!creatingEmployee"
                                        class="w-min"
                                        :variant="'outline'"
                                        :size="'sm'"
                                        :icon="'mdi:delete-outline'"
                                        :disabled="disableEmployeeDeductionActions"
                                        @click="deleteSelectedPayrollComponent(FORMULABLE.DEDUCTIONS)" />
                                    <Button
                                        v-if="!creatingEmployee"
                                        class="w-min"
                                        :variant="'outline'"
                                        :size="'sm'"
                                        :icon="'ic:sharp-restart-alt'"
                                        :disabled="disableEmployeeDeductionActions"
                                        @click="employeeDeductionExecute" />
                                </div>
                                <UnorderedList
                                    v-if="disableEmployeeDeductionActions"
                                    :icon="'eos-icons:loading'"
                                    :size="'md'"
                                    :label="'Please wait...'"/>
                                <DataTable
                                    :headers="employeeDeductionHeaders"
                                    :size="'lg'"
                                    :rows="employeeDeductionData"
                                    :disabled="disableEmployeeDeductionDataTable"
                                    v-model="selectedEmployeeDeduction"
                                    selection>
                                    <template v-slot:cell.action="{cell,slot, headerIndex, rowIndex}">
                                        <div class="h-full mx-0.5 space-x-0.5 w-full flex items-center">
                                            <Button
                                                v-if="creatingEmployee"
                                                class="w-min"
                                                :variant="'outline'"
                                                :size="slot.buttonSize"
                                                :disabled="disableEmployeeDeductionActions"
                                                :icon="'mdi:delete-forever'"
                                                @click="deletePayrollComponentRow(FORMULABLE.DEDUCTIONS, rowIndex)"/>
                                            <Button
                                                class="w-min"
                                                :variant="'outline'"
                                                :size="slot.buttonSize"
                                                :disabled="disableEmployeeDeductionActions"
                                                :icon="'mdi:pen'"
                                                @click="createOrEditPayrollComponent(FORMULABLE.DEDUCTIONS, cell, rowIndex)"/>
                                        </div>
                                    </template>
                                    <template v-slot:cell.name="{cell, slot, scrollReference}">
                                        <div class="p-[3px]">{{cell.payroll_componentable.name}}</div>
                                    </template>
                                    <template v-slot:cell.type="{cell, slot, scrollReference}">
                                        <div class="p-[3px]">{{cell.payroll_componentable.type?.text}}</div>
                                    </template>
                                </DataTable>
                            </fieldset>

                            <fieldset class="lg:col-span-2 neutral-border px-2 pb-2 space-y-2">
                                <legend class="text-sm">Income Tax</legend>
                                <div v-if="false">
                                    <span class="font-semibold">Employee Income Taxes:</span> {{employeeIncomeTaxData}}<br>
                                    <span class="font-semibold">Employee Income Taxes[1]:</span> {{employeeIncomeTaxData[1]}}<br>
                                    <span class="font-semibold">Selected Employee Income Taxes:</span> {{selectedEmployeeIncomeTax}}<br>
                                </div>
                                <div class="inline-flex gap-2 items-center">
                                    <Button
                                        class="w-min"
                                        :variant=" 'outline'"
                                        :size="'sm'"
                                        :disabled="disableEmployeeIncomeTaxActions"
                                        :icon="'mdi:plus'"
                                        @click="createOrEditPayrollComponent(FORMULABLE.INCOME_TAX)"/>
                                    <Button
                                        v-if="!creatingEmployee"
                                        class="w-min"
                                        :variant="'outline'"
                                        :size="'sm'"
                                        :icon="'mdi:delete-outline'"
                                        :disabled="disableEmployeeIncomeTaxActions"
                                        @click="deleteSelectedPayrollComponent(FORMULABLE.INCOME_TAX)" />
                                    <Button
                                        v-if="!creatingEmployee"
                                        class="w-min"
                                        :variant="'outline'"
                                        :size="'sm'"
                                        :icon="'ic:sharp-restart-alt'"
                                        :disabled="disableEmployeeIncomeTaxActions"
                                        @click="employeeIncomeTaxExecute" />
                                </div>
                                <UnorderedList
                                    v-if="disableEmployeeIncomeTaxActions"
                                    :icon="'eos-icons:loading'"
                                    :size="'md'"
                                    :label="'Please wait...'"/>
                                <DataTable
                                    :headers="employeeIncomeTaxHeaders"
                                    :size="'lg'"
                                    :rows="employeeIncomeTaxData"
                                    :disabled="disableEmployeeIncomeTaxDataTable"
                                    v-model="selectedEmployeeIncomeTax"
                                    selection>
                                    <template v-slot:cell.action="{cell,slot, headerIndex, rowIndex}">
                                        <div class="h-full mx-0.5 space-x-0.5 w-full flex items-center">
                                            <Button
                                                v-if="creatingEmployee"
                                                class="w-min"
                                                :variant="'outline'"
                                                :size="slot.buttonSize"
                                                :disabled="disableEmployeeIncomeTaxActions"
                                                :icon="'mdi:delete-forever'"
                                                @click="deletePayrollComponentRow(FORMULABLE.INCOME_TAX, rowIndex)"/>
                                            <Button
                                                class="w-min"
                                                :variant="'outline'"
                                                :size="slot.buttonSize"
                                                :disabled="disableEmployeeIncomeTaxActions"
                                                :icon="'mdi:pen'"
                                                @click="createOrEditPayrollComponent(FORMULABLE.INCOME_TAX, cell, rowIndex)"/>
                                        </div>
                                    </template>
                                    <template v-slot:cell.name="{cell, slot, scrollReference}">
                                        <div class="p-[3px]">{{cell.payroll_componentable.name}}</div>
                                    </template>
                                    <template v-slot:cell.type="{cell, slot, scrollReference}">
                                        <div class="p-[3px]">{{cell.payroll_componentable.type?.text}}</div>
                                    </template>
                                </DataTable>
                            </fieldset>
                        </div>
                    </fieldset>

                    <div class="grid gap-2 grid-cols-4 sm:grid-cols-5 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8">
                        <Button class="w-min" :disabled="disableActions" @click="coreFormSubmit(null, {})" :size="'md'" :icon="disableActions ? 'eos-icons:loading' : 'mdi:data'" :label="coreFormSubmitLabel"></Button>
                    </div>
                </div>
            </div>
        </DefaultWrapper>
    </div>
</template>

<script setup lang="ts">
import {storeToRefs} from "pinia";
import type {TableHeaderT} from "@/public/js/types/data";
import type {SelectionOptionsT} from "@/public/js/types/form";

useLayout().setNavigationMode('solid', 'Employees/[id].vue');

const route = useRoute();
const {timezoneSelections} = useCommon();
const {screenWidthBreakpoint, width: screenWidth} = useScreen();
const {isAuthenticated} = useAuth();
const {$authStore, $associationStore, $moment} = useNuxtApp();
const clientReadyState = useClientReadyState();
const {
    updatedAssociatedCompanyFlag
} = storeToRefs($associationStore);
const {
    selectedAssociatedCompanyId,
    selectedAssociatedCompany
} = storeToRefs($authStore);
const employee = ref(null);
const employeeHasUser = computed(() => {
    return _get(employee.value, 'user_id', null) !== null;
});
const employeeHasNewlyCreatedUser = ref(false);
const employeeHasContact = ref(false);
const creatingEmployee = computed(() => {
    return route.params.id === 'create-employee';
});

const childComponentEmployeePayload = computed(() => {
   return {
       'id': _get(employee.value, 'id', null),
       'ulid': _get(employee.value, 'ulid', null),
   };
});

definePageMeta({
    middleware: ['auth', 'admin-of-selected-company',
        async (to) => {

            if(import.meta.server || to.params.id === 'create-employee'){return true;}

            const {data, error} = await laraUseFetch(`/api/employee-check/${to.params.id}`, {method: 'GET',}, {}, false);

            if(_isEmpty(data.value) && !_isEmpty(error.value)){
                let responseCode = _get(error.value, 'data.code', null);

                throw createError({ statusCode: responseCode, statusMessage: useCoreStore().servicePayloadMessage, fatal: true});
            }
        }
    ]
});

const employeeUserCreationOptionsDisabled = ref(false);
const employeeUserCreationOptions = reactive<{
    selection: Array<{text: string, value: number}>;
    selected: number | null;
}>({
    selection: [
        {text : 'No user', value: EMPLOYEE_USER_CREATION.NONE},
        {text : 'Auto-generate', value: EMPLOYEE_USER_CREATION.AUTOGENERATED},
        {text : 'Link existing account', value: EMPLOYEE_USER_CREATION.EXISTING_USER},
        {text : 'Manual', value: EMPLOYEE_USER_CREATION.MANUAL},
    ],
    selected: null
});
if(creatingEmployee.value){
    employeeUserCreationOptions.selected = EMPLOYEE_USER_CREATION.NONE;
}
const employeeUserCreationOrientation = computed(() => {
    return screenWidth.value >= screenWidthBreakpoint['md'] ? 'horizontal' : 'vertical';
})
watch(() => employeeUserCreationOptions.selected, employeeUserCreationType => {
    nonEmployeeUserOptions.selected = null;

    if(employeeUserCreationType == EMPLOYEE_USER_CREATION.MANUAL){
        employeeUsername.value = '';
        employeeUserEmail.value = '';
        employeeUserPassword.value = '';
        employeeUserPasswordConfirmation.value = '';
        employeeUserTimezoneOptions.selected = selectedAssociatedCompany?.value?.payload.timezone ?? null;
        employeeUserStatusOptions.selected = USER_STATUS.ACTIVE;
    } else {
        employeeUsername.value = '';
        employeeUserEmail.value = '';
        employeeUserPassword.value = '';
        employeeUserPasswordConfirmation.value = '';
        employeeUserTimezoneOptions.selected = null;
        employeeUserStatusOptions.selected = USER_STATUS.ACTIVE;
    }
});

//User Profile
const employeeUsername = ref('');
const employeeUserEmail = ref('');
const employeeUserPassword = ref('');
const employeeUserPasswordConfirmation = ref('');
const employeeUserStatusOptions = reactive({
    search: '',
    selection: [
        {text : 'Active', value: USER_STATUS.ACTIVE},
        {text : 'Inactive', value: USER_STATUS.INACTIVE},
    ],
    selected: USER_STATUS.ACTIVE
});
const employeeUserTimezoneOptions = reactive<SelectionOptionsT>({
    search: '',
    selection: timezoneSelections.value,
    selected: null
});

const nonEmployeeUsersPending = ref(false);
const nonEmployeeUserOptions = reactive({
    search: '',
    selection: [],
    selected: null
});
watch(() => nonEmployeeUserOptions.selected, newValue => {
    const selectedUser = _find(nonEmployeeUserOptions.selection, {value: newValue});

    if(!selectedUser || employeeOfficeEmail.value)return;

    employeeOfficeEmail.value = _get(selectedUser, 'payload.email', '');
});
const nonEmployeeUsersExecute = async () => {

    if(import.meta.server){return;}

    nonEmployeeUsersPending.value = true;

    await laraFetch("/api/non-employee-user-selections", {
        method: 'GET',
        params: {
            filters: {
                'companies': [selectedAssociatedCompanyId.value],
                'status': [USER_STATUS.ACTIVE]
            }
        }
    }, {
        onRequestError: () => {
            nonEmployeeUsersPending.value = false;
        },
        onResponse: () => {
            nonEmployeeUsersPending.value = false;
        },
        onSuccessResponse: async (request, options, response) => {
            nonEmployeeUserOptions.selection = _get(response, '_data.values.selection', []);
        }
    });
}
await nonEmployeeUsersExecute();

//Employee Contact
const employeeOfficeEmail = ref('');
const employeePersonalEmail = ref('');
const employeeOfficePhone = ref('');
const employeePersonalPhone = ref('');

//Employee Information
const employeeId = ref(null);
const employeeNumber = ref('');
const employeeFamilyName = ref('');
const employeeMiddleName = ref('');
const employeeGivenName = ref('');
const genderOptions = reactive({
    search: '',
    selection: [
        {text : 'Not Specified', value: GENDER.NOT_SPECIFIED},
        {text : 'Male', value: GENDER.MALE},
        {text : 'Female', value: GENDER.FEMALE},
    ],
    selected: GENDER.NOT_SPECIFIED
});
const maritalStatusOptions = reactive({
    search: '',
    selection: [
        {text : 'Not Specified', value: MARITAL_STATUS.NOT_SPECIFIED},
        {text : 'Single', value: MARITAL_STATUS.SINGLE},
        {text : 'Married', value: MARITAL_STATUS.MARRIED},
        {text : 'Widowed', value: MARITAL_STATUS.WIDOWED},
        {text : 'Divorced', value: MARITAL_STATUS.DIVORCED},
        {text : 'Separated', value: MARITAL_STATUS.SEPARATED},
    ],
    selected: MARITAL_STATUS.NOT_SPECIFIED
});
const employeeBirthdate = ref('1990-01-01');

//Employee Organization
const departmentOptions = reactive({
    search: '',
    selection: [],
    selected: null
});
const designationOptions = reactive({
    search: '',
    selection: [],
    selected: null
});

const designationsPending = ref(false);
const designationsExecute = async () => {

    if(import.meta.server){return;}

    designationsPending.value = true;

    await laraFetch("/api/designation-selections", {
        method: 'GET',
        params: {
            filters: {
                'company_id': selectedAssociatedCompanyId.value,
            }
        }
    }, {
        onRequestError: () => {
            designationsPending.value = false;
        },
        onResponse: () => {
            designationsPending.value = false;
        },
        onSuccessResponse: async (request, options, response) => {
            designationOptions.selection = _get(response, '_data.values.selection', []);
        }
    });
}
await designationsExecute();

const departmentsPending = ref(false);
const departmentsExecute = async () => {

    if(import.meta.server){return;}

    departmentsPending.value = true;

    await laraFetch("/api/department-selections", {
        method: 'GET',
        params: {
            filters: {
                'company_id': selectedAssociatedCompanyId.value,
            }
        }
    }, {
        onRequestError: () => {
            departmentsPending.value = false;
        },
        onResponse: () => {
            departmentsPending.value = false;
        },
        onSuccessResponse: async (request, options, response) => {
            departmentOptions.selection = _get(response, '_data.values.selection', []);
        }
    });
}
await departmentsExecute();
const tempSelectedManager = ref(null);

//Fetch Employee Information
const fetchEmployee = async () => {

    if(import.meta.server){return;}

    await laraFetch(`/api/employee/${route.params.id}`, {
        method: 'GET',
    }, {
        onSuccessResponse: async (request, options, response) => {
            employee.value = _get(response, '_data.values.employee', null);
            employeeId.value = _get(response, '_data.values.employee.id', null);
            employeeNumber.value = _get(response, '_data.values.employee.number', '');
            employeeFamilyName.value = _get(response, '_data.values.employee.family_name', '');
            employeeMiddleName.value = _get(response, '_data.values.employee.middle_name', '');
            employeeGivenName.value = _get(response, '_data.values.employee.given_name', '');
            employeeBirthdate.value = _get(response, '_data.values.employee.birth_date', '1990-01-01');
            genderOptions.selected = _get(response, '_data.values.employee.gender.value', GENDER.NOT_SPECIFIED);
            maritalStatusOptions.selected = _get(response, '_data.values.employee.marital_status.value', MARITAL_STATUS.NOT_SPECIFIED);
            departmentOptions.selected = _get(response, '_data.values.employee.department_id', null);
            designationOptions.selected = _get(response, '_data.values.employee.designation_id', null);
            tempSelectedManager.value = _get(response, '_data.values.employee.manager_id', null);

            //Set user profile creation options to null if user_id exists
            employeeUserCreationOptions.selected = _get(response, '_data.values.employee.user_id', false) ? null : EMPLOYEE_USER_CREATION.NONE;
        },
    });
};

//Fetch Employee Contact Information
const fetchEmployeeContact = async () => {

    if(import.meta.server){return;}

    await laraFetch(`/api/employee-contact/${employee?.value?.id}`, {
        method: 'GET',
    }, {
        onSuccessResponse: async (request, options, response) => {
            employeeHasContact.value = Boolean(_get(response, '_data.values.employee_contact.id', null));
            employeeOfficeEmail.value = _get(response, '_data.values.employee_contact.office_email', '');
            employeePersonalEmail.value = _get(response, '_data.values.employee_contact.personal_email', '');
            employeeOfficePhone.value = _get(response, '_data.values.employee_contact.office_phone', '');
            employeePersonalPhone.value = _get(response, '_data.values.employee_contact.personal_phone','');
        },
    });
};
if(!creatingEmployee.value){
    await fetchEmployee();
    await fetchEmployeeContact();
}

const managerOptions = reactive({
    fetch: {
        url: '/api/employee-selections',
        filters: {
            'company_id': selectedAssociatedCompanyId.value,
            'except_id': _without([employeeId.value], null),
            search: {
                keyword: '',
                callback: 1
            }
        }
    },
    selected: tempSelectedManager.value,
});

const payFrequencySelection = ref([]);
const fetchPayFrequencySelection = async () => {

    if(import.meta.server){return;}

    await laraFetch("/api/pay-frequency-selections", {
        method: 'GET',
        params: {
            filters: {
                'company_id': selectedAssociatedCompanyId.value,
            }
        }
    },{
        onSuccessResponse: async (request, options, response) => {
            payFrequencySelection.value = _get(response, '_data.values.selection', []);
        }
    });
}
await fetchPayFrequencySelection();

watch(updatedAssociatedCompanyFlag, (newValue) => {
    if(isAuthenticated.value && selectedAssociatedCompanyId.value){
        navigateTo("/workforce/employees", {replace: true});
    }
});

const creatingOrEditingPayrollComponent = ref(false);
const deletingPayrollComponent = ref(false);
const creatingOrEditingPayrollComponentFormulable = ref<number | undefined>(undefined);
const editPayrollComponentPayloadIndex = ref(-1);
const payrollComponentEditPayload = ref({});
const createOrEditPayrollComponent = (payrollComponent: number, payrollComponentAttributes = {}, rowIndex = -1) => {
    creatingOrEditingPayrollComponent.value = true;
    if(creatingEmployee.value){
        editPayrollComponentPayloadIndex.value = rowIndex;
    }
    creatingOrEditingPayrollComponentFormulable.value = payrollComponent;

    payrollComponentEditPayload.value = payrollComponentAttributes;
};

//Employee Compensation DataTable
const employeeCompensationHeaders = reactive<TableHeaderT[]>([
    { text: '', value: 'action'},
    { text: 'Compensation', value: 'name'},
    { text: 'Type', value: 'type'},
    { text: 'Amount', value: 'amount', alignData: 'right'},
    { text: 'Currency', value: 'currency'},
    { text: 'Pay Period', value: 'pay_period'},
    { text: 'Pay Type', value: 'pay_type'},
    { text: 'Pay Frequency Code', value: 'pay_frequency_code'},
    { text: 'Pay Frequency', value: 'pay_frequency'},
]);

const employeeCompensationData = ref([]);
const selectedEmployeeCompensation = ref([]);
const employeeCompensationPending = ref(false);
const employeeCompensationExecute = async () => {

    if(import.meta.server || creatingEmployee.value){return;}

    employeeCompensationPending.value = true;

    await laraFetch(`/api/employee-payroll-info/${route.params.id}/compensations`, {
        method: 'GET',
    },{
        onRequestError: () => {
            employeeCompensationPending.value = false;
        },
        onResponse: () => {
            employeeCompensationPending.value = false;
        },
        onSuccessResponse: async (request, options, response) => {
            employeeCompensationData.value = _get(response, '_data.values.compensations', []);
        }
    });
}
await employeeCompensationExecute();

const disableEmployeeCompensationActions = computed(() => {
    return employeeCompensationPending.value || creatingOrEditingPayrollComponent.value || deletingPayrollComponent.value || disableActions.value;
});
const disableEmployeeCompensationDataTable = computed(() => {
    return employeeCompensationPending.value || creatingOrEditingPayrollComponent.value || deletingPayrollComponent.value || disableActions.value;
});

//Employee Deduction DataTable
const employeeDeductionHeaders = reactive<TableHeaderT[]>([
    { text: '', value: 'action'},
    { text: 'Deduction', value: 'name'},
    { text: 'Type', value: 'type'},
]);

const employeeDeductionData = ref([]);
const selectedEmployeeDeduction = ref([]);
const employeeDeductionPending = ref(false);
const employeeDeductionExecute = async () => {

    if(import.meta.server || creatingEmployee.value){return;}

    employeeDeductionPending.value = true;

    await laraFetch(`/api/employee-payroll-info/${route.params.id}/deductions`, {
        method: 'GET',
    },{
        onRequestError: () => {
            employeeDeductionPending.value = false;
        },
        onResponse: () => {
            employeeDeductionPending.value = false;
        },
        onSuccessResponse: async (request, options, response) => {
            employeeDeductionData.value = _get(response, '_data.values.deductions', []);
        }
    });
}
await employeeDeductionExecute();
const disableEmployeeDeductionActions = computed(() => {
    return employeeDeductionPending.value || creatingOrEditingPayrollComponent.value || deletingPayrollComponent.value || disableActions.value;
});
const disableEmployeeDeductionDataTable = computed(() => {
    return employeeDeductionPending.value || creatingOrEditingPayrollComponent.value || deletingPayrollComponent.value || disableActions.value;
})

//Employee Income Tax DataTable
const employeeIncomeTaxHeaders = reactive<TableHeaderT[]>([
    { text: '', value: 'action'},
    { text: 'Tax', value: 'name'},
    { text: 'Type', value: 'type'},
]);

const employeeIncomeTaxData = ref([]);
const selectedEmployeeIncomeTax = ref([]);
const employeeIncomeTaxPending = ref(false);
const employeeIncomeTaxExecute = async () => {

    if(import.meta.server || creatingEmployee.value){return;}

    employeeIncomeTaxPending.value = true;

    await laraFetch(`/api/employee-payroll-info/${route.params.id}/income-taxes`, {
        method: 'GET',
    },{
        onRequestError: () => {
            employeeIncomeTaxPending.value = false;
        },
        onResponse: () => {
            employeeIncomeTaxPending.value = false;
        },
        onSuccessResponse: async (request, options, response) => {
            employeeIncomeTaxData.value = _get(response, '_data.values.income_taxes', []);
        }
    });
}
await employeeIncomeTaxExecute();
const disableEmployeeIncomeTaxActions = computed(() => {
    return employeeIncomeTaxPending.value || creatingOrEditingPayrollComponent.value || deletingPayrollComponent.value || disableActions.value;
});
const disableEmployeeIncomeTaxDataTable = computed(() => {
    return employeeIncomeTaxPending.value || creatingOrEditingPayrollComponent.value || deletingPayrollComponent.value || disableActions.value;
});

const deleteSelectedPayrollComponent = async (component) => {

    let selectedIds: number[] = [];

    if(component == FORMULABLE.EARNINGS){
        selectedIds = selectedEmployeeCompensation.value;
    }
    if(component == FORMULABLE.DEDUCTIONS){
        selectedIds = selectedEmployeeDeduction.value;
    }
    if(component == FORMULABLE.INCOME_TAX){
        selectedIds = selectedEmployeeIncomeTax.value;
    }

    if(_isEmpty(selectedIds)){
        return;
    }

    deletingPayrollComponent.value = true;

    let batchDelete: Promise<any>[] = [];

    selectedIds.forEach((id) => {
        batchDelete.push(
            new Promise((resolve, reject) => {
                laraFetch(`/api/employee-payroll-component/${id}`, {
                    method: 'DELETE',
                    body: {
                        'company_id': selectedAssociatedCompanyId.value
                    }
                },{
                    onRequestError: (request, options, error) => {
                        reject(error);
                    },
                    onResponse: (request, options, response) => {
                        resolve(response);
                    }
                })
            })
        );
    });

    await Promise.all(batchDelete);

    if(component == FORMULABLE.EARNINGS){
        selectedEmployeeCompensation.value = [];
        employeeCompensationExecute();
    }

    if(component == FORMULABLE.DEDUCTIONS){
        selectedEmployeeDeduction.value = [];
        employeeDeductionExecute();
    }

    if(component == FORMULABLE.INCOME_TAX){
        selectedEmployeeIncomeTax.value = [];
        employeeIncomeTaxExecute();
    }

    deletingPayrollComponent.value = false;
}
const deletePayrollComponentRow = async (component, rowIndex) => {
    if(component == FORMULABLE.EARNINGS){
        employeeCompensationData.value.splice(rowIndex, 1);
    }
    if(component == FORMULABLE.DEDUCTIONS){
        employeeDeductionData.value.splice(rowIndex, 1);
    }
    if(component == FORMULABLE.INCOME_TAX){
        employeeIncomeTaxData.value.splice(rowIndex, 1);
    }
}

const payrollComponentResolved = (component, attributes, rowIndex = -1) => {

    if(!creatingEmployee.value){

        if(component == FORMULABLE.EARNINGS){
            employeeCompensationExecute();
        }

        if(component == FORMULABLE.DEDUCTIONS){
            employeeDeductionExecute();
        }

        if(component == FORMULABLE.INCOME_TAX){
            employeeIncomeTaxExecute();
        }

    } else {

        if(_isEmpty(attributes)){
            return 0;
        }

        if(component == FORMULABLE.EARNINGS){
            if(rowIndex >= 0){
                employeeCompensationData.value.splice(rowIndex, 1, attributes);
            } else {
                employeeCompensationData.value.push(attributes);
            }
        }

        if(component == FORMULABLE.DEDUCTIONS){
            if(rowIndex >= 0){
                employeeDeductionData.value.splice(rowIndex, 1, attributes);
            } else {
                employeeDeductionData.value.push(attributes);
            }
        }

        if(component == FORMULABLE.INCOME_TAX){
            if(rowIndex >= 0){
                employeeIncomeTaxData.value.splice(rowIndex, 1, attributes);
            } else {
                employeeIncomeTaxData.value.push(attributes);
            }
        }

    }
};

const disableActions = computed(() => {
    return coreFormPending.value
        || employeeFormPending.value
        || employeeContactFormPending.value
        || employeePayrollComponentFormPending.value
});
const validateForms = ref(true);
const coreFormPending = ref(false);
const coreFormSubmitLabel = computed(() => {
    return (disableActions.value) ? 'Please wait' : (!creatingEmployee.value ? 'Save' : 'Submit');
});
const userFormSubmitPath = computed(() => {

    if(creatingEmployee.value){
        return `/api/user${validateForms.value ? '-validate' : ''}`;
    } else {
        return `/api/user`;
    }
});
const userFormBody = computed(() => {

    return {
        name: employeeUsername.value,
        email: employeeUserEmail.value,
        password: employeeUserPassword.value,
        password_confirmation: employeeUserPasswordConfirmation.value,
        timezone: employeeUserTimezoneOptions.selected,
        status: employeeUserStatusOptions.selected,
    };
});
const autogenerateUserFormSubmitPath = computed(() => {

    if(creatingEmployee.value){
        return `/api/autogenerate-user${validateForms.value ? '-validate' : ''}`;
    } else {
        return `/api/autogenerate-user`;
    }
});
const autogenerateUserFormBody = computed(() => {

    return {
        company_id: selectedAssociatedCompanyId.value,
        family_name: employeeFamilyName.value,
        given_name: employeeGivenName.value,
        office_email: employeeOfficeEmail.value,
    };
});
const coreFormSubmit = async (employee = null, formPayload = {}) => {

    coreFormPending.value = true;

    if(employeeUserCreationOptions.selected == EMPLOYEE_USER_CREATION.MANUAL){

        let skipManualInputUser = !validateForms.value && !creatingEmployee.value;

        if(skipManualInputUser){
            coreFormPending.value = false;
            await employeeFormSubmit(_get(employee, 'user_id', null), employee, formPayload);
            return;
        }

        await laraFetch(userFormSubmitPath.value, {
            method: 'POST',
            body: userFormBody.value,
        }, {
            onRequestError: () => {
                coreFormPending.value = false;
            },
            onResponse: () => {
                coreFormPending.value = false;
            },
            onNotAcceptableResponse: (request, response, options) => {
                coreFormPending.value = false;
                validateForms.value = true;
            },
            onUnprocessableContentResponse: (request, response, options) => {
                coreFormPending.value = false;
                validateForms.value = true;
            },
            onSuccessResponse: async (request, options, response) => {
                let userId = _get(response, '_data.values.user.id', null);

                employeeHasNewlyCreatedUser.value = true;

                if(!creatingEmployee.value || !validateForms.value){
                    await defaultAssignUserCompanyAssignment(userId);
                }

                await employeeFormSubmit(userId, employee, formPayload);
            },
        });

    } else if(employeeUserCreationOptions.selected == EMPLOYEE_USER_CREATION.EXISTING_USER){

        coreFormPending.value = false;
        await employeeFormSubmit(nonEmployeeUserOptions.selected, employee, formPayload);

    } else if(employeeUserCreationOptions.selected == EMPLOYEE_USER_CREATION.AUTOGENERATED){

        let skipAutogenerateUser = !validateForms.value && !creatingEmployee.value;

        if(skipAutogenerateUser){
            coreFormPending.value = false;
            await employeeFormSubmit(_get(employee, 'user_id', null), employee, formPayload);
            return;
        }

        await laraFetch(autogenerateUserFormSubmitPath.value, {
            method: 'POST',
            body: autogenerateUserFormBody.value,
        }, {
            onRequestError: () => {
                coreFormPending.value = false;
            },
            onResponse: () => {
                coreFormPending.value = false;
            },
            onNotAcceptableResponse: (request, response, options) => {
                coreFormPending.value = false;
                validateForms.value = true;
            },
            onUnprocessableContentResponse: (request, response, options) => {
                coreFormPending.value = false;
                validateForms.value = true;
            },
            onSuccessResponse: async (request, options, response) => {
                let userId = _get(response, '_data.values.user.id', null);

                employeeHasNewlyCreatedUser.value = true;

                if(!creatingEmployee.value || !validateForms.value){
                    await defaultAssignUserCompanyAssignment(userId);
                }

                await employeeFormSubmit(userId, employee, formPayload);
            },
        });

    } else if(employeeUserCreationOptions.selected == EMPLOYEE_USER_CREATION.NONE){

        coreFormPending.value = false;
        await employeeFormSubmit(null, employee, formPayload);
    } else if(employeeUserCreationOptions.selected == null){

        coreFormPending.value = false;
        await employeeFormSubmit(null, employee, formPayload);
    }
}
const defaultAssignUserCompanyAssignment = async(userId = null) => {

    if(!Boolean(userId)){return;}

    coreFormPending.value = true;

    let formBody = {};

    formBody[selectedAssociatedCompanyId.value] = {
        'assignment_type': COMPANY_ASSIGNMENT_TYPE.DEFAULT
    };

    await laraFetch(`/api/user-company-assignment/${userId}`, {
        method: 'POST',
        body: formBody,
    }, {
        onRequestError: () => {
            coreFormPending.value = false;
        },
        onResponse: () => {
            coreFormPending.value = false;
        },
        onSuccessResponse: async (request, options, response) => {

        },
    });
}

const preGeneratingUser = computed(() => {
    return _some(
        [EMPLOYEE_USER_CREATION.MANUAL, EMPLOYEE_USER_CREATION.AUTOGENERATED],
        flag => flag == employeeUserCreationOptions.selected
    );
})
const employeeFormPending = ref(false);
const employeeFormSubmitPath = computed(() => {

    if(creatingEmployee.value){
        return validateForms.value ? `/api/employee-validate` : `/api/employee`;
    } else {
        return `/api/employee/${employee?.value?.id}`;
    }
});
const employeeFormAction = computed(() => {

    if(creatingEmployee.value){
        return validateForms.value ? 'POST' : 'POST';
    } else {
        return 'PATCH';
    }
});
const employeeFormBody = computed(() => {

    return {
        company_id: selectedAssociatedCompanyId.value,
        department_id: departmentOptions.selected,
        designation_id: designationOptions.selected,
        manager_id: managerOptions.selected,
        number: employeeNumber.value,
        family_name: employeeFamilyName.value,
        middle_name: employeeMiddleName.value,
        given_name: employeeGivenName.value,
        birth_date: employeeBirthdate.value,
        gender: genderOptions.selected,
        marital_status: maritalStatusOptions.selected,
    };
});
const employeeFormSubmit = async(userId = null, employee = null, formPayload = {}) => {

    let skipEmployeeForm = !creatingEmployee.value && Boolean(formPayload.employee_id);

    if(skipEmployeeForm){
        await employeeContactFormSubmit(employee, formPayload);
        return;
    }

    employeeFormPending.value = true;

    let userReady = employeeUserCreationOptions.selected == EMPLOYEE_USER_CREATION.EXISTING_USER;

    let preGeneratingUserAndNotValidatingForms = preGeneratingUser.value && !validateForms.value;
    let preGeneratingUserAndEditingEmployee = preGeneratingUser.value && !creatingEmployee.value;

    let includeUser = userReady ? true : (preGeneratingUserAndNotValidatingForms || preGeneratingUserAndEditingEmployee);

    await laraFetch(employeeFormSubmitPath.value, {
        method: employeeFormAction.value,
        body: {
            ...employeeFormBody.value,
            ...(includeUser ? {user_id: userId} : {}),
        },
    }, {
        onRequestError: () => {
            employeeFormPending.value = false;
        },
        onResponse: () => {
            employeeFormPending.value = false;
        },
        onNotAcceptableResponse: async (request, response, options) => {
            employeeFormPending.value = false;
            validateForms.value = true;
            await autoSelectCreatedUser(userId);
        },
        onUnprocessableContentResponse: async (request, response, options) => {
            employeeFormPending.value = false;
            validateForms.value = true;
            await autoSelectCreatedUser(userId);
        },
        onSuccessResponse: async (request, options, response) => {
            const employee = _get(response, '_data.values.employee', null);
            formPayload = {...formPayload, employee_id : _get(employee, 'id', null)}

            await employeeContactFormSubmit(employee, formPayload);
        },
    });
}

const employeeContactFormPending = ref(false);
const employeeContactFormSubmitPath = computed(() => {

    if(creatingEmployee.value || !employeeHasContact.value){
        return validateForms.value ? `/api/employee-contact-validate` : `/api/employee-contact`;
    } else {
        return `/api/employee-contact/${employee?.value?.id}`;
    }
});
const employeeContactFormAction = computed(() => {

    if(creatingEmployee.value || !employeeHasContact.value){
        return validateForms.value ? 'POST' : 'POST';
    } else {
        return 'PATCH';
    }
});
const employeeContactFormBody = computed(() => {

    return {
        office_email: employeeOfficeEmail.value,
        personal_email: employeePersonalEmail.value,
        office_phone: employeeOfficePhone.value,
        personal_phone: employeePersonalPhone.value,
    };
});

const employeeContactFormSubmit = async(employee = null, formPayload = {}) => {

    let skipEmployeeContactForm = !creatingEmployee.value && Boolean(formPayload.employee_contact_id);

    if(skipEmployeeContactForm){
        await reSubmitCoreForm(employee, formPayload);
        return;
    }

    const employeeId = _get(employee, 'id', null);

    employeeContactFormPending.value = true;

    let includeEmployee = !validateForms.value || employeeHasContact.value;

    await laraFetch(employeeContactFormSubmitPath.value, {
        method: employeeContactFormAction.value,
        body: {
            ...employeeContactFormBody.value,
            ...(includeEmployee ? {employee_id: employeeId} : {}),
        },
    }, {
        onRequestError: () => {
            employeeContactFormPending.value = false;
        },
        onResponse: () => {
            employeeContactFormPending.value = false;
        },
        onNotAcceptableResponse: async (request, response, options) => {
            employeeContactFormPending.value = false;
            validateForms.value = true;
            if(!creatingEmployee.value){
                await fetchEmployee();
            }
        },
        onUnprocessableContentResponse: async (request, response, options) => {
            employeeContactFormPending.value = false;
            validateForms.value = true;
            if(!creatingEmployee.value){
                await fetchEmployee();
            }
        },
        onSuccessResponse: async (request, options, response) => {
            const employeeContact = _get(response, '_data.values.employee_contact', null);

            formPayload = {...formPayload, employee_contact_id : _get(employeeContact, 'id', null)}

            await reSubmitCoreForm(employee, formPayload);
        },
    });
}

const autoSelectCreatedUser = async (userId = null) => {

    let noUserId = !Boolean(userId);

    if(creatingEmployee.value || noUserId || !preGeneratingUser.value){
        return;
    }

    employeeUserCreationOptionsDisabled.value = true;
    employeeUserCreationOptions.selected = EMPLOYEE_USER_CREATION.EXISTING_USER;
    await nonEmployeeUsersExecute();
    nonEmployeeUserOptions.selected = userId;
}

const reSubmitCoreForm = async(employee = null, formPayload = {}) => {

    if(validateForms.value){

        validateForms.value = false;

        await coreFormSubmit(employee, formPayload);

    } else {

        if(creatingEmployee.value){
            await employeePayrollComponentFormSubmit(employee);
        } else {
            coreFormPending.value = true;
            resolveEmployee(employee);
        }
    }
}

//Save employee payroll component
const employeePayrollComponentFormPending = ref(false);
const employeePayrollComponentFormSubmit = async(employee = null) => {

    const employeeId = _get(employee, 'id', null);

    if(Boolean(employeeId)){
        employeePayrollComponentFormPending.value = true;

        //@ts-ignore
        let payrollComponents = _concat(employeeCompensationData.value, employeeDeductionData.value, employeeIncomeTaxData.value);

        let payrollComponentPromises: Promise<any>[] = [];

        //@ts-ignore
        payrollComponents.forEach((payrollComponent) => {

            let payrollFormulableType = _get(payrollComponent, 'formulable_type.value');
            let payrollComponentType = _get(payrollComponent, 'payroll_componentable.type.value');

            let employeePayrollComponentFormBody = {
                employee_id: employeeId,
                company_id: selectedAssociatedCompanyId.value,
                formulable_type: payrollFormulableType,
                payroll_componentable_type: payrollComponent.payroll_componentable_type,
                payroll_componentable_id: payrollComponent.payroll_componentable_id,
            };

            if(payrollFormulableType == FORMULABLE.EARNINGS){

                if (payrollComponentType == COMPENSATION.BASIC_SALARY ||
                    payrollComponentType == COMPENSATION.REGULAR_ALLOWANCE) {
                    employeePayrollComponentFormBody = {
                        ...employeePayrollComponentFormBody,
                        'amount': _get(payrollComponent, 'amount', 0),
                        'currency': _get(payrollComponent, 'currency', null),
                        'pay_period': _get(payrollComponent, 'pay_period.value', null),
                        'pay_type': _get(payrollComponent, 'pay_type.value', null),
                        'pay_frequency_id': _get(payrollComponent, 'pay_frequency_id', null),
                    }
                }
            }

            payrollComponentPromises.push(
                new Promise((resolve, reject) => {
                    laraFetch(`/api/employee-payroll-component`, {
                        method: 'POST',
                        body: employeePayrollComponentFormBody,
                    }, {
                        onRequestError: (request, options, error) => {
                            reject(error);
                        },
                        onResponse: (request, options, response) => {
                            resolve(response);
                        }
                    })
                })
            );
        })

        await Promise.all(payrollComponentPromises);
        employeePayrollComponentFormPending.value = false;
    }

    resolveEmployee(employee);
}

const resolvedEmployeeModal = ref(false);
const resolvedEmployee = ref({});
const resolvedEmployeeModalTitle = computed(() => {
    return `Employee ${creatingEmployee.value ? 'Created' : 'Updated'}`;
})

//@ts-ignore
const resolveEmployee = (employee) => {

    resolvedEmployee.value = employee;

    resolvedEmployeeModal.value = true;
}

const resetPageToInitialState = async () => {
    validateForms.value = true;

    //Reset flags
    employeeHasNewlyCreatedUser.value = false;
    employeeUserCreationOptionsDisabled.value = false;

    // Reset User Account options
    employeeUserCreationOptions.selected = EMPLOYEE_USER_CREATION.NONE;
    nonEmployeeUserOptions.selected = null;

    // Reset User Profile fields
    employeeId.value = null;
    employeeUsername.value = '';
    employeeUserEmail.value = '';
    employeeUserPassword.value = '';
    employeeUserPasswordConfirmation.value = '';
    employeeUserTimezoneOptions.selected = null;
    employeeUserStatusOptions.selected = USER_STATUS.ACTIVE;

    // Reset Contact fields
    employeeOfficeEmail.value = '';
    employeePersonalEmail.value = '';
    employeeOfficePhone.value = '';
    employeePersonalPhone.value = '';

    // Reset Employee Information fields
    employeeNumber.value = '';
    employeeFamilyName.value = '';
    employeeMiddleName.value = '';
    employeeGivenName.value = '';
    genderOptions.selected = GENDER.NOT_SPECIFIED;
    maritalStatusOptions.selected = MARITAL_STATUS.NOT_SPECIFIED;
    employeeBirthdate.value = '1990-01-01';

    // Reset Organization fields
    departmentOptions.selected = null;
    designationOptions.selected = null;
    managerOptions.selected = null;

    // Reset Payroll data
    employeeCompensationData.value = [];
    employeeDeductionData.value = [];
    employeeIncomeTaxData.value = [];
    selectedEmployeeCompensation.value = [];
    selectedEmployeeDeduction.value = [];
    selectedEmployeeIncomeTax.value = [];

    await nonEmployeeUsersExecute();
    resolvedEmployeeModal.value = false;
    resolvedEmployee.value = {};
};


//Render date pickers
const datePickers = ref([
    {
        id: `datetime-birthdate-${route.params.id}`,
        type: 'date',
        selectedCallback: (payload: {value: string}) => {
            employeeBirthdate.value = payload.value;
        }
    }
]);
const {render} = dateTimePicker();

if(clientReadyState.value){
    onMounted(async () => {
        await nextTick(() => {
            render(datePickers.value);
        });
    });
}

watch(clientReadyState, async (clientReady) => {
    if(clientReady){
        await nextTick(() => {
            render(datePickers.value);
        });
    }
})
</script>

<style scoped>

</style>