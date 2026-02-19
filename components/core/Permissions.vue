<template>
    <div class="space-y-6">

        <div class="flex flex-row flex-wrap gap-4" v-for="(series, index) in permissionSeries" :key="index">
            <div class="font-header text-lg w-full scaffold-border-bottom">{{series.name}}</div>

            <div
                class="flex flex-col"
                v-for="(permission_group, index) in series.permission_group" :key="index">
                <div class="font-data">{{permission_group.name}}</div>

                <div
                     v-for="(permission_form_input, index) in permission_group.permissions" :key="index">
                    <label class="flex items-center">
                        <Checkbox :label="permission_form_input.name" v-model="rolePermissions[permission_form_input.value_key].value" />
                    </label>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type {PermissionSeriesFormT, RolePermissionT} from "@/public/js/types/role-permission";

const props = defineProps({
    rolePermissions: {
        required: true,
        type: Object as PropType<RolePermissionT>,
    },
});

const permissionSeries = ref<PermissionSeriesFormT[]>([]);
const fetchPermissions = async () => {

    await laraFetch(`/api/permission-series`, {
        method: 'GET',
    }, {
        onSuccessResponse: async (request, options, response) => {
            permissionSeries.value = _get(response, '_data.values.series', []);
        },
    }, false);
};

await fetchPermissions();
</script>

<style scoped>

</style>