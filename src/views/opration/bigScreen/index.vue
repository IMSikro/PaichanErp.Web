<template>
	<div class="bigScreen-container">
		<div>
			<h1>{{ state.orgData.name }} - 排产控制台</h1>
		</div>
	</div>
</template>

<script lang="ts" setup="" name="bigScreen">
import { defineAsyncComponent, onMounted, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';
import { SysUser, SysTenant } from '/@/api-services/models';
import { getAPI } from '/@/utils/axios-utils';

import { SysFileApi, SysOrgApi, SysUserApi, SysTenantApi } from '/@/api-services/api';

const state = reactive({
	currentUser: {} as SysUser,
	currentTenant: {} as SysTenant,
	orgData: [] as any,
	deviceTypes: [] as any,
});

const getBaseInfo = async () => {
	var res = await getAPI(SysOrgApi).apiSysOrgListGet(0);
	var d = res.data.result ?? [];
	state.orgData = d[0] ?? []; // 默认第一个树分支
};

onMounted(async () => {
	getBaseInfo();
});
</script>
<style scoped>
.bigScreen-container {
	background-color: aqua;
}
</style>
