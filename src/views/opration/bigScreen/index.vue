<template>
	<div class="bigScreen-container">
		<div class="bigTitle">{{ state.orgData.name }} - 排产控制台</div>
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
	display: flex;
	color: #ffffff;
	background-color: #000d3a;
	.bigTitle {
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 2rem;
		width: 100%;
		height: 6.0625rem;
		background: url('../../../assets/bigScreen/bigTitle.png') no-repeat center center;
	}
}
</style>
