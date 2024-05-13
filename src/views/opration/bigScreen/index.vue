<template>
	<div class="bigScreen-container">
		<div class="bigTitle">
			<div class="bigTitle-First" v-if="state.group">{{ state.group }}</div>
			<div class="title_bg_left"></div>
			<div class="title_bg_left1"></div>
			<div class="title_bg_left2"></div>
			<div class="bigTitle-Content">{{ state.orgData.name }} - 排产控制台</div>
			<div class="title_bg_right2"></div>
			<div class="title_bg_right1"></div>
			<div class="title_bg_right"></div>
		</div>
		<div class="content">
			<el-collapse v-model="activeNames">
				<el-collapse-item v-for="dt in state.deviceTypes" :key="dt.id" :name="dt.id">
					<template #title>
						<div class="title_bg"></div>
						<el-text tag="b" style="margin-left: 3rem; color: white;font-size: 1.6rem;">{{
				dt.typeName
			}}</el-text>
					</template>
					<DeviceList :ref="(e: any) => { if (e) setDeviceListRef(e, dt); }" :dt="dt" />
				</el-collapse-item>
			</el-collapse>
		</div>
	</div>
</template>

<script lang="ts" setup="" name="bigScreen">
import { defineAsyncComponent, onMounted, onBeforeUnmount, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';
import mittBus from '/@/utils/mitt';
import { getAPI } from '/@/utils/axios-utils';
import { SysUser, SysTenant } from '/@/api-services/models';
import { pageDeviceType } from '/@/api/main/deviceType';
import { SysFileApi, SysOrgApi, SysUserApi, SysTenantApi } from '/@/api-services/api';
import DeviceList from '/@/views/opration/subBig/deviceList.vue';

import { storeToRefs } from 'pinia';
import { useTagsViewRoutes } from '/@/stores/tagsViewRoutes';

// 定义变量内容
const stores = useTagsViewRoutes();
const { isTagsViewCurrenFull } = storeToRefs(stores);

// 关闭当前全屏
const onCloseFullscreen = () => {
	stores.setCurrenFullscreen(false);
	window.removeEventListener("popstate", onReturnBack, false);
};

// 定义变量内容
const route = useRoute();

// 0 刷新当前，1 关闭当前，2 关闭其它，3 关闭全部 4 当前页全屏
// 1、刷新当前 tagsView
const refreshCurrentTagsView = () => {
	mittBus.emit('onCurrentContextmenuClick', Object.assign({}, { contextMenuClickId: 0, ...route }));
};
// 3、关闭其它 tagsView
const closeOtherTagsView = () => {
	mittBus.emit('onCurrentContextmenuClick', Object.assign({}, { contextMenuClickId: 2, ...route }));
};
// 5、开启当前页面全屏
const openCurrenFullscreen = () => {
	mittBus.emit('onCurrentContextmenuClick', Object.assign({}, { contextMenuClickId: 4, ...route }));
	window.addEventListener("popstate", onReturnBack, false);
};

const state = reactive({
	currentUser: {} as SysUser,
	currentTenant: {} as SysTenant,
	orgData: [] as any,
	deviceTypes: [] as any,
	group: '',
});

const activeNames = ref<string[]>([]);
const getBaseInfo = async () => {
	var res = await getAPI(SysOrgApi).apiSysOrgListGet(0);
	var d = res.data.result ?? [];
	state.orgData = d[0] ?? []; // 默认第一个树分支

	let groupId = Number(route.query.groupId ?? 0);
	var dtRes = await pageDeviceType({ groupId });
	state.deviceTypes = dtRes.data.result?.items ?? [];
	activeNames.value = state.deviceTypes.map((x) => x.id);
};

let deviceListRef = {} as any;
const setDeviceListRef = (e: any, dt: { id: string }) => {
	deviceListRef[dt.id] = e;
};

const handleKeyDown = (event: any) => {
	if (event.key.toLowerCase() == 'escape') {
		// 在这里执行要触发的逻辑
		onCloseFullscreen();
	}
}

const onReturnBack = () => {
	onCloseFullscreen();
}

onMounted(async () => {
	console.log(route.query.groupId);
	let groupId = Number(route.query.groupId ?? 0);
	state.group = groupId > 0 ? `分组${groupId}` : '';

	getBaseInfo();
	window.history.pushState(null, '', document.URL);
	openCurrenFullscreen();
	closeOtherTagsView();
	// 添加键盘事件监听
	document.addEventListener('keydown', handleKeyDown);
});

// 在组件卸载时移除事件监听
// 考虑到你想要的是在页面卸载前移除事件监听，因此这里使用了`beforeUnmount`
// 如果你希望在页面卸载后再移除事件监听，可以使用`onUnmounted`
onBeforeUnmount(() => {
	document.removeEventListener('keydown', handleKeyDown);
});
</script>
<style scoped>
.bigScreen-container {
	display: flex;
	color: #ffffff;
	background-color: #000d3a;
	padding: 1.5rem 3.25rem 0 3.25rem;

	/* 顶部标题 */
	.bigTitle {
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 2rem;
		width: 100%;
		height: 6.0625rem;
		margin-bottom: 1.25rem;
		position: relative;

		/* background-color: rgba(255, 255, 255, 0.3); */
		.title_bg_left {
			width: 18%;
			height: 0.625rem;
			border-top: 0.1563rem solid #00539f;
			position: absolute;
			left: 0;
			bottom: 5%;
			z-index: 2;
		}

		.title_bg_left1 {
			width: 22%;
			height: 81px;
			background: url('../../../assets/bigScreen/title_bg_left1.png') no-repeat center center / 100% 100%;
			position: absolute;
			left: 18%;
			top: 0;
			z-index: 2;
		}

		.title_bg_left2 {
			width: 20%;
			height: 70px;
			background: url('../../../assets/bigScreen/title_bg_left2.png') no-repeat center center / 100% 100%;
			position: absolute;
			left: 32.5%;
			top: 15%;
			z-index: 2;
		}

		.bigTitle-First {
			position: absolute;
			top: 50%;
			transform: translateY(-50%);
		}

		.bigTitle-Content {
			/* width: 40%; */
			line-height: 7rem;
			position: absolute;
			left: 50%;
			top: 0;
			transform: translateX(-50%);
			z-index: 3;
		}

		.title_bg_right2 {
			width: 20%;
			height: 70px;
			background: url('../../../assets/bigScreen/title_bg_right2.png') no-repeat center center / 100% 100%;
			position: absolute;
			right: 32.5%;
			top: 15%;
			z-index: 2;
		}

		.title_bg_right1 {
			width: 22%;
			height: 81px;
			background: url('../../../assets/bigScreen/title_bg_right1.png') no-repeat center center / 100% 100%;
			position: absolute;
			right: 18%;
			top: 0;
			z-index: 2;
		}

		.title_bg_right {
			width: 18%;
			height: 0.625rem;
			border-top: 0.1563rem solid #00539f;
			position: absolute;
			right: 0;
			bottom: 5%;
			z-index: 2;
		}
	}

	.content {
		width: 100%;
		min-height: 37.5rem;
		height: 100%;
		position: relative;

		.title_bg {
			width: 1.875rem;
			height: 1.875rem;
			background: url('../../../assets/bigScreen/title_bg_top_left.png') no-repeat center center;
			position: absolute;
			left: 0;
			top: 0;
			z-index: 2;
		}
	}
}

:deep(.content) {
	.el-collapse {
		--el-collapse-border-color: transparent;

		.el-collapse-item {
			--el-collapse-border-color: transparent;
			--el-collapse-header-bg-color: transparent;
			--el-collapse-content-bg-color: transparent;
		}
	}
}

:deep(.el-collapse-item__header) {
	width: 100%;
	height: 42px;
	border: 0.0625rem solid #01346d;
	border-left: 0;
	border-top: 0;
	position: relative;
	z-index: 1;
	background: linear-gradient(to right, #048ef3, transparent);

	.el-text {
		font-size: 1rem;
	}
}

:deep(.el-collapse-item__header::before) {
	content: '';
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 0.0625rem;
	background: linear-gradient(to right, transparent, #01346d);
	z-index: 2;
}

:deep(.el-collapse-item__header::after) {
	content: '';
	position: absolute;
	top: 0;
	left: 0;
	width: 0;
	height: 0;
	border-left: 2.1875rem solid transparent;
	border-bottom: 3.4375rem solid #000d3a;
	transform: rotate(180deg);
}
</style>
