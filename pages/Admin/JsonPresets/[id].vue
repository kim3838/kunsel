<template>
    <div>
        <AdminWrapper>
            <div class="mx-auto max-w-screen-2xl">

                <DialogModal
                    :max-width="'1240px'"
                    :show="resolvedJsonPresetModal"
                    :closeable="false">
                    <template #title>
                        {{resolvedJsonPresetModalTitle}}
                    </template>
                    <template #content>

                        <div class="mt-4 space-y-2">

                            <fieldset class="neutral-border px-2 pb-2 space-y-2">
                                <legend class="font-header">Json Preset</legend>

                                <table class="border-separate font-data">
                                    <tbody>
                                        <tr><td class="font-semibold">Key</td><td class="pl-2">{{ _get(resolvedJsonPreset, 'key', null) }}</td></tr>
                                        <tr><td class="font-semibold">Path</td><td class="pl-2">{{ _get(resolvedJsonPreset, 'path', null) }}</td></tr>
                                    </tbody>
                                </table>
                            </fieldset>

                            <fieldset class="neutral-border px-2 pb-2 space-y-2">
                                <legend class="font-header">Json</legend>

                                <FormulaSettingsCaster :description-whitespace="'pre-line'" :settings="_get(resolvedJsonPreset, 'json_value', null)" />
                            </fieldset>
                        </div>
                    </template>
                    <template #footer>
                        <div class="flex space-x-2 justify-between">
                            <div class="space-x-2 inline-flex items-center">
                                <Button :icon="'ic:sharp-keyboard-arrow-left'" @click="navigateTo({path: `/admin/jsonpresets`, replace: true});" :label="'Back to json presets'" />
                                <Button v-if="!creatingJsonPreset" @click="resetResolved" :label="'Close'" />
                            </div>
                        </div>
                    </template>
                </DialogModal>

                <div class="flex px-[20px] pt-[20px] mb-2">
                    <NuxtLink
                        :to="`/admin/jsonpresets`">
                        <Button class="w-min" :variant="`outline`" :disabled="disableActions" :size="'sm'" :icon="disableActions ? 'eos-icons:loading' : 'ic:sharp-keyboard-arrow-left'" :label="disableActions ? 'Please wait' : ''"></Button>
                    </NuxtLink>
                </div>

                <form @submit.prevent="formSubmit" class="px-[20px] space-y-2">

                    <fieldset class="neutral-border px-2 pb-2 space-y-2">
                        <legend class="text-lg font-header">Json Preset</legend>

                        <div class="grid gap-2 grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                            <div class="sm:col-span-2">
                                <InputLabel :size="'sm'" value="Key"/>
                                <Input :size="'md'" v-model="jsonPresetKey" :disabled="disableActions" type="text"/>
                            </div>
                            <div class="sm:col-span-2">
                                <InputLabel :size="'sm'" value="Presets Disk Path"/>
                                <Input :size="'md'" v-model="jsonPresetPath" :disabled="disableActions" type="text"/>
                            </div>

                        </div>
                    </fieldset>

                    <fieldset class="neutral-border px-2 pb-2 space-y-2">
                        <legend class="text-lg font-header">Json File</legend>

                        <div class="grid gap-2 grid-cols-1 sm:grid-cols-3 lg:grid-cols-4">
                            <div class="sm:col-span-2">
                                <InputWithIcon ref="jsonFile" :size="'md'" class="mt-2" :icon="'ic:baseline-file-open'" type="file" />
                                <div v-if="$coreStore.hasNonPromptableServicePayloadMessage" class="block">
                                    <Label invert :size="'sm'" :type="'danger'" :label="$coreStore.servicePayloadMessage" />
                                </div>
                            </div>
                        </div>

                        <div class="mb-2 flex gap-2 items-center min-h-8">
                            <Button :type="'button'" class="w-min" :disabled="disableActions" :size="'sm'" :icon="'tdesign:scan'" :label="'Read json'" @click="readJsonFile"></Button>
                            <Button :type="'button'" class="w-min" :disabled="disableActions" :size="'sm'" :icon="'tdesign:clear-formatting-1-filled'" :label="'Clear'" @click="clearJsonFile"></Button>
                        </div>

                        <FormulaSettingsCaster :description-whitespace="'pre-line'" :settings="inputJsonFileContent" />
                    </fieldset>

                    <fieldset v-if="!creatingJsonPreset" class="neutral-border px-2 pb-2 space-y-2">
                        <legend class="text-lg font-header">Json</legend>

                        <div class="mb-2 flex gap-2 items-center min-h-8">
                            <Button :type="'button'" class="w-min" :disabled="disableActions" :size="'sm'" :icon="'tdesign:download'" :label="'Download'" @click="download"></Button>
                            <Button :type="'button'" class="w-min" :disabled="disableActions" :size="'sm'" :icon="'tdesign:file-import-filled'" :label="'View'" @click="view"></Button>
                        </div>

                        <FormulaSettingsCaster :description-whitespace="'pre-line'" :settings="jsonContent" />
                    </fieldset>

                    <Button class="w-min" ref="submitButton" type="submit" :disabled="disableActions" :size="'md'" :icon="disableActions ? 'eos-icons:loading' : 'mdi:data'" :label="submitLabel"></Button>
                </form>
            </div>
        </AdminWrapper>
    </div>
