<template>
    <div>
        <AdminWrapper>
            <div class="mx-auto max-w-screen-2xl">
                <div class="flex px-[20px] pt-[20px] mb-2">
                    <NuxtLink
                        :to="`/admin/companies`">
                        <Button class="w-min" :variant="`outline`" :disabled="disableActions" :size="'sm'" :icon="disableActions ? 'eos-icons:loading' : 'ic:sharp-keyboard-arrow-left'" :label="disableActions ? 'Please wait' : ''"></Button>
                    </NuxtLink>
                </div>

                <DialogModal
                    :show="creatingOrEditing"
                    :landscape="true"
                    :closeable="false">
                    <template #title>
                        <div class="mx-auto max-w-screen-xl">
                            {{createEditModalTitle}}
                        </div>
                    </template>
                    <template #content>
                        <div class="pt-4 mx-auto max-w-screen-xl grid gap-2 grid-cols-3 sm:grid-cols-4 md:grid-cols-5">
                            <div>
                                <InputLabel :size="'sm'" value="Name"/>
                                <Input v-model="moduleName" type="text" />
                            </div>
                            <div>
                                <InputLabel :size="'sm'" value="Formulable Type" />
                                <SingleSelect drop-shadow :selection-max-viewable-line="10" :size="'md'" :options="formulableOptions"/>
                            </div>
                            <div>
                                <InputLabel :size="'sm'" value="Property"/>
                                <Input v-model="property" type="text" />
                            </div>
                            <div>
                                <InputLabel :size="'sm'" value="Attribute"/>
                                <Input v-model="attribute" type="text" />
                            </div>
                            <div class="flex flex-col">
                                <div class="flex-none h-[1rem]"></div>
                                <div class="grow">
                                    <div class="h-full w-min scaffold-border flex items-center">
                                        <label>
                                            <Checkbox
                                                class="px-[0.3rem]"
                                                name="remember"
                                                v-model="aggregation"
                                                :size="'md'"
                                                :label="'Aggregation'" />
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div class="col-span-full">
                                <InputLabel :size="'sm'" value="Conditions"/>
                                <TextArea v-model="conditions" class="font-mono" min-height="'16rem'" :size="'md'" type="text" />
                            </div>
                        </div>
                    </template>
                    <template #footer>
                        <div class="flex mx-auto max-w-screen-xl space-x-2 justify-between">
                            <div class="space-x-2 inline-flex">
                                <div class="space-x-2 inline-flex items-center">
                                    <UnorderedList
                                        v-if="createEditModalDisableActions"
                                        :icon="'eos-icons:loading'"
                                        :size="'md'"
                                        :label="'Please wait...'"/>
                                </div>
                            </div>
                            <div class="space-x-2 inline-flex items-center">
                                <Button :variant="'outline'" :disabled="createEditModalDisableActions" @click="closeModal" :label="'Cancel'" />
                                <Button :disabled="createEditModalDisableActions" :icon="createEditModalActionIcon" @click="createEditModalSubmit" :label="createEditModalActionLabel" />
                            </div>
                        </div>
                    </template>
                </DialogModal>

                <div class="px-[20px]">
                    <div class="mb-2 text-lg font-header">{{`${companyCode} ${companyName}`}}</div>

                    <div class="mb-2 flex gap-2 items-center min-h-8">
                        <Button :variant="'outline'" class="w-min" :disabled="disableActions" :size="'sm'" :icon="'mdi:plus'" @click="create"></Button>
                        <Button :variant="'outline'" class="w-min" :disabled="disableActions" :size="'sm'" :icon="'mdi:delete-outline'" @click="deleteSelected"></Button>
                        <UnorderedList
                            v-if="disableActions"
                            :icon="'eos-icons:loading'"
                            :size="'md'"
                            :label="'Please wait...'"/>
                    </div>

                    <DataTable
                        :headers="salaryStatementModulesHeaders"
                        :size="'lg'"
                        :rows="salaryStatementModulesData"
                        :disabled="disableActions"
                        v-model="selectedSalaryStatementModules"
                        manual-sortable
                        @manualSorted="manualSorted"
                        selection
                        :stripped="true">
                        <template v-slot:cell.actions="{cell}">
                            <div class="flex items-center">
                                <NavDrop
                                    class="z-10"
                                    :disabled="disableActions"
                                    :parent-icon="'ic:baseline-arrow-right'"
                                    in-horizontal-scrollable
                                    :size="`sm`"
                                    :drop-shadow-size="`lg`"
                                    :title="'Menu'"
                                    :drop-align="'top'"
                                    :drop-justify="'right'"
                                    :drop-options="[
                                        {type: 'action', title: 'Edit',callback: () => {edit(cell);}},
                                    ]">
                                </NavDrop>
                            </div>
                        </template>
                        <template v-slot:cell.formulable_type="{cell,slot}">
                            <div class="flex space-x-1 px-[0.3rem] items-center">
                                <Label :size="slot.labelSize" :type="cell?._payload?.label_shade?.value as LabelTypeT" shade :label="cell.formulable_type.text" />
                            </div>
                        </template>
                        <template v-slot:cell.aggregation="{cell, slot, scrollReference}">
                            <div class="flex justify-center">
                                <NonModelCheckBox disabled :size="slot.checkBoxSize" :checked="cell.aggregation" ></NonModelCheckBox>
                            </div>
                        </template>
                        <template v-slot:cell.conditions="{cell,slot}">
                            <div class="p-[3px] font-mono">{{cell.conditions ? JSON.stringify(cell.conditions): cell.conditions}}</div>
                        </template>
                    </DataTable>
                </div>
            </div>
        </AdminWrapper>
    </div>
