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
                                <tr><td>Email:</td><td class="pl-2">{{account.email}}</td></tr>
                                <tr><td>Date registered:</td><td class="pl-2">{{account.date_registered}}</td></tr>
                                <tr><td colspan="2">Subscriptions:</td></tr>
                                <tr><td colspan="2">
                                    <div v-for="subscription in account.subscriptions" class="flex flex-row gap-4">
                                        <UnorderedList
                                            :icon="'ic:sharp-radio-button-checked'"
                                            :label="subscription.module.text" />

                                        <div class="font-serif">{{subscription.plan.text}}</div>
                                    </div>
                                </td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminWrapper>
    </div>
</template>

<script setup lang="ts">
import type {AccountT} from "@/public/js/types/account";

useHead({titleTemplate: (titleChunk) => {return `${titleChunk} - Accounts`}});
definePageMeta({middleware: ['auth', 'admin-in-any-company']});
useLayout().setNavigationMode('solid');
const user = userState();

const accountsData = ref<AccountT[]>([]);

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