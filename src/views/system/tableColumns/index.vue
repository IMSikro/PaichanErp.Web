<template>
	<div class="tableColumns-container">
		tableColumns
	</div>
</template>

<script lang="ts" setup name="weChatUser">
import { onMounted, reactive, ref } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';

onMounted(async () => {
	handleQuery();
});

// 查询操作
const handleQuery = async () => {
	state.loading = true;
	let params = Object.assign(state.queryParams, state.tableParams);
	var res = await getAPI(SysWechatUserApi).apiSysWechatUserPagePost(params);
	state.weChatUserData = res.data.result?.items ?? [];
	state.tableParams.total = res.data.result?.total;
	state.loading = false;
};
</script>