</template>

<script setup lang="ts">
import type {Sequenceable, TableHeaderT, TableRowT} from "@/public/js/types/data";
import type {LabelTypeT} from "@/public/js/types/theme";
import type {SalaryStatementModuleT} from "@/public/js/types/company-component";
import type {StringEnumInterface} from "@/public/js/common/type";
import type {CompanyT} from "@/public/js/types/company";

useHead({titleTemplate: (titleChunk) => {return `${titleChunk} - Company Salary Statement Modules`}});
definePageMeta({middleware: ['auth', 'super-admin']});
useLayout().setNavigationMode('solid');
const route = useRoute();
const nuxtApp = useNuxtApp();
const orderSequenceable = nuxtApp.$orderSequenceable as (data: Sequenceable[]) => void;
const $enumerableOption = nuxtApp.$enumerableOption as (enumerable: StringEnumInterface, value: number) => {
    text: string,
    value: number
};
const company = ref<Partial<CompanyT>>({});
const companyId = computed(() => _get(company.value, 'id', null));
const companyCode = ref('');
const companyName = ref('');

//Fetch Company Information
const fetchCompany = async () => {
    await laraFetch(`/api/company/${route.params.id}`, {
        method: 'GET',
    }, {
        onSuccessResponse: async (request, options, response) => {
            company.value = _get(response, '_data.values.company', {}) as CompanyT;
            companyCode.value = _get(response, '_data.values.company.code', '');
            companyName.value = _get(response, '_data.values.company.name', '');
        },
    });
};
await fetchCompany();

const salaryStatementModulesHeaders = reactive<TableHeaderT[]>([
    { text: '', value: 'actions'},
    { text: 'Order', value: 'order'},
    { text: 'Name', value: 'name'},
    { text: 'Formulable Type', value: 'formulable_type', alignData: 'left'},
    { text: 'Aggregation', value: 'aggregation', alignData: 'left'},
    { text: 'Property', value: 'property'},
    { text: 'Attribute', value: 'attribute'},
    { text: 'Conditions', value: 'conditions'},
]);
const salaryStatementModulesPending = ref(false)
const salaryStatementModulesData = ref<SalaryStatementModuleT[]>([]);
const selectedSalaryStatementModules = ref([]);

const salaryStatementModulesExecute = async() =>{

    if(import.meta.server || !companyId.value){
        return;
    }

    salaryStatementModulesPending.value = true;

    await laraFetch(`/api/salary-statement-modules`, {
        method: 'GET',
        params: {
            filters: {
                'company_id': company.value?.id,
            }
        }
    }, {
        onRequestError: () => {
            salaryStatementModulesPending.value = false;
        },
        onResponse: () => {
            salaryStatementModulesPending.value = false;
        },
        onSuccessResponse: async (request, options, response) => {
            let salaryStatementModules = _get(response, '_data.values.salary_statement_modules', []) as SalaryStatementModuleT[];

            salaryStatementModulesData.value = salaryStatementModules.map((module: SalaryStatementModuleT) => {

                let formulableType = _get(module, 'formulable_type.value', null);

                return {
                    ...module,
                    _payload: {
                        'label_shade': {
                            'cell': ['formulable_type'],
                            'value': useCosmetic().formulableShade(formulableType)
                        }
                    }
                };
            });
        }
    }, false);
}
await salaryStatementModulesExecute();

const salaryStatementModulesReOrderPending = ref(false);
const salaryStatementModulesReOrderExecute = async () => {
    salaryStatementModulesReOrderPending.value = true;

    const orderables = salaryStatementModulesData.value.map((item) => {
        return {id: item.id, order: item.order}
    });

    await laraFetch("/api/re-order/salary-statement-modules", {
        method: 'POST',
        params: {
            orderables: JSON.stringify(orderables),
        }
    },{
        onRequestError: () => {
            salaryStatementModulesReOrderPending.value = false;
        },
        onResponse: () => {
            salaryStatementModulesReOrderPending.value = false;
        },
        onUnAuthorizedResponse: async (request, options, response) => {
            await salaryStatementModulesExecute();
        },
        onSuccessResponse: async (request, options, response) => {
            await salaryStatementModulesExecute();
        }
    });
}