</template>

<script setup lang="ts">

useHead({titleTemplate: (titleChunk) => {return `${titleChunk} - Json Presets`}});
useLayout().setNavigationMode('solid');

const route = useRoute();
const jsonPreset = ref(null);
const creatingJsonPreset = computed(() => {
    return route.params.id === 'create-jsonpreset';
});
const jsonPresetKey = ref<string | null>('');
const jsonPresetPath = ref<string | null>('');
const jsonPresetFileBaseName = ref<string | null>('');
const inputJsonFileContent = ref<any[] | null>([]);
const jsonContent = ref<any[] | null>([]);
const jsonFile = ref<HTMLInputElement | null>(null);

definePageMeta({
    middleware: ['auth', 'super-admin',
        async (to) => {

            if(import.meta.server || to.params.id === 'create-jsonpreset'){return true;}

            const {data, error} = await laraUseFetch(`/api/json-preset-check/${to.params.id}`, {method: 'GET',}, {}, false);

            if(_isEmpty(data.value) && !_isEmpty(error.value)){
                let responseCode = _get(error.value, 'data.code', null);

                throw createError({ statusCode: responseCode, statusMessage: useCoreStore().servicePayloadMessage, fatal: true});
            }
        }
    ]
});

const jsonPresetPending = ref(false);

//Fetch Json Preset Information
const fetchJsonPreset = async () => {
    if(import.meta.server || route.params.id === 'create-jsonpreset'){return;}

    await laraFetch(`/api/json-preset/${route.params.id}`, {
        method: 'GET',
    }, {
        onSuccessResponse: async (request, options, response) => {
            jsonPreset.value = _get(response, '_data.values.json_preset', null);
            jsonPresetKey.value = _get(response, '_data.values.json_preset.key', null);
            jsonPresetPath.value = _get(response, '_data.values.json_preset.path', null);
            jsonPresetFileBaseName.value = _get(response, '_data.values.json_preset.json_base_name', null);
            jsonContent.value = _get(response, '_data.values.json_preset.json_value', null);
        },
    });
};
await fetchJsonPreset();

const formPending = ref(false);
const disableActions = computed(() => {
    return formPending.value || jsonPresetPending.value;
});

const submitLabel = computed(() => {
    return formPending.value ? 'Please wait' : (!creatingJsonPreset.value ? 'Save' : 'Submit');
});
const submitAction = computed(() => {
    return 'POST';
});
const submitPath = computed(() => {
    return !creatingJsonPreset.value ? `/api/json-preset/${jsonPreset.value.id}` : `/api/json-preset`;
});

const formSubmit = async() => {
    formPending.value = true;

    let file = jsonFile?.value?.$refs.input.files[0];
    const formData = new FormData();

    formData.append('key', jsonPresetKey.value);
    formData.append('path', jsonPresetPath.value);

    if(!creatingJsonPreset.value){
        formData.append('_method', 'PATCH')
    }

    if (file) {
        formData.append('json_file', file);
    }

    await laraFetch(submitPath.value, {
        method: submitAction.value,
        body: formData,
    }, {
        onRequestError: () => {
            formPending.value = false;
        },
        onResponse: () => {
            formPending.value = false;
        },
        onSuccessResponse: async (request, options, response) => {
            resolvedJsonPreset.value = _get(response, '_data.values.json_preset', null);
            resolvedJsonPresetModal.value = true;
        },
    });
}

const readJsonFile = async() => {
    formPending.value = true;

    let file = jsonFile?.value?.$refs.input.files[0];
    const formData = new FormData();

    formData.append('json_file', file);

    await laraFetch('/api/read-json-file', {
        method: 'POST',
        body: formData,
    }, {
        onRequestError: () => {
            formPending.value = false;
        },
        onResponse: () => {
            formPending.value = false;
        },
        onSuccessResponse: async (request, options, response) => {
            inputJsonFileContent.value = _get(response, '_data.values.json_content', null);
        },
    });
}

const clearJsonFile = () => {
    inputJsonFileContent.value = null
    jsonFile.value.$refs.input.value = '';
}

const isJsonPresetValid = (): boolean => {
    return !_isEmpty(jsonPreset.value) && jsonPreset.value != null;
};

const viewOrDownloadJson = async (action: 'download' | 'view') => {
    if (!isJsonPresetValid()) {
        return;
    }

    await laraBlobFetch({
        path: `/api/json-preset-download/${jsonPreset.value.id}`,
        filename: jsonPresetFileBaseName.value,
        action
    }, {
        onResponse: () => {},
        onSuccessResponse: () => {}
    });
};

const download = async () => {
    await viewOrDownloadJson('download');
};

const view = async () => {
    await viewOrDownloadJson('view');
};

const resolvedJsonPresetModal = ref(false);
const resolvedJsonPreset = ref<{} | null>({});
const resolvedJsonPresetModalTitle = computed(() => {
    return `Json Preset ${creatingJsonPreset.value ? 'Created' : 'Updated'}`;
})
const resetResolved = () => {
    resolvedJsonPresetModal.value = false;
    resolvedJsonPreset.value = {};
}
</script>

<style scoped>

</style>