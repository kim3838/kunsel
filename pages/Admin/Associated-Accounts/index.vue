<template>
    <div>
        <AdminWrapper>
            <div class="mx-auto max-w-screen-2xl p-[20px] flex flex-row flex-wrap gap-4">

                <div v-for="account in accountsData" :key="account.id" class="scaffold-border p-4 space-y-2">
                    <div class="font-sans">
                        <div>
                            Account ID:
                        </div>

                        <div class="text-lg font-header">
                            <span>{{account.number}}</span>
                        </div>
                    </div>

                    <div class="space-y-2 font-sans">

                        <table class="border-separate font-sans">
                            <tbody>
                                <tr><td>Plan:</td><td class="pl-2">{{account.plan.text}}</td></tr>
                            </tbody>
                        </table>

                        <div>
                            <div class="mb-2">Subscriptions:</div>
                            <UnorderedList
                                v-for="subscription in account.subscriptions"
                                :icon="'ic:sharp-radio-button-checked'"
                                :label="subscription.module.text" />
                        </div>
                    </div>
                </div>
            </div>
        </AdminWrapper>
    </div>
</template>

<script setup lang="ts">
definePageMeta({middleware: ['auth', 'admin-in-any-company']});
useLayout().setNavigationMode('solid');
const user = userState();

const accountsData = ref([]);

let paramsComputed = computed(() => {
    return {
        filters: {
            'user_id': user?.value?.id,
            'assignment_type': [COMPANY_ASSIGNMENT_TYPE.ADMIN],
        }
    };
});

const accountsPending = ref(false);

const accountsExecute = async () => {

    if(import.meta.server){return;}

    accountsPending.value = true;

    await laraFetch("/api/associated-accounts", {
        method: 'GET',
        params: paramsComputed.value
    },{
        onRequestError: () => {
            accountsPending.value = false;
        },
        onResponse: () => {
            accountsPending.value = false;
        },
        onSuccessResponse: async (request, options, response) => {
            accountsData.value = _get(response, '_data.values.data', []);
        }
    });
}

await accountsExecute();
</script>

<style scoped>

</style>