const disableActions = computed(() => {
    return salaryStatementModulesPending.value || creatingOrEditing.value || salaryStatementModulesReOrderPending.value || deleting.value;
});

const manualSorted = async () => {
    salaryStatementModulesPending.value = true;
    orderSequenceable(salaryStatementModulesData.value);
    await salaryStatementModulesReOrderExecute();
}

const creatingOrEditing = ref(false);
const deleting = ref(false);
const editPayload = ref<Partial<SalaryStatementModuleT>>({});

const moduleName = ref('');
const formulableOptions = reactive({
    search: '',
    selection: [
        $enumerableOption(FORMULABLE_NAME, FORMULABLE.EARNINGS as number),
        $enumerableOption(FORMULABLE_NAME, FORMULABLE.DEDUCTIONS as number),
        $enumerableOption(FORMULABLE_NAME, FORMULABLE.TAXABLE_INCOME as number),
        $enumerableOption(FORMULABLE_NAME, FORMULABLE.NON_TAXABLE_INCOME as number),
        $enumerableOption(FORMULABLE_NAME, FORMULABLE.INCOME_TAX as number),
        $enumerableOption(FORMULABLE_NAME, FORMULABLE.NET_INCOME as number),
    ],
    selected: null
});
const aggregation = ref(false);
const property = ref('');
const attribute = ref('');
const conditions = ref<string | null>('');

const edit = (cell: TableRowT) => {

    editPayload.value = cell as SalaryStatementModuleT;

    if(Boolean(cell.id)){
        moduleName.value = _get(cell, 'name', '');
        formulableOptions.selected = _get(cell, 'formulable_type.value', null);
        aggregation.value = _get(cell, 'aggregation', false);
        property.value = _get(cell, 'property', '');
        attribute.value = _get(cell, 'attribute', '');
        conditions.value = cell.conditions == null ? null : JSON.stringify(cell.conditions);
    }

    creatingOrEditing.value = true;
}

const create = async () => {
    editPayload.value = {};
    creatingOrEditing.value = true;
}

const closeModal = () => {
    creatingOrEditing.value = false;
    editPayload.value = {};
    createEditModalReset();
};

const createEditModalReset = () => {
    moduleName.value = '';
    formulableOptions.selected = null;
    aggregation.value = false;
    property.value = '';
    attribute.value = '';
    conditions.value = '';
};

const createEditModalSubmitPending = ref(false);
const createEditModalDisableActions = computed(() => {
    return createEditModalSubmitPending.value;
});
const createEditModalActionIcon = computed(() => {
    return Boolean(editPayload.value.id) ? 'ic:sharp-save' : 'mdi:plus';
});
const createEditModalActionLabel = computed(() => {
    return Boolean(editPayload.value.id) ? 'Save' : 'Create';
});
const createEditModalSubmitAction = computed(() => {
    return Boolean(editPayload.value.id) ? 'PATCH' : 'POST';
});
const createEditModalSubmitPath = computed(() => {
    return Boolean(editPayload.value.id) ? `/api/salary-statement-module/${editPayload.value.id}` : `/api/salary-statement-module`;
});
const createEditModalTitle = computed(() => {
    return Boolean(editPayload.value.id) ? 'Edit Salary Statement Module' : 'Create Salary Statement Module';
});

const createEditModalResolved = async () => {
    closeModal();
    await salaryStatementModulesExecute();
}

const createEditModalForm = computed(() => {
    return {
        'company_id': companyId.value,
        'name': moduleName.value,
        'formulable_type': formulableOptions.selected,
        'aggregation': aggregation.value,
        'property': property.value,
        'attribute': attribute.value,
        'conditions': conditions.value,
    }
});

const createEditModalSubmit = async() => {
    createEditModalSubmitPending.value = true;

    await laraFetch(createEditModalSubmitPath.value, {
        method: createEditModalSubmitAction.value,
        body: createEditModalForm.value,
    }, {
        onRequestError: () => {
            createEditModalSubmitPending.value = false;
        },
        onResponse: () => {
            createEditModalSubmitPending.value = false;
        },
        onSuccessResponse: async (request, options, response) => {
            await createEditModalResolved();
        },
    });
}

const deleteSelected = async () => {

    const selectedIds = selectedSalaryStatementModules.value;

    if(_isEmpty(selectedIds)){
        return;
    }

    deleting.value = true;

    let batchDelete: Promise<any>[] = [];

    selectedIds.forEach((id) => {
        batchDelete.push(
            new Promise((resolve, reject) => {
                laraFetch(`/api/salary-statement-module/${id}`, {
                    method: 'DELETE',
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
    selectedSalaryStatementModules.value = [];
    await salaryStatementModulesExecute();
    orderSequenceable(salaryStatementModulesData.value);
    await salaryStatementModulesReOrderExecute();

    deleting.value = false;
}
</script>

<style scoped>

</style>