<template>
	<div class="layout-navbars-close-full" v-if="isTagsViewCurrenFull">
		<div class="layout-navbars-close-full-icon">
			<SvgIcon name="ele-Close" :title="$t('message.tagsView.closeFullscreen')" @click="onCloseFullscreen" />
		</div>
	</div>
</template>

<script setup lang="ts" name="layoutCloseFull">
import { storeToRefs } from 'pinia';
import { useTagsViewRoutes } from '/@/stores/tagsViewRoutes';

// 定义变量内容
const stores = useTagsViewRoutes();
const { isTagsViewCurrenFull } = storeToRefs(stores);

// 关闭当前全屏
const onCloseFullscreen = () => {
	stores.setCurrenFullscreen(false);
};
</script>

<style scoped lang="scss">
.layout-navbars-close-full {
	position: fixed;
	z-index: 9999999999;
	right: -30px;
	top: -30px;
	.layout-navbars-close-full-icon {
		width: 90px;
		height: 90px;
		border-radius: 100%;
		cursor: pointer;
		background: rgba(4, 124, 218, 0.5);
		transition: all 0.3s ease;
		position: relative;
		:deep(i) {
			position: absolute;
			left: 18px;
			top: 35px;
			font-size: 36px !important;
			color: rgba(255, 255, 255, 0.8);
			transition: all 0.3s ease;
		}
	}
	&:hover {
		transition: all 0.3s ease;
		:deep(i) {
			color: var(--el-color-primary);
			transition: all 0.3s ease;
		}
	}
}
</style>
