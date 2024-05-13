<template>
	<div class="home-container layout-pd">
		<el-row :gutter="15" class="home-card-one mb15">
			<el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6" v-for="(v, k) in state.homeOne" :key="k"
				:class="{ 'home-media home-media-lg': k > 1, 'home-media-sm': k === 1 }">
				<div class="home-card-item flex">
					<div class="flex-margin flex w100" :class="` home-one-animation${k}`">
						<div class="flex-auto">
							<span class="font30">{{ v.num1 }}</span>
							<span class="ml5 font16" :style="{ color: v.color1 }">{{ v.num2 }}%</span>
							<div class="mt10">{{ v.num3 }}</div>
						</div>
						<div class="home-card-item-icon flex" :style="{ background: `var(${v.color2})` }">
							<i class="flex-margin font32" :class="v.num4" :style="{ color: `var(${v.color3})` }"></i>
						</div>
					</div>
				</div>
			</el-col>
		</el-row>
		<el-row :gutter="15" class="home-card-three mb15">
			<el-col :xs="24" :sm="10" :md="10" :lg="8" :xl="8">
				<div class="home-card-item">
					<div class="home-card-item-title">快捷导航(大屏分组)</div>
					<div class="home-monitor">
						<div class="flex-warp">
							<div class="flex-warp-item" v-for="(v, k) in state.homeMenu" :key="k"
								@click="openLink(v.url, v.groupId)">
								<div class="flex-warp-item-box" :class="`home-animation${k}`">
									<div class="flex-margin">
										<i :class="v.icon" :style="{ color: v.iconColor }"></i>
										<span class="pl5">{{ v.label }}</span>
										<div class="mt10">{{ v.groupId }}</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</el-col>
		</el-row>
	</div>
</template>

<script setup lang="ts" name="home">
import { reactive, onMounted, ref, watch, nextTick, onActivated, markRaw } from 'vue';
import * as echarts from 'echarts';
import { storeToRefs } from 'pinia';
import { useThemeConfig } from '/@/stores/themeConfig';
import { useTagsViewRoutes } from '/@/stores/tagsViewRoutes';
import { useRouter } from 'vue-router';

const router = useRouter();

// 定义变量内容
const storesTagsViewRoutes = useTagsViewRoutes();
const storesThemeConfig = useThemeConfig();
const { themeConfig } = storeToRefs(storesThemeConfig);
const { isTagsViewCurrenFull } = storeToRefs(storesTagsViewRoutes);
const state = reactive({
	homeMenu: [
		{
			icon: 'iconfont icon-diannao1',
			label: '分组1',
			iconColor: '#FBD4A0',
			url: '/dashboard/bigScreen',
			groupId: 1,
		},
		{
			icon: 'iconfont icon-diannao1',
			label: '分组2',
			iconColor: '#FBD4A0',
			url: '/dashboard/bigScreen',
			groupId: 2,
		},
		{
			icon: 'iconfont icon-diannao1',
			label: '分组3',
			iconColor: '#FBD4A0',
			url: '/dashboard/bigScreen',
			groupId: 3,
		},
		{
			icon: 'iconfont icon-diannao1',
			label: '分组4',
			iconColor: '#FBD4A0',
			url: '/dashboard/bigScreen',
			groupId: 4,
		},
	],
	homeOne: [
		{
			num1: '125,12',
			num2: '-12.32',
			num3: '订单统计信息',
			num4: 'fa fa-meetup',
			color1: '#FF6462',
			color2: '--next-color-primary-lighter',
			color3: '--el-color-primary',
		},
		{
			num1: '653,33',
			num2: '+42.32',
			num3: '月度计划信息',
			num4: 'iconfont icon-ditu',
			color1: '#6690F9',
			color2: '--next-color-success-lighter',
			color3: '--el-color-success',
		},
		// {
		// 	num1: '125,65',
		// 	num2: '+17.32',
		// 	num3: '年度计划信息',
		// 	num4: 'iconfont icon-zaosheng',
		// 	color1: '#6690F9',
		// 	color2: '--next-color-warning-lighter',
		// 	color3: '--el-color-warning',
		// },
		// {
		// 	num1: '520,43',
		// 	num2: '-10.01',
		// 	num3: '访问统计信息',
		// 	num4: 'fa fa-github-alt',
		// 	color1: '#FF6462',
		// 	color2: '--next-color-danger-lighter',
		// 	color3: '--el-color-danger',
		// },
	],
	myCharts: [] as EmptyArrayType,
	charts: {
		theme: '',
		bgColor: '',
		color: '#303133',
	},
});

// 打开微信支付列表
const openLink = (url: string, groupId: number) => {
	router.push({
		path: url,
		query: { groupId: groupId },
	});
};

// 页面加载时
onMounted(() => {
});
// 由于页面缓存原因，keep-alive
onActivated(() => { });
// 监听 pinia 中的 tagsview 开启全屏变化，重新 resize 图表，防止不出现/大小不变等
watch(
	() => isTagsViewCurrenFull.value,
	() => { }
);
// 监听 pinia 中是否开启深色主题
watch(
	() => themeConfig.value.isIsDark,
	(isIsDark) => {
		nextTick(() => {
			state.charts.theme = isIsDark ? 'dark' : '';
			state.charts.bgColor = isIsDark ? 'transparent' : '';
			state.charts.color = isIsDark ? '#dadada' : '#303133';
		});
	},
	{
		deep: true,
		immediate: true,
	}
);
</script>

<style scoped lang="scss">
$homeNavLengh: 8;

.home-container {
	overflow: hidden;

	.home-card-one,
	.home-card-two,
	.home-card-three {
		.home-card-item {
			width: 100%;
			height: 130px;
			border-radius: 4px;
			transition: all ease 0.3s;
			padding: 20px;
			overflow: hidden;
			background: var(--el-color-white);
			color: var(--el-text-color-primary);
			border: 1px solid var(--next-border-color-light);

			&:hover {
				box-shadow: 0 2px 12px var(--next-color-dark-hover);
				transition: all ease 0.3s;
			}

			&-icon {
				width: 70px;
				height: 70px;
				border-radius: 100%;
				flex-shrink: 1;

				i {
					color: var(--el-text-color-placeholder);
				}
			}

			&-title {
				font-size: 15px;
				font-weight: bold;
				height: 30px;
			}
		}
	}

	.home-card-one {
		@for $i from 0 through 3 {
			.home-one-animation#{$i} {
				opacity: 0;
				animation-name: error-num;
				animation-duration: 0.5s;
				animation-fill-mode: forwards;
				animation-delay: calc($i/4) + s;
			}
		}
	}

	.home-card-two,
	.home-card-three {
		.home-card-item {
			height: 400px;
			width: 100%;
			overflow: hidden;

			.home-monitor {
				height: 100%;

				.flex-warp-item {
					width: 25%;
					height: 111px;
					display: flex;

					.flex-warp-item-box {
						margin: auto;
						text-align: center;
						color: var(--el-text-color-primary);
						display: flex;
						border-radius: 5px;
						background: var(--next-bg-color);
						cursor: pointer;
						transition: all 0.3s ease;

						&:hover {
							background: var(--el-color-primary-light-9);
							transition: all 0.3s ease;
						}
					}

					@for $i from 0 through $homeNavLengh {
						.home-animation#{$i} {
							opacity: 0;
							animation-name: error-num;
							animation-duration: 0.5s;
							animation-fill-mode: forwards;
							animation-delay: calc($i/10) + s;
						}
					}
				}
			}
		}
	}
}
</style>
