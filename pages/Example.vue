<template>
    <div>
        <DefaultWrapper>
            <div class="tw-mx-auto tw-pt-4 tw-max-w-screen-2xl tw-font-header tw-text-lg tw-font-semibold">
                Example page
            </div>
            <div class="tw-mt-4 tw-space-y-2 tw-text-sm tw-font-mono">
                <pre>OFETCH PENDING: {{ofetchPending}}</pre>
                <pre class="tw-bg-opacity-50 tw-bg-slate-200">OFETCH RESPONSE: <span v-text="ofetchData" /></pre>
                <pre class="tw-bg-opacity-50 tw-bg-slate-200">OFETCH RESPONSE: <span v-html="ofetchData" /></pre>
                <Input :size="'lg'" class="tw-font-mono" v-model="singleLineStringValue" type="text" autocomplete="off"/>
                <TextArea :cols="80" :size="'lg'" class="tw-font-mono" v-model="multiLineStringValue"/>
                <Button class="tw-inline-block" @click="oFetchGet" :label="'OFetch Get'" />
            </div>
        </DefaultWrapper>
    </div>
</template>

<script setup lang="ts">
definePageMeta({middleware: 'auth'});
useLayout().setNavigationMode('solid', 'Example.vue');

const singleLineStringValue = ref('');
const multiLineStringValue = ref('');
const ofetchData = ref('');
const ofetchPending = ref(false);

async function oFetchGet(){
    ofetchData.value = '';
    ofetchPending.value = true;

    await laraFetch("/api/hit", {
        method: 'GET',
        params: {
            'singleLineStringValue': singleLineStringValue.value
        }
    }, {
        onRequest: () => {
            console.log("CALLBACK ON REQUEST");
        },
        onRequestError: () => {
            console.log("CALLBACK ON REQUEST ERROR");
            ofetchPending.value = false;
        },
        onResponse: (request, response, options) => {
            console.log("CALLBACK ON RESPONSE");
            ofetchPending.value = false;
            ofetchData.value = response._data?.values?.return;
        },
        onSuccessResponse: (request, response, options) => {
            console.log("CALLBACK ON SUCCESS RESPONSE");
        },
        onNotAcceptableResponse: (request, response, options) => {
            console.log("CALLBACK ON NOT ACCEPTABLE RESPONSE");
        }
    });
}
</script>